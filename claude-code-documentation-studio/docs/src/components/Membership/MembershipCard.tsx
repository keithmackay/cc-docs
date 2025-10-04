import React from 'react';
import { MembershipPlan } from '../../contexts/MembershipContext';
import styles from './MembershipCard.module.css';

interface MembershipCardProps {
  plan: MembershipPlan;
  isCurrentPlan: boolean;
  onUpgrade?: () => void;
}

export default function MembershipCard({ plan, isCurrentPlan, onUpgrade }: MembershipCardProps) {
  const features = Array.isArray(plan.features) ? plan.features : [];
  const isPro = plan.name === 'pro';

  return (
    <div className={`${styles.card} ${isCurrentPlan ? styles.currentPlan : ''} ${isPro ? styles.proPlan : ''}`}>
      {isPro && <div className={styles.popularBadge}>Most Popular</div>}

      <div className={styles.header}>
        <h3 className={styles.planName}>{plan.display_name}</h3>
        <p className={styles.description}>{plan.description}</p>
      </div>

      <div className={styles.pricing}>
        {plan.price_monthly === 0 ? (
          <div className={styles.price}>
            <span className={styles.amount}>Free</span>
          </div>
        ) : (
          <>
            <div className={styles.price}>
              <span className={styles.currency}>$</span>
              <span className={styles.amount}>{plan.price_monthly}</span>
              <span className={styles.period}>/month</span>
            </div>
            <div className={styles.yearlyPrice}>
              or ${plan.price_yearly}/year <span className={styles.savings}>(Save ${(plan.price_monthly * 12 - plan.price_yearly).toFixed(0)})</span>
            </div>
          </>
        )}
      </div>

      <ul className={styles.features}>
        {features.map((feature, index) => (
          <li key={index} className={styles.feature}>
            <svg width="20" height="20" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd"/>
            </svg>
            <span>{feature}</span>
          </li>
        ))}
      </ul>

      <div className={styles.action}>
        {isCurrentPlan ? (
          <button className={styles.currentButton} disabled>
            Current Plan
          </button>
        ) : (
          <button
            className={styles.upgradeButton}
            onClick={onUpgrade}
          >
            {plan.name === 'free' ? 'Downgrade' : 'Upgrade to Pro'}
          </button>
        )}
      </div>
    </div>
  );
}
