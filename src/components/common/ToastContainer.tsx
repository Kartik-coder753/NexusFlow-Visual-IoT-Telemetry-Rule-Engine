import { AlertCircle, AlertTriangle, CheckCircle2, Info, X } from 'lucide-react';
import { useToast } from '../../hooks/useToast';
import type { ToastVariant } from '../../context/ToastContext';

const VARIANT_ICONS: Record<ToastVariant, { Icon: typeof Info; color: string }> = {
  info: { Icon: Info, color: 'text-[#3B82F6]' },
  success: { Icon: CheckCircle2, color: 'text-[#22C55E]' },
  warning: { Icon: AlertTriangle, color: 'text-[#F59E0B]' },
  error: { Icon: AlertCircle, color: 'text-[#EF4444]' },
};

export function ToastContainer() {
  const { toasts, dismissToast } = useToast();

  if (toasts.length === 0) return null;

  return (
    <div
      aria-live="polite"
      aria-label="Notifications"
      className="fixed bottom-4 right-4 z-50 flex flex-col gap-2 w-full max-w-sm pointer-events-none px-4 sm:px-0"
    >
      {toasts.map((toast) => {
        const { Icon, color } = VARIANT_ICONS[toast.variant];
        return (
          <div
            key={toast.id}
            className="pointer-events-auto bg-[#172338] border border-[#22324D] rounded-lg p-3.5 shadow-lg flex items-start gap-3"
          >
            <Icon className={`w-4 h-4 shrink-0 mt-0.5 ${color}`} aria-hidden="true" />
            <div className="flex-1 min-w-0">
              <p className="text-xs font-semibold text-slate-100">{toast.title}</p>
              {toast.description && (
                <p className="text-xs text-slate-400 mt-0.5 leading-relaxed">
                  {toast.description}
                </p>
              )}
            </div>
            <button
              type="button"
              onClick={() => dismissToast(toast.id)}
              aria-label="Dismiss notification"
              className="text-slate-400 hover:text-slate-200 p-0.5 rounded"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
        );
      })}
    </div>
  );
}
