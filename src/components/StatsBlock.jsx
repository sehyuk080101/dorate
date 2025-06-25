import React from 'react';
import { CheckCircle, Clock, AlertTriangle, Target } from 'lucide-react';

export const StatsBlock = ({ stats }) => {
  const statCards = [
    {
      title: '전체 할 일',
      value: stats.total,
      icon: <Target className="w-5 h-5 text-blue-500" />,
      bg: 'bg-blue-50 dark:bg-blue-900/20',
      text: 'text-blue-600 dark:text-blue-400',
    },
    {
      title: '완료',
      value: stats.completed,
      icon: <CheckCircle className="w-5 h-5 text-green-500" />,
      bg: 'bg-green-50 dark:bg-green-900/20',
      text: 'text-green-600 dark:text-green-400',
    },
    {
      title: '미완료',
      value: stats.pending,
      icon: <Clock className="w-5 h-5 text-yellow-500" />,
      bg: 'bg-yellow-50 dark:bg-yellow-900/20',
      text: 'text-yellow-600 dark:text-yellow-400',
    },
    {
      title: '기한 초과',
      value: stats.overdue,
      icon: <AlertTriangle className="w-5 h-5 text-red-500" />,
      bg: 'bg-red-50 dark:bg-red-900/20',
      text: 'text-red-600 dark:text-red-400',
    },
  ];

  return (
    <div className="p-6 space-y-6">
      <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6 space-y-6">
        {/* 통계 카드 그리드 */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3 md:gap-4 mb-6">
          {statCards.map((card) => (
            <div
              key={card.title}
              className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-0 flex flex-col h-full"
            >
              <div className={`flex flex-col h-full rounded-xl ${card.bg} p-6`}>
                <div className="flex items-center gap-2 mb-2">
                  {card.icon}
                  <span className="text-base font-medium text-gray-700 dark:text-gray-300">{card.title}</span>
                </div>
                <span className={`text-3xl font-bold ${card.text}`}>{card.value}</span>
              </div>
            </div>
          ))}
        </div>

        {/* 진행률 박스 */}
        <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-6">
          <div className="flex items-center justify-between mb-2">
            <span className="text-base text-gray-700 dark:text-gray-300 font-medium">진행 현황</span>
            <span className="text-base text-gray-500 dark:text-gray-400 font-semibold">{stats.completed}개 / {stats.total}개</span>
          </div>
          <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-3">
            <div
              className="bg-blue-500 dark:bg-blue-400 h-3 rounded-full transition-all duration-500"
              style={{ width: `${stats.completionRate || 0}%` }}
            />
          </div>
          <div className="flex justify-between text-sm text-gray-600 dark:text-gray-400 mt-2">
            <span>완료율</span>
            <span>{stats.completionRate}%</span>
          </div>
        </div>
      </div>
    </div>
  );
};