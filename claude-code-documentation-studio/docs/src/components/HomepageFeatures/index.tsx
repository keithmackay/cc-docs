import type {ReactNode} from 'react';
import clsx from 'clsx';
import Heading from '@theme/Heading';
import Link from '@docusaurus/Link';
import styles from './styles.module.css';

type FeatureItem = {
  title: string;
  description: string;
  details: string;
  gradient: string;
  link: string;
  type: string;
};

const FeatureList: FeatureItem[] = [
  {
    title: 'Subagents',
    description: 'Foundation Concepts',
    details: 'Learn the fundamentals of Claude Code subagents and how specialized agents work in your development workflow.',
    gradient: 'linear-gradient(135deg, #1a1a1a 0%, #d97706 100%)',
    link: '/docs/subagents/overview',
    type: 'Beginner'
  },
  {
    title: 'Docusaurus Expert',
    description: 'Specialized Agent',
    details: 'Master the documentation specialist agent and automate your Docusaurus documentation workflows.',
    gradient: 'linear-gradient(135deg, #2d2d2d 0%, #ea580c 100%)',
    link: '/docs/subagents/docusaurus-expert',
    type: 'Beginner'
  },
  {
    title: 'Hooks',
    description: 'Event-Driven Automation',
    details: 'Create powerful hooks that respond to Claude Code events and automate your development workflows.',
    gradient: 'linear-gradient(135deg, #374151 0%, #f59e0b 100%)',
    link: '/docs/hooks/overview',
    type: 'Intermediate'
  },
  {
    title: 'Discord Notifications',
    description: 'Team Communication',
    details: 'Build a Discord notification system to send real-time updates to your team when agents complete tasks.',
    gradient: 'linear-gradient(135deg, #4b5563 0%, #fbbf24 100%)',
    link: '/docs/hooks/discord-notification-hook',
    type: 'Intermediate'
  },
  {
    title: 'CI/CD Workflow',
    description: 'Complete Integration',
    details: 'Combine everything into a production-ready CI/CD pipeline with GitHub Actions automation.',
    gradient: 'linear-gradient(135deg, #1e293b 0%, #10b981 100%)',
    link: '/docs/workflows/cicd-workflow',
    type: 'Advanced'
  },
  {
    title: 'Getting Started',
    description: 'Introduction',
    details: 'Start your journey with Claude Code and learn the basics to get up and running quickly.',
    gradient: 'linear-gradient(135deg, #0f172a 0%, #06b6d4 100%)',
    link: '/docs/intro',
    type: 'Beginner'
  },
];

function Feature({title, description, details, gradient, link, type}: FeatureItem) {
  return (
    <div className={styles.featureWrapper}>
      <Link to={link} className={styles.featureLink}>
        <div className={styles.featureCard} style={{background: gradient}}>
          <div className={styles.featureContent}>
            <div className={styles.featureType}>{type}</div>
            <Heading as="h3" className={styles.featureTitle}>
              {title}
            </Heading>
            <p className={styles.featureDescription}>{description}</p>
            <p className={styles.featureDetails}>{details}</p>
          </div>
        </div>
      </Link>
    </div>
  );
}

export default function HomepageFeatures(): ReactNode {
  return (
    <section className={styles.features}>
      <div className="container">
        <div className="text--center margin-bottom--xl">
          <Heading as="h2" className={styles.sectionTitle}>
            Start Your Claude Code Journey
          </Heading>
          <p className={styles.sectionSubtitle}>
            Explore individual modules and dive deep into the topics that matter most to you
          </p>
        </div>
        <div className={styles.featuresGrid}>
          {FeatureList.map((props, idx) => (
            <Feature key={idx} {...props} />
          ))}
        </div>
        <div className={styles.viewAllContainer}>
          <Link to="/docs" className={styles.viewAllButton}>
            View All Modules →
          </Link>
        </div>
      </div>
    </section>
  );
}