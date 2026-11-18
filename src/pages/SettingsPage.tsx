import { useCallback, useEffect, useState } from 'react';
import { Database, LogOut, RefreshCw, ShieldCheck } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { ErrorMessage } from '../components/common/ErrorMessage';
import { StatusIndicator } from '../components/common/StatusIndicator';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../hooks/useToast';
import { fetchSystemHealth } from '../services/healthService';
import type { HealthResponse } from '../types/common.types';
import { formatTimestamp, formatUptime } from '../utils/formatters';

export function SettingsPage() {
  const { user, logout, refreshAuthStatus } = useAuth();
  const { showToast } = useToast();
  const navigate = useNavigate();

  const [health, setHealth] = useState<HealthResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadHealth = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetchSystemHealth();
      setHealth(response);
      await refreshAuthStatus();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unable to fetch /api/health.');
    } finally {
      setLoading(false);
    }
  }, [refreshAuthStatus]);

  useEffect(() => {
    void loadHealth();
  }, [loadHealth]);

  const handleLogout = async () => {
    await logout();
    showToast({
      variant: 'info',
      title: 'Signed out',
      description: 'Authentication token cleared from session storage.',
    });
    navigate('/login', { replace: true });
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold text-slate-100 tracking-tight">Settings</h1>
          <p className="text-xs text-slate-400 mt-1">
            Operator account profile, session persistence mode, and backend infrastructure status
          </p>
        </div>

        <button
          type="button"
          onClick={() => void loadHealth()}
          disabled={loading}
          className="inline-flex items-center gap-2 px-3.5 py-2 rounded-md bg-[#172338] border border-[#22324D] hover:border-[#3B82F6] text-xs font-medium text-slate-200 transition-colors self-start sm:self-auto"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} aria-hidden="true" />
          <span>Verify Backend Health</span>
        </button>
      </div>

      {error && (
        <ErrorMessage
          title="Health Check Failed"
          message={error}
          onRetry={() => void loadHealth()}
        />
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Account Profile Card */}
        <section className="bg-[#172338] border border-[#22324D] rounded-lg p-5 space-y-4">
          <div className="flex items-center gap-2.5">
            <ShieldCheck className="w-4 h-4 text-[#3B82F6]" aria-hidden="true" />
            <h2 className="text-base font-semibold text-slate-100">Account &amp; Session</h2>
          </div>

          <dl className="divide-y divide-[#22324D] text-xs">
            <div className="py-2.5 flex items-center justify-between gap-4">
              <dt className="text-slate-400">Operator Name</dt>
              <dd className="text-slate-100 font-medium">{user?.name || '—'}</dd>
            </div>
            <div className="py-2.5 flex items-center justify-between gap-4">
              <dt className="text-slate-400">Email</dt>
              <dd className="text-slate-100 font-mono">{user?.email || '—'}</dd>
            </div>
            <div className="py-2.5 flex items-center justify-between gap-4">
              <dt className="text-slate-400">Role</dt>
              <dd className="text-slate-200 capitalize">{user?.role || '—'}</dd>
            </div>
            <div className="py-2.5 flex items-center justify-between gap-4">
              <dt className="text-slate-400">Organization</dt>
              <dd className="text-slate-200">{user?.organization || '—'}</dd>
            </div>
            <div className="py-2.5 flex items-center justify-between gap-4">
              <dt className="text-slate-400">Auth Persistence</dt>
              <dd>
                <StatusIndicator
                  label={
                    user?.persistenceMode === 'mongodb'
                      ? 'MongoDB Persistent'
                      : 'Non-Persistent Preview'
                  }
                  tone={user?.persistenceMode === 'mongodb' ? 'success' : 'warning'}
                />
              </dd>
            </div>
          </dl>

          <div className="pt-2">
            <button
              type="button"
              onClick={handleLogout}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-md bg-[#111C2E] border border-[#EF4444]/40 text-xs font-medium text-[#EF4444] hover:bg-[#EF4444]/10 transition-colors"
            >
              <LogOut className="w-3.5 h-3.5" aria-hidden="true" />
              <span>Sign Out</span>
            </button>
          </div>
        </section>

        {/* Backend & MongoDB Readiness Card */}
        <section className="bg-[#172338] border border-[#22324D] rounded-lg p-5 space-y-4">
          <div className="flex items-center gap-2.5">
            <Database className="w-4 h-4 text-[#3B82F6]" aria-hidden="true" />
            <h2 className="text-base font-semibold text-slate-100">
              Backend &amp; Database Diagnostics
            </h2>
          </div>

          <dl className="divide-y divide-[#22324D] text-xs">
            <div className="py-2.5 flex items-center justify-between gap-4">
              <dt className="text-slate-400">API Health Endpoint</dt>
              <dd>
                <StatusIndicator
                  label={health?.status === 'ok' ? 'GET /api/health OK' : 'Unavailable'}
                  tone={health?.status === 'ok' ? 'success' : 'critical'}
                />
              </dd>
            </div>
            <div className="py-2.5 flex items-center justify-between gap-4">
              <dt className="text-slate-400">Server Uptime</dt>
              <dd className="font-mono text-slate-100 tabular-nums">
                {health ? formatUptime(health.uptimeSeconds) : '—'}
              </dd>
            </div>
            <div className="py-2.5 flex items-center justify-between gap-4">
              <dt className="text-slate-400">MongoDB Connection</dt>
              <dd>
                <StatusIndicator
                  label={
                    health?.database.status === 'connected'
                      ? 'Connected'
                      : health?.database.status === 'unconfigured'
                        ? 'Unconfigured'
                        : 'Disconnected'
                  }
                  tone={
                    health?.database.status === 'connected'
                      ? 'success'
                      : health?.database.status === 'unconfigured'
                        ? 'warning'
                        : 'critical'
                  }
                />
              </dd>
            </div>
            <div className="py-2.5 flex items-center justify-between gap-4">
              <dt className="text-slate-400">Password Hashing</dt>
              <dd className="font-mono text-slate-200">
                {health?.authentication.passwordHashing || 'bcryptjs'}
              </dd>
            </div>
            <div className="py-2.5 flex items-center justify-between gap-4">
              <dt className="text-slate-400">Token Mechanism</dt>
              <dd className="font-mono text-slate-200 uppercase">
                {health?.authentication.tokenMechanism || 'JWT'}
              </dd>
            </div>
            <div className="py-2.5 flex items-center justify-between gap-4">
              <dt className="text-slate-400">Last Checked</dt>
              <dd className="font-mono text-slate-400">
                {formatTimestamp(health?.timestamp)}
              </dd>
            </div>
          </dl>

          {health && health.authentication.pendingDependencies.length > 0 && (
            <div className="rounded-md bg-[#111C2E] border border-[#F59E0B]/40 p-3 text-xs text-slate-300 space-y-1">
              <p className="font-semibold text-[#F59E0B]">Pending Configuration</p>
              {health.authentication.pendingDependencies.map((dep, idx) => (
                <p key={idx} className="text-slate-400 leading-relaxed">
                  {dep}
                </p>
              ))}
            </div>
          )}
        </section>
      </div>
    </div>
  );
}
