import React, { useState, useEffect } from 'react';
import { supabase } from '../../lib/supabase';
import UserDetailsModal from './UserDetailsModal';
import styles from './UserManagement.module.css';

interface User {
  id: string;
  email: string;
  created_at: string;
  user_metadata: {
    name?: string;
    avatar_url?: string;
    user_name?: string;
  };
}

interface UserMembership {
  plan: {
    name: string;
    display_name: string;
  };
  status: string;
  billing_cycle: string;
}

interface UserWithMembership extends User {
  membership?: UserMembership;
}

export default function UserManagement() {
  const [users, setUsers] = useState<UserWithMembership[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedUser, setSelectedUser] = useState<UserWithMembership | null>(null);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    loadUsers();
  }, []);

  const loadUsers = async () => {
    try {
      setLoading(true);

      console.log('[UserManagement] Loading users via RPC...');

      // Use RPC function to get all users with memberships
      const { data: usersData, error: usersError } = await supabase
        .rpc('get_all_users_admin');

      console.log('[UserManagement] RPC result:', { usersData, usersError });

      if (usersError) {
        console.error('[UserManagement] Error loading users:', usersError);
        alert(`Error loading users: ${usersError.message}`);
        setLoading(false);
        return;
      }

      // Transform RPC data to match User interface
      const usersWithMemberships: UserWithMembership[] = (usersData || []).map(user => ({
        id: user.id,
        email: user.email,
        created_at: user.created_at,
        user_metadata: user.user_metadata || {},
        membership: user.plan_name ? {
          plan: {
            name: user.plan_name,
            display_name: user.plan_display_name
          },
          status: user.membership_status,
          billing_cycle: user.billing_cycle
        } : undefined
      }));

      console.log('[UserManagement] Processed users:', usersWithMemberships.length);
      setUsers(usersWithMemberships);
    } catch (error) {
      console.error('[UserManagement] Exception loading users:', error);
      alert(`Error loading users: ${error}`);
    } finally {
      setLoading(false);
    }
  };

  const filteredUsers = users.filter(user => {
    const query = searchQuery.toLowerCase();
    return (
      user.email?.toLowerCase().includes(query) ||
      user.user_metadata?.name?.toLowerCase().includes(query) ||
      user.user_metadata?.user_name?.toLowerCase().includes(query)
    );
  });

  if (loading) {
    return (
      <div className={styles.loading}>
        <div className={styles.spinner}></div>
        <p>Loading users...</p>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <div>
          <h2>User Management</h2>
          <p>View and manage user accounts and memberships</p>
        </div>
        <div className={styles.stats}>
          <div className={styles.statCard}>
            <span className={styles.statValue}>{users.length}</span>
            <span className={styles.statLabel}>Total Users</span>
          </div>
          <div className={styles.statCard}>
            <span className={styles.statValue}>
              {users.filter(u => u.membership?.plan?.name === 'pro').length}
            </span>
            <span className={styles.statLabel}>Pro Members</span>
          </div>
        </div>
      </div>

      <div className={styles.searchBar}>
        <svg viewBox="0 0 24 24" width="20" height="20" fill="currentColor">
          <path d="M15.5 14h-.79l-.28-.27C15.41 12.59 16 11.11 16 9.5 16 5.91 13.09 3 9.5 3S3 5.91 3 9.5 5.91 16 9.5 16c1.61 0 3.09-.59 4.23-1.57l.27.28v.79l5 4.99L20.49 19l-4.99-5zm-6 0C7.01 14 5 11.99 5 9.5S7.01 5 9.5 5 14 7.01 14 9.5 11.99 14 9.5 14z"/>
        </svg>
        <input
          type="text"
          placeholder="Search by name, email, or username..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className={styles.searchInput}
        />
      </div>

      <div className={styles.table}>
        <div className={styles.tableHeader}>
          <div className={styles.columnUser}>User</div>
          <div className={styles.columnPlan}>Plan</div>
          <div className={styles.columnStatus}>Status</div>
          <div className={styles.columnDate}>Joined</div>
          <div className={styles.columnActions}>Actions</div>
        </div>

        {filteredUsers.length === 0 ? (
          <div className={styles.emptyState}>
            <p>No users found</p>
          </div>
        ) : (
          filteredUsers.map(user => (
            <div key={user.id} className={styles.tableRow}>
              <div className={styles.columnUser}>
                <div className={styles.userInfo}>
                  {user.user_metadata?.avatar_url && (
                    <img
                      src={user.user_metadata.avatar_url}
                      alt={user.user_metadata.name || 'User'}
                      className={styles.avatar}
                    />
                  )}
                  <div className={styles.userDetails}>
                    <div className={styles.userName}>
                      {user.user_metadata?.name || 'Unknown User'}
                    </div>
                    <div className={styles.userEmail}>{user.email}</div>
                  </div>
                </div>
              </div>

              <div className={styles.columnPlan}>
                <span className={`${styles.planBadge} ${styles[user.membership?.plan?.name || 'free']}`}>
                  {user.membership?.plan?.display_name || 'Free'}
                </span>
              </div>

              <div className={styles.columnStatus}>
                <span className={`${styles.statusBadge} ${styles[user.membership?.status || 'active']}`}>
                  {user.membership?.status || 'active'}
                </span>
              </div>

              <div className={styles.columnDate}>
                {new Date(user.created_at).toLocaleDateString()}
              </div>

              <div className={styles.columnActions}>
                <button
                  className={styles.viewButton}
                  onClick={() => setSelectedUser(user)}
                >
                  View Details
                </button>
              </div>
            </div>
          ))
        )}
      </div>

      {selectedUser && (
        <UserDetailsModal
          user={selectedUser}
          onClose={() => setSelectedUser(null)}
        />
      )}
    </div>
  );
}
