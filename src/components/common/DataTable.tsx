import type { ReactNode } from 'react';
import { cn } from '../../utils/cn';

export interface TableColumn<T> {
  key: string;
  header: string;
  align?: 'left' | 'right';
  render: (row: T) => ReactNode;
  widthClass?: string;
}

export interface DataTableProps<T> {
  columns: TableColumn<T>[];
  rows: T[];
  rowKey: (row: T) => string;
  loading?: boolean;
  emptyState: ReactNode;
  onRowClick?: (row: T) => void;
}

export function DataTable<T>({
  columns,
  rows,
  rowKey,
  loading = false,
  emptyState,
  onRowClick,
}: DataTableProps<T>) {
  if (loading) {
    return (
      <div className="space-y-2">
        {[0, 1, 2].map((idx) => (
          <div
            key={idx}
            className="h-10 w-full rounded bg-[#111C2E]/80 border border-[#22324D]/60 animate-pulse"
          />
        ))}
      </div>
    );
  }

  if (rows.length === 0) {
    return <>{emptyState}</>;
  }

  return (
    <div className="w-full overflow-x-auto">
      <table className="w-full border-collapse text-left">
        <thead>
          <tr className="border-b border-[#22324D]">
            {columns.map((col) => (
              <th
                key={col.key}
                className={cn(
                  'py-2.5 px-3 text-xs font-medium text-slate-400 whitespace-nowrap',
                  col.align === 'right' ? 'text-right' : 'text-left',
                  col.widthClass
                )}
              >
                {col.header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-[#22324D]/70">
          {rows.map((row) => (
            <tr
              key={rowKey(row)}
              onClick={onRowClick ? () => onRowClick(row) : undefined}
              className={cn(
                'h-10 text-sm text-slate-200 transition-colors duration-150',
                onRowClick ? 'cursor-pointer hover:bg-[#111C2E]/80' : 'hover:bg-[#111C2E]/40'
              )}
            >
              {columns.map((col) => (
                <td
                  key={col.key}
                  className={cn(
                    'py-2 px-3 whitespace-nowrap',
                    col.align === 'right' ? 'text-right tabular-nums' : 'text-left'
                  )}
                >
                  {col.render(row)}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
