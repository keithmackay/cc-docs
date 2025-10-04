import React, { useState } from 'react';
import { useMembership } from '../../contexts/MembershipContext';
import MembershipCard from './MembershipCard';
import styles from './MembershipManager.module.css';

export default function MembershipManager() {
  const { currentMembership, plans, loading } = useMembership();
  const [billingCycle, setBillingCycle] = useState<'monthly' | 'yearly'>('monthly');

  if (loading) {
    return (
      <div className={styles.loading}>
        <div className={styles.spinner}></div>
        <p>Loading membership information...</p>
      </div>
    );
  }

  const currentPlanName = currentMembership?.plan?.name || 'free';

  const handleUpgrade = (planName: string) => {
    // TODO: Implement payment flow
    console.log(`Upgrade to ${planName} - ${billingCycle}`);
    alert(`Upgrade to ${planName} (${billingCycle}) - Payment integration coming soon!`);
  };

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h2 className={styles.title}>Membership Plans</h2>
        <p className={styles.subtitle}>
          Choose the perfect plan for your learning journey
        </p>

        <div className={styles.billingToggle}>
          <button
            className={`${styles.toggleButton} ${billingCycle === 'monthly' ? styles.active : ''}`}
            onClick={() => setBillingCycle('monthly')}
          >
            Monthly
          </button>
          <button
            className={`${styles.toggleButton} ${billingCycle === 'yearly' ? styles.active : ''}`}
            onClick={() => setBillingCycle('yearly')}
          >
            Yearly
            <span className={styles.saveBadge}>Save 17%</span>
          </button>
        </div>
      </div>

      <div className={styles.plansGrid}>
        {plans.map((plan) => (
          <MembershipCard
            key={plan.id}
            plan={plan}
            isCurrentPlan={plan.name === currentPlanName}
            onUpgrade={() => handleUpgrade(plan.name)}
          />
        ))}
      </div>

      {currentMembership && currentMembership.plan.name !== 'free' && (
        <div className={styles.currentMembershipInfo}>
          <div className={styles.infoCard}>
            <h3>Current Subscription</h3>
            <div className={styles.infoGrid}>
              <div className={styles.infoItem}>
                <span className={styles.label}>Plan</span>
                <span className={styles.value}>{currentMembership.plan.display_name}</span>
              </div>
              <div className={styles.infoItem}>
                <span className={styles.label}>Status</span>
                <span className={`${styles.value} ${styles.statusBadge} ${styles[currentMembership.status]}`}>
                  {currentMembership.status}
                </span>
              </div>
              <div className={styles.infoItem}>
                <span className={styles.label}>Billing Cycle</span>
                <span className={styles.value}>{currentMembership.billing_cycle}</span>
              </div>
              {currentMembership.expires_at && (
                <div className={styles.infoItem}>
                  <span className={styles.label}>Next Billing</span>
                  <span className={styles.value}>
                    {new Date(currentMembership.expires_at).toLocaleDateString()}
                  </span>
                </div>
              )}
            </div>
            <div className={styles.actions}>
              <button className={styles.manageButton}>
                Manage Subscription
              </button>
              <button className={styles.cancelButton}>
                Cancel Subscription
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
