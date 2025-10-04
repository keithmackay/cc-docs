import React, { createContext, useContext, useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';
import { useAuth } from './AuthContext';

export interface MembershipPlan {
  id: string;
  name: string;
  display_name: string;
  description: string;
  price_monthly: number;
  price_yearly: number;
  features: string[];
  is_active: boolean;
  sort_order: number;
}

export interface UserMembership {
  id: string;
  user_id: string;
  plan_id: string;
  status: 'active' | 'cancelled' | 'expired' | 'past_due';
  billing_cycle: 'monthly' | 'yearly' | 'lifetime';
  started_at: string;
  expires_at: string | null;
  cancelled_at: string | null;
  plan: MembershipPlan;
}

interface MembershipContextType {
  currentMembership: UserMembership | null;
  plans: MembershipPlan[];
  loading: boolean;
  hasAccessToCourse: (courseId: string) => Promise<boolean>;
  hasAccessToModule: (courseId: string, moduleId: string) => Promise<boolean>;
  refreshMembership: () => Promise<void>;
}

const MembershipContext = createContext<MembershipContextType | undefined>(undefined);

export function MembershipProvider({ children }: { children: React.ReactNode }) {
  const { user } = useAuth();
  const [currentMembership, setCurrentMembership] = useState<UserMembership | null>(null);
  const [plans, setPlans] = useState<MembershipPlan[]>([]);
  const [loading, setLoading] = useState(true);

  // Load all available plans
  useEffect(() => {
    loadPlans();
  }, []);

  // Load user's current membership
  useEffect(() => {
    if (user) {
      loadUserMembership();
    } else {
      setCurrentMembership(null);
      setLoading(false);
    }
  }, [user]);

  const loadPlans = async () => {
    try {
      const { data, error } = await supabase
        .from('membership_plans')
        .select('*')
        .eq('is_active', true)
        .order('sort_order', { ascending: true });

      if (error) throw error;
      setPlans(data || []);
    } catch (error) {
      console.error('Error loading plans:', error);
      setPlans([]);
    }
  };

  const loadUserMembership = async () => {
    if (!user) {
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('user_memberships')
        .select(`
          *,
          plan:membership_plans(*)
        `)
        .eq('user_id', user.id)
        .eq('status', 'active')
        .single();

      if (error && error.code !== 'PGRST116') { // PGRST116 = no rows returned
        throw error;
      }

      setCurrentMembership(data as UserMembership | null);
    } catch (error) {
      console.error('Error loading user membership:', error);
      setCurrentMembership(null);
    } finally {
      setLoading(false);
    }
  };

  const refreshMembership = async () => {
    await loadUserMembership();
  };

  const hasAccessToCourse = async (courseId: string): Promise<boolean> => {
    if (!user) return false;

    try {
      const { data, error } = await supabase
        .rpc('user_has_course_access', {
          p_user_id: user.id,
          p_course_id: courseId,
        });

      if (error) throw error;
      return data === true;
    } catch (error) {
      console.error('Error checking course access:', error);
      return false;
    }
  };

  const hasAccessToModule = async (courseId: string, moduleId: string): Promise<boolean> => {
    if (!user) return false;

    try {
      const { data, error } = await supabase
        .rpc('user_has_module_access', {
          p_user_id: user.id,
          p_course_id: courseId,
          p_module_id: moduleId,
        });

      if (error) throw error;
      return data === true;
    } catch (error) {
      console.error('Error checking module access:', error);
      return false;
    }
  };

  const value = {
    currentMembership,
    plans,
    loading,
    hasAccessToCourse,
    hasAccessToModule,
    refreshMembership,
  };

  return (
    <MembershipContext.Provider value={value}>
      {children}
    </MembershipContext.Provider>
  );
}

export function useMembership() {
  const context = useContext(MembershipContext);
  if (context === undefined) {
    throw new Error('useMembership must be used within a MembershipProvider');
  }
  return context;
}
