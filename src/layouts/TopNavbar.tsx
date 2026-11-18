import { useEffect, useMemo, useRef, useState } from 'react';
import {
  Bell,
  LogOut,
  Menu,
  PanelLeftClose,
  PanelLeftOpen,
  Search,
  Settings,
  User as UserIcon,
} from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { NexusFlowLogo } from '../components/brand/NexusFlowLogo';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../hooks/useToast';
import { SIDEBAR_NAV_ITEMS } from './Sidebar';

export interface TopNavbarProps {
  sidebarCollapsed: boolean;
  onToggleDesktopSidebar: () => void;
  onOpenMobileSidebar: () => void;
}

export function TopNavbar({
  sidebarCollapsed,
  onToggleDesktopSidebar,
  onOpenMobileSidebar,
}: TopNavbarProps) {
  const { user, logout } = useAuth();
  const { showToast } = useToast();
  const navigate = useNavigate();

  const [searchQuery, setSearchQuery] = useState('');
  const [searchFocused, setSearchFocused] = useState(false);
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const [profileMenuOpen, setProfileMenuOpen] = useState(false);

  const searchRef = useRef<HTMLDivElement>(null);
  const notifRef = useRef<HTMLDivElement>(null);
  const profileRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as Node;
      if (searchRef.current && !searchRef.current.contains(target)) {
        setSearchFocused(false);
      }
      if (notifRef.current && !notifRef.current.contains(target)) {
        setNotificationsOpen(false);
      }
      if (profileRef.current && !profileRef.current.contains(target)) {
        setProfileMenuOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const filteredRoutes = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    if (!q) return SIDEBAR_NAV_ITEMS;
    return SIDEBAR_NAV_ITEMS.filter((item) => item.label.toLowerCase().includes(q));
  }, [searchQuery]);

  const handleLogout = async () => {
    setProfileMenuOpen(false);
    await logout();
    showToast({
      variant: 'info',
      title: 'Signed out',
      description: 'Your NexusFlow session has been closed.',
    });
    navigate('/login', { replace: true });
  };

  return (
    <header className="h-16 shrink-0 bg-[#111C2E] border-b border-[#22324D] px-4 lg:px-6 flex items-center justify-between gap-4">
      {/* Left: Sidebar Collapse Controls + Mobile Logo */}
      <div className="flex items-center gap-3 shrink-0">
        <button
          type="button"
          onClick={onOpenMobileSidebar}
          aria-label="Open navigation menu"
          className="lg:hidden p-2 rounded-md text-slate-300 hover:text-white hover:bg-[#172338] transition-colors"
        >
          <Menu className="w-5 h-5" />
        </button>

        <button
          type="button"
          onClick={onToggleDesktopSidebar}
          aria-label={sidebarCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
          title={sidebarCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
          className="hidden lg:inline-flex p-2 rounded-md text-slate-400 hover:text-slate-100 hover:bg-[#172338] transition-colors"
        >
          {sidebarCollapsed ? (
            <PanelLeftOpen className="w-4 h-4" />
          ) : (
            <PanelLeftClose className="w-4 h-4" />
          )}
        </button>

        <Link to="/" className="lg:hidden">
          <NexusFlowLogo />
        </Link>
      </div>

      {/* Center: Global Search */}
      <div ref={searchRef} className="relative flex-1 max-w-md hidden sm:block">
        <div className="relative">
          <Search
            className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none"
            aria-hidden="true"
          />
          <input
            type="search"
            value={searchQuery}
            onFocus={() => setSearchFocused(true)}
            onChange={(e) => {
              setSearchQuery(e.target.value);
              setSearchFocused(true);
            }}
            onKeyDown={(e) => {
              if (e.key === 'Enter' && filteredRoutes.length > 0) {
                navigate(filteredRoutes[0].to);
                setSearchFocused(false);
                setSearchQuery('');
              }
            }}
            placeholder="Search workspace pages..."
            aria-label="Search workspace"
            className="w-full h-9 pl-9 pr-3 rounded-md bg-[#0B1220] border border-[#22324D] text-xs text-slate-100 placeholder:text-slate-500 focus:outline-none focus:border-[#3B82F6]"
          />
        </div>

        {searchFocused && (
          <div className="absolute left-0 right-0 mt-1.5 bg-[#172338] border border-[#22324D] rounded-md shadow-xl py-1.5 z-40">
            {filteredRoutes.length === 0 ? (
              <div className="px-3 py-2 text-xs text-slate-400">
                No matching workspace views.
              </div>
            ) : (
              filteredRoutes.map((item) => {
                const Icon = item.icon;
                return (
                  <button
                    key={item.to}
                    type="button"
                    onClick={() => {
                      navigate(item.to);
                      setSearchFocused(false);
                      setSearchQuery('');
                    }}
                    className="w-full px-3 py-2 text-left text-xs text-slate-200 hover:bg-[#111C2E] flex items-center gap-2.5"
                  >
                    <Icon className="w-3.5 h-3.5 text-slate-400" aria-hidden="true" />
                    <span>{item.label}</span>
                  </button>
                );
              })
            )}
          </div>
        )}
      </div>

      {/* Right: Notifications, Account Settings, User Profile */}
      <div className="flex items-center gap-2 shrink-0">
        {/* Notifications Popover */}
        <div ref={notifRef} className="relative">
          <button
            type="button"
            onClick={() => {
              setNotificationsOpen((prev) => !prev);
              setProfileMenuOpen(false);
            }}
            aria-label="Notifications"
            className="p-2 rounded-md text-slate-300 hover:text-white hover:bg-[#172338] transition-colors"
          >
            <Bell className="w-4 h-4" />
          </button>

          {notificationsOpen && (
            <div className="absolute right-0 mt-2 w-72 bg-[#172338] border border-[#22324D] rounded-lg shadow-xl z-40 overflow-hidden">
              <div className="px-4 py-3 border-b border-[#22324D] flex items-center justify-between">
                <span className="text-xs font-semibold text-slate-100">Notifications</span>
                <Link
                  to="/alerts"
                  onClick={() => setNotificationsOpen(false)}
                  className="text-xs text-[#3B82F6] hover:underline"
                >
                  View all
                </Link>
              </div>
              <div className="px-4 py-6 text-center">
                <p className="text-xs text-slate-300 font-medium">No active alerts</p>
                <p className="text-xs text-slate-500 mt-1">
                  Alert dispatches will appear here once rules are active.
                </p>
              </div>
            </div>
          )}
        </div>

        {/* Account Settings Direct Link */}
        <Link
          to="/settings"
          aria-label="Account settings"
          title="Account settings"
          className="p-2 rounded-md text-slate-300 hover:text-white hover:bg-[#172338] transition-colors"
        >
          <Settings className="w-4 h-4" />
        </Link>

        {/* User Profile Dropdown */}
        <div ref={profileRef} className="relative">
          <button
            type="button"
            onClick={() => {
              setProfileMenuOpen((prev) => !prev);
              setNotificationsOpen(false);
            }}
            aria-label="User profile menu"
            className="flex items-center gap-2.5 pl-2 pr-2.5 py-1.5 rounded-md border border-[#22324D] bg-[#172338] hover:border-[#334A70] transition-colors"
          >
            <span className="w-6 h-6 rounded bg-[#3B82F6]/20 border border-[#3B82F6]/40 flex items-center justify-center text-xs font-semibold text-[#3B82F6]">
              {user?.name?.charAt(0).toUpperCase() || <UserIcon className="w-3.5 h-3.5" />}
            </span>
            <span className="hidden md:block text-left max-w-[140px]">
              <span className="block text-xs font-medium text-slate-100 truncate">
                {user?.name || 'Operator'}
              </span>
            </span>
          </button>

          {profileMenuOpen && (
            <div className="absolute right-0 mt-2 w-60 bg-[#172338] border border-[#22324D] rounded-lg shadow-xl z-40 overflow-hidden">
              <div className="px-4 py-3 border-b border-[#22324D]">
                <p className="text-xs font-semibold text-slate-100 truncate">
                  {user?.name}
                </p>
                <p className="text-xs text-slate-400 truncate mt-0.5">{user?.email}</p>
                <p className="text-[11px] font-mono text-slate-400 mt-1.5">
                  {user?.persistenceMode === 'mongodb'
                    ? 'Persistent MongoDB Session'
                    : 'Preview Session (Non-Persistent)'}
                </p>
              </div>
              <div className="py-1.5">
                <Link
                  to="/settings"
                  onClick={() => setProfileMenuOpen(false)}
                  className="flex items-center gap-2.5 px-4 py-2 text-xs text-slate-200 hover:bg-[#111C2E]"
                >
                  <Settings className="w-3.5 h-3.5 text-slate-400" aria-hidden="true" />
                  <span>Account Settings</span>
                </Link>
                <button
                  type="button"
                  onClick={handleLogout}
                  className="w-full flex items-center gap-2.5 px-4 py-2 text-xs text-[#EF4444] hover:bg-[#111C2E] text-left"
                >
                  <LogOut className="w-3.5 h-3.5" aria-hidden="true" />
                  <span>Sign Out</span>
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
