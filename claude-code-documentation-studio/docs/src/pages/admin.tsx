import React, { useState } from 'react';
import Layout from '@theme/Layout';
import { useAuth } from '../contexts/AuthContext';
import { useAdmin } from '../contexts/AdminContext';
import ResourceManagement from '../components/Admin/ResourceManagement';
import UserManagement from '../components/Admin/UserManagement';
import styles from './admin.module.css';

type TabType = 'resources' | 'users';

export default function AdminPanel() {
  const { user, loading: authLoading } = useAuth();
  const { isAdmin, loading: adminLoading } = useAdmin();
  const [activeTab, setActiveTab] = useState<TabType>('resources');

  if (authLoading || adminLoading) {
    return (
      <Layout title="Admin Panel" description="Administration Dashboard">
        <div className={styles.container}>
          <div className={styles.loading}>
            <div className={styles.spinner}></div>
            <p>Loading admin panel...</p>
          </div>
        </div>
      </Layout>
    );
  }

  if (!user || !isAdmin) {
    return (
      <Layout title="Admin Panel" description="Administration Dashboard">
        <div className={styles.container}>
          <div className={styles.unauthorized}>
            <div className={styles.lockIcon}>
              <svg viewBox="0 0 24 24" width="64" height="64" fill="currentColor">
                <path d="M18 8h-1V6c0-2.76-2.24-5-5-5S7 3.24 7 6v2H6c-1.1 0-2 .9-2 2v10c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V10c0-1.1-.9-2-2-2zm-6 9c-1.1 0-2-.9-2-2s.9-2 2-2 2 .9 2 2-.9 2-2 2zm3.1-9H8.9V6c0-1.71 1.39-3.1 3.1-3.1 1.71 0 3.1 1.39 3.1 3.1v2z"/>
              </svg>
            </div>
            <h1>Access Denied</h1>
            <p>You do not have permission to access this area.</p>
            <a href="/" className={styles.homeButton}>
              Return to Home
            </a>
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout title="Admin Panel" description="Administration Dashboard">
      <div className={styles.container}>
        <div className={styles.header}>
          <h1 className={styles.title}>Admin Panel</h1>
          <p className={styles.subtitle}>Manage resources and users</p>
        </div>

        <div className={styles.tabs}>
          <button
            className={`${styles.tab} ${activeTab === 'resources' ? styles.activeTab : ''}`}
            onClick={() => setActiveTab('resources')}
          >
            <svg viewBox="0 0 24 24" width="20" height="20" fill="currentColor">
              <path d="M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm0 16H5V5h14v14zM7 10h2v7H7zm4-3h2v10h-2zm4 6h2v4h-2z"/>
            </svg>
            Resource Management
          </button>
          <button
            className={`${styles.tab} ${activeTab === 'users' ? styles.activeTab : ''}`}
            onClick={() => setActiveTab('users')}
          >
            <svg viewBox="0 0 24 24" width="20" height="20" fill="currentColor">
              <path d="M16 11c1.66 0 2.99-1.34 2.99-3S17.66 5 16 5c-1.66 0-3 1.34-3 3s1.34 3 3 3zm-8 0c1.66 0 2.99-1.34 2.99-3S9.66 5 8 5C6.34 5 5 6.34 5 8s1.34 3 3 3zm0 2c-2.33 0-7 1.17-7 3.5V19h14v-2.5c0-2.33-4.67-3.5-7-3.5zm8 0c-.29 0-.62.02-.97.05 1.16.84 1.97 1.97 1.97 3.45V19h6v-2.5c0-2.33-4.67-3.5-7-3.5z"/>
            </svg>
            User Management
          </button>
        </div>

        <div className={styles.content}>
          {activeTab === 'resources' && <ResourceManagement />}
          {activeTab === 'users' && <UserManagement />}
        </div>
      </div>
    </Layout>
  );
}
