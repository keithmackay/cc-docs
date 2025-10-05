import type {ReactNode} from 'react';
import clsx from 'clsx';
import Link from '@docusaurus/Link';
import Layout from '@theme/Layout';
import HomepageFeatures from '@site/src/components/HomepageFeatures';
import Heading from '@theme/Heading';

import styles from './index.module.css';

function HomepageHeader() {
  return (
    <header className={clsx('hero hero--primary', styles.heroBanner)}>
      <div className="container">
        <div className={styles.heroContent}>
          <Heading as="h1" className={styles.heroTitle}>
            Claude Code Templates
          </Heading>
          <div className={styles.heroAcademy}>Academy</div>
          <p className={styles.heroSubtitle}>
            Master Claude Code's powerful components and unlock next-level AI-assisted development workflows
          </p>
        </div>
      </div>
    </header>
  );
}

import {useState} from 'react';

function ChooseYourPath() {
  const paths = [
    {
      title: 'Getting Started',
      level: 'Beginner',
      description: 'Master the fundamentals of Claude Code and its core components',
      features: [
        'Subagents & Output Styles',
        'Hooks & Custom Commands',
        'IDE Integration Basics',
        'First AI Workflows'
      ],
      link: '/docs/category/getting-started',
      color: '#d97706'
    },
    {
      title: 'Tricks & Tips',
      level: 'Intermediate',
      description: 'Advanced techniques and best practices for power users',
      features: [
        'Advanced Subagent Patterns',
        'Custom MCP Servers',
        'Workflow Optimization',
        'Team Collaboration'
      ],
      link: '/docs/category/build-with-claude-code',
      color: 'var(--terminal-text-warning)'
    },
    {
      title: 'Production Ready',
      level: 'Advanced',
      description: 'Deploy Claude Code in enterprise environments at scale',
      features: [
        'Amazon Bedrock & Vertex AI',
        'Security & Compliance',
        'CI/CD Integration',
        'Cost & Performance Monitoring'
      ],
      link: '/docs/category/deployment',
      color: '#10b981'
    }
  ];

  return (
    <section className={styles.pathSection}>
      <div className="container">
        <Heading as="h2" className={styles.pathTitle}>
          Choose Your Path
        </Heading>
        <p className={styles.pathSubtitle}>
          Select your experience level and start building with Claude Code
        </p>

        <div className={styles.pathGrid}>
          {paths.map((path, index) => (
            <Link key={index} to={path.link} className={styles.pathCard}>
              <div className={styles.pathCardHeader} style={{borderTopColor: path.color}}>
                <div className={styles.pathLevel} style={{color: path.color}}>
                  {path.level}
                </div>
                <h3 className={styles.pathCardTitle}>{path.title}</h3>
              </div>
              <p className={styles.pathDescription}>{path.description}</p>
              <ul className={styles.pathFeatures}>
                {path.features.map((feature, idx) => (
                  <li key={idx} className={styles.pathFeature}>
                    <span className={styles.pathFeatureIcon} style={{color: path.color}}>▸</span>
                    {feature}
                  </li>
                ))}
              </ul>
              <div className={styles.pathCta} style={{color: path.color}}>
                Start Learning →
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}

function FAQAccordion() {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const faqItems = [
    {
      question: "What's the difference between Claude Code Templates and the Academy?",
      answer: "Claude Code Templates is a platform where you can download pre-built components for Claude Code (subagents, output styles, hooks, etc.). The Academy is the educational platform that teaches you how to use those components effectively and master Claude Code best practices through structured learning paths."
    },
    {
      question: "How do I get started with the Academy?",
      answer: "Choose your learning path based on your experience level: Beginner (Getting Started), Intermediate (Tricks & Tips), or Advanced (Production Ready). Each path includes step-by-step tutorials, real-world examples, and explanations on how to implement and customize the components from Claude Code Templates."
    },
    {
      question: "Do I need to download components to learn from the Academy?",
      answer: "No! The Academy provides complete documentation and code examples for each component. You can learn the concepts and best practices first, then download the components from Claude Code Templates when you're ready to implement them in your projects."
    },
    {
      question: "Can I contribute components or educational content?",
      answer: "Yes! This is an open-source community project. You can contribute pre-built components to the Templates platform or create educational content for the Academy. We welcome contributions from developers at all levels to help the Claude Code community grow."
    },
    {
      question: "Is this project related to Anthropic?",
      answer: "No, Claude Code Templates and the Academy are independent open-source projects created and maintained by the developer community. We have no official affiliation with Anthropic. Our mission is to help developers maximize their productivity with Claude Code through shared components and community-driven knowledge."
    }
  ];

  const toggleAccordion = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <section className={styles.faqSection}>
      <div className="container">
        <Heading as="h2" className={styles.faqTitle}>
          Frequently Asked Questions
        </Heading>
        <p className={styles.faqSubtitle}>
          Updated this week. Common questions about Claude Code components, integrations, and workflows.
        </p>

        <div className={styles.accordionContainer}>
          {faqItems.map((item, index) => (
            <div key={index} className={styles.accordionItem}>
              <button
                className={`${styles.accordionButton} ${openIndex === index ? styles.accordionButtonOpen : ''}`}
                onClick={() => toggleAccordion(index)}
                type="button"
              >
                <span className={styles.accordionQuestion}>{item.question}</span>
                <span className={`${styles.accordionIcon} ${openIndex === index ? styles.accordionIconOpen : ''}`}>
                  ▲
                </span>
              </button>
              <div className={`${styles.accordionContent} ${openIndex === index ? styles.accordionContentOpen : ''}`}>
                <div className={styles.accordionAnswer}>
                  {item.answer}
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className={styles.faqFooter}>
          <p>For more detailed information, visit the <Link to="https://docs.claude.com/en/docs/claude-code">Claude Code Documentation</Link></p>
        </div>
      </div>
    </section>
  );
}

export default function Home(): ReactNode {
  return (
    <Layout
      title="Claude Code Templates Academy"
      description="Master Claude Code's powerful components and unlock next-level AI-assisted development workflows">
      <HomepageHeader />
      <main>
        <ChooseYourPath />
        <HomepageFeatures />
        <FAQAccordion />
      </main>
    </Layout>
  );
}