/**
 * Mock API Service
 * Simulates API calls using local JSON files
 */

import userComponentsData from '../data/mock-api/user-components.json';
import userStacksData from '../data/mock-api/user-stacks.json';
import userStatsData from '../data/mock-api/user-stats.json';

// Simulate network delay
const delay = (ms: number = 300) => new Promise(resolve => setTimeout(resolve, ms));

export interface Component {
  id: string;
  componentId: string;
  name: string;
  type: 'agent' | 'command' | 'setting' | 'hook' | 'mcp' | 'template';
  description: string;
  author: string;
  authorId: string;
  downloads: number;
  tags: string[];
  savedAt: string;
  sourceUrl: string;
  usageCount: number;
  lastUsed: string;
  stacks: string[];
}

export interface Stack {
  id: string;
  name: string;
  description: string;
  components: string[];
  visibility: 'private' | 'public';
  createdAt: string;
  updatedAt: string;
  usageCount: number;
}

export interface UserStats {
  userId: string;
  stats: {
    componentsSaved: number;
    stacksCreated: number;
    totalUsageCount: number;
    favoriteComponentType: string;
    mostUsedComponent: {
      id: string;
      name: string;
      usageCount: number;
    };
    memberSince: string;
    lastActive: string;
    totalTimeActive: number;
    componentsByType: Record<string, number>;
    usageByType: Record<string, number>;
    topTags: Array<{ tag: string; count: number }>;
    recentActivity: Array<{
      type: string;
      componentId: string;
      componentName: string;
      timestamp: string;
    }>;
    weeklyActivity: Array<{ day: string; usageCount: number }>;
  };
}

/**
 * Get user's saved components
 */
export async function getUserComponents(userId: string): Promise<Component[]> {
  await delay();
  return userComponentsData.components as Component[];
}

/**
 * Get user's stacks
 */
export async function getUserStacks(userId: string, includeComponents: boolean = false): Promise<Stack[]> {
  await delay();
  const stacks = userStacksData.stacks as Stack[];

  if (!includeComponents) {
    return stacks;
  }

  // Enrich stacks with component details
  const components = userComponentsData.components;
  return stacks.map(stack => ({
    ...stack,
    componentsDetails: stack.components
      .map(compId => components.find(c => c.id === compId))
      .filter(Boolean)
  }));
}

/**
 * Get user statistics
 */
export async function getUserStats(userId: string): Promise<UserStats> {
  await delay();
  return userStatsData as UserStats;
}

/**
 * Save a component
 */
export async function saveComponent(userId: string, componentData: Partial<Component>): Promise<{ success: boolean; component: Component }> {
  await delay(500);

  const newComponent: Component = {
    id: `comp-${Date.now()}`,
    componentId: componentData.componentId || '',
    name: componentData.name || '',
    type: componentData.type || 'agent',
    description: componentData.description || '',
    author: componentData.author || '',
    authorId: componentData.authorId || '',
    downloads: componentData.downloads || 0,
    tags: componentData.tags || [],
    savedAt: new Date().toISOString(),
    sourceUrl: componentData.sourceUrl || '',
    usageCount: 0,
    lastUsed: new Date().toISOString(),
    stacks: []
  };

  return {
    success: true,
    component: newComponent
  };
}

/**
 * Create a stack
 */
export async function createStack(userId: string, name: string, description: string): Promise<{ success: boolean; stack: Stack }> {
  await delay(500);

  const newStack: Stack = {
    id: `stack-${Date.now()}`,
    name,
    description,
    components: [],
    visibility: 'private',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    usageCount: 0
  };

  return {
    success: true,
    stack: newStack
  };
}

/**
 * Add component to stack
 */
export async function addComponentToStack(userId: string, stackId: string, componentId: string): Promise<{ success: boolean }> {
  await delay(300);
  return { success: true };
}

/**
 * Remove component from stack
 */
export async function removeComponentFromStack(userId: string, stackId: string, componentId: string): Promise<{ success: boolean }> {
  await delay(300);
  return { success: true };
}

/**
 * Delete component
 */
export async function deleteComponent(userId: string, componentId: string): Promise<{ success: boolean }> {
  await delay(300);
  return { success: true };
}

/**
 * Delete stack
 */
export async function deleteStack(userId: string, stackId: string): Promise<{ success: boolean }> {
  await delay(300);
  return { success: true };
}

/**
 * Check if component is saved
 */
export async function checkComponentSaved(userId: string, componentId: string): Promise<{ isSaved: boolean; savedAt?: string; stacks?: string[] }> {
  await delay(200);

  const component = userComponentsData.components.find(c => c.componentId === componentId);

  if (component) {
    return {
      isSaved: true,
      savedAt: component.savedAt,
      stacks: component.stacks
    };
  }

  return { isSaved: false };
}

export default {
  getUserComponents,
  getUserStacks,
  getUserStats,
  saveComponent,
  createStack,
  addComponentToStack,
  removeComponentFromStack,
  deleteComponent,
  deleteStack,
  checkComponentSaved
};
