import React, { useEffect, useState } from 'react';
import { useMembership } from '../../contexts/MembershipContext';
import { useAuth } from '../../contexts/AuthContext';
import styles from './ContentGate.module.css';

interface ContentGateProps {
  courseId: string;
  moduleId?: string;
  children: React.ReactNode;
}

export default function ContentGate({ courseId, moduleId, children }: ContentGateProps) {
  const { user } = useAuth();
  const { hasAccessToCourse, hasAccessToModule, loading } = useMembership();
  const [hasAccess, setHasAccess] = useState<boolean>(false);
  const [checking, setChecking] = useState<boolean>(true);

  useEffect(() => {
    async function checkAccess() {
      if (!user) {
        setHasAccess(false);
        setChecking(false);
        return;
      }

      try {
        let access = false;
        if (moduleId) {
          access = await hasAccessToModule(courseId, moduleId);
        } else {
          access = await hasAccessToCourse(courseId);
        }
        setHasAccess(access);
      } catch (error) {
        console.error('Error checking access:', error);
        setHasAccess(false);
      } finally {
        setChecking(false);
      }
    }

    checkAccess();
  }, [user, courseId, moduleId, hasAccessToCourse, hasAccessToModule]);

  if (loading || checking) {
    return (
      <div className={styles.loading}>
        <div className={styles.spinner}></div>
        <p>Checking access...</p>
      </div>
    );
  }

  if (!user) {
    // Redirect to auth page with current location as redirect parameter
    if (typeof window !== 'undefined') {
      const currentPath = window.location.pathname;
      window.location.href = `/auth?redirect=${encodeURIComponent(currentPath)}`;
    }

    return (
      <div className={styles.gate}>
        <div className={styles.lockIcon}>
          <svg viewBox="0 0 24 24" width="48" height="48" fill="currentColor">
            <path d="M18 8h-1V6c0-2.76-2.24-5-5-5S7 3.24 7 6v2H6c-1.1 0-2 .9-2 2v10c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V10c0-1.1-.9-2-2-2zm-6 9c-1.1 0-2-.9-2-2s.9-2 2-2 2 .9 2 2-.9 2-2 2zm3.1-9H8.9V6c0-1.71 1.39-3.1 3.1-3.1 1.71 0 3.1 1.39 3.1 3.1v2z"/>
          </svg>
        </div>
        <h2>Redirecting to sign in...</h2>
        <p>Please wait while we redirect you to the authentication page.</p>
      </div>
    );
  }

  if (!hasAccess) {
    return (
      <div className={styles.gate}>
        <div className={styles.lockIcon}>
          <svg viewBox="0 0 24 24" width="48" height="48" fill="currentColor">
            <path d="M18 8h-1V6c0-2.76-2.24-5-5-5S7 3.24 7 6v2H6c-1.1 0-2 .9-2 2v10c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V10c0-1.1-.9-2-2-2zm-6 9c-1.1 0-2-.9-2-2s.9-2 2-2 2 .9 2 2-.9 2-2 2zm3.1-9H8.9V6c0-1.71 1.39-3.1 3.1-3.1 1.71 0 3.1 1.39 3.1 3.1v2z"/>
          </svg>
        </div>
        <h2>Pro Membership Required</h2>
        <p>Upgrade to Pro to unlock this {moduleId ? 'module' : 'course'} and all premium content.</p>
        <a href="/membership" className={styles.upgradeButton}>
          <svg viewBox="0 0 24 24" width="20" height="20" fill="currentColor">
            <path d="M12 2L2 7v10c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V7l-10-5zm0 18c-3.87-.96-7-5.54-7-10V8.3l7-3.11 7 3.11V10c0 4.46-3.13 9.04-7 10z"/>
          </svg>
          Upgrade to Pro
        </a>
      </div>
    );
  }

  return <>{children}</>;
}
