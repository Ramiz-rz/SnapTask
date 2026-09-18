import React, { useState, useEffect } from 'react';
import {
  Shield,
  Sliders,
  Cpu,
  Download,
  RotateCcw,
  CheckCircle2,
  Lock,
  Slack,
  Mail,
  Calendar,
  Layers,
  Database,
  Bell,
  Volume2,
  VolumeX,
  Sparkles,
  FileSpreadsheet,
  Sun,
  Moon,
} from 'lucide-react';
import { Task } from '../types';
import { getNotificationPermission, requestNotificationPermission } from '../utils/notifications';
import { downloadTasksCSV } from '../utils/exportUtils';

interface SettingsScreenProps {
  tasks: Task[];
  onResetData: () => void;
  onClearCompleted: () => void;
  theme?: 'light' | 'dark';
  onToggleTheme?: (theme: 'light' | 'dark') => void;
  remindersEnabled?: boolean;
  onToggleReminders?: (enabled: boolean) => void;
  reminderSoundEnabled?: boolean;
  onToggleReminderSound?: (enabled: boolean) => void;
  onTestReminder?: () => void;
  onShowToast?: (msg: string) => void;
}

export const SettingsScreen: React.FC<SettingsScreenProps> = ({
  tasks,
  onResetData,
  onClearCompleted,
  theme = 'light',
  onToggleTheme,
  remindersEnabled = true,
  onToggleReminders,
  reminderSoundEnabled = true,
  onToggleReminderSound,
  onTestReminder,
  onShowToast,
}) => {
  const [zeroRetention, setZeroRetention] = useState(true);
  const [autoPriority, setAutoPriority] = useState(true);
  const [selectedModel, setSelectedModel] = useState('gemini-3.8-flash');
  const [confidenceThreshold, setConfidenceThreshold] = useState(90);
  const [copiedNotification, setCopiedNotification] = useState(false);
  const [browserPermission, setBrowserPermission] = useState<string>('default');

  useEffect(() => {
    setBrowserPermission(getNotificationPermission());
  }, []);

  const handleRequestPermission = async () => {
    const res = await requestNotificationPermission();
    setBrowserPermission(res);
  };

  const [lastExportedFile, setLastExportedFile] = useState<string | null>(null);

  const handleExportJSON = () => {
    try {
      const dataStr = JSON.stringify(tasks, null, 2);
      const blob = new Blob([dataStr], { type: 'application/json;charset=utf-8;' });
      const url = URL.createObjectURL(blob);
      const timestamp = new Date().toISOString().slice(0, 10);
      const filename = `snaptask-backup-${timestamp}-${Date.now()}.json`;

      const downloadAnchor = document.createElement('a');
      downloadAnchor.href = url;
      downloadAnchor.setAttribute('download', filename);
      downloadAnchor.style.display = 'none';
      document.body.appendChild(downloadAnchor);
      downloadAnchor.click();
      document.body.removeChild(downloadAnchor);

      setTimeout(() => URL.revokeObjectURL(url), 1000);
      setLastExportedFile(filename);
      onShowToast?.(`Exported ${tasks.length} tasks as JSON backup`);
    } catch (err) {
      console.error('JSON export failed:', err);
    }
  };

  const handleExportCSV = () => {
    try {
      const filename = downloadTasksCSV(tasks);
      setLastExportedFile(filename);
      onShowToast?.(`Exported ${tasks.length} tasks as CSV backup (${filename})`);
    } catch (err) {
      console.error('CSV export failed:', err);
    }
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto pb-12 animate-in fade-in duration-200">
      {/* Header */}
      <div>
        <h1
          className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-white tracking-tight"
          style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}
        >
          Settings & Vision Preferences
        </h1>
        <p className="text-slate-500 dark:text-slate-400 text-xs sm:text-sm mt-1">
          Configure Gemini Vision models, appearance theme, task reminders, and backup export.
        </p>
      </div>

      {/* Appearance & Interface Theme Toggle */}
      <section
        id="appearance-theme-section"
        className="bg-white dark:bg-[#131B2E] border border-slate-200 dark:border-slate-800 rounded-xl p-5 shadow-xs space-y-4 transition-colors"
      >
        <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
          <div className="flex items-center gap-2">
            <div className="p-1.5 bg-indigo-50 dark:bg-indigo-950/60 text-[#4F46E5] dark:text-indigo-400 rounded-lg">
              {theme === 'dark' ? <Moon className="w-5 h-5" /> : <Sun className="w-5 h-5" />}
            </div>
            <div>
              <h2
                className="text-base font-bold text-slate-900 dark:text-white"
                style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}
              >
                Appearance & Theme
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Customize interface styling between light and high-contrast dark mode
              </p>
            </div>
          </div>
          <span className="px-2.5 py-0.5 rounded-full text-[11px] font-mono font-semibold bg-indigo-50 dark:bg-indigo-950/60 text-[#4F46E5] dark:text-indigo-300 border border-indigo-100 dark:border-indigo-900/60 capitalize">
            {theme} Mode Active
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
          {/* Light Mode Option */}
          <button
            id="theme-light-btn"
            type="button"
            onClick={() => onToggleTheme?.('light')}
            className={`flex items-center justify-between p-4 rounded-xl border text-left transition-all ${
              theme === 'light'
                ? 'border-[#4F46E5] bg-indigo-50/50 dark:bg-indigo-950/30 ring-2 ring-indigo-500/20'
                : 'border-slate-200 dark:border-slate-800 bg-slate-50/70 dark:bg-slate-900/40 hover:border-slate-300 dark:hover:border-slate-700'
            }`}
          >
            <div className="flex items-center gap-3">
              <div
                className={`w-10 h-10 rounded-xl flex items-center justify-center border ${
                  theme === 'light'
                    ? 'bg-white text-amber-500 border-amber-200 shadow-xs'
                    : 'bg-white dark:bg-slate-800 text-slate-400 border-slate-200 dark:border-slate-700'
                }`}
              >
                <Sun className="w-5 h-5 text-amber-500" />
              </div>
              <div>
                <span className="text-sm font-bold text-slate-900 dark:text-white block">
                  Light Theme
                </span>
                <span className="text-xs text-slate-500 dark:text-slate-400">
                  Crisp off-white canvas with deep indigo accents
                </span>
              </div>
            </div>
            {theme === 'light' && (
              <span className="w-5 h-5 rounded-full bg-[#4F46E5] text-white flex items-center justify-center shrink-0">
                <CheckCircle2 className="w-3.5 h-3.5" />
              </span>
            )}
          </button>

          {/* Dark Mode Option */}
          <button
            id="theme-dark-btn"
            type="button"
            onClick={() => onToggleTheme?.('dark')}
            className={`flex items-center justify-between p-4 rounded-xl border text-left transition-all ${
              theme === 'dark'
                ? 'border-[#4F46E5] bg-indigo-950/40 ring-2 ring-indigo-500/20'
                : 'border-slate-200 dark:border-slate-800 bg-slate-50/70 dark:bg-slate-900/40 hover:border-slate-300 dark:hover:border-slate-700'
            }`}
          >
            <div className="flex items-center gap-3">
              <div
                className={`w-10 h-10 rounded-xl flex items-center justify-center border ${
                  theme === 'dark'
                    ? 'bg-slate-900 text-indigo-400 border-indigo-900/60 shadow-xs'
                    : 'bg-white dark:bg-slate-800 text-slate-400 border-slate-200 dark:border-slate-700'
                }`}
              >
                <Moon className="w-5 h-5 text-indigo-400" />
              </div>
              <div>
                <span className="text-sm font-bold text-slate-900 dark:text-white block">
                  Dark Theme
                </span>
                <span className="text-xs text-slate-500 dark:text-slate-400">
                  Refined dark navy slate for reduced eye fatigue
                </span>
              </div>
            </div>
            {theme === 'dark' && (
              <span className="w-5 h-5 rounded-full bg-[#4F46E5] text-white flex items-center justify-center shrink-0">
                <CheckCircle2 className="w-3.5 h-3.5" />
              </span>
            )}
          </button>
        </div>
      </section>

      {/* Model & AI Vision Engine */}
      <section className="bg-white dark:bg-[#131B2E] border border-slate-200 dark:border-slate-800 rounded-xl p-5 shadow-xs space-y-4 transition-colors">
        <div className="flex items-center gap-2 pb-3 border-b border-slate-100 dark:border-slate-800">
          <Cpu className="w-5 h-5 text-[#4F46E5]" />
          <h2
            className="text-base font-bold text-slate-900 dark:text-white"
            style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}
          >
            Vision OCR & Model Engine
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
              Active Vision Model
            </label>
            <select
              value={selectedModel}
              onChange={(e) => setSelectedModel(e.target.value)}
              className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg px-3 py-2 text-xs font-medium text-slate-900 dark:text-slate-100 focus:outline-none focus:border-[#4F46E5]"
            >
              <option value="gemini-3.8-flash">
                Gemini 3.8 Flash (Multimodal Vision - Recommended)
              </option>
              <option value="gemini-3.1-pro-preview">
                Gemini 3.1 Pro (Complex Document Reasoning)
              </option>
              <option value="local-snapvision">
                SnapVision v2 (Local Heuristic Engine)
              </option>
            </select>
            <p className="text-[11px] text-slate-500 mt-1">
              Used to segment chat threads, extract action items, and detect due dates.
            </p>
          </div>

          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="text-xs font-semibold text-slate-700">
                Minimum Confidence Threshold
              </label>
              <span className="text-xs font-mono font-bold text-[#4F46E5]">
                {confidenceThreshold}%
              </span>
            </div>
            <input
              type="range"
              min="70"
              max="99"
              value={confidenceThreshold}
              onChange={(e) => setConfidenceThreshold(Number(e.target.value))}
              className="w-full h-1.5 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-[#4F46E5]"
            />
            <p className="text-[11px] text-slate-500 mt-1">
              Screenshots with lower OCR confidence will flag items for manual review.
            </p>
          </div>
        </div>
      </section>

      {/* Privacy & Zero-Retention Security */}
      <section className="bg-white dark:bg-[#131B2E] border border-slate-200 dark:border-slate-800 rounded-xl p-5 shadow-xs space-y-4 transition-colors">
        <div className="flex items-center gap-2 pb-3 border-b border-slate-100 dark:border-slate-800">
          <Shield className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
          <h2
            className="text-base font-bold text-slate-900 dark:text-white"
            style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}
          >
            Zero-Retention Privacy Protection
          </h2>
        </div>

        <div className="space-y-3">
          <div className="flex items-center justify-between p-3 rounded-lg bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800">
            <div className="space-y-0.5">
              <div className="flex items-center gap-2">
                <Lock className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                <span className="text-xs font-bold text-slate-800 dark:text-slate-200">
                  Zero-Retention Processing
                </span>
              </div>
              <p className="text-[11px] text-slate-500 dark:text-slate-400">
                Uploaded images are parsed in volatile memory and immediately deleted after extraction.
              </p>
            </div>
            <button
              type="button"
              onClick={() => setZeroRetention(!zeroRetention)}
              className={`w-11 h-6 flex items-center rounded-full p-1 transition-colors duration-200 ${
                zeroRetention ? 'bg-emerald-600' : 'bg-slate-300 dark:bg-slate-700'
              }`}
            >
              <div
                className={`bg-white w-4 h-4 rounded-full shadow-md transform transition-transform duration-200 ${
                  zeroRetention ? 'translate-x-5' : 'translate-x-0'
                }`}
              />
            </button>
          </div>

          <div className="flex items-center justify-between p-3 rounded-lg bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800">
            <div className="space-y-0.5">
              <div className="flex items-center gap-2">
                <Sliders className="w-4 h-4 text-[#4F46E5] dark:text-indigo-400" />
                <span className="text-xs font-bold text-slate-800 dark:text-slate-200">
                  Natural Language Auto-Prioritization
                </span>
              </div>
              <p className="text-[11px] text-slate-500 dark:text-slate-400">
                Infers priority flags (High/Medium/Low) based on contextual deadline language (e.g. "asap", "today", "yesterday").
              </p>
            </div>
            <button
              type="button"
              onClick={() => setAutoPriority(!autoPriority)}
              className={`w-11 h-6 flex items-center rounded-full p-1 transition-colors duration-200 ${
                autoPriority ? 'bg-[#4F46E5]' : 'bg-slate-300 dark:bg-slate-700'
              }`}
            >
              <div
                className={`bg-white w-4 h-4 rounded-full shadow-md transform transition-transform duration-200 ${
                  autoPriority ? 'translate-x-5' : 'translate-x-0'
                }`}
              />
            </button>
          </div>
        </div>
      </section>

      {/* Task Reminders & Browser Notifications */}
      <section
        id="reminders-settings-section"
        className="bg-white dark:bg-[#131B2E] border border-slate-200 dark:border-slate-800 rounded-xl p-5 shadow-xs space-y-4 transition-colors"
      >
        <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
          <div className="flex items-center gap-2">
            <Bell className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
            <h2
              className="text-base font-bold text-slate-900 dark:text-white"
              style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}
            >
              Due Time Reminders & Notifications
            </h2>
          </div>
          <span
            className={`px-2 py-0.5 rounded-full text-[11px] font-mono font-semibold border ${
              remindersEnabled
                ? 'bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-400 border-emerald-200 dark:border-emerald-800'
                : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 border-slate-200 dark:border-slate-700'
            }`}
          >
            {remindersEnabled ? 'Active' : 'Disabled'}
          </span>
        </div>

        <div className="space-y-3">
          {/* Main Toggle */}
          <div className="flex items-center justify-between p-3.5 rounded-lg bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800">
            <div className="space-y-0.5">
              <div className="flex items-center gap-2">
                <Bell className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
                <span className="text-xs font-bold text-slate-800 dark:text-slate-200">
                  Enable Due Time Reminders
                </span>
              </div>
              <p className="text-[11px] text-slate-500 dark:text-slate-400">
                Triggers an in-app visual alert and browser notification whenever current time matches a task&apos;s scheduled reminder time.
              </p>
            </div>
            <button
              id="toggle-reminders-button"
              type="button"
              onClick={() => onToggleReminders && onToggleReminders(!remindersEnabled)}
              className={`w-11 h-6 flex items-center rounded-full p-1 transition-colors duration-200 shrink-0 ml-4 ${
                remindersEnabled ? 'bg-[#4F46E5]' : 'bg-slate-300 dark:bg-slate-700'
              }`}
              title={remindersEnabled ? 'Disable reminders' : 'Enable reminders'}
            >
              <div
                className={`bg-white w-4 h-4 rounded-full shadow-md transform transition-transform duration-200 ${
                  remindersEnabled ? 'translate-x-5' : 'translate-x-0'
                }`}
              />
            </button>
          </div>

          {/* Sound Chime Toggle */}
          <div className="flex items-center justify-between p-3.5 rounded-lg bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800">
            <div className="space-y-0.5">
              <div className="flex items-center gap-2">
                {reminderSoundEnabled ? (
                  <Volume2 className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
                ) : (
                  <VolumeX className="w-4 h-4 text-slate-400" />
                )}
                <span className="text-xs font-bold text-slate-800 dark:text-slate-200">
                  Audio Chime on Reminder
                </span>
              </div>
              <p className="text-[11px] text-slate-500 dark:text-slate-400">
                Plays a subtle dual-frequency audio chime when an alert is fired.
              </p>
            </div>
            <button
              type="button"
              onClick={() => onToggleReminderSound && onToggleReminderSound(!reminderSoundEnabled)}
              className={`w-11 h-6 flex items-center rounded-full p-1 transition-colors duration-200 shrink-0 ml-4 ${
                reminderSoundEnabled ? 'bg-[#4F46E5]' : 'bg-slate-300 dark:bg-slate-700'
              }`}
            >
              <div
                className={`bg-white w-4 h-4 rounded-full shadow-md transform transition-transform duration-200 ${
                  reminderSoundEnabled ? 'translate-x-5' : 'translate-x-0'
                }`}
              />
            </button>
          </div>

          {/* Browser Push Permission Status & Test Alert */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between p-3.5 rounded-lg bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800 gap-3">
            <div className="space-y-0.5">
              <span className="text-xs font-bold text-slate-800 dark:text-slate-200 block">
                System Notification Status
              </span>
              <p className="text-[11px] text-slate-500 dark:text-slate-400">
                {browserPermission === 'granted'
                  ? 'Browser notifications are granted. System popups will appear even when minimized.'
                  : browserPermission === 'denied'
                  ? 'Browser notifications are blocked. In-app banner and chime alerts remain active.'
                  : 'Allows background system notifications for reminder times.'}
              </p>
            </div>

            <div className="flex items-center gap-2 shrink-0">
              {browserPermission !== 'granted' && (
                <button
                  type="button"
                  onClick={handleRequestPermission}
                  className="px-3 py-1.5 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 hover:border-slate-300 dark:hover:border-slate-600 text-slate-700 dark:text-slate-200 text-xs font-semibold rounded-lg shadow-2xs transition-colors"
                >
                  Request Permission
                </button>
              )}

              <button
                type="button"
                onClick={() => onTestReminder && onTestReminder()}
                className="px-3 py-1.5 bg-indigo-50 dark:bg-indigo-950/60 hover:bg-indigo-100 dark:hover:bg-indigo-900/60 text-[#4F46E5] dark:text-indigo-300 text-xs font-semibold rounded-lg border border-indigo-200/80 dark:border-indigo-800 transition-colors flex items-center gap-1.5 shadow-2xs"
              >
                <Sparkles className="w-3.5 h-3.5" />
                <span>Test Alert</span>
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Connected Workspaces & Ingestion */}
      <section className="bg-white dark:bg-[#131B2E] border border-slate-200 dark:border-slate-800 rounded-xl p-5 shadow-xs space-y-4 transition-colors">
        <div className="flex items-center gap-2 pb-3 border-b border-slate-100 dark:border-slate-800">
          <Layers className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
          <h2
            className="text-base font-bold text-slate-900 dark:text-white"
            style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}
          >
            Workspace Connectors
          </h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <div className="p-3.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/60 flex flex-col justify-between">
            <div className="flex items-center gap-2 mb-2">
              <div className="p-1.5 bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-400 rounded-lg">
                <Slack className="w-4 h-4" />
              </div>
              <div>
                <span className="text-xs font-bold text-slate-900 dark:text-white block">Slack Bot OCR</span>
                <span className="text-[10px] text-emerald-600 dark:text-emerald-400 font-medium flex items-center gap-1">
                  <CheckCircle2 className="w-3 h-3" /> Connected
                </span>
              </div>
            </div>
            <p className="text-[11px] text-slate-500 dark:text-slate-400">
              Paste screenshots directly from #procurement, #general, and DMs.
            </p>
          </div>

          <div className="p-3.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/60 flex flex-col justify-between">
            <div className="flex items-center gap-2 mb-2">
              <div className="p-1.5 bg-indigo-50 dark:bg-indigo-950/60 text-indigo-700 dark:text-indigo-300 rounded-lg">
                <Calendar className="w-4 h-4" />
              </div>
              <div>
                <span className="text-xs font-bold text-slate-900 dark:text-white block">Google Workspace</span>
                <span className="text-[10px] text-indigo-600 dark:text-indigo-400 font-medium flex items-center gap-1">
                  <CheckCircle2 className="w-3 h-3" /> Synced
                </span>
              </div>
            </div>
            <p className="text-[11px] text-slate-500 dark:text-slate-400">
              Sync extracted action items with Calendar and Tasks automatically.
            </p>
          </div>

          <div className="p-3.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/60 flex flex-col justify-between">
            <div className="flex items-center gap-2 mb-2">
              <div className="p-1.5 bg-amber-50 dark:bg-amber-950/60 text-amber-700 dark:text-amber-400 rounded-lg">
                <Mail className="w-4 h-4" />
              </div>
              <div>
                <span className="text-xs font-bold text-slate-900 dark:text-white block">Email Thread Sync</span>
                <span className="text-[10px] text-slate-500 dark:text-slate-400 font-medium">Ready</span>
              </div>
            </div>
            <p className="text-[11px] text-slate-500 dark:text-slate-400">
              Drag email receipts and newsletters to parse action items.
            </p>
          </div>
        </div>
      </section>

      {/* Database & Export Actions */}
      <section
        id="data-storage-export-section"
        className="bg-white dark:bg-[#131B2E] border border-slate-200 dark:border-slate-800 rounded-xl p-5 shadow-xs space-y-4 transition-colors"
      >
        <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
          <div className="flex items-center gap-2">
            <Database className="w-5 h-5 text-slate-700 dark:text-slate-300" />
            <h2
              className="text-base font-bold text-slate-900 dark:text-white"
              style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}
            >
              Data Storage & Backup Export
            </h2>
          </div>
          <span className="px-2.5 py-0.5 rounded-full text-[11px] font-mono font-semibold bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700">
            {tasks.length} {tasks.length === 1 ? 'task' : 'tasks'} recorded
          </span>
        </div>

        <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
          Create downloadable backups of your entire task list for external archiving, offline records, or importing into Excel, Google Sheets, Airtable, and Notion.
        </p>

        {lastExportedFile && (
          <div className="flex items-center gap-2 p-2.5 rounded-lg bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-200 dark:border-emerald-800 text-emerald-800 dark:text-emerald-300 text-xs font-medium animate-in fade-in duration-200">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
            <span className="truncate">
              Downloaded backup file: <span className="font-mono font-semibold">{lastExportedFile}</span>
            </span>
          </div>
        )}

        <div className="flex flex-wrap items-center gap-2.5 pt-1">
          {/* Export CSV Button */}
          <button
            id="export-tasks-csv-btn"
            type="button"
            onClick={handleExportCSV}
            className="px-3.5 py-2 bg-emerald-50 dark:bg-emerald-950/60 hover:bg-emerald-100 dark:hover:bg-emerald-900/60 border border-emerald-200 dark:border-emerald-800 text-emerald-800 dark:text-emerald-300 text-xs font-semibold rounded-lg flex items-center gap-1.5 transition-colors shadow-2xs"
            title="Download full tasks list as CSV spreadsheet"
          >
            <FileSpreadsheet className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
            <span>Export Tasks (CSV)</span>
          </button>

          {/* Export JSON Button */}
          <button
            id="export-tasks-json-btn"
            type="button"
            onClick={handleExportJSON}
            className="px-3.5 py-2 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 text-xs font-semibold rounded-lg flex items-center gap-1.5 transition-colors shadow-2xs"
            title="Download full tasks list in raw JSON format"
          >
            <Download className="w-3.5 h-3.5 text-slate-600 dark:text-slate-400" />
            <span>Export Tasks (JSON)</span>
          </button>

          <button
            type="button"
            onClick={onClearCompleted}
            className="px-3.5 py-2 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 text-xs font-semibold rounded-lg transition-colors"
          >
            Archive Completed
          </button>

          <button
            type="button"
            onClick={onResetData}
            className="px-3.5 py-2 bg-rose-50 dark:bg-rose-950/60 hover:bg-rose-100 dark:hover:bg-rose-900/60 text-rose-700 dark:text-rose-400 border border-rose-200 dark:border-rose-800 text-xs font-semibold rounded-lg flex items-center gap-1.5 transition-colors ml-auto"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Reset Demo Dataset</span>
          </button>
        </div>
      </section>
    </div>
  );
};
