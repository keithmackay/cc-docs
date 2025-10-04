-- =============================================
-- MEMBERSHIP SYSTEM SCHEMA
-- =============================================

-- Membership Plans Table
CREATE TABLE IF NOT EXISTS membership_plans (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL UNIQUE, -- 'free', 'pro', 'enterprise'
  display_name TEXT NOT NULL, -- 'Free', 'Pro', 'Enterprise'
  description TEXT,
  price_monthly DECIMAL(10,2) DEFAULT 0,
  price_yearly DECIMAL(10,2) DEFAULT 0,
  features JSONB DEFAULT '[]'::jsonb,
  is_active BOOLEAN DEFAULT true,
  sort_order INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- User Memberships Table
CREATE TABLE IF NOT EXISTS user_memberships (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  plan_id UUID REFERENCES membership_plans(id) ON DELETE RESTRICT,
  status TEXT NOT NULL DEFAULT 'active', -- 'active', 'cancelled', 'expired', 'past_due'
  billing_cycle TEXT DEFAULT 'monthly', -- 'monthly', 'yearly', 'lifetime'
  started_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  expires_at TIMESTAMP WITH TIME ZONE,
  cancelled_at TIMESTAMP WITH TIME ZONE,
  payment_provider TEXT, -- 'stripe', 'paypal', 'manual', null for free
  subscription_id TEXT, -- External subscription ID from payment provider
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_id)
);

-- Course Access Levels Table
CREATE TABLE IF NOT EXISTS course_access (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  course_id TEXT NOT NULL,
  plan_id UUID REFERENCES membership_plans(id) ON DELETE CASCADE,
  has_access BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(course_id, plan_id)
);

-- Module Access Levels Table (for granular control)
CREATE TABLE IF NOT EXISTS module_access (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  course_id TEXT NOT NULL,
  module_id TEXT NOT NULL,
  plan_id UUID REFERENCES membership_plans(id) ON DELETE CASCADE,
  has_access BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(course_id, module_id, plan_id)
);

-- Payment History Table
CREATE TABLE IF NOT EXISTS payment_history (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  membership_id UUID REFERENCES user_memberships(id) ON DELETE SET NULL,
  amount DECIMAL(10,2) NOT NULL,
  currency TEXT DEFAULT 'USD',
  status TEXT NOT NULL, -- 'succeeded', 'failed', 'refunded', 'pending'
  payment_provider TEXT NOT NULL,
  transaction_id TEXT,
  metadata JSONB DEFAULT '{}'::jsonb,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- =============================================
-- INDEXES
-- =============================================

CREATE INDEX IF NOT EXISTS idx_user_memberships_user_id ON user_memberships(user_id);
CREATE INDEX IF NOT EXISTS idx_user_memberships_status ON user_memberships(status);
CREATE INDEX IF NOT EXISTS idx_course_access_course_plan ON course_access(course_id, plan_id);
CREATE INDEX IF NOT EXISTS idx_module_access_module_plan ON module_access(course_id, module_id, plan_id);
CREATE INDEX IF NOT EXISTS idx_payment_history_user_id ON payment_history(user_id);

-- =============================================
-- ROW LEVEL SECURITY (RLS)
-- =============================================

ALTER TABLE membership_plans ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_memberships ENABLE ROW LEVEL SECURITY;
ALTER TABLE course_access ENABLE ROW LEVEL SECURITY;
ALTER TABLE module_access ENABLE ROW LEVEL SECURITY;
ALTER TABLE payment_history ENABLE ROW LEVEL SECURITY;

-- Membership Plans: Public read access
CREATE POLICY "Anyone can view active membership plans"
  ON membership_plans FOR SELECT
  USING (is_active = true);

-- User Memberships: Users can only see their own
CREATE POLICY "Users can view own membership"
  ON user_memberships FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can update own membership"
  ON user_memberships FOR UPDATE
  USING (auth.uid() = user_id);

-- Course Access: Public read
CREATE POLICY "Anyone can view course access levels"
  ON course_access FOR SELECT
  USING (true);

-- Module Access: Public read
CREATE POLICY "Anyone can view module access levels"
  ON module_access FOR SELECT
  USING (true);

-- Payment History: Users can only see their own
CREATE POLICY "Users can view own payment history"
  ON payment_history FOR SELECT
  USING (auth.uid() = user_id);

-- =============================================
-- FUNCTIONS
-- =============================================

-- Function to check if user has access to a course
CREATE OR REPLACE FUNCTION user_has_course_access(
  p_user_id UUID,
  p_course_id TEXT
)
RETURNS BOOLEAN AS $$
DECLARE
  v_plan_id UUID;
  v_has_access BOOLEAN;
BEGIN
  -- Get user's current plan
  SELECT plan_id INTO v_plan_id
  FROM user_memberships
  WHERE user_id = p_user_id
    AND status = 'active'
    AND (expires_at IS NULL OR expires_at > NOW());

  -- If no active membership, assume free plan
  IF v_plan_id IS NULL THEN
    SELECT id INTO v_plan_id
    FROM membership_plans
    WHERE name = 'free'
    LIMIT 1;
  END IF;

  -- Check course access
  SELECT has_access INTO v_has_access
  FROM course_access
  WHERE course_id = p_course_id
    AND plan_id = v_plan_id;

  -- If no specific rule, default to false
  RETURN COALESCE(v_has_access, false);
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to check if user has access to a module
CREATE OR REPLACE FUNCTION user_has_module_access(
  p_user_id UUID,
  p_course_id TEXT,
  p_module_id TEXT
)
RETURNS BOOLEAN AS $$
DECLARE
  v_plan_id UUID;
  v_has_access BOOLEAN;
BEGIN
  -- Get user's current plan
  SELECT plan_id INTO v_plan_id
  FROM user_memberships
  WHERE user_id = p_user_id
    AND status = 'active'
    AND (expires_at IS NULL OR expires_at > NOW());

  -- If no active membership, assume free plan
  IF v_plan_id IS NULL THEN
    SELECT id INTO v_plan_id
    FROM membership_plans
    WHERE name = 'free'
    LIMIT 1;
  END IF;

  -- Check module access (more specific)
  SELECT has_access INTO v_has_access
  FROM module_access
  WHERE course_id = p_course_id
    AND module_id = p_module_id
    AND plan_id = v_plan_id;

  -- If no module-specific rule, check course access
  IF v_has_access IS NULL THEN
    SELECT has_access INTO v_has_access
    FROM course_access
    WHERE course_id = p_course_id
      AND plan_id = v_plan_id;
  END IF;

  -- If no specific rule, default to false
  RETURN COALESCE(v_has_access, false);
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- =============================================
-- SEED DATA - Default Plans
-- =============================================

INSERT INTO membership_plans (name, display_name, description, price_monthly, price_yearly, features, sort_order) VALUES
  (
    'free',
    'Free',
    'Perfect for getting started with Claude Code',
    0,
    0,
    '[
      "Access to 1 introductory course",
      "Basic progress tracking",
      "Community support",
      "Limited modules"
    ]'::jsonb,
    1
  ),
  (
    'pro',
    'Pro',
    'For developers serious about mastering Claude Code',
    29.99,
    299.99,
    '[
      "Access to all courses",
      "Full progress tracking",
      "Priority support",
      "Downloadable resources",
      "Certificate of completion",
      "Early access to new content"
    ]'::jsonb,
    2
  )
