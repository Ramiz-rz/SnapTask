import React, { useState, useEffect } from 'react';
import { Task, Priority } from '../types';
import { TimePicker } from './TimePicker';
import { X, FileEdit, Trash2, CheckCircle2 } from 'lucide-react';

interface TaskDetailsModalProps {
  isOpen: boolean;
  task: Task | null;
  onClose: () => void;
  onSave: (updatedTask: Task) => void;
  onDelete: (taskId: string) => void;
}

export const TaskDetailsModal: React.FC<TaskDetailsModalProps> = ({
  isOpen,
  task,
  onClose,
  onSave,
  onDelete,
}) => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState('Work');
  const [priority, setPriority] = useState<Priority>('High');
  const [dueDate, setDueDate] = useState('');
  const [dueTime, setDueTime] = useState('');

  useEffect(() => {
    if (task) {
      setTitle(task.title);
      setDescription(task.description || '');
      setCategory(task.category);
      setPriority(task.priority);
      setDueDate(task.dueDate);
      setDueTime(task.dueTime || '');
    }
  }, [task]);

  if (!isOpen || !task) return null;

  const handleSave = () => {
    onSave({
      ...task,
      title: title.trim() || task.title,
      description: description.trim(),
      category: category.trim() || 'Work',
      priority,
      dueDate: dueDate.trim() || task.dueDate,
      dueTime: dueTime.trim() || undefined,
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in duration-150">
      <div className="bg-white w-full max-w-lg rounded-2xl shadow-xl border border-slate-200 overflow-hidden transform transition-all p-6 space-y-4">
        {/* Modal Header */}
        <div className="flex items-center justify-between pb-3 border-b border-slate-100">
          <div className="flex items-center gap-2">
            <span className="p-1.5 bg-indigo-50 text-[#4F46E5] rounded-lg">
              <FileEdit className="w-5 h-5" />
            </span>
            <h3
              className="text-lg font-bold text-slate-900"
              style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}
            >
              Task Details & Actions
            </h3>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-slate-700 p-1.5 rounded-lg hover:bg-slate-100 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="space-y-3.5">
          <div>
            <label className="block text-xs font-semibold text-slate-600 mb-1">
              Task Title
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full bg-white border border-slate-200 rounded-lg px-3 py-2 text-sm text-slate-900 font-medium focus:border-[#4F46E5] focus:ring-2 focus:ring-indigo-500/15 focus:outline-none transition-all"
              placeholder="e.g. Finalize Q3 OKR deck"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-600 mb-1">
              Description & Context
            </label>
            <textarea
              rows={2}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full bg-white border border-slate-200 rounded-lg px-3 py-2 text-xs text-slate-700 focus:border-[#4F46E5] focus:ring-2 focus:ring-indigo-500/15 focus:outline-none resize-none transition-all"
              placeholder="Add extra context or notes..."
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-600 mb-1">
                Category
              </label>
              <input
                type="text"
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full bg-white border border-slate-200 rounded-lg px-3 py-2 text-xs text-slate-800 focus:border-[#4F46E5] focus:outline-none"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-600 mb-1">
                Priority
              </label>
              <select
                value={priority}
                onChange={(e) => setPriority(e.target.value as Priority)}
                className="w-full bg-white border border-slate-200 rounded-lg px-3 py-2 text-xs text-slate-800 focus:border-[#4F46E5] focus:outline-none"
              >
                <option value="High">High Priority</option>
                <option value="Medium">Medium Priority</option>
                <option value="Low">Low Priority</option>
              </select>
            </div>
          </div>

          {/* Due Date & Reminder Time Picker */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 pt-1">
            <div className="space-y-1">
              <label className="block text-xs font-semibold text-slate-600 mb-1">
                Due Date / Target
              </label>
              <input
                type="text"
                value={dueDate}
                onChange={(e) => setDueDate(e.target.value)}
                className="w-full bg-white border border-slate-200 rounded-lg px-3 py-2 text-xs text-slate-800 focus:border-[#4F46E5] focus:ring-2 focus:ring-indigo-500/15 focus:outline-none transition-all"
                placeholder="e.g. Today, Tomorrow, Oct 24"
              />
              <p className="text-[10px] text-slate-400">Calendar deadline or date description</p>
            </div>

            <div>
              <TimePicker
                value={dueTime}
                onChange={setDueTime}
                label="Reminder Time"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-600 mb-1">
              Extraction Provenance
            </label>
            <div className="bg-slate-50 border border-slate-200 rounded-lg p-2.5 flex items-center justify-between">
              <span className="font-mono text-xs text-indigo-700 font-medium">
                {task.source} {task.sourceDetail ? `(${task.sourceDetail})` : ''}
              </span>
              <span className="bg-indigo-100 text-[#4F46E5] text-[10px] font-semibold px-2 py-0.5 rounded-full flex items-center gap-1">
                <CheckCircle2 className="w-3 h-3" />
                {task.confidence || 98.4}% Match
              </span>
            </div>
            {task.context && (
              <p className="mt-1 text-[11px] text-slate-500 italic bg-white p-2 rounded border border-dashed border-slate-200">
                "{task.context}"
              </p>
            )}
          </div>
        </div>

        {/* Modal Footer */}
        <div className="flex items-center justify-between pt-3 border-t border-slate-100">
          <button
            onClick={() => {
              onDelete(task.id);
              onClose();
            }}
            className="flex items-center gap-1 px-3 py-2 text-rose-600 hover:bg-rose-50 text-xs font-semibold rounded-lg transition-colors"
          >
            <Trash2 className="w-4 h-4" />
            <span>Delete</span>
          </button>

          <div className="flex items-center gap-2">
            <button
              onClick={onClose}
              className="px-4 py-2 text-slate-600 hover:text-slate-900 hover:bg-slate-100 text-xs font-semibold rounded-lg transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={handleSave}
              className="px-4 py-2 bg-[#4F46E5] hover:bg-[#4338CA] text-white text-xs font-semibold rounded-lg shadow-xs transition-all active:scale-95"
            >
              Save Changes
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
