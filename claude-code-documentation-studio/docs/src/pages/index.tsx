import type {ReactNode} from 'react';
import {useState, useEffect} from 'react';
import Layout from '@theme/Layout';
import Link from '@docusaurus/Link';
import { useHistory } from '@docusaurus/router';
import { useAuth } from '@site/src/contexts/AuthContext';
import * as mockApi from '@site/src/services/mockApi';
import type { Component, Stack, UserStats } from '@site/src/services/mockApi';

import styles from './index.module.css';

const componentTypeIcons: Record<Component['type'], string> = {
  agent: '🤖',
  command: '⚡',
  setting: '⚙️',
  hook: '🪝',
  mcp: '🔌',
  template: '📄'
};

function UserProfile({ stats }: { stats: UserStats | null }) {
  const { user } = useAuth();

  return (
    <div className={styles.profileCard}>
      <div className={styles.profileHeader}>
        <div className={styles.profileAvatar}>
          {user ? user.email.charAt(0).toUpperCase() : 'G'}
        </div>
        <div className={styles.editIcon}>✏️</div>
      </div>
      <h3 className={styles.profileName}>
        {user ? user.user_metadata?.full_name || user.email.split('@')[0] : 'Guest User'}
      </h3>
      <p className={styles.profileEmail}>
        {user ? user.email : 'Sign in to track your component usage'}
      </p>
      <div className={styles.profileStats}>
        <span className={styles.statItem}>{stats?.stats.componentsSaved || 0} Components</span>
        <span className={styles.statDivider}>•</span>
        <span className={styles.statItem}>{stats?.stats.stacksCreated || 0} Stacks</span>
      </div>
    </div>
  );
}

