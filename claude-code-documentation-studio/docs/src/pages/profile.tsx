import React from 'react';
import Layout from '@theme/Layout';
import { useAuth } from '../contexts/AuthContext';
import { useMembership } from '../contexts/MembershipContext';
import UserProgressDashboard from '../components/Progress/UserProgressDashboard';
import styles from './profile.module.css';

export default function Profile() {
  const { user, loading, signInWithGitHub } = useAuth();
  const { currentMembership, loading: membershipLoading } = useMembership();

  if (loading) {
    return (
      <Layout title="Profile" description="User Profile Page">
        <div className={styles.container}>
          <div className={styles.loading}>Loading...</div>
        </div>
      </Layout>
    );
  }

  if (!user) {
    return (
      <Layout title="Profile" description="User Profile Page">
        <div className={styles.container}>
          <div className={styles.notAuthenticated}>
            <h1>Welcome to Your Profile</h1>
            <p>Please sign in to view your profile.</p>
            <button onClick={signInWithGitHub} className={styles.signInButton}>
              <svg
                viewBox="0 0 24 24"
                width="20"
                height="20"
                fill="currentColor"
                className={styles.githubIcon}
              >
                <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
              </svg>
              Sign in with GitHub
            </button>
          </div>
        </div>
      </Layout>
    );
  }

  const metadata = user.user_metadata || {};

  return (
    <Layout title="Profile" description="User Profile Page">
      <div className={styles.container}>
        <div className={styles.twoColumnLayout}>
          {/* Left Column - Progress Dashboard */}
          <div className={styles.leftColumn}>
            <UserProgressDashboard />
          </div>

          {/* Right Column - Profile Card */}
          <div className={styles.rightColumn}>
            <div className={styles.profileCard}>
              <div className={styles.profileHeader}>
                {metadata.avatar_url && (
                  <img
                    src={metadata.avatar_url}
                    alt={metadata.name || 'User'}
                    className={styles.avatar}
                  />
                )}
                <h1 className={styles.name}>{metadata.name || 'User'}</h1>
                {metadata.user_name && (
                  <p className={styles.username}>@{metadata.user_name}</p>
                )}
              </div>

              <div className={styles.profileInfo}>
                {/* Membership Section */}
                <div className={styles.infoSection}>
                  <h2>Membership</h2>
                  {membershipLoading ? (
                    <div className={styles.membershipLoading}>Loading membership...</div>
                  ) : currentMembership ? (
                    <div className={styles.membershipCard}>
                      <div className={styles.membershipHeader}>
                        <div className={styles.planBadge}>
                          <svg viewBox="0 0 24 24" width="20" height="20" fill="currentColor">
                            <path d="M12 2L2 7v10c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V7l-10-5zm0 18c-3.87-.96-7-5.54-7-10V8.3l7-3.11 7 3.11V10c0 4.46-3.13 9.04-7 10z"/>
                          </svg>
                          <span>{currentMembership.plan.display_name}</span>
                        </div>
                        <span className={`${styles.statusBadge} ${styles[currentMembership.status]}`}>
                          {currentMembership.status}
                        </span>
                      </div>

                      <div className={styles.membershipDetails}>
                        {currentMembership.plan.name !== 'free' && (
                          <>
                            <div className={styles.detailItem}>
                              <span className={styles.detailLabel}>Billing Cycle</span>
                              <span className={styles.detailValue}>{currentMembership.billing_cycle}</span>
                            </div>
                            {currentMembership.expires_at && (
                              <div className={styles.detailItem}>
                                <span className={styles.detailLabel}>Next Billing</span>
                                <span className={styles.detailValue}>
                                  {new Date(currentMembership.expires_at).toLocaleDateString()}
                                </span>
                              </div>
                            )}
                          </>
                        )}
                      </div>

                      <a href="/membership" className={styles.manageMembershipButton}>
                        <svg viewBox="0 0 24 24" width="18" height="18" fill="currentColor">
                          <path d="M19.14 12.94c.04-.3.06-.61.06-.94 0-.32-.02-.64-.07-.94l2.03-1.58c.18-.14.23-.41.12-.61l-1.92-3.32c-.12-.22-.37-.29-.59-.22l-2.39.96c-.5-.38-1.03-.7-1.62-.94l-.36-2.54c-.04-.24-.24-.41-.48-.41h-3.84c-.24 0-.43.17-.47.41l-.36 2.54c-.59.24-1.13.57-1.62.94l-2.39-.96c-.22-.08-.47 0-.59.22L2.74 8.87c-.12.21-.08.47.12.61l2.03 1.58c-.05.3-.09.63-.09.94s.02.64.07.94l-2.03 1.58c-.18.14-.23.41-.12.61l1.92 3.32c.12.22.37.29.59.22l2.39-.96c.5.38 1.03.7 1.62.94l.36 2.54c.05.24.24.41.48.41h3.84c.24 0 .44-.17.47-.41l.36-2.54c.59-.24 1.13-.56 1.62-.94l2.39.96c.22.08.47 0 .59-.22l1.92-3.32c.12-.22.07-.47-.12-.61l-2.01-1.58zM12 15.6c-1.98 0-3.6-1.62-3.6-3.6s1.62-3.6 3.6-3.6 3.6 1.62 3.6 3.6-1.62 3.6-3.6 3.6z"/>
                        </svg>
                        Manage Membership
                      </a>
                    </div>
                  ) : (
                    <div className={styles.noMembership}>
                      <p>No membership found</p>
                      <a href="/membership" className={styles.manageMembershipButton}>
                        View Plans
                      </a>
                    </div>
                  )}
                </div>

                <div className={styles.infoSection}>
                  <h2>Account Information</h2>
                  <div className={styles.infoGrid}>
                    <div className={styles.infoItem}>
                      <label>Email</label>
                      <p>{user.email || 'Not provided'}</p>
                    </div>

                    {metadata.preferred_username && (
                      <div className={styles.infoItem}>
                        <label>GitHub Username</label>
                        <p>
                          <a
                            href={`https://github.com/${metadata.preferred_username}`}
                            target="_blank"
                            rel="noopener noreferrer"
                          >
                            {metadata.preferred_username}
                          </a>
                        </p>
                      </div>
                    )}

                    <div className={styles.infoItem}>
                      <label>Provider</label>
                      <p className={styles.provider}>
                        <svg viewBox="0 0 24 24" width="16" height="16" fill="currentColor">
                          <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
                        </svg>
                        GitHub
                      </p>
                    </div>

                    <div className={styles.infoItem}>
                      <label>Member Since</label>
                      <p>{new Date(user.created_at || '').toLocaleDateString()}</p>
                    </div>
                  </div>
                </div>

                {metadata.bio && (
                  <div className={styles.infoSection}>
                    <h2>Bio</h2>
                    <p className={styles.bio}>{metadata.bio}</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}
