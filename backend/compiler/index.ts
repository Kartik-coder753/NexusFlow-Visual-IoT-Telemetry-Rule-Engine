export interface WorkflowGraphInput {
  workflowId: string;
  nodes: Array<{ id: string; type: string; config: Record<string, unknown> }>;
  edges: Array<{ id: string; source: string; target: string }>;
}

export interface CompiledWorkflowSpec {
  workflowId: string;
  version: number;
  compiledAt: string;
  nodeCount: number;
}

export interface WorkflowCompilerContract {
  compile(graph: WorkflowGraphInput): CompiledWorkflowSpec;
}
