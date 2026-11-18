import { Link } from 'react-router-dom';

export function NotFoundPage() {
  return (
    <div className="min-h-[60vh] flex flex-col items-center justify-center text-center px-4">
      <p className="font-mono text-xs text-[#3B82F6] mb-2">404</p>
      <h1 className="text-2xl font-semibold text-slate-100">Workspace page not found</h1>
      <p className="text-xs text-slate-400 mt-2 max-w-sm">
        The requested NexusFlow route does not exist or has moved.
      </p>
      <Link
        to="/"
        className="mt-5 px-4 py-2 rounded-md bg-[#3B82F6] hover:bg-[#2563EB] text-xs font-medium text-white transition-colors"
      >
        Return to Overview
      </Link>
    </div>
  );
}