function UsageStatsCard({ stats }: { stats: UserStats | null }) {
  if (!stats) return null;

  const { componentsByType, usageByType, totalUsageCount } = stats.stats;

  return (
    <div className={styles.statsCard}>
      <h4 className={styles.statsTitle}>Usage Statistics</h4>

      <div className={styles.statItem}>
        <span className={styles.statLabel}>Total Uses</span>
        <span className={styles.statValue}>{totalUsageCount}</span>
      </div>

      <div className={styles.statsGrid}>
        {Object.entries(componentsByType).map(([type, count]) => (
          <div key={type} className={styles.typeStatItem}>
            <div className={styles.typeIcon}>{componentTypeIcons[type as Component['type']]}</div>
            <div className={styles.typeInfo}>
              <div className={styles.typeName}>{type}</div>
              <div className={styles.typeCount}>{count} saved • {usageByType[type] || 0} uses</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function TopComponentsCard({ stats }: { stats: UserStats | null }) {
  if (!stats) return null;

  const { mostUsedComponent, topTags } = stats.stats;

  return (
    <div className={styles.topicsCard}>
      <div className={styles.topicsHeader}>
        <h4>Most Used</h4>
      </div>

      <div className={styles.mostUsedComponent}>
        <div className={styles.componentName}>{mostUsedComponent.name}</div>
        <div className={styles.componentUsage}>{mostUsedComponent.usageCount} uses</div>
      </div>

      <div className={styles.topTagsSection}>
        <h5 className={styles.topTagsTitle}>Top Tags</h5>
        <div className={styles.topicsList}>
          {topTags.map(({ tag, count }) => (
            <span key={tag} className={styles.topicTag}>
              {tag} <span className={styles.topicCount}>{count}</span>
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}

function ComponentCard({ component, onClick }: { component: Component; onClick: () => void }) {
  const typeColor = {
    agent: '#3b82f6',
    command: '#f59e0b',
    setting: '#8b5cf6',
    hook: '#ec4899',
    mcp: '#10b981',
    template: '#6366f1'
  }[component.type];

  return (
    <div className={styles.componentCardSmall} onClick={onClick}>
      <div className={styles.componentIconSmall} style={{ background: typeColor }}>
        {componentTypeIcons[component.type]}
      </div>

      <div className={styles.componentContent}>
        <div className={styles.componentMeta}>
          <span className={styles.componentType}>{component.type}</span>
        </div>

        <h4 className={styles.componentTitle}>{component.name}</h4>

        <div className={styles.componentStats}>
          <span>🔄 {component.usageCount} uses</span>
          <span>📥 {component.downloads.toLocaleString()}</span>
        </div>
      </div>
    </div>
  );
}

function StacksSection({ stacks, components }: { stacks: Stack[]; components: Component[] }) {
  const [expandedStack, setExpandedStack] = useState<string | null>(null);

  return (
    <div className={styles.stacksSection}>
      <div className={styles.stacksHeader}>
        <h3>My Stacks</h3>
        <Link to="/my-components" className={styles.viewAllLink}>View All →</Link>
      </div>

      {stacks.length === 0 ? (
        <div className={styles.emptyStack}>
          <p>No stacks created yet</p>
          <Link to="/my-components" className={styles.createStackLink}>Create Your First Stack</Link>
        </div>
      ) : (
        <div className={styles.stacksList}>
          {stacks.slice(0, 3).map((stack) => {
            const stackComponents = stack.components
              .map(compId => components.find(c => c.id === compId))
              .filter(Boolean) as Component[];

            return (
              <div key={stack.id} className={styles.stackItem}>
                <div className={styles.stackItemHeader} onClick={() => setExpandedStack(expandedStack === stack.id ? null : stack.id)}>
                  <div>
                    <div className={styles.stackItemName}>{stack.name}</div>
                    <div className={styles.stackItemMeta}>
                      {stackComponents.length} components • {stack.usageCount} uses
                    </div>
                  </div>
                  <span>{expandedStack === stack.id ? '▲' : '▼'}</span>
                </div>

                {expandedStack === stack.id && (
                  <div className={styles.stackItemComponents}>
                    {stackComponents.map(comp => (
                      <div key={comp.id} className={styles.stackComponent}>
                        <span>{componentTypeIcons[comp.type]}</span>
                        <span>{comp.name}</span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

function RecentComponentsSection({ components }: { components: Component[] }) {
  const history = useHistory();

  const recent = [...components]
    .sort((a, b) => new Date(b.lastUsed).getTime() - new Date(a.lastUsed).getTime())
    .slice(0, 4);

  return (
    <div className={styles.recentSection}>
      <div className={styles.sectionHeader}>
        <h3>Recently Used</h3>
        <Link to="/my-components" className={styles.viewAllLink}>View All →</Link>
      </div>

      {recent.length === 0 ? (
        <div className={styles.emptyState}>
          <div className={styles.emptyIcon}>🔍</div>
          <p>No components saved yet</p>
          <button
            className={styles.browseBtn}
            onClick={() => window.open('https://aitmpl.com', '_blank')}
          >
            Browse Components ↗
          </button>
        </div>
      ) : (
        <div className={styles.componentsGrid}>
          {recent.map((component) => (
            <ComponentCard
              key={component.id}
              component={component}
              onClick={() => window.open(component.sourceUrl, '_blank')}
            />
          ))}
        </div>
      )}
    </div>
  );
}

export default function Home(): ReactNode {
  const { user, loading } = useAuth();
  const history = useHistory();
  const [components, setComponents] = useState<Component[]>([]);
  const [stacks, setStacks] = useState<Stack[]>([]);
  const [stats, setStats] = useState<UserStats | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (user) {
      loadData();
    } else {
      setIsLoading(false);
    }
  }, [user]);

  const loadData = async () => {
    if (!user) return;

    setIsLoading(true);
    try {
      const [componentsData, stacksData, statsData] = await Promise.all([
        mockApi.getUserComponents(user.id),
        mockApi.getUserStacks(user.id),
        mockApi.getUserStats(user.id)
      ]);
      setComponents(componentsData);
      setStacks(stacksData);
      setStats(statsData);
    } catch (error) {
      console.error('Error loading data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  if (loading || isLoading) {
    return (
      <Layout
        title="Claude Code Templates - Academy"
        description="Manage your Claude Code components and stacks">
        <div className={styles.loading}>Loading...</div>
      </Layout>
    );
  }

  if (!user) {
    return (
      <Layout
        title="Claude Code Templates - Academy"
        description="Manage your Claude Code components and stacks">
        <div className={styles.guestView}>
          <div className={styles.guestHero}>
            <h1>Welcome to Claude Code Academy</h1>
            <p>Your personal workspace for organizing and tracking Claude Code components from aitmpl.com</p>
            <div className={styles.guestActions}>
              <Link to="/auth" className={styles.signInBtn}>Sign In to Get Started</Link>
              <button
                className={styles.browseBtn}
                onClick={() => window.open('https://aitmpl.com', '_blank')}
              >
                Browse Components ↗
              </button>
            </div>
          </div>

          <div className={styles.featuresGrid}>
            <div className={styles.featureCard}>
              <div className={styles.featureIcon}>🤖</div>
              <h3>Save Components</h3>
              <p>Save your favorite agents, hooks, settings, and more from aitmpl.com</p>
            </div>
            <div className={styles.featureCard}>
              <div className={styles.featureIcon}>📚</div>
              <h3>Organize in Stacks</h3>
              <p>Create reusable stacks for different projects and workflows</p>
            </div>
            <div className={styles.featureCard}>
              <div className={styles.featureIcon}>📊</div>
              <h3>Track Usage</h3>
              <p>Monitor which components you use most and optimize your workflow</p>
            </div>
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout
      title="My Dashboard - Claude Code Academy"
      description="Manage your Claude Code components and stacks">
      <div className={styles.dashboardContainer}>
        <div className={styles.dashboardGrid}>
          {/* Sidebar */}
          <aside className={styles.sidebar}>
            <UserProfile stats={stats} />
            <UsageStatsCard stats={stats} />
            <TopComponentsCard stats={stats} />
          </aside>

          {/* Main Content */}
          <main className={styles.mainContent}>
            <RecentComponentsSection components={components} />
            <StacksSection stacks={stacks} components={components} />
          </main>
        </div>
      </div>
    </Layout>
  );
}
