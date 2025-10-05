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
    link: '/docs/category/getting-started',
    type: 'Beginner'
  },
  {
    title: 'Output Styles',
    description: 'Customization & Formatting',
    details: 'Master custom output formatting and create personalized response styles for your Claude Code interactions.',
    gradient: 'linear-gradient(135deg, #2d2d2d 0%, #ea580c 100%)',
    link: '/docs/category/build-with-claude-code',
    type: 'Beginner'
  },
  {
    title: 'Hooks',
    description: 'Event-Driven Automation',
    details: 'Create powerful hooks that respond to Claude Code events and automate your development workflows.',
    gradient: 'linear-gradient(135deg, #374151 0%, #f59e0b 100%)',
    link: '/docs/category/build-with-claude-code',
    type: 'Intermediate'
  },
  {
    title: 'MCP Servers',
    description: 'Advanced Integration',
    details: 'Build and integrate Model Context Protocol servers to extend Claude Code capabilities with custom tools.',
    gradient: 'linear-gradient(135deg, #4b5563 0%, #fbbf24 100%)',
    link: '/docs/category/build-with-claude-code',
    type: 'Intermediate'
  },
  {
    title: 'GitHub Actions',
    description: 'CI/CD Automation',
    details: 'Integrate Claude Code into your CI/CD pipeline with GitHub Actions for automated workflows.',
    gradient: 'linear-gradient(135deg, #1e293b 0%, #10b981 100%)',
    link: '/docs/category/build-with-claude-code',
    type: 'Advanced'
  },
  {
    title: 'Production Deployment',
    description: 'Enterprise Scale',
    details: 'Deploy Claude Code in production environments with Amazon Bedrock, Vertex AI, and enterprise security.',
    gradient: 'linear-gradient(135deg, #0f172a 0%, #06b6d4 100%)',
    link: '/docs/category/deployment',
    type: 'Advanced'
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