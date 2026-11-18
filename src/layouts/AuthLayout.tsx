import type { ReactNode } from 'react';
import { NexusFlowLogo } from '../components/brand/NexusFlowLogo';

export interface AuthLayoutProps {
  title: string;
  subtitle: string;
  children: ReactNode;
}

export function AuthLayout({ title, subtitle, children }: AuthLayoutProps) {
  return (
    <div className="min-h-screen bg-[#0B1220] text-[#F1F5F9] flex flex-col justify-center py-10 px-4 sm:px-6">
      <div className="w-full max-w-md mx-auto space-y-6">
        <div className="flex flex-col items-center text-center space-y-2">
          <NexusFlowLogo showTagline />
        </div>

        <div className="bg-[#172338] border border-[#22324D] rounded-lg p-6 sm:p-7 space-y-5">
          <div>
            <h1 className="text-xl font-semibold text-slate-100">{title}</h1>
            <p className="text-xs text-slate-400 mt-1 leading-relaxed">{subtitle}</p>
          </div>
          {children}
        </div>
      </div>
    </div>
  );
}
