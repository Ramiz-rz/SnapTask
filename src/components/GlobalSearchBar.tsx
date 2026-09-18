import React, { useState, useRef, useEffect, useMemo } from 'react';
import { Task, Priority } from '../types';
import { formatTimeDisplay } from './TimePicker';
import {
  Search,
  X,
  Clock,
  ArrowRight,
  CheckCircle2,
  Circle,
  Tag,
  FileText,
} from 'lucide-react';

interface GlobalSearchBarProps {
  tasks: Task[];
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  onOpenTaskDetails: (task: Task) => void;
  onNavigateToTasks: () => void;
  className?: string;
}

const PRIORITY_BADGE_STYLES: Record<Priority, string> = {
  High: 'bg-rose-50 text-rose-700 border-rose-200',
  Medium: 'bg-amber-50 text-amber-700 border-amber-200',
  Low: 'bg-indigo-50 text-indigo-700 border-indigo-200',
};

export const GlobalSearchBar: React.FC<GlobalSearchBarProps> = ({
  tasks,
  searchQuery,
  setSearchQuery,
  onOpenTaskDetails,
  onNavigateToTasks,
  className = '',
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Filter tasks by title, description, or category
  const matchingTasks = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    if (!q) return [];

    return tasks.filter((task) => {
      const titleMatch = task.title?.toLowerCase().includes(q);
      const descMatch = task.description?.toLowerCase().includes(q);
      const catMatch = task.category?.toLowerCase().includes(q);
      return titleMatch || descMatch || catMatch;
    });
  }, [tasks, searchQuery]);

  // Global keyboard shortcut: Cmd+K or Ctrl+K or / to focus search
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        inputRef.current?.focus();
        setIsOpen(true);
      } else if (e.key === 'Escape') {
        setIsOpen(false);
        inputRef.current?.blur();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  // Click outside to close dropdown
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleClear = () => {
    setSearchQuery('');
    setIsOpen(false);
    inputRef.current?.focus();
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      setIsOpen(false);
      onNavigateToTasks();
    }
  };

  const handleSelectTask = (task: Task) => {
    setIsOpen(false);
    onOpenTaskDetails(task);
  };

  return (
    <div ref={containerRef} className={`relative ${className}`}>
      {/* Search Input Bar */}
      <div className="relative flex items-center w-full">
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
          <Search className="w-4 h-4" />
        </div>

        <input
          id="global-search-input"
          ref={inputRef}
          type="text"
          value={searchQuery}
          onChange={(e) => {
            setSearchQuery(e.target.value);
            setIsOpen(true);
          }}
          onFocus={() => {
            if (searchQuery.trim().length > 0) {
              setIsOpen(true);
            }
          }}
          onKeyDown={handleKeyDown}
          placeholder="Filter by title, desc, category..."
          className="w-full bg-slate-50/80 hover:bg-slate-100/80 focus:bg-white dark:bg-slate-800/80 dark:hover:bg-slate-800 dark:focus:bg-slate-900 text-slate-900 dark:text-slate-100 text-xs pl-9 pr-16 py-1.5 md:py-2 rounded-xl border border-slate-200/90 dark:border-slate-700 focus:border-[#4F46E5] dark:focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/15 focus:outline-none transition-all placeholder:text-slate-400 dark:placeholder:text-slate-500"
          autoComplete="off"
        />

        {/* Trailing Controls: Clear and Keyboard Hint */}
        <div className="absolute inset-y-0 right-0 pr-2 flex items-center gap-1">
          {searchQuery ? (
            <button
              type="button"
              onClick={handleClear}
              className="p-1 rounded-md text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-200/50 dark:hover:bg-slate-700/50 transition-colors"
              title="Clear search"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          ) : (
            <kbd className="hidden sm:inline-flex items-center gap-0.5 px-1.5 py-0.5 text-[10px] font-mono text-slate-400 dark:text-slate-400 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded shadow-2xs select-none">
              ⌘K
            </kbd>
          )}
        </div>
      </div>

      {/* Instant Filter Popover Dropdown */}
      {isOpen && searchQuery.trim().length > 0 && (
        <div
          id="global-search-results"
          className="absolute left-0 right-0 top-full mt-1.5 bg-white dark:bg-[#131B2E] rounded-xl border border-slate-200 dark:border-slate-800 shadow-xl z-50 overflow-hidden animate-in fade-in zoom-in-95 duration-150 max-h-[420px] flex flex-col"
        >
          {/* Header Info */}
          <div className="flex items-center justify-between px-3.5 py-2 bg-slate-50/80 dark:bg-slate-900/60 border-b border-slate-100 dark:border-slate-800 text-[11px] font-mono text-slate-500 dark:text-slate-400">
            <span>
              {matchingTasks.length === 0
                ? 'No matching tasks'
                : `${matchingTasks.length} task${matchingTasks.length === 1 ? '' : 's'} found`}
            </span>
            <span className="text-[10px] text-slate-400">Press Enter to view all</span>
          </div>

          {/* Results List */}
          <div className="overflow-y-auto p-1.5 space-y-1 divide-y divide-slate-50 dark:divide-slate-800/50">
            {matchingTasks.length === 0 ? (
              <div className="py-6 px-4 text-center">
                <p className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                  No tasks match &ldquo;{searchQuery}&rdquo;
                </p>
                <p className="text-[11px] text-slate-400 mt-1 max-w-xs mx-auto">
                  Try filtering by different keywords, task descriptions, or category names.
                </p>
              </div>
            ) : (
              matchingTasks.slice(0, 6).map((task) => {
                const priority = task.priority || 'Medium';
                const badgeStyle =
                  PRIORITY_BADGE_STYLES[priority] || 'bg-slate-50 text-slate-600 border-slate-200';

                return (
                  <button
                    key={task.id}
                    type="button"
                    onClick={() => handleSelectTask(task)}
                    className="w-full text-left p-2.5 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-800/60 transition-colors flex items-start gap-2.5 group"
                  >
                    {/* Completion Icon */}
                    <div className="mt-0.5 shrink-0 text-slate-400 group-hover:text-indigo-600">
                      {task.isCompleted ? (
                        <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                      ) : (
                        <Circle className="w-4 h-4 text-slate-300 dark:text-slate-600" />
                      )}
                    </div>

                    <div className="flex-1 min-w-0 space-y-1">
                      {/* Title */}
                      <p
                        className={`text-xs font-semibold truncate text-slate-900 dark:text-slate-100 group-hover:text-[#4F46E5] dark:group-hover:text-indigo-400 transition-colors ${
                          task.isCompleted ? 'line-through text-slate-400 dark:text-slate-500' : ''
                        }`}
                      >
                        {task.title}
                      </p>

                      {/* Snippet / Description if matched */}
                      {task.description && (
                        <p className="text-[11px] text-slate-500 dark:text-slate-400 line-clamp-1">
                          {task.description}
                        </p>
                      )}

                      {/* Meta Tags: Category, Due Date, Priority */}
                      <div className="flex flex-wrap items-center gap-1.5 pt-0.5 text-[10px]">
                        <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 font-medium">
                          <Tag className="w-2.5 h-2.5 text-slate-400" />
                          <span>{task.category}</span>
                        </span>

                        <span
                          className={`px-1.5 py-0.5 rounded border font-semibold ${badgeStyle}`}
                        >
                          {priority}
                        </span>

                        {task.dueDate && (
                          <span className="inline-flex items-center gap-1 text-slate-500 dark:text-slate-400 font-mono">
                            <Clock className="w-2.5 h-2.5 text-slate-400" />
                            <span>
                              {task.dueDate}
                              {task.dueTime ? ` · ${formatTimeDisplay(task.dueTime)}` : ''}
                            </span>
                          </span>
                        )}
                      </div>
                    </div>
                  </button>
                );
              })
            )}
          </div>

          {/* Footer Action to Jump to Full Tasks Screen */}
          {matchingTasks.length > 0 && (
            <div className="p-2 border-t border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/40">
              <button
                type="button"
                onClick={() => {
                  setIsOpen(false);
                  onNavigateToTasks();
                }}
                className="w-full py-1.5 px-3 rounded-lg text-xs font-semibold text-[#4F46E5] dark:text-indigo-400 hover:bg-indigo-50 dark:hover:bg-indigo-950/40 transition-colors flex items-center justify-center gap-1.5"
              >
                <span>View all {matchingTasks.length} tasks in Tasks view</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
