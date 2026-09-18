import React from 'react';
import { Clock, Bell, X, Check } from 'lucide-react';

interface TimePickerProps {
  value: string; // "HH:MM" in 24h format, e.g. "09:00", "17:00", or ""
  onChange: (time: string) => void;
  label?: string;
  id?: string;
}

export const formatTimeDisplay = (timeStr?: string): string => {
  if (!timeStr) return '';
  const parts = timeStr.split(':');
  if (parts.length < 2) return timeStr;
  const hours = parseInt(parts[0], 10);
  const minutes = parts[1];
  if (isNaN(hours)) return timeStr;

  const ampm = hours >= 12 ? 'PM' : 'AM';
  const displayHours = hours % 12 === 0 ? 12 : hours % 12;
  return `${displayHours}:${minutes} ${ampm}`;
};

const TIME_PRESETS = [
  { label: '9:00 AM', value: '09:00', title: 'Morning' },
  { label: '12:00 PM', value: '12:00', title: 'Midday' },
  { label: '2:00 PM', value: '14:00', title: 'Afternoon' },
  { label: '5:00 PM', value: '17:00', title: 'End of Day' },
  { label: '8:00 PM', value: '20:00', title: 'Evening' },
];

export const TimePicker: React.FC<TimePickerProps> = ({
  value,
  onChange,
  label = 'Reminder Time',
  id = 'task-due-time-input',
}) => {
  const isTimeSet = Boolean(value && value.trim() !== '');

  return (
    <div className="space-y-2">
      {/* Header Label & Formatted Time Preview */}
      <div className="flex items-center justify-between">
        <label
          htmlFor={id}
          className="flex items-center gap-1.5 text-xs font-semibold text-slate-600"
        >
          <Clock className="w-3.5 h-3.5 text-indigo-600" />
          <span>{label}</span>
        </label>
        {isTimeSet && (
          <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded-full border border-indigo-100/80">
            <Bell className="w-3 h-3 text-indigo-600 animate-pulse" />
            <span>{formatTimeDisplay(value)}</span>
          </span>
        )}
      </div>

      {/* Main Time Input Field */}
      <div className="relative flex items-center">
        <input
          id={id}
          type="time"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="w-full bg-white border border-slate-200 rounded-lg pl-3 pr-8 py-2 text-xs text-slate-800 font-medium focus:border-[#4F46E5] focus:ring-2 focus:ring-indigo-500/15 focus:outline-none transition-all cursor-pointer"
        />

        {isTimeSet && (
          <button
            type="button"
            onClick={() => onChange('')}
            className="absolute right-2 text-slate-400 hover:text-slate-600 p-1 rounded hover:bg-slate-100 transition-colors"
            title="Clear reminder time"
            aria-label="Clear time"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        )}
      </div>

      {/* Quick Time Preset Buttons */}
      <div className="pt-0.5">
        <div className="text-[10px] uppercase font-mono tracking-wider text-slate-400 mb-1">
          Quick Reminder Times
        </div>
        <div className="flex flex-wrap gap-1.5">
          {TIME_PRESETS.map((preset) => {
            const isSelected = value === preset.value;
            return (
              <button
                key={preset.value}
                type="button"
                onClick={() => onChange(preset.value)}
                className={`text-[11px] px-2 py-1 rounded-md transition-all flex items-center gap-1 border font-medium ${
                  isSelected
                    ? 'bg-[#4F46E5] text-white border-[#4F46E5] shadow-xs'
                    : 'bg-slate-50 hover:bg-slate-100 text-slate-600 border-slate-200'
                }`}
                title={preset.title}
              >
                {isSelected && <Check className="w-3 h-3" />}
                <span>{preset.label}</span>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};
