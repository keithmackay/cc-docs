import React from 'react';
import { AuthProvider } from '../contexts/AuthContext';
import { ProgressProvider } from '../contexts/ProgressContext';
import { MembershipProvider } from '../contexts/MembershipContext';
import { AdminProvider } from '../contexts/AdminContext';

// Wrap the entire application with providers
export default function Root({ children }: { children: React.ReactNode }) {
  return (
    <AuthProvider>
      <AdminProvider>
        <MembershipProvider>
          <ProgressProvider>
            {children}
          </ProgressProvider>
        </MembershipProvider>
      </AdminProvider>
    </AuthProvider>
  );
}
