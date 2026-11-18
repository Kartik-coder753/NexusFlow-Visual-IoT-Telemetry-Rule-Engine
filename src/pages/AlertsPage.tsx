import { useState } from 'react';
import { Bell } from 'lucide-react';
import { EmptyState } from '../components/common/EmptyState';

type SeverityFilter = 'all' | 'critical' | 'warning' | 'info';

export function AlertsPage() {
  const [severityFilter, setSeverityFilter] = useState<SeverityFilter>('all');

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold text-slate-100 tracking-tight">
            Alerts &amp; Notifications
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Triggered rule incidents, severity classifications, and notification delivery status
          </p>
        </div>

        <div className="flex items-center gap-1 p-1 rounded-md bg-[#111C2E] border border-[#22324D] self-start sm:self-auto">
          {(['all', 'critical', 'warning', 'info'] as SeverityFilter[]).map((sev) => (
            <button
              key={sev}
              type="button"
              onClick={() => setSeverityFilter(sev)}
              className={`px-2.5 py-1 rounded text-xs font-medium capitalize transition-colors whitespace-nowrap ${
                severityFilter === sev
                  ? 'bg-[#3B82F6] text-white'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              {sev}
            </button>
          ))}
        </div>
      </div>

      <div className="bg-[#172338] border border-[#22324D] rounded-lg p-5">
        <EmptyState
          icon={Bell}
          title="No alerts recorded"
          description={
            severityFilter === 'all'
              ? 'No threshold breaches or rule alerts have been triggered yet.'
              : `No ${severityFilter} severity alerts exist in the current log.`
          }
        />
      </div>
    </div>
  );
}
