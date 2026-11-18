import {
  Activity,
  Bell,
  Cpu,
  GitBranch,
  History,
  LayoutDashboard,
  Settings,
  X,
  type LucideIcon,
} from 'lucide-react';
import { NavLink } from 'react-router-dom';
import { NexusFlowLogo } from '../components/brand/NexusFlowLogo';
import { cn } from '../utils/cn';

export interface NavItem {
  to: string;
  label: string;
  icon: LucideIcon;
  end?: boolean;
}

export const SIDEBAR_NAV_ITEMS: NavItem[] = [
  { to: '/', label: 'Overview', icon: LayoutDashboard, end: true },
  { to: '/devices', label: 'Devices', icon: Cpu },
  { to: '/workflows', label: 'Workflow Builder', icon: GitBranch },
  { to: '/monitoring', label: 'Live Monitoring', icon: Activity },
  { to: '/alerts', label: 'Alerts & Notifications', icon: Bell },
  { to: '/history', label: 'Workflow History', icon: History },
  { to: '/settings', label: 'Settings', icon: Settings },
];

export interface SidebarProps {
  collapsed: boolean;
  mobileOpen: boolean;
  onCloseMobile: () => void;
}

export function Sidebar({
  collapsed,
  mobileOpen,
  onCloseMobile,
}: SidebarProps) {
  const renderNavLinks = (isCollapsed: boolean) => (
    <nav className="flex-1 px-2.5 py-4 space-y-1 overflow-y-auto" aria-label="Primary navigation">
      {SIDEBAR_NAV_ITEMS.map((item) => {
        const Icon = item.icon;
        return (
          <NavLink
            key={item.to}
            to={item.to}
            end={item.end}
            onClick={onCloseMobile}
            title={isCollapsed ? item.label : undefined}
            className={({ isActive }) =>
              cn(
                'flex items-center gap-3 px-3 py-2.5 rounded-md text-sm font-medium transition-colors duration-150 whitespace-nowrap',
                isCollapsed ? 'justify-center px-2' : 'justify-start',
                isActive
                  ? 'bg-[#3B82F6]/15 text-[#3B82F6] border border-[#3B82F6]/30'
                  : 'text-slate-300 hover:text-slate-100 hover:bg-[#172338] border border-transparent'
              )
            }
          >
            <Icon className="w-4 h-4 shrink-0" aria-hidden="true" />
            {!isCollapsed && <span className="truncate">{item.label}</span>}
          </NavLink>
        );
      })}
    </nav>
  );

  return (
    <>
      {/* Desktop & Laptop Collapsible Sidebar */}
      <aside
        className={cn(
          'hidden lg:flex flex-col shrink-0 bg-[#111C2E] border-r border-[#22324D] transition-[width] duration-200',
          collapsed ? 'w-[68px]' : 'w-[252px]'
        )}
      >
        <div
          className={cn(
            'h-16 flex items-center border-b border-[#22324D] px-4 shrink-0',
            collapsed ? 'justify-center px-2' : 'justify-between'
          )}
        >
          <NexusFlowLogo compact={collapsed} showTagline={!collapsed} />
        </div>

        {renderNavLinks(collapsed)}
      </aside>

      {/* Mobile & Tablet Slide-over Drawer */}
      {mobileOpen && (
        <div className="fixed inset-0 z-50 lg:hidden flex">
          <div
            className="fixed inset-0 bg-[#0B1220]/75 backdrop-blur-xs"
            onClick={onCloseMobile}
            aria-hidden="true"
          />
          <aside className="relative w-[264px] max-w-[85vw] bg-[#111C2E] border-r border-[#22324D] flex flex-col h-full z-10">
            <div className="h-16 flex items-center justify-between px-4 border-b border-[#22324D]">
              <NexusFlowLogo showTagline />
              <button
                type="button"
                onClick={onCloseMobile}
                aria-label="Close navigation menu"
                className="p-2 rounded-md text-slate-400 hover:text-slate-100 hover:bg-[#172338]"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
            {renderNavLinks(false)}
          </aside>
        </div>
      )}
    </>
  );
}
