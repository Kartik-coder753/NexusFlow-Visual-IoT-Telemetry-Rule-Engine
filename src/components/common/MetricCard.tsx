import type { LucideIcon } from 'lucide-react';
import { cn } from '../../utils/cn';

export type MetricTone = 'neutral' | 'accent' | 'success' | 'warning' | 'critical';

export interface MetricCardProps {
  label: string;
  value: string | number;
  sublabel?: string;
  icon?: LucideIcon;
  tone?: MetricTone;
  loading?: boolean;
  className?: string;
}

const TONE_ICON_STYLES: Record<MetricTone, string> = {
  neutral: 'text-slate-400',
  accent: 'text-[#3B82F6]',
  success: 'text-[#22C55E]',
  warning: 'text-[#F59E0B]',
  critical: 'text-[#EF4444]',
};

export function MetricCard({
  label,
  value,
  sublabel,
  icon: Icon,
  tone = 'neutral',
  loading = false,
  className,
}: MetricCardProps) {
  return (
    <div
      className={cn(
        'bg-[#172338] border border-[#22324D] rounded-lg p-4 flex flex-col justify-between gap-3 transition-colors duration-150 hover:border-[#334A70]',
        className
      )}
    >
      <div className="flex items-center justify-between gap-2">
        <span className="text-xs font-medium text-slate-400 truncate">{label}</span>
        {Icon && <Icon className={cn('w-4 h-4 shrink-0', TONE_ICON_STYLES[tone])} aria-hidden="true" />}
      </div>

      {loading ? (
        <div className="h-7 w-20 bg-[#22324D]/70 rounded animate-pulse" />
      ) : (
        <div className="font-mono text-2xl font-semibold text-slate-100 tabular-nums tracking-tight">
          {value}
        </div>
      )}

      {sublabel && (
        <p className="text-xs text-slate-400 truncate">{sublabel}</p>
      )}
    </div>
  );
}
