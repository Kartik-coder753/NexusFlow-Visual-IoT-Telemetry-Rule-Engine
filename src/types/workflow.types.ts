export type WorkflowStatus = 'active' | 'paused' | 'draft' | 'error';

export interface WorkflowSummary {
  id: string;
  name: string;
  description?: string;
  status: WorkflowStatus;
  triggerType: string;
  executionCount: number;
  lastExecutedAt: string | null;
}
