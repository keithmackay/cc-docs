import React, { useState, useEffect } from 'react';
import { supabase } from '../../lib/supabase';
import styles from './ResourceManagement.module.css';

interface MembershipPlan {
  id: string;
  name: string;
  display_name: string;
}

interface ModuleAccess {
  id: string;
  course_id: string;
  module_id: string;
  plan_id: string;
  has_access: boolean;
}

interface ResourceItem {
  courseId: string;
  moduleId: string;
  moduleName: string;
  freeAccess: boolean;
  proAccess: boolean;
}

export default function ResourceManagement() {
  const [plans, setPlans] = useState<MembershipPlan[]>([]);
  const [resources, setResources] = useState<ResourceItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState<string | null>(null);

  const moduleNames: Record<string, string> = {
    'subagents': 'Subagents',
    'hooks': 'Hooks',
    'workflows': 'Workflows'
  };

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);

      // Load plans
      const { data: plansData, error: plansError } = await supabase
        .from('membership_plans')
        .select('id, name, display_name')
        .in('name', ['free', 'pro'])
        .order('sort_order');

      if (plansError) throw plansError;
      setPlans(plansData || []);

      const freePlan = plansData?.find(p => p.name === 'free');
      const proPlan = plansData?.find(p => p.name === 'pro');

      // Load module access
      const { data: accessData, error: accessError } = await supabase
        .from('module_access')
        .select('*')
        .eq('course_id', 'claude-code');

      if (accessError) throw accessError;

      // Build resources list
      const resourcesList: ResourceItem[] = Object.keys(moduleNames).map(moduleId => {
        const freeAccessRecord = accessData?.find(
          a => a.module_id === moduleId && a.plan_id === freePlan?.id
        );
        const proAccessRecord = accessData?.find(
          a => a.module_id === moduleId && a.plan_id === proPlan?.id
        );

        return {
          courseId: 'claude-code',
          moduleId,
          moduleName: moduleNames[moduleId],
          freeAccess: freeAccessRecord?.has_access || false,
          proAccess: proAccessRecord?.has_access !== false // default to true if not set
        };
      });

      setResources(resourcesList);
    } catch (error) {
      console.error('Error loading data:', error);
    } finally {
      setLoading(false);
    }
  };

  const updateAccess = async (
    moduleId: string,
    planType: 'free' | 'pro',
    hasAccess: boolean
  ) => {
    try {
      setSaving(moduleId);

      const plan = plans.find(p => p.name === planType);
      if (!plan) throw new Error('Plan not found');

      console.log('[ResourceManagement] Updating access:', { moduleId, planType, hasAccess, planId: plan.id });

      // Check if record exists
      const { data: existing, error: selectError } = await supabase
        .from('module_access')
        .select('id')
        .eq('course_id', 'claude-code')
        .eq('module_id', moduleId)
        .eq('plan_id', plan.id)
        .single();

      console.log('[ResourceManagement] Existing record:', { existing, selectError });

      if (existing) {
        // Update existing record
        const { error } = await supabase
          .from('module_access')
          .update({ has_access: hasAccess })
          .eq('id', existing.id);

        console.log('[ResourceManagement] Update result:', { error });

        if (error) {
          console.error('[ResourceManagement] Update error details:', error);
          throw error;
        }
      } else {
        // Insert new record
        const { error } = await supabase
          .from('module_access')
          .insert({
            course_id: 'claude-code',
            module_id: moduleId,
            plan_id: plan.id,
            has_access: hasAccess
          });

        console.log('[ResourceManagement] Insert result:', { error });

        if (error) {
          console.error('[ResourceManagement] Insert error details:', error);
          throw error;
        }
      }

      // Reload data
      await loadData();
    } catch (error: any) {
      console.error('[ResourceManagement] Error updating access:', error);
      const errorMessage = error?.message || 'Unknown error';
      alert(`Error updating access: ${errorMessage}\n\nCheck console for details.`);
    } finally {
      setSaving(null);
    }
  };

  if (loading) {
    return (
      <div className={styles.loading}>
        <div className={styles.spinner}></div>
        <p>Loading resources...</p>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h2>Module Access Management</h2>
        <p>Control which membership plans have access to each module</p>
      </div>

      <div className={styles.table}>
        <div className={styles.tableHeader}>
          <div className={styles.columnModule}>Module</div>
          <div className={styles.columnAccess}>Free Access</div>
          <div className={styles.columnAccess}>Pro Access</div>
        </div>

        {resources.map(resource => (
          <div key={resource.moduleId} className={styles.tableRow}>
            <div className={styles.columnModule}>
              <div className={styles.moduleName}>{resource.moduleName}</div>
              <div className={styles.moduleId}>{resource.courseId}/{resource.moduleId}</div>
            </div>

            <div className={styles.columnAccess}>
              <label className={styles.toggle}>
                <input
                  type="checkbox"
                  checked={resource.freeAccess}
                  disabled={saving === resource.moduleId}
                  onChange={(e) => updateAccess(resource.moduleId, 'free', e.target.checked)}
                />
                <span className={styles.slider}></span>
                <span className={styles.label}>
                  {saving === resource.moduleId ? 'Saving...' : resource.freeAccess ? 'Enabled' : 'Disabled'}
                </span>
              </label>
            </div>

            <div className={styles.columnAccess}>
              <label className={styles.toggle}>
                <input
                  type="checkbox"
                  checked={resource.proAccess}
                  disabled={saving === resource.moduleId}
                  onChange={(e) => updateAccess(resource.moduleId, 'pro', e.target.checked)}
                />
                <span className={styles.slider}></span>
                <span className={styles.label}>
                  {saving === resource.moduleId ? 'Saving...' : resource.proAccess ? 'Enabled' : 'Disabled'}
                </span>
              </label>
            </div>
          </div>
        ))}
      </div>

      <div className={styles.note}>
        <svg viewBox="0 0 24 24" width="20" height="20" fill="currentColor">
          <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-2h2v2zm0-4h-2V7h2v6z"/>
        </svg>
        <p>Changes take effect immediately for all users. Pro members should always have access to all modules.</p>
      </div>
    </div>
  );
}
