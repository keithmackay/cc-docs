import type {ReactNode} from 'react';
import {useState, useEffect} from 'react';
import Layout from '@theme/Layout';
import Link from '@docusaurus/Link';
import { useHistory } from '@docusaurus/router';
import { useAuth } from '@site/src/contexts/AuthContext';
import * as mockApi from '@site/src/services/mockApi';
import type { Component, Stack, UserStats } from '@site/src/services/mockApi';

import styles from './profile.module.css';

// Mock course data
interface Course {
  id: string;
  title: string;
  description: string;
  progress: number;
  totalLessons: number;
  completedLessons: number;
  category: 'agent' | 'command' | 'setting' | 'hook' | 'mcp' | 'template' | 'general';
  status: 'in-progress' | 'completed' | 'not-started';
  lastAccessed?: string;
  thumbnail?: string;
}

const MOCK_COURSES: Course[] = [
  {
    id: '1',
    title: 'Mastering Claude Code Agents',
    description: 'Learn to build and deploy custom agents for automation',
    progress: 65,
    totalLessons: 12,
    completedLessons: 8,
    category: 'agent',
    status: 'in-progress',
    lastAccessed: '2 hours ago'
  },
  {
    id: '2',
    title: 'Custom Commands Workshop',
    description: 'Create powerful CLI commands for your workflow',
    progress: 100,
    totalLessons: 8,
    completedLessons: 8,
    category: 'command',
    status: 'completed',
    lastAccessed: '1 day ago'
  },
  {
    id: '3',
    title: 'MCP Integration Guide',
    description: 'Connect and configure Model Context Protocol',
    progress: 30,
    totalLessons: 10,
    completedLessons: 3,
    category: 'mcp',
    status: 'in-progress',
    lastAccessed: '3 days ago'
  },
  {
    id: '4',
    title: 'Advanced Hooks & Automation',
    description: 'Master event-driven automation with hooks',
    progress: 0,
    totalLessons: 15,
    completedLessons: 0,
    category: 'hook',
    status: 'not-started'
  },
  {
    id: '5',
    title: 'Template Design Patterns',
    description: 'Build reusable templates for rapid development',
    progress: 0,
    totalLessons: 10,
    completedLessons: 0,
    category: 'template',
    status: 'not-started'
  }
];

const componentTypeIcons: Record<Component['type'], string> = {
  agent: '🤖',
  command: '⚡',
  setting: '⚙️',
  hook: '🪝',
  mcp: '🔌',
  template: '📄'
};

const componentTypeColors: Record<Component['type'], string> = {
  agent: '#10b981',
  command: '#f59e0b',
  setting: '#8b5cf6',
  hook: '#ec4899',
  mcp: '#3b82f6',
  template: '#6366f1'
};

