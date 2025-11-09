import type {ReactNode} from 'react';
import {useState, useEffect} from 'react';
import Layout from '@theme/Layout';
import Link from '@docusaurus/Link';
import { useHistory } from '@docusaurus/router';
import { useAuth } from '@site/src/contexts/AuthContext';
import * as mockApi from '@site/src/services/mockApi';
import type { Component, Stack } from '@site/src/services/mockApi';

import styles from './my-components.module.css';

const componentTypeIcons: Record<Component['type'], string> = {
  agent: '🤖',
  command: '⚡',
  setting: '⚙️',
  hook: '🪝',
  mcp: '🔌',
  template: '📄'
};

const componentTypeColors: Record<Component['type'], string> = {
  agent: '#3b82f6',
  command: '#f59e0b',
  setting: '#8b5cf6',
  hook: '#ec4899',
  mcp: '#10b981',
  template: '#6366f1'
};

function ComponentCard({ component, onAddToStack }: { component: Component; onAddToStack: (component: Component) => void }) {
  return (
    <div className={styles.componentCard}>
      <div className={styles.componentHeader}>
        <div className={styles.componentIcon} style={{ background: componentTypeColors[component.type] }}>
          {componentTypeIcons[component.type]}
        </div>
        <div className={styles.componentMeta}>
          <h4 className={styles.componentName}>{component.name}</h4>
          <div className={styles.componentInfo}>
            <span className={styles.componentType}>{component.type}</span>
            <span className={styles.componentDivider}>•</span>
            <span className={styles.componentAuthor}>{component.author}</span>
          </div>
        </div>
      </div>

      <p className={styles.componentDescription}>{component.description}</p>

      <div className={styles.componentTags}>
        {component.tags.map((tag) => (
          <span key={tag} className={styles.componentTag}>{tag}</span>
        ))}
      </div>

      <div className={styles.componentFooter}>
        <div className={styles.componentStats}>
          <span>📥 {component.downloads.toLocaleString()}</span>
          <span>🔄 {component.usageCount} uses</span>
        </div>
        <div className={styles.componentActions}>
          <Link to={component.sourceUrl} className={styles.viewBtn}>View</Link>
          <button onClick={() => onAddToStack(component)} className={styles.addBtn}>+ Stack</button>
        </div>
      </div>
    </div>
  );
}

