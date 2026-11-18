import type { LucideIcon } from 'lucide-react';
import type { ReactNode } from 'react';
import { cn } from '../../utils/cn';

export interface EmptyStateProps {
  icon: LucideIcon;
  title: string;
  description: string;
  action?: ReactNode;
  className?: string;
}

export function EmptyState({
  icon: Icon,
  title,
  description,
  action,
  className,
}: EmptyStateProps) {
  return (
    <div
      className={cn(
        'rounded-md border border-dashed border-[#22324D] bg-[#0B1220]/40 px-5 py-8 flex flex-col items-center justify-center text-center',
        className
      )}
    >
      <div className="w-9 h-9 rounded-md bg-[#111C2E] border border-[#22324D] flex items-center justify-center mb-3">
        <Icon className="w-4 h-4 text-slate-400" aria-hidden="true" />
      </div>
      <h4 className="text-sm font-medium text-slate-200">{title}</h4>
      <p className="text-xs text-slate-400 mt-1 max-w-md leading-relaxed">{description}</p>
      {action && <div className="mt-4">{action}</div>}
    </div>
  );
}
