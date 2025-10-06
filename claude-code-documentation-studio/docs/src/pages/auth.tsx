import React, { useEffect } from 'react';
import { useHistory, useLocation } from '@docusaurus/router';
import Layout from '@theme/Layout';
import { useAuth } from '../contexts/AuthContext';
import styles from './auth.module.css';

export default function AuthPage() {
  const { user, loading, signInWithGitHub } = useAuth();
  const history = useHistory();
  const location = useLocation();

  // Get redirect URL from query params
  const searchParams = new URLSearchParams(location.search);
  const redirectTo = searchParams.get('redirect') || '/docs';

  // Redirect if already logged in
  useEffect(() => {
    if (user && !loading) {
      history.push(redirectTo);
    }
  }, [user, loading, history, redirectTo]);

  if (loading) {
    return (
      <Layout title="Sign In" description="Sign in to Claude Code Templates Academy">
        <div className={styles.authContainer}>
          <div className={styles.loadingContainer}>
            <div className={styles.spinner}></div>
            <p className={styles.loadingText}>Loading...</p>
          </div>
        </div>
      </Layout>
    );
  }

  if (user) {
    return null; // Will redirect via useEffect
  }

  return (
    <Layout title="Sign In" description="Sign in to Claude Code Templates Academy">
      <div className={styles.authContainer}>
        <div className={styles.authCard}>
          {/* Terminal Header */}
          <div className={styles.terminalHeader}>
            <div className={styles.terminalButtons}>
              <span className={styles.terminalButton} style={{background: '#ff5f56'}}></span>
              <span className={styles.terminalButton} style={{background: '#ffbd2e'}}></span>
              <span className={styles.terminalButton} style={{background: '#27c93f'}}></span>
            </div>
            <div className={styles.terminalTitle}>claude-code-academy/auth</div>
          </div>

          {/* Auth Content */}
          <div className={styles.authContent}>
            <div className={styles.lockIconContainer}>
              <svg viewBox="0 0 24 24" width="64" height="64" fill="currentColor" className={styles.lockIcon}>
                <path d="M18 8h-1V6c0-2.76-2.24-5-5-5S7 3.24 7 6v2H6c-1.1 0-2 .9-2 2v10c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V10c0-1.1-.9-2-2-2zm-6 9c-1.1 0-2-.9-2-2s.9-2 2-2 2 .9 2 2-.9 2-2 2zm3.1-9H8.9V6c0-1.71 1.39-3.1 3.1-3.1 1.71 0 3.1 1.39 3.1 3.1v2z"/>
              </svg>
            </div>

            <h1 className={styles.authTitle}>
              <span className={styles.prompt}>$</span> Authentication Required
            </h1>

            <p className={styles.authDescription}>
              <span className={styles.comment}># Sign in to access Claude Code Templates Academy</span>
            </p>

            <div className={styles.authMethods}>
              <button onClick={signInWithGitHub} className={styles.authButton}>
                <svg
                  className={styles.providerIcon}
                  viewBox="0 0 24 24"
                  width="24"
                  height="24"
                  fill="currentColor"
                >
                  <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
                </svg>
                <span className={styles.buttonText}>
                  <span className={styles.buttonPrompt}>></span> Sign in with GitHub
                </span>
                <span className={styles.buttonCursor}>_</span>
              </button>

              {/* Placeholder for future auth methods */}
              <div className={styles.futureMethodsPlaceholder}>
                <div className={styles.commentLine}>
                  <span className={styles.comment}># More authentication methods coming soon...</span>
                </div>
                <div className={styles.commentLine}>
                  <span className={styles.comment}># - Google OAuth</span>
                </div>
                <div className={styles.commentLine}>
                  <span className={styles.comment}># - Email/Password</span>
                </div>
              </div>
            </div>

            <div className={styles.authFooter}>
              <p className={styles.footerText}>
                <span className={styles.footerPrompt}>→</span> Free plan automatically assigned on sign-up
              </p>
              <p className={styles.footerText}>
                <span className={styles.footerPrompt}>→</span> Access all documentation and tutorials
              </p>
            </div>
          </div>
        </div>

        {/* Background grid effect */}
        <div className={styles.gridBackground}></div>
      </div>
    </Layout>
  );
}
