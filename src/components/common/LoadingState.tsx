import { Loader2 } from 'lucide-react';
import { cn } from '../../utils/cn';

export interface LoadingStateProps {
  message?: string;
  fullHeight?: boolean;
  className?: string;
}

export function LoadingState({
  message = 'Loading workspace data...',
  fullHeight = false,
  className,
}: LoadingStateProps) {
  return (
    <div
      className={cn(
        'flex flex-col items-center justify-center gap-3 text-slate-400',
        fullHeight ? 'min-h-[60vh]' : 'py-10',
        className
      )}
      role="status"
      aria-live="polite"
    >
      <Loader2 className="w-6 h-6 text-[#3B82F6] animate-spin" aria-hidden="true" />
      <span className="text-sm text-slate-300">{message}</span>
    </div>
  );
}
