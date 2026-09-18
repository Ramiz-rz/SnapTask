import React from 'react';
import { TabType } from '../types';
import { LayoutDashboard, ScanLine, CheckSquare, Settings } from 'lucide-react';

interface BottomNavBarProps {
  activeTab: TabType;
  setActiveTab: (tab: TabType) => void;
}

export const BottomNavBar: React.FC<BottomNavBarProps> = ({
  activeTab,
  setActiveTab,
}) => {
  const tabs = [
    { id: 'dashboard' as TabType, label: 'Dashboard', icon: LayoutDashboard },
    { id: 'extract' as TabType, label: 'Extract', icon: ScanLine },
    { id: 'tasks' as TabType, label: 'Tasks', icon: CheckSquare },
    { id: 'settings' as TabType, label: 'Settings', icon: Settings },
  ];

  return (
    <nav className="md:hidden fixed bottom-0 left-0 w-full z-50 flex justify-around items-center px-4 py-2 bg-white dark:bg-[#131B2E] border-t border-slate-200/80 dark:border-slate-800 shadow-lg transition-colors duration-150">
      {tabs.map((tab) => {
        const Icon = tab.icon;
        const isActive = activeTab === tab.id;
        return (
          <button
            key={tab.id}
            aria-label={tab.label}
            onClick={() => setActiveTab(tab.id)}
            className={`flex flex-col items-center justify-center transition-all duration-150 active:scale-95 ${
              isActive
                ? 'bg-[#4F46E5] text-white rounded-xl px-4 py-1.5 shadow-sm shadow-indigo-500/20'
                : 'text-slate-500 dark:text-slate-400 hover:text-[#4F46E5] dark:hover:text-indigo-400 px-3 py-1.5'
            }`}
          >
            <Icon className="w-5 h-5" />
            <span className="text-[11px] font-medium mt-0.5">{tab.label}</span>
          </button>
        );
      })}
    </nav>
  );
};
