import React, { useState } from 'react';
import { ExtractionResult, ExtractedTask, Priority } from '../types';
import {
  ArrowLeft,
  RefreshCw,
  Sparkles,
  Image as ImageIcon,
  ZoomIn,
  Crop,
  CheckCircle2,
  Info,
  CheckSquare,
  Square,
  Edit2,
  Trash2,
  ChevronDown,
  Code2,
  Users,
  CreditCard,
  Briefcase,
  Clock,
  Calendar,
  PlusCircle,
  Check,
} from 'lucide-react';

interface ReviewExtractionScreenProps {
  extraction: ExtractionResult;
  onSaveTasks: (tasksToSave: ExtractedTask[]) => void;
  onDiscard: () => void;
  onBack: () => void;
}

export const ReviewExtractionScreen: React.FC<ReviewExtractionScreenProps> = ({
  extraction,
  onSaveTasks,
  onDiscard,
  onBack,
}) => {
  const [tasks, setTasks] = useState<ExtractedTask[]>(extraction.tasks || []);
  const [activeZoom, setActiveZoom] = useState(false);

  React.useEffect(() => {
    setTasks(extraction.tasks || []);
  }, [extraction]);

  const selectedCount = tasks.filter((t) => t.checked).length;
  const allSelected = tasks.length > 0 && selectedCount === tasks.length;

  const toggleSelectAll = () => {
    const nextState = !allSelected;
    setTasks(tasks.map((t) => ({ ...t, checked: nextState })));
  };

  const toggleTaskCheck = (id: string) => {
    setTasks(
      tasks.map((t) => (t.id === id ? { ...t, checked: !t.checked } : t))
    );
  };

  const updateTaskField = (
    id: string,
    field: keyof ExtractedTask,
    value: any
  ) => {
    setTasks(
      tasks.map((t) => (t.id === id ? { ...t, [field]: value } : t))
    );
  };

  const deleteTask = (id: string) => {
    setTasks(tasks.filter((t) => t.id !== id));
  };

  const addAnotherTask = () => {
    const newTask: ExtractedTask = {
      id: `manual-add-${Date.now()}`,
      title: 'New extracted action item',
      description: 'Added manually during extraction review',
      priority: 'Medium',
      category: 'Work',
      dueDate: 'Due Tomorrow',
      matchConfidence: 98.0,
      checked: true,
      source: extraction.detectedFormat,
      context: 'Manual addition from preview',
    };
    setTasks([...tasks, newTask]);
  };

  const handleSave = () => {
    const tasksToSave = tasks.filter((t) => t.checked);
    onSaveTasks(tasksToSave);
  };

  return (
    <div className="space-y-6 pb-28 animate-in fade-in duration-200">
      {/* Top Header matching Image 6 */}
      <div className="flex items-center justify-between pb-3 border-b border-slate-200/80">
        <div className="flex items-center gap-3">
          <button
            onClick={onBack}
            className="w-9 h-9 flex items-center justify-center rounded-lg hover:bg-slate-100 text-slate-600 transition-all active:scale-95"
            title="Go Back"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>

          <div className="flex flex-col">
            <h1
              className="text-xl md:text-2xl font-bold text-slate-900 leading-tight"
              style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}
            >
              Review Extraction
            </h1>
            <span className="text-xs font-mono text-slate-500 flex items-center gap-1.5 mt-0.5">
              <span className="inline-block w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
              {extraction.parsingModel}
            </span>
          </div>
        </div>

        <div className="flex items-center gap-2 sm:gap-3">
          <div className="hidden sm:flex items-center gap-1.5 px-3 py-1 rounded-full bg-indigo-50 border border-indigo-100">
            <Sparkles className="w-3.5 h-3.5 text-[#4F46E5]" />
            <span className="text-xs font-mono text-[#4F46E5] font-semibold">
              {tasks.length} tasks in {extraction.extractionTime}
            </span>
          </div>

          <button
            onClick={onDiscard}
            className="w-9 h-9 flex items-center justify-center rounded-lg hover:bg-slate-100 text-slate-600 active:scale-95 transition-all"
            title="Reset or re-run"
          >
            <RefreshCw className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Top Status Banner for Mobile */}
      <div className="sm:hidden flex items-center justify-between bg-white p-3 rounded-xl border border-slate-200 shadow-xs">
        <div className="flex items-center gap-2">
          <Sparkles className="w-4 h-4 text-[#4F46E5]" />
          <span className="text-xs font-bold text-slate-900">
            {tasks.length} Actionable Tasks Extracted
          </span>
        </div>
        <span className="text-xs font-mono bg-indigo-50 text-[#4F46E5] font-semibold px-2 py-0.5 rounded-md">
          {extraction.extractionTime}
        </span>
      </div>

      {/* Main Grid: 5 cols Left Preview / 7 cols Right Extracted Tasks */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* LEFT COLUMN: Screenshot Inspection Workspace (5 cols) */}
        <section className="lg:col-span-5 flex flex-col gap-4 sticky lg:top-20">
          <div className="bg-white rounded-xl border border-slate-200 p-4 shadow-xs overflow-hidden">
            <div className="flex items-center justify-between pb-2.5 border-b border-slate-100 mb-3">
              <div className="flex items-center gap-1.5">
                <ImageIcon className="w-4 h-4 text-slate-500" />
                <span className="text-xs font-bold text-slate-800">
                  Source Ingestion Preview
                </span>
              </div>
              <div className="flex items-center gap-1">
                <button
                  type="button"
                  onClick={() => setActiveZoom(!activeZoom)}
                  className={`p-1.5 rounded hover:bg-slate-100 transition-colors ${
                    activeZoom ? 'text-[#4F46E5] bg-indigo-50' : 'text-slate-500'
                  }`}
                  title="Zoom Preview"
                >
                  <ZoomIn className="w-4 h-4" />
                </button>
                <button
                  type="button"
                  className="p-1.5 rounded hover:bg-slate-100 text-slate-500"
                  title="Recrop Area"
                >
                  <Crop className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Interactive Screenshot Preview Sandbox */}
            <div
              className={`relative w-full rounded-xl overflow-hidden border border-slate-200 bg-slate-100 select-none transition-all ${
                activeZoom ? 'h-80 scale-102' : 'h-64'
              }`}
            >
              {extraction.imageUrl ? (
                <div className="w-full h-full relative flex items-center justify-center bg-slate-900">
                  <img
                    src={extraction.imageUrl}
                    alt="Screenshot"
                    className="max-h-full max-w-full object-contain"
                  />
                  {/* Laser scan line overlay */}
                  <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-[#4F46E5] to-transparent shadow-[0_0_12px_#4F46E5] animate-pulse"></div>
                </div>
              ) : (
                /* Simulated chat screenshot mockup with OCR bounding boxes matching Image 6 */
                <div className="w-full h-full p-3.5 bg-[#f8fafc] flex flex-col gap-2 relative overflow-hidden text-xs leading-tight font-sans text-slate-800">
                  {/* Scanner overlay laser line */}
                  <div className="absolute left-0 right-0 top-1/3 h-0.5 bg-[#4F46E5] shadow-[0_0_10px_#4f46e5] opacity-75 z-20 pointer-events-none"></div>

                  <div className="flex items-center justify-between text-[11px] text-slate-500 pb-1 border-b border-slate-200">
                    <span className="font-semibold">
                      #eng-deployment Slack • Today 2:41 PM
                    </span>
                    <span>Thread (12)</span>
                  </div>

                  {/* Message 1 with Bounding Box Overlay */}
                  <div className="relative p-2 bg-white rounded-lg border border-indigo-300 shadow-xs ring-2 ring-indigo-500/20">
                    <span className="absolute -top-2 right-2 text-[9px] font-mono font-bold bg-[#4F46E5] text-white px-1.5 py-0.2 rounded">
                      TASK 1
                    </span>
                    <p className="font-medium text-slate-800 text-[11px]">
                      <span className="text-indigo-600 font-bold">@alex:</span>{' '}
                      Can you ship sprint release candidate v2.4 today? Check CI
                      passes and update deploy tag in Github.
                    </p>
                  </div>

                  {/* Message 2 with Bounding Box Overlay */}
                  <div className="relative p-2 bg-white rounded-lg border border-indigo-300 shadow-xs ring-2 ring-indigo-500/20">
                    <span className="absolute -top-2 right-2 text-[9px] font-mono font-bold bg-[#4F46E5] text-white px-1.5 py-0.2 rounded">
                      TASK 2
                    </span>
                    <p className="text-slate-700 text-[11px]">
                      <span className="text-amber-700 font-bold">@maria:</span>{' '}
                      Also schedule team retro with product lead by Oct 24.
                    </p>
                  </div>

                  {/* Message 3 with Bounding Box Overlay */}
                  <div className="relative p-2 bg-white rounded-lg border border-indigo-300 shadow-xs ring-2 ring-indigo-500/20">
                    <span className="absolute -top-2 right-2 text-[9px] font-mono font-bold bg-[#4F46E5] text-white px-1.5 py-0.2 rounded">
                      TASK 3
                    </span>
                    <p className="text-slate-600 text-[11px]">
                      Reminder: please submit expense report for travel
                      reimbursement (receipt #8839) before Nov 1st.
                    </p>
                  </div>
                </div>
              )}

              {/* Floating Pill Bottom of Preview */}
              <div className="absolute bottom-2 left-2 right-2 bg-white/95 backdrop-blur-xs px-2.5 py-1 rounded-md border border-slate-200 flex items-center justify-between text-slate-600 shadow-xs">
                <span className="font-mono text-[10px]">{extraction.resolution}</span>
                <span className="font-mono text-[10px] text-emerald-600 font-semibold flex items-center gap-1">
                  <CheckCircle2 className="w-3 h-3" />
                  OCR Conf. {extraction.confidence}%
                </span>
              </div>
            </div>

            {/* Metadata info cards */}
            <div className="grid grid-cols-2 gap-2.5 mt-3">
              <div className="p-2.5 rounded-lg bg-slate-50 border border-slate-200/70 flex flex-col">
                <span className="text-xs text-slate-500 font-medium">
                  Detected Format
                </span>
                <span className="text-xs font-bold text-slate-900 mt-0.5">
                  {extraction.detectedFormat}
                </span>
              </div>

              <div className="p-2.5 rounded-lg bg-slate-50 border border-slate-200/70 flex flex-col">
                <span className="text-xs text-slate-500 font-medium">
                  Parsing Model
                </span>
                <span className="text-xs font-bold text-[#4F46E5] mt-0.5">
                  {extraction.parsingModel}
                </span>
              </div>
            </div>
          </div>

          {/* Quick Guidance Note */}
          <div className="hidden sm:flex items-start gap-2.5 p-3.5 bg-indigo-50/50 rounded-xl border border-indigo-100 text-slate-600">
            <Info className="w-4 h-4 text-[#4F46E5] shrink-0 mt-0.5" />
            <p className="text-xs leading-relaxed">
              Verify task details before saving. You can edit inline titles,
              descriptions, priorities, categories, and due dates detected by the
              vision model.
            </p>
          </div>
        </section>

        {/* RIGHT COLUMN: Editable Task Breakdown (7 cols) */}
        <section className="lg:col-span-7 flex flex-col gap-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <h2
                className="text-base font-bold text-slate-900"
                style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}
              >
                Extracted Tasks
              </h2>
              <span className="px-2 py-0.5 rounded-full text-xs font-bold bg-[#4F46E5] text-white">
                {tasks.length} items
              </span>
            </div>

            <button
              type="button"
              onClick={toggleSelectAll}
              className="text-[#4F46E5] hover:text-indigo-800 text-xs font-semibold flex items-center gap-1 active:scale-95 transition-transform"
            >
              {allSelected ? (
                <>
                  <CheckSquare className="w-3.5 h-3.5" />
                  <span>Deselect All</span>
                </>
              ) : (
                <>
                  <Square className="w-3.5 h-3.5" />
                  <span>Select All</span>
                </>
              )}
            </button>
          </div>

          {/* Tasks List */}
          <div className="space-y-3.5">
            {tasks.map((task, idx) => {
              const isHigh = task.priority === 'High';
              const isMedium = task.priority === 'Medium';

              return (
                <article
                  key={task.id}
                  className={`bg-white rounded-xl border shadow-xs p-4 transition-all duration-150 flex flex-col gap-3 ${
                    task.checked
                      ? 'border-slate-200 hover:border-[#4F46E5]/60'
                      : 'opacity-60 bg-slate-50 border-slate-200'
                  }`}
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-start gap-2.5 flex-1 min-w-0">
                      <input
                        type="checkbox"
                        checked={task.checked}
                        onChange={() => toggleTaskCheck(task.id)}
                        className="mt-1 w-4 h-4 rounded border-slate-300 text-[#4F46E5] focus:ring-[#4F46E5] cursor-pointer"
                        aria-label={`Include Task ${idx + 1}`}
                      />
                      <div className="flex-1 min-w-0">
                        <input
                          type="text"
                          value={task.title}
                          onChange={(e) =>
                            updateTaskField(task.id, 'title', e.target.value)
                          }
                          className="w-full text-sm font-bold text-slate-900 bg-transparent border-0 border-b border-transparent focus:border-[#4F46E5] focus:ring-0 px-0 py-0.5 transition-colors"
                          placeholder="Task title"
                        />
                      </div>
                    </div>

                    <div className="flex items-center gap-1 shrink-0">
                      <button
                        type="button"
                        onClick={() => deleteTask(task.id)}
                        className="w-7 h-7 flex items-center justify-center rounded-lg text-slate-400 hover:bg-rose-50 hover:text-rose-600 transition-colors"
                        title="Delete Task"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>

                  {/* Description Field */}
                  <div className="pl-6.5">
                    <textarea
                      rows={2}
                      value={task.description}
                      onChange={(e) =>
                        updateTaskField(task.id, 'description', e.target.value)
                      }
                      className="w-full text-xs text-slate-600 bg-slate-50/70 hover:bg-slate-50 focus:bg-white rounded-lg border border-slate-200 focus:border-[#4F46E5] p-2 focus:ring-1 focus:ring-[#4F46E5] transition-colors resize-none"
                      placeholder="Supporting context or notes"
                    />
                  </div>

                  {/* Tags & Controls Row */}
                  <div className="pl-6.5 flex flex-wrap items-center gap-2 pt-1 border-t border-slate-100 text-xs">
                    {/* Priority Selector Pill */}
                    <div className="relative inline-block">
                      <select
                        value={task.priority}
                        onChange={(e) =>
                          updateTaskField(
                            task.id,
                            'priority',
                            e.target.value as Priority
                          )
                        }
                        className={`text-[11px] font-semibold rounded-full px-2.5 py-1 pr-6 border appearance-none cursor-pointer focus:outline-none transition-colors ${
                          isHigh
                            ? 'bg-[#FFF1F2] text-[#E11D48] border-[rgba(225,29,72,0.2)]'
                            : isMedium
                            ? 'bg-[#FFFBEB] text-[#D97706] border-[rgba(217,119,6,0.2)]'
                            : 'bg-[#F1F5F9] text-[#475569] border-[rgba(71,85,105,0.15)]'
                        }`}
                      >
                        <option value="High">● High Priority</option>
                        <option value="Medium">● Medium Priority</option>
                        <option value="Low">● Low Priority</option>
                      </select>
                      <ChevronDown className="w-3 h-3 text-slate-500 absolute right-2 top-2 pointer-events-none" />
                    </div>

                    {/* Category Selector Pill */}
                    <div className="relative inline-block">
                      <select
                        value={task.category}
                        onChange={(e) =>
                          updateTaskField(task.id, 'category', e.target.value)
                        }
                        className="text-[11px] font-semibold rounded-full px-2.5 py-1 pr-6 border border-slate-200 bg-slate-50 text-slate-700 appearance-none cursor-pointer focus:outline-none hover:bg-slate-100 transition-colors"
                      >
                        <option value="Engineering">Engineering</option>
                        <option value="Management">Management</option>
                        <option value="Finance">Finance</option>
                        <option value="Design">Design</option>
                        <option value="Support">Support</option>
                        <option value="DevOps">DevOps</option>
                        <option value="Work">Work</option>
                      </select>
                      <ChevronDown className="w-3 h-3 text-slate-500 absolute right-2 top-2 pointer-events-none" />
                    </div>

                    {/* Due Date Input Pill */}
                    <div className="relative inline-flex items-center">
                      <input
                        type="text"
                        value={task.dueDate}
                        onChange={(e) =>
                          updateTaskField(task.id, 'dueDate', e.target.value)
                        }
                        className="text-[11px] font-semibold rounded-full px-2.5 py-1 bg-slate-50 text-slate-700 border border-slate-200 hover:bg-slate-100 focus:outline-none focus:border-[#4F46E5] transition-colors w-32"
                        placeholder="Due Date"
                      />
                    </div>

                    <span className="ml-auto font-mono text-[11px] text-emerald-600 font-semibold">
                      {task.matchConfidence}% match
                    </span>
                  </div>
                </article>
              );
            })}
          </div>

          {/* Add Another Task Button matching Image 6 */}
          <button
            type="button"
            onClick={addAnotherTask}
            className="w-full py-3 border-2 border-dashed border-slate-200 hover:border-[#4F46E5] rounded-xl bg-slate-50/50 hover:bg-indigo-50/20 text-slate-600 hover:text-[#4F46E5] transition-all flex items-center justify-center gap-2 group font-semibold text-xs"
          >
            <PlusCircle className="w-4 h-4 group-hover:scale-110 transition-transform text-[#4F46E5]" />
            <span>Add Another Task</span>
          </button>
        </section>
      </div>

      {/* Sticky Bottom Action Bar matching Image 6 */}
      <div className="fixed bottom-14 md:bottom-0 left-0 right-0 bg-white/95 backdrop-blur-md border-t border-slate-200/80 z-30 shadow-lg py-3 px-4 md:px-6">
        <div className="max-w-7xl mx-auto flex items-center justify-between gap-3">
          <button
            type="button"
            onClick={onDiscard}
            className="px-4 py-2.5 rounded-lg border border-slate-200 text-xs font-semibold text-slate-600 hover:bg-rose-50 hover:text-rose-600 hover:border-rose-200 transition-all active:scale-95"
          >
            Discard All
          </button>

          <div className="flex items-center gap-3">
            <span className="hidden sm:inline font-mono text-xs text-slate-500">
              SQLite Synced
            </span>
            <button
              type="button"
              onClick={handleSave}
              disabled={selectedCount === 0}
              className="px-5 py-2.5 rounded-lg bg-[#4F46E5] hover:bg-[#4338CA] text-white text-xs font-bold shadow-sm shadow-indigo-500/25 flex items-center gap-2 active:scale-95 transition-all disabled:opacity-50"
            >
              <Check className="w-4 h-4" />
              <span>Save All to Tasks ({selectedCount})</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