function Sidebar({ stats }: { stats: UserStats | null }) {
  const { user } = useAuth();
  const avatarUrl = user?.user_metadata?.avatar_url;
  const username = user?.user_metadata?.user_name || user?.user_metadata?.full_name || user?.email?.split('@')[0] || 'user';

  return (
    <div className={styles.sidebar}>
      {/* User Profile Card */}
      <div className={styles.profileCard}>
        {avatarUrl ? (
          <img
            src={avatarUrl}
            alt={username}
            className={styles.avatar}
          />
        ) : (
          <div className={styles.avatarFallback}>
            {username.charAt(0).toUpperCase()}
          </div>
        )}
        <h2 className={styles.profileName}>{username}</h2>
        <p className={styles.profileEmail}>{user?.email}</p>
        <div className={styles.profileStats}>
          <span className={styles.profileStat}>{stats?.stats.componentsSaved || 0} Components</span>
          <span className={styles.separator}>·</span>
          <span className={styles.profileStat}>{stats?.stats.stacksCreated || 0} Stacks</span>
        </div>
      </div>

      {/* Usage Statistics Card */}
      <div className={styles.statsCard}>
        <h3 className={styles.statsTitle}>
          <span className={styles.terminalPrompt}>$</span> Usage Statistics
        </h3>

        <div className={styles.totalUses}>
          <span className={styles.totalLabel}>Total Uses</span>
          <span className={styles.totalValue}>{stats?.stats.totalUsageCount || 0}</span>
        </div>

        <div className={styles.typesList}>
          {stats?.stats.componentsByType && Object.entries(stats.stats.componentsByType).map(([type, savedCount]) => {
            const usedCount = stats.stats.usageByType[type] || 0;
            return (
              <div key={type} className={styles.typeItem}>
                <div className={styles.typeIcon} style={{ color: componentTypeColors[type as Component['type']] }}>
                  {componentTypeIcons[type as Component['type']]}
                </div>
                <div className={styles.typeInfo}>
                  <div className={styles.typeName}>{type.charAt(0).toUpperCase() + type.slice(1)}</div>
                  <div className={styles.typeStats}>{savedCount} saved · {usedCount} uses</div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

function RecentlyUsed({ components }: { components: Component[] }) {
  // Get the 4 most recently used components
  const recentComponents = components
    .sort((a, b) => new Date(b.lastUsed).getTime() - new Date(a.lastUsed).getTime())
    .slice(0, 4);

  return (
    <div className={styles.section}>
      <div className={styles.sectionHeader}>
        <h2 className={styles.sectionTitle}>
          <span className={styles.terminalPrompt}>$</span> Recently Used
        </h2>
        <Link to="/my-components" className={styles.viewAll}>
          View All →
        </Link>
      </div>

      <div className={styles.componentsGrid}>
        {recentComponents.map((component) => (
          <div
            key={component.id}
            className={styles.componentCard}
            style={{ borderLeftColor: componentTypeColors[component.type] }}
          >
            <div
              className={styles.componentIcon}
              style={{ backgroundColor: componentTypeColors[component.type] }}
            >
              {componentTypeIcons[component.type]}
            </div>
            <div className={styles.componentInfo}>
              <h3 className={styles.componentName}>{component.name}</h3>
              <div className={styles.componentMeta}>
                <span className={styles.metaItem}>
                  <span className={styles.metaIcon}>🔄</span>
                  {component.usageCount} uses
                </span>
                <span className={styles.metaItem}>
                  <span className={styles.metaIcon}>📊</span>
                  {component.stacks.length.toLocaleString()}
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function MyStacks({ stacks }: { stacks: Stack[] }) {
  return (
    <div className={styles.section}>
      <div className={styles.sectionHeader}>
        <h2 className={styles.sectionTitle}>
          <span className={styles.terminalPrompt}>$</span> My Stacks
        </h2>
        <Link to="/my-components" className={styles.viewAll}>
          View All →
        </Link>
      </div>

      <div className={styles.stacksList}>
        {stacks.map((stack) => (
          <div key={stack.id} className={styles.stackItem}>
            <div className={styles.stackInfo}>
              <h3 className={styles.stackName}>{stack.name}</h3>
              <p className={styles.stackMeta}>
                {stack.components.length} components · {stack.usageCount} uses
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function MyCourses() {
  const inProgressCourses = MOCK_COURSES.filter(c => c.status === 'in-progress');
  const upcomingCourses = MOCK_COURSES.filter(c => c.status === 'not-started').slice(0, 2);
  const completedCount = MOCK_COURSES.filter(c => c.status === 'completed').length;

  return (
    <div className={styles.section}>
      <div className={styles.sectionHeader}>
        <h2 className={styles.sectionTitle}>
          <span className={styles.terminalPrompt}>$</span> My Learning
        </h2>
        <Link to="/docs" className={styles.viewAll}>
          View All Courses →
        </Link>
      </div>

      {/* Course Progress Summary */}
      <div className={styles.coursesSummary}>
        <div className={styles.summaryItem}>
          <span className={styles.summaryLabel}>In Progress</span>
          <span className={styles.summaryValue}>{inProgressCourses.length}</span>
        </div>
        <div className={styles.summaryItem}>
          <span className={styles.summaryLabel}>Completed</span>
          <span className={styles.summaryValue}>{completedCount}</span>
        </div>
        <div className={styles.summaryItem}>
          <span className={styles.summaryLabel}>Total Courses</span>
          <span className={styles.summaryValue}>{MOCK_COURSES.length}</span>
        </div>
      </div>

      {/* In Progress Courses */}
      {inProgressCourses.length > 0 && (
        <>
          <h3 className={styles.subsectionTitle}>Continue Learning</h3>
          <div className={styles.coursesList}>
            {inProgressCourses.map((course) => (
              <div
                key={course.id}
                className={styles.courseCard}
                style={{ borderLeftColor: componentTypeColors[course.category as Component['type']] }}
              >
                <div className={styles.courseHeader}>
                  <div
                    className={styles.courseCategoryIcon}
                    style={{ backgroundColor: componentTypeColors[course.category as Component['type']] }}
                  >
                    {componentTypeIcons[course.category as Component['type']]}
                  </div>
                  <div className={styles.courseMainInfo}>
                    <h4 className={styles.courseTitle}>{course.title}</h4>
                    <p className={styles.courseDescription}>{course.description}</p>
                  </div>
                </div>
                <div className={styles.courseProgress}>
                  <div className={styles.courseProgressBar}>
                    <div
                      className={styles.courseProgressFill}
                      style={{
                        width: `${course.progress}%`,
                        backgroundColor: componentTypeColors[course.category as Component['type']]
                      }}
                    ></div>
                  </div>
                  <div className={styles.courseProgressInfo}>
                    <span className={styles.courseProgressText}>
                      {course.completedLessons}/{course.totalLessons} lessons
                    </span>
                    <span className={styles.courseProgressPercent}>{course.progress}%</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </>
      )}

      {/* Upcoming Courses */}
      {upcomingCourses.length > 0 && (
        <>
          <h3 className={styles.subsectionTitle}>Recommended Next</h3>
          <div className={styles.upcomingCoursesList}>
            {upcomingCourses.map((course) => (
              <div key={course.id} className={styles.upcomingCourseCard}>
                <div
                  className={styles.upcomingCourseIcon}
                  style={{ backgroundColor: componentTypeColors[course.category as Component['type']] }}
                >
                  {componentTypeIcons[course.category as Component['type']]}
                </div>
                <div className={styles.upcomingCourseInfo}>
                  <h4 className={styles.upcomingCourseTitle}>{course.title}</h4>
                  <p className={styles.upcomingCourseMeta}>{course.totalLessons} lessons</p>
                </div>
                <Link to="/docs" className={styles.startCourseBtn}>
                  Start
                </Link>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
}

export default function Profile(): ReactNode {
  const { user, loading } = useAuth();
  const history = useHistory();
  const [stats, setStats] = useState<UserStats | null>(null);
  const [components, setComponents] = useState<Component[]>([]);
  const [stacks, setStacks] = useState<Stack[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!loading && !user) {
      history.push('/auth?redirect=/profile');
    }
  }, [user, loading, history]);

  useEffect(() => {
    if (user) {
      loadData();
    }
  }, [user]);

  const loadData = async () => {
    if (!user) return;

    setIsLoading(true);
    try {
      const [statsData, componentsData, stacksData] = await Promise.all([
        mockApi.getUserStats(user.id),
        mockApi.getUserComponents(user.id),
        mockApi.getUserStacks(user.id, true)
      ]);
      setStats(statsData);
      setComponents(componentsData);
      setStacks(stacksData);
    } catch (error) {
      console.error('Error loading data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  if (loading || isLoading) {
    return (
      <Layout title="Profile">
        <div className={styles.container}>
          <div className={styles.loading}>Loading...</div>
        </div>
      </Layout>
    );
  }

  if (!user) {
    return null;
  }

  return (
    <Layout
      title="My Profile - Claude Code Templates"
      description="Your personal dashboard for component usage and learning progress">
      <div className={styles.container}>
        <div className={styles.layout}>
          <Sidebar stats={stats} />

          <div className={styles.mainContent}>
            <RecentlyUsed components={components} />
            <MyCourses />
            <MyStacks stacks={stacks} />
          </div>
        </div>
      </div>
    </Layout>
  );
}
