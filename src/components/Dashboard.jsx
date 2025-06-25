// React를 가져옵니다
import React from 'react';
// Lucide React에서 필요한 아이콘들을 가져옵니다
import { CheckCircle, Clock, AlertTriangle, TrendingUp, Calendar, Target } from 'lucide-react';

// 대시보드 컴포넌트: 할 일 통계와 개요를 보여주는 메인 페이지
export const Dashboard = ({ todos, stats }) => {
  // 오늘 마감인 할 일들을 필터링합니다
  const todaysTasks = todos.filter(todo => {
    if (!todo.deadline) return false; // 마감일이 없으면 제외
    const today = new Date();
    // 날짜만 비교하여 오늘 마감인 할 일들을 찾습니다
    return todo.deadline.toDateString() === today.toDateString();
  });

  // 최근에 완료된 할 일들을 가져옵니다 (최신 5개)
  const recentTasks = todos
    .filter(todo => todo.completed) // 완료된 할 일만 필터링
    .sort((a, b) => (b.completedAt?.getTime() || 0) - (a.completedAt?.getTime() || 0)) // 완료 시간 기준 내림차순 정렬
    .slice(0, 5); // 최신 5개만 가져오기

  // 통계 카드 데이터를 정의합니다
  const statCards = [
    {
      title: '전체 할 일',
      value: stats.total,
      icon: <Target className="w-5 h-5 text-blue-500" />,
      bg: 'bg-blue-50',
      text: 'text-blue-600',
    },
    {
      title: '완료',
      value: stats.completed,
      icon: <CheckCircle className="w-5 h-5 text-green-500" />,
      bg: 'bg-green-50',
      text: 'text-green-600',
    },
    {
      title: '미완료',
      value: stats.pending,
      icon: <Clock className="w-5 h-5 text-yellow-500" />,
      bg: 'bg-yellow-50',
      text: 'text-yellow-600',
    },
    {
      title: '기한 초과',
      value: stats.overdue,
      icon: <AlertTriangle className="w-5 h-5 text-red-500" />,
      bg: 'bg-red-50',
      text: 'text-red-600',
    },
  ];

  return (
    <div className="bg-white rounded-2xl border border-gray-100 p-6 md:p-8 w-full max-w-5xl mx-auto space-y-6">
      {/* 통계 카드 그리드 */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3 md:gap-4 mb-6">
        {statCards.map((card) => (
          <div
            key={card.title}
            className="bg-white rounded-xl border border-gray-100 p-0 flex flex-col h-full"
          >
            <div className={`flex flex-col h-full rounded-xl ${card.bg} p-6`}>
              <div className="flex items-center gap-2 mb-2">
                {card.icon}
                <span className="text-base font-medium text-gray-700">{card.title}</span>
              </div>
              <span className={`text-3xl font-bold ${card.text}`}>{card.value}</span>
            </div>
          </div>
        ))}
      </div>

      {/* 진행률 박스 */}
      <div className="bg-white rounded-xl border border-gray-100 p-6 mb-6">
        <div className="flex items-center justify-between mb-2">
          <span className="text-base text-gray-700 font-medium">진행 현황</span>
          <span className="text-base text-gray-500 font-semibold">{stats.completed}개 / {stats.total}개</span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-3">
          <div
            className="bg-gray-400 h-3 rounded-full transition-all duration-500"
            style={{ width: `${stats.completionRate || 0}%` }}
          />
        </div>
        <div className="flex justify-between text-sm text-gray-600 mt-2">
          <span>완료율</span>
          <span>{stats.completionRate}%</span>
        </div>
      </div>

      {/* 2열 그리드: 오늘 마감 + 최근 완료 */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3 md:gap-6">
        {/* 오늘 마감 할 일 섹션 */}
        <div className="bg-white rounded-xl border border-gray-100 p-6 flex flex-col">
          <div className="flex items-center gap-2 mb-4">
            <Calendar className="w-5 h-5 text-blue-600" />
            <h2 className="text-lg font-semibold text-gray-900">오늘 마감</h2>
            <span className="bg-blue-100 text-blue-800 text-xs font-medium px-2 py-1 rounded-full">
              {todaysTasks.length}
            </span>
          </div>
          <div className="space-y-3">
            {todaysTasks.length === 0 ? (
              <p className="text-gray-500 text-center py-8">오늘 마감된 할 일이 없습니다</p>
            ) : (
              todaysTasks.slice(0, 5).map(todo => (
                <div key={todo.id} className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                  <div className={`w-2 h-2 rounded-full ${
                    todo.priority === 'high' ? 'bg-red-500' :
                    todo.priority === 'medium' ? 'bg-yellow-500' : 'bg-blue-500'
                  }`} />
                  <div className="flex-1">
                    <p className="font-medium text-gray-900 text-sm">{todo.text}</p>
                    <p className="text-xs text-gray-500">{todo.category}</p>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* 최근 완료된 할 일 섹션 */}
        <div className="bg-white rounded-xl border border-gray-100 p-6 flex flex-col">
          <div className="flex items-center gap-2 mb-4">
            <CheckCircle className="w-5 h-5 text-green-600" />
            <h2 className="text-lg font-semibold text-gray-900">최근 완료</h2>
          </div>
          <div className="space-y-3">
            {recentTasks.length === 0 ? (
              <p className="text-gray-500 text-center py-8">아직 완료된 할 일이 없습니다</p>
            ) : (
              recentTasks.map(todo => (
                <div key={todo.id} className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                  <CheckCircle className="w-4 h-4 text-green-600 flex-shrink-0" />
                  <div className="flex-1">
                    <p className="font-medium text-gray-900 text-sm line-through">{todo.text}</p>
                    <p className="text-xs text-gray-500">
                      Completed {todo.completedAt?.toLocaleDateString()}
                    </p>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}; 