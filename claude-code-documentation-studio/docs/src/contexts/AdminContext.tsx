import React, { createContext, useContext, useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { useAuth } from './AuthContext';

interface AdminContextType {
  isAdmin: boolean;
  loading: boolean;
  checkAdminStatus: () => Promise<boolean>;
}

const AdminContext = createContext<AdminContextType | undefined>(undefined);

export function AdminProvider({ children }: { children: React.ReactNode }) {
  const { user } = useAuth();
  const [isAdmin, setIsAdmin] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(true);

  const checkAdminStatus = async (): Promise<boolean> => {
    if (!user) {
      console.log('[AdminContext] No user authenticated');
      setIsAdmin(false);
      setLoading(false);
      return false;
    }

    try {
      console.log('[AdminContext] Checking admin status for:', user.email);

      // Use RPC function to check admin status (bypasses RLS)
      const { data, error } = await supabase
        .rpc('check_is_admin');

      console.log('[AdminContext] RPC result:', { data, error });

      if (error) {
        console.error('[AdminContext] Error checking admin status:', error);
        setIsAdmin(false);
        setLoading(false);
        return false;
      }

      // RPC returns an array, check if we have results
      const adminStatus = data && data.length > 0 && data[0].is_admin === true;
      console.log('[AdminContext] Admin status:', adminStatus);
      setIsAdmin(adminStatus);
      setLoading(false);
      return adminStatus;
    } catch (error) {
      console.error('[AdminContext] Exception checking admin status:', error);
      setIsAdmin(false);
      setLoading(false);
      return false;
    }
  };

  useEffect(() => {
    checkAdminStatus();
  }, [user]);

  return (
    <AdminContext.Provider value={{ isAdmin, loading, checkAdminStatus }}>
      {children}
    </AdminContext.Provider>
  );
}

export function useAdmin() {
  const context = useContext(AdminContext);
  if (context === undefined) {
    throw new Error('useAdmin must be used within an AdminProvider');
  }
  return context;
}
