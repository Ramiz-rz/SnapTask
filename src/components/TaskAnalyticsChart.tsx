import React, { useState, useMemo } from 'react';
import { Task, Priority } from '../types';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  PieChart,
  Pie,
  Cell,
} from 'recharts';
import {
  BarChart3,
  PieChart as PieIcon,
  Filter,
  Layers,
  AlertTriangle,
  Flame,
  CheckCircle2,
  TrendingUp,
} from 'lucide-react';

interface TaskAnalyticsChartProps {
  tasks: Task[];
  onCategorySelect?: (category: string) => void;
}

const PRIORITY_COLORS: Record<Priority, string> = {
  High: '#E11D48', // Rose-600
  Medium: '#F59E0B', // Amber-500
  Low: '#6366F1', // Indigo-500
};

const PRIORITY_BG: Record<Priority, string> = {
  High: 'bg-rose-50 text-rose-700 border-rose-200',
  Medium: 'bg-amber-50 text-amber-700 border-amber-200',
  Low: 'bg-indigo-50 text-indigo-700 border-indigo-200',
};

type ViewMode = 'stacked-bar' | 'donut' | 'grouped-bar';
type ScopeFilter = 'all' | 'active' | 'completed';

export const TaskAnalyticsChart: React.FC<TaskAnalyticsChartProps> = ({
  tasks,
  onCategorySelect,
}) => {
  const [viewMode, setViewMode] = useState<ViewMode>('stacked-bar');
  const [scopeFilter, setScopeFilter] = useState<ScopeFilter>('active');
  const [activeCategory, setActiveCategory] = useState<string | null>(null);

  // Filter tasks based on scope
  const filteredTasks = useMemo(() => {
    if (scopeFilter === 'active') return tasks.filter((t) => !t.isCompleted);
    if (scopeFilter === 'completed') return tasks.filter((t) => t.isCompleted);
    return tasks;
  }, [tasks, scopeFilter]);

  // Aggregate by Category x Priority for Bar Charts
  const categoryData = useMemo(() => {
    const map = new Map<
      string,
      { category: string; High: number; Medium: number; Low: number; total: number }
    >();

    filteredTasks.forEach((task) => {
      const cat = task.category?.trim() || 'General';
      if (!map.has(cat)) {
        map.set(cat, { category: cat, High: 0, Medium: 0, Low: 0, total: 0 });
      }
      const entry = map.get(cat)!;
      const prio = task.priority as Priority;
      if (prio === 'High' || prio === 'Medium' || prio === 'Low') {
        entry[prio] += 1;
      } else {
        entry.Medium += 1;
      }
      entry.total += 1;
    });

    return Array.from(map.values()).sort((a, b) => b.total - a.total);
  }, [filteredTasks]);

  // Aggregate by Priority for Donut Chart
  const priorityData = useMemo(() => {
    const counts: Record<Priority, number> = { High: 0, Medium: 0, Low: 0 };
    filteredTasks.forEach((task) => {
      const prio = (['High', 'Medium', 'Low'].includes(task.priority)
        ? task.priority
        : 'Medium') as Priority;
      counts[prio] += 1;
    });

    const total = filteredTasks.length;
    return (['High', 'Medium', 'Low'] as Priority[]).map((prio) => ({
      name: prio,
      value: counts[prio],
      percentage: total > 0 ? Math.round((counts[prio] / total) * 100) : 0,
      color: PRIORITY_COLORS[prio],
    }));
  }, [filteredTasks]);

  // Key metrics
  const topCategory = categoryData.length > 0 ? categoryData[0] : null;
  const highPriorityCount = priorityData.find((p) => p.name === 'High')?.value || 0;
  const mediumPriorityCount = priorityData.find((p) => p.name === 'Medium')?.value || 0;
  const lowPriorityCount = priorityData.find((p) => p.name === 'Low')?.value || 0;

  // Custom Tooltip for Bar Chart
  const CustomBarTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      const totalInCat = payload.reduce(
        (sum: number, entry: any) => sum + (Number(entry.value) || 0),
        0
      );

      return (
        <div className="bg-white/95 backdrop-blur-md p-3 rounded-xl border border-slate-200 shadow-xl text-xs space-y-2 min-w-[170px]">
          <div className="flex items-center justify-between border-b border-slate-100 pb-1.5">
            <span className="font-bold text-slate-900">{label}</span>
            <span className="font-mono text-slate-500 font-semibold">{totalInCat} tasks</span>
          </div>
          <div className="space-y-1">
            {payload.map((entry: any, index: number) => {
              const count = Number(entry.value) || 0;
              const pct = totalInCat > 0 ? Math.round((count / totalInCat) * 100) : 0;
              return (
                <div key={`item-${index}`} className="flex items-center justify-between gap-3">
                  <div className="flex items-center gap-1.5">
                    <span
                      className="w-2 h-2 rounded-full"
                      style={{ backgroundColor: entry.color }}
                    />
                    <span className="text-slate-600 font-medium">{entry.name}</span>
                  </div>
                  <div className="font-mono text-slate-800">
                    <span className="font-semibold">{count}</span>
                    <span className="text-slate-400 text-[10px] ml-1">({pct}%)</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      );
    }
    return null;
  };

  // Custom Tooltip for Donut Chart
  const CustomPieTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div className="bg-white/95 backdrop-blur-md p-2.5 rounded-xl border border-slate-200 shadow-xl text-xs min-w-[140px]">
          <div className="flex items-center gap-1.5 mb-1">
            <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: data.color }} />
            <span className="font-bold text-slate-900">{data.name} Priority</span>
          </div>
          <div className="flex items-baseline justify-between font-mono pt-1 border-t border-slate-100">
            <span className="text-slate-600">{data.value} tasks</span>
            <span className="font-bold text-slate-900">{data.percentage}%</span>
          </div>
        </div>
      );
    }
    return null;
  };

  return (
    <div
      id="task-analytics-card"
      className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs flex flex-col gap-4"
    >
      {/* Header with Title and Mode Switchers */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-100">
        <div>
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-[#4F46E5]"></span>
            <h2
              className="text-base font-bold text-slate-900"
              style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}
            >
              Task Breakdown & Distribution
            </h2>
            <span className="text-[11px] font-mono px-2 py-0.5 rounded bg-indigo-50 text-[#4F46E5] font-semibold">
              Category × Priority
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-0.5">
            Cross-sectional workload breakdown across categories and urgency levels
          </p>
        </div>

        {/* Controls Toolbar */}
        <div className="flex flex-wrap items-center gap-2">
          {/* Scope Filter Pill Toggle */}
          <div className="flex items-center bg-slate-100/80 p-0.5 rounded-lg text-xs font-semibold text-slate-600">
            <button
              type="button"
              onClick={() => setScopeFilter('active')}
              className={`px-2.5 py-1 rounded-md transition-all ${
                scopeFilter === 'active'
                  ? 'bg-white text-slate-900 shadow-xs'
                  : 'hover:text-slate-900'
              }`}
            >
              Active ({tasks.filter((t) => !t.isCompleted).length})
            </button>
            <button
              type="button"
              onClick={() => setScopeFilter('all')}
              className={`px-2.5 py-1 rounded-md transition-all ${
                scopeFilter === 'all'
                  ? 'bg-white text-slate-900 shadow-xs'
                  : 'hover:text-slate-900'
              }`}
            >
              All ({tasks.length})
            </button>
          </div>

          {/* View Mode Toggle */}
          <div className="flex items-center bg-slate-100/80 p-0.5 rounded-lg text-xs font-semibold text-slate-600">
            <button
              type="button"
              onClick={() => setViewMode('stacked-bar')}
              title="Stacked Bar Breakdown"
              className={`flex items-center gap-1 px-2.5 py-1 rounded-md transition-all ${
                viewMode === 'stacked-bar'
                  ? 'bg-white text-[#4F46E5] shadow-xs'
                  : 'hover:text-slate-900'
              }`}
            >
              <BarChart3 className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Stacked</span>
            </button>
            <button
              type="button"
              onClick={() => setViewMode('grouped-bar')}
              title="Grouped Bar Breakdown"
              className={`flex items-center gap-1 px-2.5 py-1 rounded-md transition-all ${
                viewMode === 'grouped-bar'
                  ? 'bg-white text-[#4F46E5] shadow-xs'
                  : 'hover:text-slate-900'
              }`}
            >
              <Layers className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Grouped</span>
            </button>
            <button
              type="button"
              onClick={() => setViewMode('donut')}
              title="Priority Donut Distribution"
              className={`flex items-center gap-1 px-2.5 py-1 rounded-md transition-all ${
                viewMode === 'donut'
                  ? 'bg-white text-[#4F46E5] shadow-xs'
                  : 'hover:text-slate-900'
              }`}
            >
              <PieIcon className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Split</span>
            </button>
          </div>
        </div>
      </div>

      {/* Main Visualization Container */}
      {filteredTasks.length === 0 ? (
        <div className="h-64 flex flex-col items-center justify-center text-center p-6 bg-slate-50/50 rounded-xl border border-dashed border-slate-200">
          <div className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center mb-2 text-slate-400">
            <BarChart3 className="w-5 h-5" />
          </div>
          <p className="text-sm font-semibold text-slate-700">No tasks in this view</p>
          <p className="text-xs text-slate-500 max-w-xs mt-0.5">
            Switch filter to &ldquo;All&rdquo; or capture a new screenshot to populate the analytics
            breakdown.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-center">
          {/* Chart Display Area (8 cols on lg) */}
          <div className="lg:col-span-8 w-full min-h-[260px] h-[260px]">
            {viewMode === 'donut' ? (
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Tooltip content={<CustomPieTooltip />} />
                  <Legend
                    verticalAlign="bottom"
                    height={36}
                    formatter={(val) => (
                      <span className="text-xs font-semibold text-slate-700">{val} Priority</span>
                    )}
                  />
                  <Pie
                    data={priorityData}
                    cx="50%"
                    cy="45%"
                    innerRadius={55}
                    outerRadius={85}
                    paddingAngle={3}
                    dataKey="value"
                    animationDuration={600}
                  >
                    {priorityData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} stroke="#ffffff" strokeWidth={2} />
                    ))}
                  </Pie>
                </PieChart>
              </ResponsiveContainer>
            ) : (
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={categoryData}
                  margin={{ top: 10, right: 15, left: -20, bottom: 5 }}
                >
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#F1F5F9" />
                  <XAxis
                    dataKey="category"
                    tickLine={false}
                    axisLine={{ stroke: '#E2E8F0' }}
                    tick={{ fill: '#64748B', fontSize: 11, fontWeight: 500 }}
                  />
                  <YAxis
                    allowDecimals={false}
                    tickLine={false}
                    axisLine={false}
                    tick={{ fill: '#94A3B8', fontSize: 11 }}
                  />
                  <Tooltip content={<CustomBarTooltip />} />
                  <Legend
                    verticalAlign="top"
                    align="right"
                    iconType="circle"
                    iconSize={8}
                    wrapperStyle={{ paddingBottom: 8 }}
                    formatter={(val) => (
                      <span className="text-xs font-semibold text-slate-600">{val} Priority</span>
                    )}
                  />
                  <Bar
                    dataKey="High"
                    name="High"
                    stackId={viewMode === 'stacked-bar' ? 'priority' : undefined}
                    fill={PRIORITY_COLORS.High}
                    radius={viewMode === 'stacked-bar' ? [0, 0, 0, 0] : [4, 4, 0, 0]}
                    animationDuration={500}
                  />
                  <Bar
                    dataKey="Medium"
                    name="Medium"
                    stackId={viewMode === 'stacked-bar' ? 'priority' : undefined}
                    fill={PRIORITY_COLORS.Medium}
                    radius={viewMode === 'stacked-bar' ? [0, 0, 0, 0] : [4, 4, 0, 0]}
                    animationDuration={500}
                  />
                  <Bar
                    dataKey="Low"
                    name="Low"
                    stackId={viewMode === 'stacked-bar' ? 'priority' : undefined}
                    fill={PRIORITY_COLORS.Low}
                    radius={viewMode === 'stacked-bar' ? [4, 4, 0, 0] : [4, 4, 0, 0]}
                    animationDuration={500}
                  />
                </BarChart>
              </ResponsiveContainer>
            )}
          </div>

          {/* Breakdown Insights / Summary Column (4 cols on lg) */}
          <div className="lg:col-span-4 flex flex-col gap-2.5 bg-[#FAF8FF] p-3.5 rounded-xl border border-slate-200">
            <span className="text-[11px] font-mono font-semibold uppercase tracking-wider text-slate-500">
              Workload Insights
            </span>

            {/* Top Category Card */}
            {topCategory && (
              <div className="bg-white p-2.5 rounded-lg border border-slate-200 shadow-xs">
                <div className="flex items-center justify-between text-xs mb-1">
                  <span className="text-slate-500 font-medium">Largest Category</span>
                  <span className="font-mono font-bold text-slate-900">{topCategory.total} tasks</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm font-bold text-slate-900">{topCategory.category}</span>
                  <span className="text-[11px] font-mono text-indigo-600 font-semibold bg-indigo-50 px-2 py-0.5 rounded">
                    {Math.round((topCategory.total / filteredTasks.length) * 100)}% of load
                  </span>
                </div>
              </div>
            )}

            {/* Priority Distribution Chips */}
            <div className="space-y-1.5 pt-1">
              <div className="flex items-center justify-between p-2 rounded-lg bg-white border border-slate-200 text-xs">
                <div className="flex items-center gap-1.5">
                  <Flame className="w-3.5 h-3.5 text-rose-600" />
                  <span className="font-medium text-slate-700">High Priority</span>
                </div>
                <span className="font-mono font-bold text-rose-600 bg-rose-50 px-2 py-0.5 rounded border border-rose-100">
                  {highPriorityCount} items
                </span>
              </div>

              <div className="flex items-center justify-between p-2 rounded-lg bg-white border border-slate-200 text-xs">
                <div className="flex items-center gap-1.5">
                  <AlertTriangle className="w-3.5 h-3.5 text-amber-500" />
                  <span className="font-medium text-slate-700">Medium Priority</span>
                </div>
                <span className="font-mono font-bold text-amber-700 bg-amber-50 px-2 py-0.5 rounded border border-amber-100">
                  {mediumPriorityCount} items
                </span>
              </div>

              <div className="flex items-center justify-between p-2 rounded-lg bg-white border border-slate-200 text-xs">
                <div className="flex items-center gap-1.5">
                  <TrendingUp className="w-3.5 h-3.5 text-indigo-500" />
                  <span className="font-medium text-slate-700">Low Priority</span>
                </div>
                <span className="font-mono font-bold text-indigo-700 bg-indigo-50 px-2 py-0.5 rounded border border-indigo-100">
                  {lowPriorityCount} items
                </span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Category Quick Badges Footer */}
      {categoryData.length > 0 && (
        <div className="flex flex-wrap items-center gap-1.5 pt-2 border-t border-slate-100 text-xs">
          <span className="text-[11px] font-mono text-slate-500 mr-1">Categories:</span>
          {categoryData.map((item) => (
            <button
              key={item.category}
              type="button"
              onClick={() => onCategorySelect?.(item.category)}
              className="px-2.5 py-1 rounded-lg bg-slate-50 hover:bg-indigo-50 border border-slate-200 hover:border-indigo-300 text-slate-700 hover:text-[#4F46E5] text-xs font-medium transition-colors flex items-center gap-1.5"
            >
              <span>{item.category}</span>
              <span className="font-mono text-[10px] bg-white px-1.5 py-0.2 rounded border border-slate-200 font-semibold text-slate-600">
                {item.total}
              </span>
            </button>
          ))}
        </div>
      )}
    </div>
  );
};
