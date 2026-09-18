import React, { useState, useMemo } from 'react';
import { Task, Priority } from '../types';
import { formatTimeDisplay } from './TimePicker';
import {
  Search,
  ArrowUpDown,
  Plus,
  Briefcase,
  Folder,
  Headphones,
  Terminal,
  CreditCard,
  Palette,
  Clock,
  Calendar,
  ChevronDown,
  ChevronRight,
  MoreVertical,
  Check,
  Sparkles,
  CheckCheck,
  X,
} from 'lucide-react';

interface TasksScreenProps {
  tasks: Task[];
  onToggleTask: (id: string) => void;
  onOpenTaskDetails: (task: Task) => void;
  onNewTask: () => void;
  searchQuery?: string;
  setSearchQuery?: (query: string) => void;
}

export const TasksScreen: React.FC<TasksScreenProps> = ({
  tasks,
  onToggleTask,
  onOpenTaskDetails,
  onNewTask,
  searchQuery: externalSearchQuery,
  setSearchQuery: externalSetSearchQuery,
}) => {
  const [internalSearchQuery, setInternalSearchQuery] = useState('');
  const searchQuery = externalSearchQuery !== undefined ? externalSearchQuery : internalSearchQuery;
  const setSearchQuery = externalSetSearchQuery || setInternalSearchQuery;
  const [sortBy, setSortBy] = useState<'dueDate' | 'priority' | 'category'>('dueDate');
  const [filterTab, setFilterTab] = useState<'all' | 'pending' | 'completed' | 'high'>('all');
  const [completedCollapsed, setCompletedCollapsed] = useState(false);

  // Filter tasks based on search & filter tabs
  const filteredTasks = useMemo(() => {
    return tasks.filter((task) => {
      const matchesSearch =
        task.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        task.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (task.source && task.source.toLowerCase().includes(searchQuery.toLowerCase())) ||
        (task.description && task.description.toLowerCase().includes(searchQuery.toLowerCase()));

      if (!matchesSearch) return false;

      if (filterTab === 'pending') return !task.isCompleted;
      if (filterTab === 'completed') return task.isCompleted;
      if (filterTab === 'high') return task.priority === 'High' && !task.isCompleted;

      return true;
    });
  }, [tasks, searchQuery, filterTab]);

  // Group filtered tasks
  const overdueOrHighTasks = useMemo(() => {
    return filteredTasks.filter(
      (t) =>
        !t.isCompleted &&
        (t.priority === 'High' || t.dueDate.toLowerCase().includes('yesterday') || t.dueDate.toLowerCase().includes('overdue'))
    );
  }, [filteredTasks]);

  const upcomingTasks = useMemo(() => {
    return filteredTasks.filter(
      (t) =>
        !t.isCompleted &&
        t.priority !== 'High' &&
        !t.dueDate.toLowerCase().includes('yesterday') &&
        !t.dueDate.toLowerCase().includes('overdue')
    );
  }, [filteredTasks]);

  const completedTasks = useMemo(() => {
    return filteredTasks.filter((t) => t.isCompleted);
  }, [filteredTasks]);

  // Category Icon helper
  const getCategoryIcon = (category: string) => {
    const c = category.toLowerCase();
    if (c.includes('work')) return <Briefcase className="w-3.5 h-3.5 text-slate-400" />;
    if (c.includes('support')) return <Headphones className="w-3.5 h-3.5 text-slate-400" />;
    if (c.includes('devops') || c.includes('engineering')) return <Terminal className="w-3.5 h-3.5 text-slate-400" />;
    if (c.includes('finance')) return <CreditCard className="w-3.5 h-3.5 text-slate-400" />;
    if (c.includes('design')) return <Palette className="w-3.5 h-3.5 text-slate-400" />;
    return <Folder className="w-3.5 h-3.5 text-slate-400" />;
  };

  const pendingCount = tasks.filter((t) => !t.isCompleted).length;
  const completedCount = tasks.filter((t) => t.isCompleted).length;
  const highPriorityCount = tasks.filter((t) => !t.isCompleted && t.priority === 'High').length;

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      {/* 1. Screen Title Header & Actions matching Image 4 */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <div className="flex items-center gap-3">
            <h1
              className="text-2xl md:text-3xl font-bold text-slate-900 tracking-tight"
              style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}
            >
              Tasks & Reminders
            </h1>
            <span className="bg-[#EEF2FF] text-[#4F46E5] font-mono text-xs font-semibold px-2.5 py-0.5 rounded-full border border-indigo-200">
              {tasks.length} Tasks
            </span>
          </div>
          <p className="text-slate-500 text-xs sm:text-sm mt-1">
            Live queue captured via OCR extraction and manual entries
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            type="button"
            onClick={onNewTask}
            className="inline-flex items-center justify-center gap-1.5 bg-[#4F46E5] text-white hover:bg-[#4338CA] text-xs font-semibold px-4 py-2.5 rounded-lg active:scale-95 transition-all shadow-xs"
          >
            <Plus className="w-4 h-4" />
            <span>+ New Task</span>
          </button>
        </div>
      </div>

      {/* 2. Search & Filter Bar Section matching Image 4 */}
      <section className="bg-white border border-slate-200 rounded-xl p-4 shadow-xs space-y-3.5">
        <div className="flex flex-col md:flex-row gap-3 items-center justify-between">
          {/* Search Input */}
          <div className="relative w-full md:w-96">
            <Search className="absolute left-3 top-2.5 text-slate-400 w-4 h-4" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search tasks, categories, tags..."
              className="w-full bg-white border border-slate-200 rounded-lg pl-9 pr-8 py-2 text-slate-900 text-xs placeholder:text-slate-400 focus:border-[#4F46E5] focus:ring-2 focus:ring-indigo-500/15 focus:outline-none transition-all"
            />
            {searchQuery && (
              <button
                type="button"
                onClick={() => setSearchQuery('')}
                className="absolute right-2.5 top-2.5 text-slate-400 hover:text-slate-600 p-0.5 rounded"
                title="Clear search"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

          {/* Sort Dropdown */}
          <div className="w-full md:w-auto flex justify-end items-center gap-2">
            <div className="relative inline-block text-left w-full sm:w-auto">
              <button
                type="button"
                onClick={() => {
                  if (sortBy === 'dueDate') setSortBy('priority');
                  else if (sortBy === 'priority') setSortBy('category');
                  else setSortBy('dueDate');
                }}
                className="w-full sm:w-auto inline-flex items-center justify-between gap-2 px-3 py-2 bg-white border border-slate-200 hover:border-slate-300 rounded-lg text-slate-700 text-xs transition-colors"
              >
                <span className="flex items-center gap-1.5 text-slate-500">
                  <ArrowUpDown className="w-3.5 h-3.5 text-slate-400" />
                  <span>Sort by:</span>
                  <strong className="text-slate-900 font-medium capitalize">
                    {sortBy === 'dueDate' ? 'Due Date' : sortBy}
                  </strong>
                </span>
                <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
              </button>
            </div>
          </div>
        </div>

        {/* Filter Pills matching Image 4 */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1 pt-1 no-scrollbar border-t border-slate-100">
          <button
            type="button"
            onClick={() => setFilterTab('all')}
            className={`text-xs font-semibold px-3 py-1.5 rounded-full shadow-xs flex items-center gap-1.5 whitespace-nowrap transition-all ${
              filterTab === 'all'
                ? 'bg-[#4F46E5] text-white'
                : 'bg-slate-50 hover:bg-slate-100 text-slate-600 border border-slate-200'
            }`}
          >
            <span>All ({tasks.length})</span>
          </button>

          <button
            type="button"
            onClick={() => setFilterTab('pending')}
            className={`text-xs font-semibold px-3 py-1.5 rounded-full whitespace-nowrap transition-all ${
              filterTab === 'pending'
                ? 'bg-[#4F46E5] text-white shadow-xs'
                : 'bg-slate-50 hover:bg-slate-100 text-slate-600 border border-slate-200'
            }`}
          >
            <span>Pending ({pendingCount})</span>
          </button>

          <button
            type="button"
            onClick={() => setFilterTab('completed')}
            className={`text-xs font-semibold px-3 py-1.5 rounded-full whitespace-nowrap transition-all ${
              filterTab === 'completed'
                ? 'bg-[#4F46E5] text-white shadow-xs'
                : 'bg-slate-50 hover:bg-slate-100 text-slate-600 border border-slate-200'
            }`}
          >
            <span>Completed ({completedCount})</span>
          </button>

          <button
            type="button"
            onClick={() => setFilterTab('high')}
            className={`text-xs font-semibold px-3 py-1.5 rounded-full whitespace-nowrap transition-all flex items-center gap-1.5 ${
              filterTab === 'high'
                ? 'bg-[#E11D48] text-white shadow-xs'
                : 'bg-[#FFF1F2] hover:bg-[#FFE4E6] text-[#E11D48] border border-[rgba(225,29,72,0.2)]'
            }`}
          >
            <span className="w-1.5 h-1.5 rounded-full bg-[#E11D48]"></span>
            <span>High Priority ({highPriorityCount})</span>
          </button>
        </div>
      </section>

      {/* 3. Categorized Task Lists matching Image 4 */}
      <div className="space-y-6">
        {/* GROUP 1: Overdue / High Priority */}
        {overdueOrHighTasks.length > 0 && (
          <section className="space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-[#E11D48]"></span>
                <h2
                  className="text-base font-bold text-slate-900"
                  style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}
                >
                  Overdue / High Priority
                </h2>
              </div>
              <span className="text-[11px] font-semibold text-[#E11D48] bg-[#FFF1F2] px-2 py-0.5 rounded border border-[rgba(225,29,72,0.15)]">
                {overdueOrHighTasks.length} Critical
              </span>
            </div>

            <div className="space-y-2.5">
              {overdueOrHighTasks.map((task) => (
                <div
                  key={task.id}
                  onClick={() => onOpenTaskDetails(task)}
                  className="group bg-white border border-slate-200 hover:border-slate-300 rounded-xl p-4 shadow-xs transition-all duration-150 flex items-start justify-between gap-3 cursor-pointer"
                >
                  <div className="flex items-start gap-3 flex-1 min-w-0">
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        onToggleTask(task.id);
                      }}
                      className={`mt-0.5 w-4.5 h-4.5 rounded border-[1.5px] flex items-center justify-center transition-colors shrink-0 ${
                        task.isCompleted
                          ? 'bg-[#10B981] border-[#10B981] text-white'
                          : 'border-slate-300 hover:border-[#4F46E5] bg-white'
                      }`}
                    >
                      {task.isCompleted && <Check className="w-3.5 h-3.5 text-white" />}
                    </button>

                    <div className="space-y-1.5 flex-1 min-w-0">
                      <div className="flex flex-wrap items-center gap-2">
                        <span
                          className={`task-title text-sm font-semibold tracking-tight text-slate-900 group-hover:text-[#4F46E5] transition-colors ${
                            task.isCompleted ? 'line-through text-slate-400' : ''
                          }`}
                        >
                          {task.title}
                        </span>

                        <span className="bg-[#FFF1F2] text-[#E11D48] border border-[rgba(225,29,72,0.15)] text-[11px] font-semibold px-2 py-0.5 rounded flex items-center gap-1">
                          High
                        </span>

                        {task.source.includes('OCR') && (
                          <span className="bg-[#EEF2FF] text-[#4F46E5] font-mono text-[10px] px-2 py-0.5 rounded-full flex items-center gap-1">
                            <span className="w-1.5 h-1.5 rounded-full bg-[#4F46E5] animate-ping"></span>
                            OCR Extracted
                          </span>
                        )}
                      </div>

                      <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-slate-500 text-xs">
                        <span className="flex items-center gap-1">
                          {getCategoryIcon(task.category)}
                          <span>{task.category}</span>
                        </span>
                        <span className="text-slate-300">•</span>
                        <span className="flex items-center gap-1 text-rose-600 font-medium">
                          <Clock className="w-3.5 h-3.5" />
                          <span>{task.dueDate}</span>
                          {task.dueTime && (
                            <span className="bg-rose-50 text-rose-700 border border-rose-200 text-[10px] font-semibold px-1.5 py-0.5 rounded font-mono ml-0.5">
                              {formatTimeDisplay(task.dueTime)}
                            </span>
                          )}
                        </span>
                        {task.sourceDetail && (
                          <>
                            <span className="text-slate-300">•</span>
                            <span className="font-mono text-[11px] text-slate-400">
                              {task.sourceDetail}
                            </span>
                          </>
                        )}
                      </div>
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      onOpenTaskDetails(task);
                    }}
                    className="p-1 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-lg transition-colors shrink-0"
                  >
                    <MoreVertical className="w-4.5 h-4.5" />
                  </button>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* GROUP 2: Upcoming */}
        {upcomingTasks.length > 0 && (
          <section className="space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-[#D97706]"></span>
                <h2
                  className="text-base font-bold text-slate-900"
                  style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}
                >
                  Upcoming
                </h2>
              </div>
              <span className="text-xs text-slate-500">
                {upcomingTasks.length} Tasks
              </span>
            </div>

            <div className="space-y-2.5">
              {upcomingTasks.map((task) => (
                <div
                  key={task.id}
                  onClick={() => onOpenTaskDetails(task)}
                  className="group bg-white border border-slate-200 hover:border-slate-300 rounded-xl p-4 shadow-xs transition-all duration-150 flex items-start justify-between gap-3 cursor-pointer"
                >
                  <div className="flex items-start gap-3 flex-1 min-w-0">
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        onToggleTask(task.id);
                      }}
                      className={`mt-0.5 w-4.5 h-4.5 rounded border-[1.5px] flex items-center justify-center transition-colors shrink-0 ${
                        task.isCompleted
                          ? 'bg-[#10B981] border-[#10B981] text-white'
                          : 'border-slate-300 hover:border-[#4F46E5] bg-white'
                      }`}
                    >
                      {task.isCompleted && <Check className="w-3.5 h-3.5 text-white" />}
                    </button>

                    <div className="space-y-1.5 flex-1 min-w-0">
                      <div className="flex flex-wrap items-center gap-2">
                        <span
                          className={`task-title text-sm font-semibold tracking-tight text-slate-900 group-hover:text-[#4F46E5] transition-colors ${
                            task.isCompleted ? 'line-through text-slate-400' : ''
                          }`}
                        >
                          {task.title}
                        </span>

                        <span className="bg-[#FFFBEB] text-[#D97706] border border-[rgba(217,119,6,0.15)] text-[11px] font-semibold px-2 py-0.5 rounded">
                          {task.priority === 'Medium' ? 'Medium' : 'Low'}
                        </span>
                      </div>

                      <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-slate-500 text-xs">
                        <span className="flex items-center gap-1">
                          {getCategoryIcon(task.category)}
                          <span>{task.category}</span>
                        </span>
                        <span className="text-slate-300">•</span>
                        <span className="flex items-center gap-1">
                          <Calendar className="w-3.5 h-3.5 text-slate-400" />
                          <span>{task.dueDate}</span>
                          {task.dueTime && (
                            <span className="bg-indigo-50 text-indigo-700 border border-indigo-100 text-[10px] font-semibold px-1.5 py-0.5 rounded font-mono ml-0.5">
                              {formatTimeDisplay(task.dueTime)}
                            </span>
                          )}
                        </span>
                      </div>
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      onOpenTaskDetails(task);
                    }}
                    className="p-1 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-lg transition-colors shrink-0"
                  >
                    <MoreVertical className="w-4.5 h-4.5" />
                  </button>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* GROUP 3: Completed (Collapsible) matching Image 4 */}
        {completedTasks.length > 0 && (
          <section className="space-y-3">
            <button
              type="button"
              onClick={() => setCompletedCollapsed(!completedCollapsed)}
              className="w-full flex items-center justify-between text-slate-600 hover:text-slate-900 transition-colors py-1 focus:outline-none"
            >
              <div className="flex items-center gap-2">
                {completedCollapsed ? (
                  <ChevronRight className="w-5 h-5 text-slate-400 transition-transform" />
                ) : (
                  <ChevronDown className="w-5 h-5 text-slate-400 transition-transform" />
                )}
                <h2
                  className="text-base font-bold text-slate-900"
                  style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}
                >
                  Completed ({completedTasks.length})
                </h2>
              </div>
              <span className="text-[11px] font-semibold bg-slate-100 px-2.5 py-0.5 rounded-full text-slate-600">
                Archived in DB
              </span>
            </button>

            {!completedCollapsed && (
              <div className="space-y-2.5">
                {completedTasks.map((task) => (
                  <div
                    key={task.id}
                    className="bg-slate-50/70 border border-slate-200 rounded-xl p-4 shadow-xs flex items-start justify-between gap-3 opacity-85 hover:opacity-100 transition-opacity"
                  >
                    <div className="flex items-start gap-3 flex-1 min-w-0">
                      <button
                        type="button"
                        onClick={() => onToggleTask(task.id)}
                        className="mt-0.5 w-4.5 h-4.5 rounded border-[1.5px] border-[#10B981] bg-[#10B981] flex items-center justify-center transition-colors shrink-0"
                      >
                        <Check className="w-3.5 h-3.5 text-white" />
                      </button>

                      <div className="space-y-1 flex-1 min-w-0">
                        <p className="task-title text-sm font-medium text-slate-400 line-through">
                          {task.title}
                        </p>
                        <div className="flex items-center gap-3 text-slate-500 text-xs">
                          <span className="flex items-center gap-1">
                            {getCategoryIcon(task.category)}
                            <span>{task.category}</span>
                          </span>
                          <span className="text-slate-300">•</span>
                          <span className="text-emerald-700 font-medium text-[11px]">
                            {task.completedAt || 'Finished today'}
                          </span>
                        </div>
                      </div>
                    </div>

                    <button
                      type="button"
                      onClick={() => onOpenTaskDetails(task)}
                      className="p-1 text-slate-400 hover:text-slate-700 rounded-lg"
                      title="View details"
                    >
                      <CheckCheck className="w-5 h-5 text-emerald-600" />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </section>
        )}
      </div>
    </div>
  );
};
