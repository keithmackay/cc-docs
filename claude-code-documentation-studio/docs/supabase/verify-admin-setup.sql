-- =============================================
-- VERIFICATION SCRIPT
-- Run this to check if admin setup is correct
-- =============================================

-- 1. Check if admin_users table exists and has data
SELECT 'Admin Users Table' as check_name,
       count(*) as count,
       string_agg(email, ', ') as emails
FROM admin_users
WHERE is_active = true;

-- 2. Check if helper function exists
SELECT 'Helper Function Exists' as check_name,
       EXISTS(
         SELECT 1 FROM pg_proc p
         JOIN pg_namespace n ON p.pronamespace = n.oid
         WHERE n.nspname = 'public'
         AND p.proname = 'is_admin'
       ) as exists;

-- 3. Check if check_is_admin RPC function exists
SELECT 'RPC Function Exists' as check_name,
       EXISTS(
         SELECT 1 FROM pg_proc p
         JOIN pg_namespace n ON p.pronamespace = n.oid
         WHERE n.nspname = 'public'
         AND p.proname = 'check_is_admin'
       ) as exists;

-- 4. List all policies on module_access table
SELECT 'Module Access Policies' as check_name,
       string_agg(policyname, ', ') as policies
FROM pg_policies
WHERE tablename = 'module_access';

-- 5. List all policies on course_access table
SELECT 'Course Access Policies' as check_name,
       string_agg(policyname, ', ') as policies
FROM pg_policies
WHERE tablename = 'course_access';

-- 6. List all policies on user_memberships table
SELECT 'User Memberships Policies' as check_name,
       string_agg(policyname, ', ') as policies
FROM pg_policies
WHERE tablename = 'user_memberships';

-- 7. Check module_access data
SELECT 'Module Access Records' as check_name,
       count(*) as count
FROM module_access;

-- 8. Show current module access configuration
SELECT
  ma.module_id,
  mp.name as plan_name,
  ma.has_access
FROM module_access ma
JOIN membership_plans mp ON ma.plan_id = mp.id
WHERE ma.course_id = 'claude-code'
ORDER BY ma.module_id, mp.sort_order;

-- 9. Check if current user can call is_admin function (will only work if you're logged in)
-- This is a test query, might fail if not logged in via Supabase client
SELECT 'Current User Is Admin' as check_name,
       public.is_admin() as is_admin;
