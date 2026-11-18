import { History } from 'lucide-react';
import { EmptyState } from '../components/common/EmptyState';

export function WorkflowHistoryPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold text-slate-100 tracking-tight">
          Workflow History
        </h1>
        <p className="text-xs text-slate-400 mt-1">
          Audited execution traces, node evaluation timings, and outcome logs
        </p>
      </div>

      <div className="bg-[#172338] border border-[#22324D] rounded-lg p-5">
        <EmptyState
          icon={History}
          title="No workflow executions recorded"
          description="Execution traces will appear here once workflow rules are deployed and evaluated against incoming device telemetry."
        />
      </div>
    </div>
  );
}
