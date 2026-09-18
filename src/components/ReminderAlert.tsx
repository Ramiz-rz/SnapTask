import React from 'react';
import { Task } from '../types';
import { formatTimeDisplay } from './TimePicker';
import { Bell, CheckCircle2, X, ExternalLink, Clock } from 'lucide-react';

interface ReminderAlertProps {
  alerts: Task[];
  onDismiss: (taskId: string) => void;
  onComplete: (taskId: string) => void;
  onOpenDetails: (task: Task) => void;
}

export const ReminderAlert: React.FC<ReminderAlertProps> = ({
  alerts,
  onDismiss,
  onComplete,
  onOpenDetails,
}) => {
  if (alerts.length === 0) return null;

  return (
    <div
      id="reminder-alert-container"
      className="fixed top-4 right-4 z-50 flex flex-col gap-3 max-w-sm w-full pointer-events-auto"
    >
      {alerts.map((task) => (
        <div
          key={task.id}
          className="bg-white/95 backdrop-blur-md border-2 border-indigo-500/80 rounded-2xl p-4 shadow-2xl animate-in slide-in-from-top-4 duration-200"
          role="alert"
        >
          {/* Header */}
          <div className="flex items-center justify-between gap-2 mb-2">
            <div className="flex items-center gap-2">
              <span className="relative flex h-3 w-3">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-rose-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-3 w-3 bg-rose-500"></span>
              </span>
              <span className="inline-flex items-center gap-1 text-[11px] font-bold text-indigo-700 uppercase tracking-wider bg-indigo-50 px-2 py-0.5 rounded-full border border-indigo-100">
                <Bell className="w-3 h-3 text-indigo-600 animate-bounce" />
                Due Time Reminder
              </span>
            </div>

            <button
              type="button"
              onClick={() => onDismiss(task.id)}
              className="text-slate-400 hover:text-slate-600 p-1 rounded-lg hover:bg-slate-100 transition-colors"
              title="Dismiss reminder"
              aria-label="Dismiss reminder"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Task Info */}
          <div className="space-y-1 mb-3">
            <h3 className="text-sm font-bold text-slate-900 line-clamp-1">
              {task.title}
            </h3>
            {task.description && (
              <p className="text-xs text-slate-600 line-clamp-2">
                {task.description}
              </p>
            )}

            {/* Meta row */}
            <div className="flex flex-wrap items-center gap-1.5 pt-1 text-[11px]">
              {task.dueTime && (
                <span className="inline-flex items-center gap-1 font-mono font-semibold text-indigo-700 bg-indigo-50/80 px-2 py-0.5 rounded-md">
                  <Clock className="w-3 h-3 text-indigo-600" />
                  <span>{formatTimeDisplay(task.dueTime)}</span>
                </span>
              )}
              <span className="px-2 py-0.5 rounded-md bg-slate-100 font-medium text-slate-700">
                {task.category}
              </span>
              <span
                className={`px-2 py-0.5 rounded-md font-semibold border ${
                  task.priority === 'High'
                    ? 'bg-rose-50 text-rose-700 border-rose-200'
                    : task.priority === 'Medium'
                    ? 'bg-amber-50 text-amber-700 border-amber-200'
                    : 'bg-slate-50 text-slate-700 border-slate-200'
                }`}
              >
                {task.priority} Priority
              </span>
            </div>
          </div>

          {/* Actions */}
          <div className="flex items-center gap-2 pt-1 border-t border-slate-100">
            <button
              type="button"
              onClick={() => {
                onComplete(task.id);
                onDismiss(task.id);
              }}
              className="flex-1 py-1.5 px-3 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold rounded-lg flex items-center justify-center gap-1.5 shadow-xs transition-colors"
            >
              <CheckCircle2 className="w-3.5 h-3.5" />
              <span>Mark Done</span>
            </button>

            <button
              type="button"
              onClick={() => {
                onOpenDetails(task);
                onDismiss(task.id);
              }}
              className="py-1.5 px-3 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold rounded-lg flex items-center gap-1 transition-colors"
            >
              <ExternalLink className="w-3.5 h-3.5" />
              <span>Details</span>
            </button>
          </div>
        </div>
      ))}
    </div>
  );
};
