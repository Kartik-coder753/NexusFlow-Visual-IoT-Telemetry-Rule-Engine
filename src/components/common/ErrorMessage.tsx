import { AlertCircle, RefreshCw } from 'lucide-react';
import { cn } from '../../utils/cn';

export interface ErrorMessageProps {
  title?: string;
  message: string;
  onRetry?: () => void;
  className?: string;
}

export function ErrorMessage({
  title = 'Unable to complete request',
  message,
  onRetry,
  className,
}: ErrorMessageProps) {
  return (
    <div
      role="alert"
      className={cn(
        'bg-[#172338] border border-[#EF4444]/40 rounded-lg p-4 flex items-start justify-between gap-4',
        className
      )}
    >
      <div className="flex items-start gap-3">
        <AlertCircle className="w-5 h-5 text-[#EF4444] shrink-0 mt-0.5" aria-hidden="true" />
        <div className="space-y-1">
          <h4 className="text-sm font-semibold text-slate-100">{title}</h4>
          <p className="text-xs text-slate-300 leading-relaxed">{message}</p>
        </div>
      </div>

      {onRetry && (
        <button
          type="button"
          onClick={onRetry}
          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-md bg-[#111C2E] border border-[#22324D] text-xs font-medium text-slate-200 hover:bg-[#22324D] transition-colors whitespace-nowrap shrink-0"
        >
          <RefreshCw className="w-3.5 h-3.5" aria-hidden="true" />
          <span>Retry</span>
        </button>
      )}
    </div>
  );
}
