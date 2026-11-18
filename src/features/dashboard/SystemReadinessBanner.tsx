import { Database, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import type { DatabaseStatus } from '../../types/common.types';
import type { PersistenceMode } from '../../types/auth.types';

export interface SystemReadinessBannerProps {
  database: DatabaseStatus;
  persistenceMode?: PersistenceMode;
}

export function SystemReadinessBanner({
  database,
  persistenceMode,
}: SystemReadinessBannerProps) {
  if (database.status === 'connected' && persistenceMode === 'mongodb') {
    return null;
  }

  return (
    <div className="bg-[#172338] border border-[#F59E0B]/40 rounded-lg p-4 flex flex-col md:flex-row md:items-center justify-between gap-4">
      <div className="flex items-start gap-3">
        <Database className="w-5 h-5 text-[#F59E0B] shrink-0 mt-0.5" aria-hidden="true" />
        <div className="space-y-1">
          <p className="text-sm font-medium text-slate-100">
            MongoDB connection is not configured
          </p>
          <p className="text-xs text-slate-300 leading-relaxed">
            Set <code className="font-mono text-slate-100">MONGODB_URI</code> in your environment to enable persistent user accounts, device registries, telemetry storage, workflows, and alert logs. Current session is running in non-persistent preview mode.
          </p>
        </div>
      </div>

      <Link
        to="/settings"
        className="inline-flex items-center gap-1.5 px-3 py-2 rounded-md bg-[#111C2E] border border-[#22324D] text-xs font-medium text-slate-200 hover:border-[#3B82F6] transition-colors whitespace-nowrap shrink-0 self-start md:self-center"
      >
        <span>View Database Status</span>
        <ArrowRight className="w-3.5 h-3.5" aria-hidden="true" />
      </Link>
    </div>
  );
}
