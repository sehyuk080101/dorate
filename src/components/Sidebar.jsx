import React from 'react';
import { 
  CheckSquare, 
  Calendar, 
  BarChart3, 
  Brain, 
  Settings, 
  Plus,
  Home,
  Clock,
  AlertTriangle,
  CheckCircle2
} from 'lucide-react';

export const Sidebar = ({ activeTab, onTabChange, stats, showResetModal }) => {
  const menuItems = [
    {
      id: 'all',
      label: '전체 할 일',
      icon: CheckSquare,
      count: stats.total,
    },
    {
      id: 'pending',
      label: '미완료',
      icon: Clock,
      count: stats.pending,
    },
    {
      id: 'completed',
      label: '완료',
      icon: CheckCircle2,
      count: stats.completed,
    },
    {
      id: 'overdue',
      label: '기한 초과',
      icon: AlertTriangle,
      count: stats.overdue,
    },
    {
      id: 'today',
      label: '오늘 마감',
      icon: Calendar,
      count: stats.todayCount,
    },
    {
      id: 'analytics',
      label: '분석',
      icon: BarChart3,
      count: null,
    },
    {
      id: 'ai-insights',
      label: 'AI 인사이트',
      icon: Brain,
      count: null,
    },
    {
      id: 'settings',
      label: '설정',
      icon: Settings,
      count: null,
    },
  ];

  return (
    <div className="w-full sm:w-56 md:w-64 bg-gray-50 dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700 flex flex-col fixed left-0 z-20 pt-0 top-20 md:top-24 h-[calc(100vh-5rem)] md:h-[calc(100vh-6rem)]">
      {/* Header 자리 제거 (헤더에만 DoRate 남김) */}

      {/* Navigation */}
      <nav className="flex-1 p-4">
        <div className="space-y-1">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            
            return (
              <button
                key={item.id}
                onClick={() => onTabChange(item.id)}
                className={`w-full flex items-center justify-between px-3 py-2 text-sm rounded-lg transition-colors border ${
                  isActive
                    ? 'bg-blue-50 dark:bg-blue-900/50 text-blue-700 dark:text-blue-300 border-blue-200 dark:border-blue-800'
                    : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 border-transparent'
                }`}
              >
                <div className="flex items-center gap-3">
                  <Icon className={`w-4 h-4 ${isActive ? 'text-blue-600 dark:text-blue-400' : 'text-gray-500 dark:text-gray-400'}`} />
                  <span className="font-medium">{item.label}</span>
                </div>
                {item.count !== null && (
                  <span className={`px-2 py-0.5 text-xs rounded-full ${
                    isActive
                      ? 'bg-blue-100 dark:bg-blue-800 text-blue-700 dark:text-blue-300'
                      : 'bg-gray-200 dark:bg-gray-600 text-gray-600 dark:text-gray-400'
                  }`}>
                    {item.count}
                  </span>
                )}
              </button>
            );
          })}
        </div>
      </nav>
    </div>
  );
};