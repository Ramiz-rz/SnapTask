import React from 'react';
import { SnapTaskLogo } from './SnapTaskLogo';
import { TabType, Task } from '../types';
import { GlobalSearchBar } from './GlobalSearchBar';
import { Scan, Sparkles, Sun, Moon } from 'lucide-react';

interface TopAppBarProps {
  activeTab: TabType;
  setActiveTab: (tab: TabType) => void;
  onQuickUpload: () => void;
  tasks: Task[];
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  onOpenTaskDetails: (task: Task) => void;
  theme?: 'light' | 'dark';
  onToggleTheme?: () => void;
}

export const TopAppBar: React.FC<TopAppBarProps> = ({
  activeTab,
  setActiveTab,
  onQuickUpload,
  tasks,
  searchQuery,
  setSearchQuery,
  onOpenTaskDetails,
  theme = 'light',
  onToggleTheme,
}) => {
  return (
    <header className="bg-white dark:bg-[#131B2E] sticky top-0 z-40 shadow-xs border-b border-slate-200/80 dark:border-slate-800 transition-colors duration-150">
      <div className="flex justify-between items-center w-full px-4 md:px-6 py-2 max-w-7xl mx-auto gap-2 sm:gap-4">
        {/* Brand & Leading Icon */}
        <div className="flex items-center gap-2 shrink-0">
          <button
            onClick={() => setActiveTab('dashboard')}
            className="flex items-center gap-1.5 text-left focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 rounded-lg"
          >
            <SnapTaskLogo size="md" />
          </button>
          <span className="hidden sm:inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-[11px] font-mono font-semibold bg-indigo-50 dark:bg-indigo-950/60 text-indigo-700 dark:text-indigo-300 border border-indigo-100 dark:border-indigo-900/60">
            <span className="w-1.5 h-1.5 rounded-full bg-[#4F46E5] animate-pulse"></span>
            PRO AI
          </span>
        </div>

        {/* Global Search Bar (Center) */}
        <div className="flex-1 max-w-xs sm:max-w-sm md:max-w-md mx-1 sm:mx-2">
          <GlobalSearchBar
            tasks={tasks}
            searchQuery={searchQuery}
            setSearchQuery={setSearchQuery}
            onOpenTaskDetails={onOpenTaskDetails}
            onNavigateToTasks={() => setActiveTab('tasks')}
          />
        </div>

        {/* Desktop Navigation Links */}
        <nav className="hidden md:flex items-center gap-1 bg-slate-50/80 dark:bg-slate-800/70 p-1 rounded-xl border border-slate-200/60 dark:border-slate-700/60 shrink-0">
          <button
            onClick={() => setActiveTab('dashboard')}
            className={`px-2.5 py-1.5 rounded-lg text-xs font-semibold transition-all ${
              activeTab === 'dashboard'
                ? 'bg-white dark:bg-slate-900 text-[#4F46E5] dark:text-indigo-400 shadow-xs'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100/70 dark:hover:bg-slate-700/50'
            }`}
          >
            Dashboard
          </button>
          <button
            onClick={() => setActiveTab('extract')}
            className={`px-2.5 py-1.5 rounded-lg text-xs font-semibold transition-all flex items-center gap-1 ${
              activeTab === 'extract'
                ? 'bg-white dark:bg-slate-900 text-[#4F46E5] dark:text-indigo-400 shadow-xs'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100/70 dark:hover:bg-slate-700/50'
            }`}
          >
            <Sparkles className="w-3.5 h-3.5 text-indigo-500" />
            Extract
          </button>
          <button
            onClick={() => setActiveTab('tasks')}
            className={`px-2.5 py-1.5 rounded-lg text-xs font-semibold transition-all ${
              activeTab === 'tasks'
                ? 'bg-white dark:bg-slate-900 text-[#4F46E5] dark:text-indigo-400 shadow-xs'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100/70 dark:hover:bg-slate-700/50'
            }`}
          >
            Tasks
          </button>
          <button
            onClick={() => setActiveTab('settings')}
            className={`px-2.5 py-1.5 rounded-lg text-xs font-semibold transition-all ${
              activeTab === 'settings'
                ? 'bg-white dark:bg-slate-900 text-[#4F46E5] dark:text-indigo-400 shadow-xs'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100/70 dark:hover:bg-slate-700/50'
            }`}
          >
            Settings
          </button>
        </nav>

        {/* Trailing Action: Upload & Profile status */}
        <div className="flex items-center gap-2 sm:gap-3 shrink-0">
          <div className="hidden xl:flex items-center gap-1.5 bg-slate-100/80 dark:bg-slate-800/80 px-2.5 py-1 rounded-full text-slate-600 dark:text-slate-400 font-mono text-[11px] border border-slate-200 dark:border-slate-700">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
            SQLite Synced
          </div>

          {/* Quick theme toggle button */}
          {onToggleTheme && (
            <button
              id="topBarThemeToggleBtn"
              type="button"
              onClick={onToggleTheme}
              className="p-2 rounded-lg text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
              title={theme === 'dark' ? 'Switch to Light mode' : 'Switch to Dark mode'}
              aria-label={theme === 'dark' ? 'Switch to Light mode' : 'Switch to Dark mode'}
            >
              {theme === 'dark' ? (
                <Sun className="w-4 h-4 text-amber-400" />
              ) : (
                <Moon className="w-4 h-4 text-slate-600" />
              )}
            </button>
          )}

          <button
            id="quickUploadTopBtn"
            onClick={onQuickUpload}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#4F46E5] text-white text-xs font-semibold hover:bg-[#4338CA] transition-all duration-150 active:scale-95 shadow-xs"
          >
            <Scan className="w-4 h-4" />
            <span className="hidden sm:inline">Upload</span>
          </button>

          <div className="relative flex items-center pl-0.5">
            <div className="w-8 h-8 rounded-full ring-2 ring-indigo-100 dark:ring-indigo-900/60 bg-indigo-50 dark:bg-indigo-950/60 flex items-center justify-center text-[#4F46E5] dark:text-indigo-400 font-bold text-xs select-none">
              JS
            </div>
            <span className="absolute bottom-0 right-0 w-2.5 h-2.5 rounded-full bg-emerald-500 ring-2 ring-white dark:ring-[#131B2E]"></span>
          </div>
        </div>
      </div>
    </header>
  );
};
