import { useState } from 'react';
import { Cpu, Plus, Search } from 'lucide-react';
import { EmptyState } from '../components/common/EmptyState';
import { Modal } from '../components/common/Modal';
import { StatusIndicator } from '../components/common/StatusIndicator';
import { useToast } from '../hooks/useToast';

export function DevicesPage() {
  const { showToast } = useToast();
  const [searchTerm, setSearchTerm] = useState('');
  const [protocolFilter, setProtocolFilter] = useState<string>('all');
  const [infoModalOpen, setInfoModalOpen] = useState(false);

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold text-slate-100 tracking-tight">Devices</h1>
          <p className="text-xs text-slate-400 mt-1">
            Industrial sensor fleet registry, protocol bindings, and heartbeat monitoring
          </p>
        </div>

        <button
          type="button"
          onClick={() => setInfoModalOpen(true)}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-md bg-[#3B82F6] hover:bg-[#2563EB] text-xs font-medium text-white transition-colors whitespace-nowrap self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" aria-hidden="true" />
          <span>Register Device</span>
        </button>
      </div>

      <div className="bg-[#172338] border border-[#22324D] rounded-lg p-5 space-y-5">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
          <div className="relative flex-1 max-w-sm">
            <Search
              className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none"
              aria-hidden="true"
            />
            <input
              type="search"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Filter devices by name or ID..."
              aria-label="Filter devices"
              className="w-full h-9 pl-9 pr-3 rounded-md bg-[#0B1220] border border-[#22324D] text-xs text-slate-100 placeholder:text-slate-500 focus:outline-none focus:border-[#3B82F6]"
            />
          </div>

          <div className="flex items-center gap-1 p-1 rounded-md bg-[#111C2E] border border-[#22324D] overflow-x-auto">
            {['all', 'mqtt', 'http', 'modbus', 'opcua'].map((proto) => (
              <button
                key={proto}
                type="button"
                onClick={() => setProtocolFilter(proto)}
                className={`px-2.5 py-1 rounded text-xs font-medium uppercase transition-colors whitespace-nowrap ${
                  protocolFilter === proto
                    ? 'bg-[#3B82F6] text-white'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                {proto}
              </button>
            ))}
          </div>
        </div>

        <EmptyState
          icon={Cpu}
          title="No registered IoT devices"
          description="The Device Mongoose schema and backend contract are established. Device CRUD endpoints and live heartbeat ingestion will be wired in the next phase."
          action={
            <button
              type="button"
              onClick={() => {
                showToast({
                  variant: 'info',
                  title: 'Device provisioning scheduled',
                  description:
                    'Device registration CRUD requires MongoDB configuration and Phase 2 ingestion routes.',
                });
                setInfoModalOpen(true);
              }}
              className="px-3.5 py-2 rounded-md bg-[#111C2E] border border-[#22324D] hover:border-[#3B82F6] text-xs font-medium text-slate-200 transition-colors"
            >
              Inspect Device Schema Readiness
            </button>
          }
        />
      </div>

      <Modal
        open={infoModalOpen}
        onClose={() => setInfoModalOpen(false)}
        title="Device Registration Scope (Phase 1)"
        description="Current architecture status for industrial endpoint onboarding."
        footer={
          <button
            type="button"
            onClick={() => setInfoModalOpen(false)}
            className="px-4 py-2 rounded-md bg-[#3B82F6] hover:bg-[#2563EB] text-xs font-medium text-white transition-colors"
          >
            Close
          </button>
        }
      >
        <div className="space-y-3 text-xs text-slate-300 leading-relaxed">
          <div className="flex items-center justify-between py-2 border-b border-[#22324D]">
            <span>Mongoose Device Model</span>
            <StatusIndicator label="Defined" tone="success" />
          </div>
          <div className="flex items-center justify-between py-2 border-b border-[#22324D]">
            <span>Frontend TypeScript Types</span>
            <StatusIndicator label="Defined" tone="success" />
          </div>
          <div className="flex items-center justify-between py-2">
            <span>Device CRUD &amp; Ingestion Endpoints</span>
            <StatusIndicator label="Pending Phase 2" tone="info" />
          </div>
        </div>
      </Modal>
    </div>
  );
}
