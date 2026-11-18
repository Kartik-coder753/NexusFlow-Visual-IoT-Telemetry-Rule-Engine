import type { InputHTMLAttributes } from 'react';
import { cn } from '../../utils/cn';

export interface FormFieldProps extends InputHTMLAttributes<HTMLInputElement> {
  id: string;
  label: string;
  error?: string | null;
  helperText?: string;
}

export function FormField({
  id,
  label,
  error,
  helperText,
  className,
  ...inputProps
}: FormFieldProps) {
  return (
    <div className="space-y-1.5">
      <label htmlFor={id} className="block text-xs font-medium text-slate-300">
        {label}
      </label>
      <input
        id={id}
        aria-invalid={Boolean(error)}
        aria-describedby={error ? `${id}-error` : helperText ? `${id}-help` : undefined}
        className={cn(
          'w-full h-10 px-3 rounded-md bg-[#0B1220] border text-sm text-slate-100 placeholder:text-slate-500 transition-colors focus:outline-none focus:ring-2',
          error
            ? 'border-[#EF4444] focus:ring-[#EF4444]/30'
            : 'border-[#22324D] focus:border-[#3B82F6] focus:ring-[#3B82F6]/30',
          className
        )}
        {...inputProps}
      />
      {error ? (
        <p id={`${id}-error`} className="text-xs text-[#EF4444]">
          {error}
        </p>
      ) : helperText ? (
        <p id={`${id}-help`} className="text-xs text-slate-400">
          {helperText}
        </p>
      ) : null}
    </div>
  );
}
