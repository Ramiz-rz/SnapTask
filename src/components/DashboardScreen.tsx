import React, { useState, useRef } from 'react';
import { Task, TabType } from '../types';
import { TaskAnalyticsChart } from './TaskAnalyticsChart';
import { formatTimeDisplay } from './TimePicker';
import {
  Cloud,
  ListTodo,
  Clock,
  Sparkles,
  CheckCircle,
  Scan,
  ShieldCheck,
  MessageSquare,
  FileText,
  Receipt,
  Mail,
  SlidersHorizontal,
  Plus,
  MoreVertical,
  Calendar,
  AlertCircle,
  Loader2,
} from 'lucide-react';

interface DashboardScreenProps {
  tasks: Task[];
  onToggleTask: (id: string) => void;
  onOpenTaskDetails: (task: Task) => void;
  onNewTask: () => void;
  onExtractSample: (sampleType: 'slack' | 'meeting' | 'receipt' | 'email') => void;
  onUploadImage: (file: File) => void;
  setActiveTab: (tab: TabType) => void;
  isExtracting: boolean;
}

export const DashboardScreen: React.FC<DashboardScreenProps> = ({
  tasks,
  onToggleTask,
  onOpenTaskDetails,
  onNewTask,
  onExtractSample,
  onUploadImage,
  setActiveTab,
  isExtracting,
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [selectedSample, setSelectedSample] = useState<'slack' | 'meeting' | 'receipt' | 'email'>('slack');

  const totalTasks = tasks.length;
  const pendingTasks = tasks.filter((t) => !t.isCompleted).length;
  const completedTasks = tasks.filter((t) => t.isCompleted).length;
  const completionRate = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;

  // Today's priority tasks: active, non-completed tasks
  const priorityTasks = tasks.filter((t) => !t.isCompleted).slice(0, 4);

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      onUploadImage(e.dataTransfer.files[0]);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      onUploadImage(e.target.files[0]);
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      {/* Hero / Headline Bar matching Image 2 */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
        <div>
          <h1
            className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-white tracking-tight"
            style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}
          >
            Visual Task Hub
          </h1>
          <p className="text-slate-500 dark:text-slate-400 text-sm mt-0.5">
            Convert screenshots into structured, actionable items instantly with Gemini Vision.
          </p>
        </div>

        <div className="flex items-center gap-2 text-xs font-mono text-slate-600 dark:text-slate-300 bg-white dark:bg-[#131B2E] px-3 py-1.5 rounded-lg border border-slate-200 dark:border-slate-800 shadow-xs self-start md:self-auto">
          <Cloud className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
          <span>Synced with Workspace</span>
        </div>
      </div>

      {/* Quick Stats Grid (Bento Style 4 cards matching Image 2) */}
      <section className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {/* Total Tasks */}
        <div className="bg-white dark:bg-[#131B2E] p-3.5 rounded-xl border border-slate-200 dark:border-slate-800 shadow-xs hover:border-slate-300 dark:hover:border-slate-700 transition-colors">
          <div className="flex items-center justify-between text-slate-500 dark:text-slate-400 mb-1">
            <span className="text-xs font-semibold">Total Tasks</span>
            <ListTodo className="w-4 h-4 text-[#4F46E5] dark:text-indigo-400" />
          </div>
          <div className="flex items-baseline gap-2">
            <span
              className="text-2xl font-bold text-slate-900 dark:text-white"
              style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}
            >
              {totalTasks}
            </span>
            <span className="text-[11px] font-mono text-emerald-600 dark:text-emerald-400 font-semibold">+3 today</span>
          </div>
        </div>

        {/* Pending Tasks */}
        <div className="bg-white dark:bg-[#131B2E] p-3.5 rounded-xl border border-slate-200 dark:border-slate-800 shadow-xs hover:border-slate-300 dark:hover:border-slate-700 transition-colors">
          <div className="flex items-center justify-between text-slate-500 dark:text-slate-400 mb-1">
            <span className="text-xs font-semibold">Pending</span>
            <Clock className="w-4 h-4 text-amber-600 dark:text-amber-400" />
          </div>
          <div className="flex items-baseline gap-2">
            <span
              className="text-2xl font-bold text-slate-900 dark:text-white"
              style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}
            >
              {pendingTasks}
            </span>
            <span className="text-[11px] font-mono text-slate-500 dark:text-slate-400">Requires action</span>
          </div>
        </div>

        {/* Extracted Today */}
        <div className="bg-white dark:bg-[#131B2E] p-3.5 rounded-xl border border-slate-200 dark:border-slate-800 shadow-xs hover:border-slate-300 dark:hover:border-slate-700 transition-colors">
          <div className="flex items-center justify-between text-slate-500 dark:text-slate-400 mb-1">
            <span className="text-xs font-semibold">Extracted Today</span>
            <Sparkles className="w-4 h-4 text-[#4F46E5] dark:text-indigo-400" />
          </div>
          <div className="flex items-baseline gap-2">
            <span
              className="text-2xl font-bold text-slate-900 dark:text-white"
              style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}
            >
              5
            </span>
            <span className="text-[11px] font-mono text-[#4F46E5] dark:text-indigo-400 font-medium">98.4% conf.</span>
          </div>
        </div>

        {/* Completion Rate */}
        <div className="bg-white dark:bg-[#131B2E] p-3.5 rounded-xl border border-slate-200 dark:border-slate-800 shadow-xs hover:border-slate-300 dark:hover:border-slate-700 transition-colors">
          <div className="flex items-center justify-between text-slate-500 dark:text-slate-400 mb-1">
            <span className="text-xs font-semibold">Completion Rate</span>
            <CheckCircle className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
          </div>
          <div className="flex items-baseline gap-2">
            <span
              className="text-2xl font-bold text-slate-900 dark:text-white"
              style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}
            >
              {completionRate}%
            </span>
            <span className="text-[11px] font-mono text-emerald-600 dark:text-emerald-400 font-medium">On track</span>
          </div>
        </div>
      </section>

      {/* Main Workspace Split: Desktop (5 cols Dropzone / 7 cols Tasks) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-start">
        {/* LEFT COLUMN: Screenshot Ingestion (5 cols) */}
        <section className="lg:col-span-5 bg-white dark:bg-[#131B2E] p-5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs flex flex-col gap-4 transition-colors">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-[#4F46E5]"></span>
              <h2
                className="text-base font-bold text-slate-900 dark:text-white"
                style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}
              >
                Screenshot Ingestion
              </h2>
            </div>
            <span className="text-[11px] font-mono font-semibold px-2 py-0.5 rounded bg-indigo-50 dark:bg-indigo-950/60 text-[#4F46E5] dark:text-indigo-300 border border-indigo-100 dark:border-indigo-900/60">
              Gemini 3.8 Flash
            </span>
          </div>

          {/* Dropzone interactive container */}
          <div
            id="dropzone"
            onClick={() => fileInputRef.current?.click()}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
            className={`relative group cursor-pointer border-2 border-dashed rounded-xl p-6 flex flex-col items-center justify-center text-center transition-all duration-200 ${
              isDragging
                ? 'border-[#4F46E5] bg-indigo-50/50 dark:bg-indigo-950/40 scale-[1.01]'
                : 'border-slate-200 dark:border-slate-700 bg-[#FAF8FF]/60 dark:bg-slate-900/40 hover:border-[#4F46E5] hover:bg-indigo-50/20 dark:hover:bg-indigo-950/20'
            }`}
          >
            <input
              ref={fileInputRef}
              type="file"
              accept="image/png, image/jpeg, image/webp"
              onChange={handleFileChange}
              className="hidden"
            />

            <div className="w-14 h-14 rounded-2xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 shadow-sm flex items-center justify-center mb-3 group-hover:scale-105 transition-transform duration-150">
              <Scan className="w-8 h-8 text-[#4F46E5] dark:text-indigo-400" />
            </div>

            <p className="text-sm text-slate-900 dark:text-white font-bold mb-1">
              Tap or drop screenshot here
            </p>
            <p className="text-xs text-slate-500 dark:text-slate-400 max-w-xs mb-3">
              PNG, JPG, WEBP up to 10MB. Ideal for Slack, chats, emails, or handwritten lists.
            </p>

            {isExtracting && (
              <div className="w-full bg-indigo-50 dark:bg-indigo-950/60 border border-indigo-100 dark:border-indigo-900/60 rounded-lg p-3 mb-2 text-left animate-in fade-in">
                <div className="flex items-center gap-2">
                  <Loader2 className="w-4 h-4 text-[#4F46E5] dark:text-indigo-400 animate-spin" />
                  <span className="text-xs font-semibold text-[#4F46E5] dark:text-indigo-300">
                    Processing screenshot with Gemini Vision...
                  </span>
                </div>
                <div className="w-full bg-indigo-100 dark:bg-indigo-900/80 h-1.5 rounded-full mt-2 overflow-hidden">
                  <div className="bg-[#4F46E5] h-full w-3/4 animate-pulse"></div>
                </div>
              </div>
            )}

            <div className="flex items-center gap-1.5 text-[11px] font-mono text-slate-600 dark:text-slate-300 bg-white dark:bg-slate-800 px-2.5 py-1 rounded-md border border-slate-200 dark:border-slate-700">
              <ShieldCheck className="w-3.5 h-3.5 text-[#4F46E5] dark:text-indigo-400" />
              <span>Zero-retention OCR privacy</span>
            </div>
          </div>

          {/* Quick Sample Screenshot Pills matching Image 2 */}
          <div>
            <label className="block text-xs font-semibold text-slate-600 dark:text-slate-300 mb-2">
              Try a sample screenshot:
            </label>
            <div className="flex flex-wrap gap-1.5">
              <button
                type="button"
                onClick={() => {
                  setSelectedSample('slack');
                  onExtractSample('slack');
                }}
                className={`text-xs font-semibold px-2.5 py-1.5 rounded-lg border flex items-center gap-1.5 transition-all ${
                  selectedSample === 'slack'
                    ? 'border-[#4F46E5] bg-indigo-50 dark:bg-indigo-950/60 text-[#4F46E5] dark:text-indigo-300'
                    : 'border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700'
                }`}
              >
                <MessageSquare className="w-3.5 h-3.5 text-[#4F46E5] dark:text-indigo-400" />
                <span>Slack Message</span>
              </button>

              <button
                type="button"
                onClick={() => {
                  setSelectedSample('meeting');
                  onExtractSample('meeting');
                }}
                className={`text-xs font-semibold px-2.5 py-1.5 rounded-lg border flex items-center gap-1.5 transition-all ${
                  selectedSample === 'meeting'
                    ? 'border-emerald-500 bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300'
                    : 'border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700'
                }`}
              >
                <FileText className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
                <span>Meeting Notes</span>
              </button>

              <button
                type="button"
                onClick={() => {
                  setSelectedSample('receipt');
                  onExtractSample('receipt');
                }}
                className={`text-xs font-semibold px-2.5 py-1.5 rounded-lg border flex items-center gap-1.5 transition-all ${
                  selectedSample === 'receipt'
                    ? 'border-amber-500 bg-amber-50 dark:bg-amber-950/60 text-amber-700 dark:text-amber-300'
                    : 'border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700'
                }`}
              >
                <Receipt className="w-3.5 h-3.5 text-amber-600 dark:text-amber-400" />
                <span>Receipt / Invoice</span>
              </button>

              <button
                type="button"
                onClick={() => {
                  setSelectedSample('email');
                  onExtractSample('email');
                }}
                className={`text-xs font-semibold px-2.5 py-1.5 rounded-lg border flex items-center gap-1.5 transition-all ${
                  selectedSample === 'email'
                    ? 'border-indigo-500 bg-indigo-50 dark:bg-indigo-950/60 text-indigo-700 dark:text-indigo-300'
                    : 'border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700'
                }`}
              >
                <Mail className="w-3.5 h-3.5 text-slate-600 dark:text-slate-400" />
                <span>Email Thread</span>
              </button>
            </div>
          </div>

          {/* Primary Action Button */}
          <button
            id="extractBtn"
            onClick={() => onExtractSample(selectedSample)}
            disabled={isExtracting}
            className="w-full mt-1 flex items-center justify-center gap-2 py-3 px-4 rounded-xl bg-[#4F46E5] text-white text-sm font-semibold hover:bg-[#4338CA] transition-all duration-150 active:scale-[0.98] shadow-xs disabled:opacity-75"
          >
            {isExtracting ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin" />
                <span>Extracting Tasks...</span>
              </>
            ) : (
              <>
                <Sparkles className="w-5 h-5 text-indigo-200" />
                <span>Extract Tasks with Gemini Vision</span>
              </>
            )}
          </button>
        </section>

        {/* RIGHT COLUMN: Today's Priority Tasks (7 cols matching Image 2) */}
        <section className="lg:col-span-7 bg-white dark:bg-[#131B2E] p-5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs transition-colors">
          {/* Section Header */}
          <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800 mb-3">
            <div className="flex items-center gap-2">
              <h2
                className="text-base font-bold text-slate-900 dark:text-white"
                style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}
              >
                Today's Priority Tasks
              </h2>
              <span
                id="activeCountBadge"
                className="text-xs font-mono font-bold px-2 py-0.5 rounded-full bg-indigo-50 dark:bg-indigo-950/60 text-[#4F46E5] dark:text-indigo-300 border border-indigo-100 dark:border-indigo-900/60"
              >
                {priorityTasks.length} active
              </span>
            </div>

            <div className="flex items-center gap-1">
              <button
                onClick={() => setActiveTab('tasks')}
                className="p-1.5 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-500 dark:text-slate-400 transition-colors"
                title="Filter tasks"
              >
                <SlidersHorizontal className="w-4 h-4" />
              </button>
              <button
                id="quickAddTaskBtn"
                onClick={onNewTask}
                className="flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-semibold text-[#4F46E5] dark:text-indigo-400 hover:bg-indigo-50 dark:hover:bg-indigo-950/50 transition-colors"
              >
                <Plus className="w-4 h-4" />
                <span>New Task</span>
              </button>
            </div>
          </div>

          {/* Task Items Stack */}
          <div className="space-y-2.5" id="taskList">
            {priorityTasks.map((task) => {
              const isHigh = task.priority === 'High';
              const isMedium = task.priority === 'Medium';

              return (
                <div
                  key={task.id}
                  onClick={() => onOpenTaskDetails(task)}
                  className="task-card group bg-white dark:bg-[#18233C] hover:bg-slate-50/70 dark:hover:bg-[#1E2B4A] p-3.5 rounded-xl border border-slate-200 dark:border-slate-700/80 transition-all duration-150 flex items-start justify-between gap-3 cursor-pointer"
                >
                  <div className="flex items-start gap-3 flex-1 min-w-0">
                    {/* Custom Checkbox */}
                    <button
                      type="button"
                      aria-label="Mark task complete"
                      onClick={(e) => {
                        e.stopPropagation();
                        onToggleTask(task.id);
                      }}
                      className={`task-toggle mt-0.5 w-4.5 h-4.5 rounded border transition-colors flex items-center justify-center shrink-0 ${
                        task.isCompleted
                          ? 'bg-emerald-600 border-emerald-600 text-white'
                          : 'border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 hover:border-[#4F46E5]'
                      }`}
                    >
                      {task.isCompleted && <CheckCircle className="w-3.5 h-3.5" />}
                    </button>

                    <div className="space-y-1 flex-1 min-w-0">
                      <p
                        className={`task-title text-sm font-semibold leading-snug tracking-tight text-slate-900 dark:text-white group-hover:text-[#4F46E5] dark:group-hover:text-indigo-300 transition-colors ${
                          task.isCompleted ? 'line-through text-slate-400 dark:text-slate-500' : ''
                        }`}
                      >
                        {task.title}
                      </p>

                      <div className="flex flex-wrap items-center gap-2 pt-0.5 text-xs">
                        {/* Category */}
                        <span className="px-2 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 font-medium">
                          {task.category}
                        </span>

                        {/* Due Date Pill */}
                        <span
                          className={`inline-flex items-center gap-1 font-medium ${
                            isHigh
                              ? 'text-rose-600 dark:text-rose-400'
                              : 'text-slate-600 dark:text-slate-400'
                          }`}
                        >
                          <Clock className="w-3 h-3" />
                          <span>{task.dueDate}</span>
                          {task.dueTime && (
                            <span className="font-mono text-[10px] ml-0.5 px-1.5 py-0.5 rounded bg-slate-100/90 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200/50 dark:border-slate-700">
                              {formatTimeDisplay(task.dueTime)}
                            </span>
                          )}
                        </span>

                        {/* Priority Tag */}
                        {isHigh && (
                          <span className="px-2 py-0.5 rounded bg-[#FFF1F2] dark:bg-rose-950/60 text-[#E11D48] dark:text-rose-300 border border-[rgba(225,29,72,0.2)] dark:border-rose-900/60 font-semibold text-[11px]">
                            High
                          </span>
                        )}
                        {isMedium && (
                          <span className="px-2 py-0.5 rounded bg-[#FFFBEB] dark:bg-amber-950/60 text-[#D97706] dark:text-amber-300 border border-[rgba(217,119,6,0.2)] dark:border-amber-900/60 font-semibold text-[11px]">
                            Medium
                          </span>
                        )}
                        {!isHigh && !isMedium && (
                          <span className="px-2 py-0.5 rounded bg-[#F1F5F9] dark:bg-slate-800 text-[#475569] dark:text-slate-300 border border-[rgba(71,85,105,0.15)] dark:border-slate-700 font-semibold text-[11px]">
                            Low
                          </span>
                        )}

                        {/* Extraction Badge */}
                        <span className="font-mono text-[11px] text-[#4F46E5] dark:text-indigo-300 bg-[#EEF2FF] dark:bg-indigo-950/60 px-2 py-0.5 rounded inline-flex items-center gap-1 border border-indigo-100 dark:border-indigo-900/60">
                          <span className="w-1.5 h-1.5 rounded-full bg-[#4F46E5]"></span>
                          {task.source}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Options Action */}
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      onOpenTaskDetails(task);
                    }}
                    className="text-slate-400 dark:text-slate-500 hover:text-slate-700 dark:hover:text-slate-200 p-1 rounded hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors opacity-80 group-hover:opacity-100 shrink-0"
                  >
                    <MoreVertical className="w-4 h-4" />
                  </button>
                </div>
              );
            })}
          </div>

          {/* Bottom helper note matching Image 2 */}
          <div className="mt-3 pt-2.5 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs font-mono text-slate-500 dark:text-slate-400">
            <span>Auto-prioritized via natural language rules</span>
            <button
              onClick={() => setActiveTab('tasks')}
              className="text-[#4F46E5] dark:text-indigo-400 hover:underline font-semibold"
            >
              View All ({totalTasks}) →
            </button>
          </div>
        </section>
      </div>

      {/* Task Breakdown & Priority Analytics (Recharts) */}
      <TaskAnalyticsChart
        tasks={tasks}
        onCategorySelect={() => setActiveTab('tasks')}
      />
    </div>
  );
};