ON CONFLICT (name) DO NOTHING;

-- =============================================
-- SEED DATA - Course Access Configuration
-- =============================================

-- Get plan IDs
DO $$
DECLARE
  free_plan_id UUID;
  pro_plan_id UUID;
BEGIN
  SELECT id INTO free_plan_id FROM membership_plans WHERE name = 'free';
  SELECT id INTO pro_plan_id FROM membership_plans WHERE name = 'pro';

  -- Claude Code Course Access
  -- Free: Limited access
  INSERT INTO course_access (course_id, plan_id, has_access) VALUES
    ('claude-code', free_plan_id, true)
  ON CONFLICT (course_id, plan_id) DO NOTHING;

  -- Pro: Full access
  INSERT INTO course_access (course_id, plan_id, has_access) VALUES
    ('claude-code', pro_plan_id, true)
  ON CONFLICT (course_id, plan_id) DO NOTHING;

  -- Module-level access for Free plan (only some modules)
  INSERT INTO module_access (course_id, module_id, plan_id, has_access) VALUES
    ('claude-code', 'subagents', free_plan_id, true),  -- Free gets subagents
    ('claude-code', 'hooks', free_plan_id, false),      -- No hooks
    ('claude-code', 'workflows', free_plan_id, false)   -- No workflows
  ON CONFLICT (course_id, module_id, plan_id) DO NOTHING;

  -- Pro gets all modules (no restrictions needed, course access = true)

END $$;

-- =============================================
-- TRIGGER: Auto-assign free plan to new users
-- =============================================

CREATE OR REPLACE FUNCTION assign_free_plan_to_new_user()
RETURNS TRIGGER AS $$
DECLARE
  free_plan_id UUID;
BEGIN
  -- Get free plan ID
  SELECT id INTO free_plan_id
  FROM membership_plans
  WHERE name = 'free'
  LIMIT 1;

  -- Assign free plan to new user
  IF free_plan_id IS NOT NULL THEN
    INSERT INTO user_memberships (user_id, plan_id, status, billing_cycle)
    VALUES (NEW.id, free_plan_id, 'active', 'lifetime');
  END IF;

  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER on_user_created_assign_free_plan
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION assign_free_plan_to_new_user();
