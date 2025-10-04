import React, { useState, useEffect } from 'react';
import { supabase } from '../../lib/supabase';
import styles from './UserDetailsModal.module.css';

interface User {
  id: string;
  email: string;
  created_at: string;
  user_metadata: {
    name?: string;
    avatar_url?: string;
    user_name?: string;
  };
  membership?: {
    plan: {
      name: string;
      display_name: string;
    };
    status: string;
    billing_cycle: string;
  };
}

interface UserProgress {
  section_id: string;
  section_name: string;
  progress_percentage: number;
  last_visited: string;
}

interface Props {
  user: User;
  onClose: () => void;
}

export default function UserDetailsModal({ user, onClose }: Props) {
  const [progress, setProgress] = useState<UserProgress[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadUserProgress();
  }, [user.id]);

  const loadUserProgress = async () => {
    try {
      setLoading(true);

      const { data, error } = await supabase
        .from('user_progress')
        .select('*')
        .eq('user_id', user.id)
        .order('last_visited', { ascending: false });

      if (error) throw error;

      setProgress(data || []);
    } catch (error) {
      console.error('Error loading user progress:', error);
    } finally {
      setLoading(false);
    }
  };

  // Calculate overall completion
  const totalProgress = progress.reduce((acc, p) => acc + p.progress_percentage, 0);
  const avgProgress = progress.length > 0 ? Math.round(totalProgress / progress.length) : 0;

  return (
    <div className={styles.overlay} onClick={onClose}>
      <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
        <div className={styles.header}>
          <h2>User Details</h2>
          <button className={styles.closeButton} onClick={onClose}>
            <svg viewBox="0 0 24 24" width="24" height="24" fill="currentColor">
              <path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z"/>
            </svg>
          </button>
        </div>

        <div className={styles.content}>
          {/* User Info Section */}
          <div className={styles.section}>
            <h3>User Information</h3>
            <div className={styles.userInfo}>
              {user.user_metadata?.avatar_url && (
                <img
                  src={user.user_metadata.avatar_url}
                  alt={user.user_metadata.name || 'User'}
                  className={styles.avatar}
                />
              )}
              <div className={styles.userDetails}>
                <div className={styles.detailRow}>
                  <span className={styles.label}>Name:</span>
                  <span className={styles.value}>{user.user_metadata?.name || 'Unknown'}</span>
                </div>
                <div className={styles.detailRow}>
                  <span className={styles.label}>Email:</span>
                  <span className={styles.value}>{user.email}</span>
                </div>
                {user.user_metadata?.user_name && (
                  <div className={styles.detailRow}>
                    <span className={styles.label}>Username:</span>
                    <span className={styles.value}>@{user.user_metadata.user_name}</span>
                  </div>
                )}
                <div className={styles.detailRow}>
                  <span className={styles.label}>Joined:</span>
                  <span className={styles.value}>{new Date(user.created_at).toLocaleDateString()}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Membership Section */}
          <div className={styles.section}>
            <h3>Membership</h3>
            <div className={styles.membershipInfo}>
              <div className={styles.detailRow}>
                <span className={styles.label}>Plan:</span>
                <span className={`${styles.planBadge} ${styles[user.membership?.plan?.name || 'free']}`}>
                  {user.membership?.plan?.display_name || 'Free'}
                </span>
              </div>
              <div className={styles.detailRow}>
                <span className={styles.label}>Status:</span>
                <span className={`${styles.statusBadge} ${styles[user.membership?.status || 'active']}`}>
                  {user.membership?.status || 'active'}
                </span>
              </div>
              {user.membership?.billing_cycle && (
                <div className={styles.detailRow}>
                  <span className={styles.label}>Billing Cycle:</span>
                  <span className={styles.value}>{user.membership.billing_cycle}</span>
                </div>
              )}
            </div>
          </div>

          {/* Progress Section */}
          <div className={styles.section}>
            <div className={styles.sectionHeader}>
              <h3>Learning Progress</h3>
              <div className={styles.overallProgress}>
                <span className={styles.progressLabel}>Overall:</span>
                <div className={styles.progressBar}>
                  <div
                    className={styles.progressFill}
                    style={{ width: `${avgProgress}%` }}
                  ></div>
                </div>
                <span className={styles.progressValue}>{avgProgress}%</span>
              </div>
            </div>

            {loading ? (
              <div className={styles.loading}>
                <div className={styles.spinner}></div>
                <p>Loading progress...</p>
              </div>
            ) : progress.length === 0 ? (
              <div className={styles.emptyState}>
                <p>No progress data available</p>
              </div>
            ) : (
              <div className={styles.progressList}>
                {progress.map((item) => (
                  <div key={item.section_id} className={styles.progressItem}>
                    <div className={styles.progressItemHeader}>
                      <span className={styles.sectionName}>{item.section_name}</span>
                      <span className={styles.progressPercent}>{item.progress_percentage}%</span>
                    </div>
                    <div className={styles.progressBar}>
                      <div
                        className={styles.progressFill}
                        style={{ width: `${item.progress_percentage}%` }}
                      ></div>
                    </div>
                    <div className={styles.lastVisited}>
                      Last visited: {new Date(item.last_visited).toLocaleDateString()}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
