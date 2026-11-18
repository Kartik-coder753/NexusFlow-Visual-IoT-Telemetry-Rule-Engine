export interface RuleEvaluationResult {
  workflowId: string;
  triggered: boolean;
  evaluatedAt: string;
  matchedNodeIds: string[];
}

export interface RuleEngineContract {
  evaluate(workflowId: string, telemetryContext: Record<string, unknown>): Promise<RuleEvaluationResult>;
}