function StackCard({ stack, components }: { stack: Stack; components: Component[] }) {
  const [isExpanded, setIsExpanded] = useState(false);

  const stackComponents = stack.components
    .map(compId => components.find(c => c.id === compId))
    .filter(Boolean) as Component[];

  return (
    <div className={styles.stackCard}>
      <div className={styles.stackHeader}>
        <div className={styles.stackInfo}>
          <h3 className={styles.stackName}>{stack.name}</h3>
          <p className={styles.stackDescription}>{stack.description}</p>
          <div className={styles.stackMeta}>
            <span>{stackComponents.length} components</span>
            <span className={styles.divider}>•</span>
            <span>{stack.usageCount} total uses</span>
            <span className={styles.divider}>•</span>
            <span>Updated {new Date(stack.updatedAt).toLocaleDateString()}</span>
          </div>
        </div>
        <button
          className={styles.expandBtn}
          onClick={() => setIsExpanded(!isExpanded)}
        >
          {isExpanded ? '▲' : '▼'}
        </button>
      </div>

      {isExpanded && (
        <div className={styles.stackComponents}>
          <div className={styles.componentsList}>
            {stackComponents.map((component) => (
              <div key={component.id} className={styles.stackComponentItem}>
                <div className={styles.componentItemIcon} style={{ background: componentTypeColors[component.type] }}>
                  {componentTypeIcons[component.type]}
                </div>
                <div className={styles.componentItemInfo}>
                  <div className={styles.componentItemName}>{component.name}</div>
                  <div className={styles.componentItemType}>{component.type} • {component.usageCount} uses</div>
                </div>
                <Link to={component.sourceUrl} className={styles.componentItemLink}>→</Link>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

function CreateStackModal({ isOpen, onClose, onCreate }: { isOpen: boolean; onClose: () => void; onCreate: (name: string, description: string) => void }) {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onCreate(name, description);
    setName('');
    setDescription('');
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className={styles.modalOverlay} onClick={onClose}>
      <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
        <div className={styles.modalHeader}>
          <h3>Create New Stack</h3>
          <button className={styles.closeBtn} onClick={onClose}>✕</button>
        </div>
        <form onSubmit={handleSubmit}>
          <div className={styles.formGroup}>
            <label htmlFor="stackName">Stack Name</label>
            <input
              id="stackName"
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g., Frontend Development Stack"
              required
              className={styles.input}
            />
          </div>
          <div className={styles.formGroup}>
            <label htmlFor="stackDescription">Description</label>
            <textarea
              id="stackDescription"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="What is this stack for?"
              rows={3}
              className={styles.textarea}
            />
          </div>
          <div className={styles.modalActions}>
            <button type="button" onClick={onClose} className={styles.cancelBtn}>Cancel</button>
            <button type="submit" className={styles.createBtn}>Create Stack</button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default function MyComponents(): ReactNode {
  const { user, loading } = useAuth();
  const history = useHistory();
  const [activeTab, setActiveTab] = useState<'stacks' | 'recent'>('stacks');
  const [stacks, setStacks] = useState<Stack[]>([]);
  const [components, setComponents] = useState<Component[]>([]);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!loading && !user) {
      history.push('/auth?redirect=/my-components');
    }
  }, [user, loading, history]);

  useEffect(() => {
    if (user) {
      loadData();
    }
  }, [user]);

  const loadData = async () => {
    setIsLoading(true);
    try {
      const [componentsData, stacksData] = await Promise.all([
        mockApi.getUserComponents(user.id),
        mockApi.getUserStacks(user.id, true)
      ]);
      setComponents(componentsData);
      setStacks(stacksData);
    } catch (error) {
      console.error('Error loading data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCreateStack = async (name: string, description: string) => {
    try {
      const result = await mockApi.createStack(user.id, name, description);
      if (result.success) {
        setStacks([...stacks, result.stack]);
      }
    } catch (error) {
      console.error('Error creating stack:', error);
    }
  };

  const handleAddToStack = (component: Component) => {
    // TODO: Show modal to select stack
    console.log('Add component to stack:', component);
  };

  if (loading || isLoading) {
    return (
      <Layout title="My Components">
        <div className={styles.loading}>Loading your components...</div>
      </Layout>
    );
  }

  if (!user) {
    return null;
  }

  const recentComponents = [...components]
    .sort((a, b) => new Date(b.savedAt).getTime() - new Date(a.savedAt).getTime())
    .slice(0, 10);

  return (
    <Layout
      title="My Components - Claude Code Academy"
      description="Manage your saved Claude Code components and stacks">
      <div className={styles.container}>
        <div className={styles.header}>
          <div className={styles.headerContent}>
            <h1 className={styles.title}>My Components</h1>
            <p className={styles.subtitle}>
              Manage components saved from <Link to="https://aitmpl.com">Claude Code Templates</Link>
            </p>
          </div>
          <button className={styles.browseBtn} onClick={() => window.open('https://aitmpl.com', '_blank')}>
            Browse Components ↗
          </button>
        </div>

        <div className={styles.tabs}>
          <button
            className={`${styles.tab} ${activeTab === 'stacks' ? styles.tabActive : ''}`}
            onClick={() => setActiveTab('stacks')}
          >
            📚 My Stacks <span className={styles.tabCount}>{stacks.length}</span>
          </button>
          <button
            className={`${styles.tab} ${activeTab === 'recent' ? styles.tabActive : ''}`}
            onClick={() => setActiveTab('recent')}
          >
            🕒 Recently Saved <span className={styles.tabCount}>{components.length}</span>
          </button>
        </div>

        {activeTab === 'stacks' && (
          <div className={styles.content}>
            <div className={styles.stacksHeader}>
              <p className={styles.stacksDescription}>
                Organize your components into reusable stacks for different projects
              </p>
              <button className={styles.createStackBtn} onClick={() => setIsCreateModalOpen(true)}>
                + Create Stack
              </button>
            </div>

            <div className={styles.stacksList}>
              {stacks.map((stack) => (
                <StackCard key={stack.id} stack={stack} components={components} />
              ))}
            </div>

            {stacks.length === 0 && (
              <div className={styles.emptyState}>
                <div className={styles.emptyIcon}>📦</div>
                <h3>No stacks yet</h3>
                <p>Create your first stack to organize components</p>
                <button className={styles.emptyBtn} onClick={() => setIsCreateModalOpen(true)}>
                  Create Your First Stack
                </button>
              </div>
            )}
          </div>
        )}

        {activeTab === 'recent' && (
          <div className={styles.content}>
            <div className={styles.componentsGrid}>
              {recentComponents.map((component) => (
                <ComponentCard
                  key={component.id}
                  component={component}
                  onAddToStack={handleAddToStack}
                />
              ))}
            </div>

            {components.length === 0 && (
              <div className={styles.emptyState}>
                <div className={styles.emptyIcon}>🔍</div>
                <h3>No components saved yet</h3>
                <p>Browse Claude Code Templates to save your first component</p>
                <button
                  className={styles.emptyBtn}
                  onClick={() => window.open('https://aitmpl.com', '_blank')}
                >
                  Browse Components ↗
                </button>
              </div>
            )}
          </div>
        )}
      </div>

      <CreateStackModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        onCreate={handleCreateStack}
      />
    </Layout>
  );
}
