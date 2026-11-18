import { cn } from '../../utils/cn';

export interface NexusFlowLogoProps {
  compact?: boolean;
  showTagline?: boolean;
  className?: string;
}

export function NexusFlowLogo({
  compact = false,
  showTagline = false,
  className,
}: NexusFlowLogoProps) {
  return (
    <div className={cn('inline-flex items-center gap-2.5 shrink-0', className)}>
      <svg
        width="28"
        height="28"
        viewBox="0 0 28 28"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="shrink-0"
        aria-hidden="true"
      >
        <rect width="28" height="28" rx="6" fill="#172338" stroke="#3B82F6" strokeWidth="1.25" />
        <path
          d="M7.5 19.5V8.5L14 14.5L20.5 8.5V19.5"
          stroke="#F1F5F9"
          strokeWidth="1.75"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <circle cx="7.5" cy="8.5" r="1.5" fill="#3B82F6" />
        <circle cx="20.5" cy="19.5" r="1.5" fill="#22C55E" />
      </svg>

      {!compact && (
        <div className="min-w-0">
          <span className="font-display text-base font-bold tracking-tight text-slate-100 whitespace-nowrap block leading-tight">
            NexusFlow
          </span>
          {showTagline && (
            <span className="text-[11px] text-slate-400 whitespace-nowrap block leading-tight">
              Visual IoT Telemetry &amp; Rule Engine
            </span>
          )}
        </div>
      )}
    </div>
  );
}
