import { AlertCircle, AlertTriangle, CheckCircle2, Info, MinusCircle } from 'lucide-react';
import { cn } from '../../utils/cn';

export type IndicatorTone = 'success' | 'warning' | 'critical' | 'info' | 'neutral';

export interface StatusIndicatorProps {
  label: string;
  tone?: IndicatorTone;
  className?: string;
}

const TONE_MAP: Record<IndicatorTone, { text: string; Icon: typeof CheckCircle2 }> = {
  success: { text: 'text-[#22C55E]', Icon: CheckCircle2 },
  warning: { text: 'text-[#F59E0B]', Icon: AlertTriangle },
  critical: { text: 'text-[#EF4444]', Icon: AlertCircle },
  info: { text: 'text-[#3B82F6]', Icon: Info },
  neutral: { text: 'text-slate-400', Icon: MinusCircle },
};

export function StatusIndicator({
  label,
  tone = 'neutral',
  className,
}: StatusIndicatorProps) {
  const { text, Icon } = TONE_MAP[tone];

  return (
    <span className={cn('inline-flex items-center gap-1.5 text-xs font-medium whitespace-nowrap', text, className)}>
      <Icon className="w-3.5 h-3.5 shrink-0" aria-hidden="true" />
      <span>{label}</span>
    </span>
  );
}
