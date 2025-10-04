-- =============================================
-- ADMIN PANEL SCHEMA
-- =============================================

-- Admin Users Table
CREATE TABLE IF NOT EXISTS admin_users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT NOT NULL UNIQUE,
  role TEXT NOT NULL DEFAULT 'admin', -- 'admin', 'super_admin'
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- =============================================
-- INDEXES
-- =============================================

CREATE INDEX IF NOT EXISTS idx_admin_users_email ON admin_users(email);
CREATE INDEX IF NOT EXISTS idx_admin_users_user_id ON admin_users(user_id);

-- =============================================
-- ROW LEVEL SECURITY (RLS)
-- =============================================

ALTER TABLE admin_users ENABLE ROW LEVEL SECURITY;

-- Only admins can view admin_users table
CREATE POLICY "Only admins can view admin users"
  ON admin_users FOR SELECT
  USING (
    email IN (
      SELECT email FROM admin_users WHERE user_id = auth.uid() AND is_active = true
    )
  );

-- =============================================
-- FUNCTIONS
-- =============================================

-- Function to check if user is admin
CREATE OR REPLACE FUNCTION is_admin(p_user_id UUID)
RETURNS BOOLEAN AS $$
DECLARE
  v_is_admin BOOLEAN;
BEGIN
  SELECT EXISTS(
    SELECT 1 FROM admin_users
    WHERE user_id = p_user_id AND is_active = true
  ) INTO v_is_admin;

  RETURN v_is_admin;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to check if email is admin
CREATE OR REPLACE FUNCTION is_admin_email(p_email TEXT)
RETURNS BOOLEAN AS $$
DECLARE
  v_is_admin BOOLEAN;
BEGIN
  SELECT EXISTS(
    SELECT 1 FROM admin_users
    WHERE email = p_email AND is_active = true
  ) INTO v_is_admin;

  RETURN v_is_admin;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- =============================================
-- POLICIES FOR ADMIN ACCESS TO OTHER TABLES
-- =============================================

-- Allow admins to insert user_memberships
CREATE POLICY "Admins can insert user memberships"
  ON user_memberships FOR INSERT
  WITH CHECK (
    EXISTS(
      SELECT 1 FROM admin_users
      WHERE user_id = auth.uid() AND is_active = true
    )
  );

-- Allow admins to view all user memberships
CREATE POLICY "Admins can view all memberships"
  ON user_memberships FOR SELECT
  USING (
    auth.uid() = user_id OR
    EXISTS(
      SELECT 1 FROM admin_users
      WHERE user_id = auth.uid() AND is_active = true
    )
  );

-- Allow admins to update user memberships
CREATE POLICY "Admins can update user memberships"
  ON user_memberships FOR UPDATE
  USING (
    auth.uid() = user_id OR
    EXISTS(
      SELECT 1 FROM admin_users
      WHERE user_id = auth.uid() AND is_active = true
    )
  );

-- Allow admins to manage course access
CREATE POLICY "Admins can insert course access"
  ON course_access FOR INSERT
  WITH CHECK (
    EXISTS(
      SELECT 1 FROM admin_users
      WHERE user_id = auth.uid() AND is_active = true
    )
  );

CREATE POLICY "Admins can update course access"
  ON course_access FOR UPDATE
  USING (
    EXISTS(
      SELECT 1 FROM admin_users
      WHERE user_id = auth.uid() AND is_active = true
    )
  );

CREATE POLICY "Admins can delete course access"
  ON course_access FOR DELETE
  USING (
    EXISTS(
      SELECT 1 FROM admin_users
      WHERE user_id = auth.uid() AND is_active = true
    )
  );

-- Allow admins to manage module access
CREATE POLICY "Admins can insert module access"
  ON module_access FOR INSERT
  WITH CHECK (
    EXISTS(
      SELECT 1 FROM admin_users
      WHERE user_id = auth.uid() AND is_active = true
    )
  );

CREATE POLICY "Admins can update module access"
  ON module_access FOR UPDATE
  USING (
    EXISTS(
      SELECT 1 FROM admin_users
      WHERE user_id = auth.uid() AND is_active = true
    )
  );

CREATE POLICY "Admins can delete module access"
  ON module_access FOR DELETE
  USING (
    EXISTS(
      SELECT 1 FROM admin_users
      WHERE user_id = auth.uid() AND is_active = true
    )
  );

-- Allow admins to view all user progress
CREATE POLICY "Admins can view all user progress"
  ON user_progress FOR SELECT
  USING (
    user_id = auth.uid() OR
    EXISTS(
      SELECT 1 FROM admin_users
      WHERE user_id = auth.uid() AND is_active = true
    )
  );

-- Allow admins to view all page visits
CREATE POLICY "Admins can view all page visits"
  ON page_visits FOR SELECT
  USING (
    user_id = auth.uid() OR
    EXISTS(
      SELECT 1 FROM admin_users
      WHERE user_id = auth.uid() AND is_active = true
    )
  );

-- =============================================
-- SEED DATA - Add primary admin
-- =============================================

-- Add dan.avila7@gmail.com as admin
-- Note: This will only work after the user has signed up
-- You may need to run this manually after user registration:
-- INSERT INTO admin_users (user_id, email, role, is_active)
-- SELECT id, email, 'super_admin', true
-- FROM auth.users
-- WHERE email = 'dan.avila7@gmail.com'
-- ON CONFLICT (email) DO NOTHING;
