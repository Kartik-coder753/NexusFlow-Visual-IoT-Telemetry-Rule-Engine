import { GitBranch } from 'lucide-react';
import { EmptyState } from '../components/common/EmptyState';
import { StatusIndicator } from '../components/common/StatusIndicator';

const PLANNED_NODE_MODULES = [
  { name: 'Telemetry Ingestion Trigger', backendModule: 'backend/ingestion', status: 'Interface Ready' },
  { name: 'Threshold & Range Operators', backendModule: 'backend/operators', status: 'Registry Defined' },
  { name: 'Rule Graph Compiler', backendModule: 'backend/compiler', status: 'Pending Phase 2' },
  { name: 'Execution Engine & Dispatch', backendModule: 'backend/engine', status: 'Pending Phase 2' },
];

export function WorkflowBuilderPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold text-slate-100 tracking-tight">
          Workflow Builder
        </h1>
        <p className="text-xs text-slate-400 mt-1">
          Visual rule graph workspace for connecting telemetry triggers, operators, and alert actions
        </p>
      </div>

      <div className="bg-[#172338] border border-[#22324D] rounded-lg p-5 space-y-5">
        <EmptyState
          icon={GitBranch}
          title="Visual Workflow Canvas Reserved for Next Phase"
          description="Phase 1 establishes the Workflow Mongoose schema, TypeScript models, and modular backend boundaries (compiler, engine, operators) without premature compilation."
        />

        <div className="border-t border-[#22324D] pt-4">
          <h2 className="text-sm font-semibold text-slate-100 mb-3">
            Modular Rule Engine Architecture Readiness
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {PLANNED_NODE_MODULES.map((mod) => (
              <div
                key={mod.name}
                className="bg-[#111C2E] border border-[#22324D] rounded-md p-3.5 flex items-center justify-between gap-3"
              >
                <div className="min-w-0">
                  <p className="text-xs font-medium text-slate-100 truncate">{mod.name}</p>
                  <p className="text-[11px] font-mono text-slate-400 mt-0.5 truncate">
                    {mod.backendModule}
                  </p>
                </div>
                <StatusIndicator
                  label={mod.status}
                  tone={mod.status.includes('Pending') ? 'info' : 'success'}
                />
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
