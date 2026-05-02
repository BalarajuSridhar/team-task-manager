import { NavLink, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useTheme } from '../contexts/ThemeContext';
import {
  HiHome,
  HiFolder,
  HiClipboardList,
  HiSun,
  HiMoon,
  HiLogout,
  HiUser,
  HiChevronLeft,
  HiChevronRight,
} from 'react-icons/hi';
import { useState } from 'react';

const Sidebar = () => {
  const { user, logout } = useAuth();
  const { dark, toggle } = useTheme();
  const [collapsed, setCollapsed] = useState(false);
  const location = useLocation();

  if (!user) return null; // No sidebar for unauthenticated users

  const navItems = [
    { to: '/', icon: HiHome, label: 'Dashboard' },
    { to: '/projects', icon: HiFolder, label: 'Projects' },
  ];

  return (
    <>
      {/* Mobile overlay */}
      {!collapsed && (
        <div
          className="fixed inset-0 z-40 bg-black/50 lg:hidden"
          onClick={() => setCollapsed(true)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed top-0 left-0 z-50 h-full bg-white dark:bg-gray-900 border-r border-gray-200 dark:border-gray-800 transition-all duration-300 flex flex-col ${
          collapsed ? 'w-[72px]' : 'w-64'
        } ${collapsed ? '-translate-x-full lg:translate-x-0' : 'translate-x-0'}`}
      >
        {/* Logo */}
        <div className="h-16 flex items-center justify-between px-4 border-b border-gray-200 dark:border-gray-800">
          {!collapsed && (
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center flex-shrink-0">
                <span className="text-white font-bold text-sm">T</span>
              </div>
              <span className="text-lg font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
                TaskFlow
              </span>
            </div>
          )}
          <button
            onClick={() => setCollapsed(!collapsed)}
            className="p-1.5 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors hidden lg:block"
          >
            {collapsed ? <HiChevronRight className="text-xl" /> : <HiChevronLeft className="text-xl" />}
          </button>
        </div>

        {/* User info */}
        <div className={`px-4 py-4 border-b border-gray-200 dark:border-gray-800 ${collapsed ? 'text-center' : ''}`}>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-indigo-500 rounded-xl flex items-center justify-center flex-shrink-0">
              <HiUser className="text-white text-lg" />
            </div>
            {!collapsed && (
              <div className="min-w-0">
                <p className="text-sm font-medium text-gray-900 dark:text-white truncate">{user.name}</p>
                <p className="text-xs text-gray-500 dark:text-gray-400 capitalize">{user.role}</p>
              </div>
            )}
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = location.pathname === item.to || 
              (item.to === '/projects' && location.pathname.startsWith('/projects'));
            
            return (
              <NavLink
                key={item.to}
                to={item.to}
                onClick={() => {
                  if (window.innerWidth < 1024) setCollapsed(true);
                }}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all group ${
                  isActive
                    ? 'bg-indigo-50 dark:bg-indigo-900/20 text-indigo-600 dark:text-indigo-400 font-medium'
                    : 'text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-800 hover:text-gray-900 dark:hover:text-white'
                }`}
                title={collapsed ? item.label : ''}
              >
                <Icon className={`text-xl flex-shrink-0 ${isActive ? 'text-indigo-600 dark:text-indigo-400' : ''}`} />
                {!collapsed && <span className="text-sm">{item.label}</span>}
              </NavLink>
            );
          })}
        </nav>

        {/* Bottom actions */}
        <div className="px-3 py-4 border-t border-gray-200 dark:border-gray-800 space-y-1">
          {/* Dark mode toggle */}
          <button
            onClick={toggle}
            className="flex items-center gap-3 w-full px-3 py-2.5 rounded-xl text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
            title={collapsed ? (dark ? 'Light mode' : 'Dark mode') : ''}
          >
            {dark ? <HiSun className="text-xl text-yellow-500 flex-shrink-0" /> : <HiMoon className="text-xl flex-shrink-0" />}
            {!collapsed && <span className="text-sm">{dark ? 'Light Mode' : 'Dark Mode'}</span>}
          </button>

          {/* Logout */}
          <button
            onClick={logout}
            className="flex items-center gap-3 w-full px-3 py-2.5 rounded-xl text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors"
            title={collapsed ? 'Sign Out' : ''}
          >
            <HiLogout className="text-xl flex-shrink-0" />
            {!collapsed && <span className="text-sm">Sign Out</span>}
          </button>
        </div>
      </aside>

      {/* Mobile toggle button */}
      <button
        onClick={() => setCollapsed(false)}
        className="fixed bottom-4 left-4 z-30 p-3 bg-indigo-600 text-white rounded-full shadow-lg lg:hidden"
      >
        <HiChevronRight className="text-xl" />
      </button>
    </>
  );
};

export default Sidebar;