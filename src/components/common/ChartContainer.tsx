import type { ReactNode } from 'react';
import { cn } from '../../utils/cn';

export interface ChartContainerProps {
  title: string;
  subtitle?: string;
  unit?: string;
  latestValue?: string | number | null;
  headerRight?: ReactNode;
  children: ReactNode;
  className?: string;
}

export function ChartContainer({
  title,
  subtitle,
  unit,
  latestValue,
  headerRight,
  children,
  className,
}: ChartContainerProps) {
  return (
    <section
      className={cn(
        'bg-[#172338] border border-[#22324D] rounded-lg p-5 flex flex-col gap-4',
        className
      )}
    >
      <div className="flex items-start justify-between gap-4">
        <div className="min-w-0">
          <div className="flex items-baseline gap-2">
            <h3 className="text-sm font-semibold text-slate-100 truncate">{title}</h3>
            {unit && (
              <span className="text-xs font-mono text-slate-400 shrink-0">{unit}</span>
            )}
          </div>
          {subtitle && (
            <p className="text-xs text-slate-400 mt-0.5 truncate">{subtitle}</p>
          )}
        </div>

        <div className="flex items-center gap-3 shrink-0">
          {latestValue !== undefined && latestValue !== null && (
            <span className="font-mono text-base font-semibold text-slate-100 tabular-nums">
              {latestValue}
            </span>
          )}
          {headerRight}
        </div>
      </div>

      <div className="w-full min-h-[180px] flex flex-col justify-center">
        {children}
      </div>
    </section>
  );
}
