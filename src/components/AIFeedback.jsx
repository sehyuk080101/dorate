import React, { useState, useEffect } from 'react';
import { Brain, Lightbulb, TrendingUp, Sparkles, ChevronDown, ChevronUp, Plus, Calendar, Clock } from 'lucide-react';
import { generateAIFeedback, generateTaskRecommendations, getProductivityTips } from '../utils/aiService';

const PERIODS = [
  { key: 'day', label: '하루' },
  { key: 'week', label: '일주일' },
  { key: 'month', label: '한 달' },
  { key: 'recommendations', label: 'AI 추천' },
];

export const AIFeedbackComponent = ({ todos, getPeriodTasks, onAdd, setActiveTab }) => {
  const [activePeriod, setActivePeriod] = useState('day');
  const [feedbacks, setFeedbacks] = useState({}); // { day: '', week: '', month: '' }
  const [recommendations, setRecommendations] = useState([]);
  const [isLoadingFeedback, setIsLoadingFeedback] = useState(false);
  const [isLoadingRecommendations, setIsLoadingRecommendations] = useState(false);
  const [requested, setRequested] = useState({}); // { day: true, ... }

  // 할 일이 없는지 확인하는 함수
  const hasNoTasks = () => {
    // 전체 할 일이 없는 경우
    if (todos.length === 0) {
      return true;
    }
    
    // 완료/실패한 할 일이 없는 경우
    const { completedTasks, failedTasks } = getPeriodTasks(activePeriod);
    return completedTasks.length === 0 && failedTasks.length === 0;
  };

  // 완료/실패한 할 일이 없는지 확인하는 함수
  const hasNoCompletedOrFailedTasks = () => {
    const { completedTasks, failedTasks } = getPeriodTasks(activePeriod);
    return completedTasks.length === 0 && failedTasks.length === 0;
  };

  const handleRequestFeedback = async () => {
    setIsLoadingFeedback(true);
    const { completedTasks, failedTasks, successRate, allTasksInPeriod } = getPeriodTasks(activePeriod);
    
    // 할 일이 없거나 성공률이 0인 경우 처리
    if (completedTasks.length === 0 && failedTasks.length === 0) {
      setIsLoadingFeedback(false);
      return;
    }
    
    const feedback = await generateAIFeedback({
      period: activePeriod,
      completedTasks,
      failedTasks,
      successRate,
      allTasksInPeriod,
    });
    setFeedbacks(prev => ({ ...prev, [activePeriod]: feedback }));
    setRequested(prev => ({ ...prev, [activePeriod]: true }));
    setIsLoadingFeedback(false);
  };

  const handleRequestRecommendations = async () => {
    setIsLoadingRecommendations(true);
    
    try {
      const recs = await generateTaskRecommendations(todos);
      setRecommendations(recs);
      setRequested(prev => ({ ...prev, recommendations: true }));
    } catch (error) {
      console.error('Error generating recommendations:', error);
    } finally {
      setIsLoadingRecommendations(false);
    }
  };

  const handleAddRecommendation = (recommendation) => {
    const deadlineDate = recommendation.suggestedDate && recommendation.suggestedTime 
      ? new Date(`${recommendation.suggestedDate}T${recommendation.suggestedTime}`)
      : recommendation.suggestedDate 
        ? new Date(recommendation.suggestedDate)
        : undefined;
    
    onAdd(recommendation.title, 'medium', recommendation.category || 'Work', deadlineDate);
  };

  const renderRecommendations = () => {
    if (isLoadingRecommendations) {
      return (
        <div className="flex flex-col items-center gap-4 py-8 text-center">
          <span className="text-gray-400 dark:text-gray-500">AI가 완료 패턴을 분석해서 할 일을 추천해드릴게요.</span>
          <div className="flex items-center gap-3 text-blue-500 dark:text-blue-400 h-9">
            <div className="animate-pulse">
              <div className="h-4 w-4 bg-blue-500 rounded-full"></div>
            </div>
            <span className="text-sm font-medium">AI 추천 생성 중...</span>
          </div>
        </div>
      );
    }

    if (!requested.recommendations) {
      return (
        <div className="flex flex-col items-center gap-4 py-8 text-center">
          <span className="text-gray-400 dark:text-gray-500">AI가 완료 패턴을 분석해서 할 일을 추천해드릴게요.</span>
          <button
            className={`px-4 py-2 bg-blue-600 dark:bg-blue-500 text-white rounded-lg text-sm font-medium hover:bg-blue-700 dark:hover:bg-blue-600 transition flex items-center gap-2 ${isLoadingRecommendations ? 'opacity-60 cursor-not-allowed' : ''}`}
            onClick={handleRequestRecommendations}
            disabled={isLoadingRecommendations}
          >
            <Lightbulb className="inline w-4 h-4 -mt-1" />
            AI 추천 받기
          </button>
        </div>
      );
    }

    if (recommendations.length === 0) {
      return (
        <div className="flex flex-col items-center gap-4 py-8 text-center">
          <div className="text-gray-400 dark:text-gray-500 mb-4">
            AI 추천을 생성하는 중에 문제가 발생했습니다.
          </div>
          <button
            onClick={handleRequestRecommendations}
            className="px-4 py-2 bg-blue-600 dark:bg-blue-500 text-white rounded-lg text-sm font-medium hover:bg-blue-700 dark:hover:bg-blue-600 transition"
          >
            다시 시도하기
          </button>
        </div>
      );
    }

    return (
      <div className="py-8">
        <div className="space-y-4">
          <div className="text-sm text-gray-600 dark:text-gray-400 mb-4">
            완료 패턴을 분석한 결과를 바탕으로 추천해드립니다.
          </div>
          {recommendations.map((rec, index) => (
            <div key={index} className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4 border border-gray-200 dark:border-gray-600">
              <div className="flex items-start justify-between gap-3">
                <div className="flex-1">
                  <h3 className="font-medium text-gray-900 dark:text-gray-100 mb-1">
                    {rec.title}
                  </h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                    {rec.reason}
                  </p>
                  <div className="flex items-center gap-4 text-xs text-gray-500 dark:text-gray-400">
                    {rec.suggestedDate && (
                      <div className="flex items-center gap-1">
                        <Calendar className="w-3 h-3" />
                        <span>{rec.suggestedDate}</span>
                      </div>
                    )}
                    {rec.suggestedTime && (
                      <div className="flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        <span>{rec.suggestedTime}</span>
                      </div>
                    )}
                    {rec.category && (
                      <span className="px-2 py-1 bg-blue-100 dark:bg-blue-900/50 text-blue-700 dark:text-blue-300 rounded-full text-xs">
                        {rec.category}
                      </span>
                    )}
                  </div>
                </div>
                <button
                  onClick={() => handleAddRecommendation(rec)}
                  className="px-3 py-1.5 bg-green-600 dark:bg-green-500 text-white rounded-lg text-sm font-medium hover:bg-green-700 dark:hover:bg-green-600 transition flex items-center gap-1"
                >
                  <Plus className="w-3 h-3" />
                  추가
                </button>
              </div>
            </div>
          ))}
          <button
            onClick={handleRequestRecommendations}
            className="px-4 py-2 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg text-sm font-medium hover:bg-gray-200 dark:hover:bg-gray-600 transition"
          >
            새로운 추천 받기
          </button>
        </div>
      </div>
    );
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6 mb-6">
      <div className="flex gap-2 mb-2">
        {PERIODS.map(p => (
          <button
            key={p.key}
            className={`px-3 py-1 rounded-lg text-sm font-medium ${activePeriod === p.key ? 'bg-blue-600 dark:bg-blue-500 text-white' : 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300'}`}
            onClick={() => setActivePeriod(p.key)}
          >
            {p.label}
          </button>
        ))}
      </div>
      <div className="min-h-[48px] text-gray-700 dark:text-gray-300 text-base">
        {activePeriod === 'recommendations' ? (
          renderRecommendations()
        ) : (
          isLoadingFeedback ? (
            <div className="flex flex-col items-center gap-4 py-8 text-center">
              <div className="text-gray-400 dark:text-gray-500">
                아직 피드백을 생성하지 않았습니다.
              </div>
              <div className="flex items-center gap-3 text-blue-500 dark:text-blue-400 h-9">
                <div className="animate-pulse">
                  <div className="h-4 w-4 bg-blue-500 rounded-full"></div>
                </div>
                <span className="text-sm font-medium">AI 피드백 생성 중...</span>
              </div>
            </div>
          ) : requested[activePeriod] ? (
            <div className="py-8">
              <div className="space-y-4">
                <div className="text-sm text-gray-600 dark:text-gray-400 mb-4">
                  {activePeriod === 'day' && '오늘의 성과를 분석한 결과입니다.'}
                  {activePeriod === 'week' && '이번 주의 성과를 분석한 결과입니다.'}
                  {activePeriod === 'month' && '이번 달의 성과를 분석한 결과입니다.'}
                </div>
                <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4 border border-gray-200 dark:border-gray-600">
                  {typeof feedbacks[activePeriod] === 'string' ? (
                    <div className="text-gray-900 dark:text-gray-100">{feedbacks[activePeriod]}</div>
                  ) : feedbacks[activePeriod] && (
                    <div className="space-y-3">
                      {feedbacks[activePeriod].insights && (
                        <div>
                          <h3 className="font-medium text-gray-900 dark:text-gray-100 mb-2">분석 결과</h3>
                          <div className="text-sm text-gray-700 dark:text-gray-300">{feedbacks[activePeriod].insights.join(' ')}</div>
                        </div>
                      )}
                      {feedbacks[activePeriod].suggestions && (
                        <div>
                          <h3 className="font-medium text-gray-900 dark:text-gray-100 mb-2">개선 제안</h3>
                          <div className="text-sm text-blue-600 dark:text-blue-400">{feedbacks[activePeriod].suggestions.join(' ')}</div>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </div>
            </div>
          ) : (
            <div className="flex flex-col items-center gap-4 py-8 text-center">
              {todos.length === 0 ? (
                <>
                  <div className="text-gray-400 dark:text-gray-500 mb-2">
                    할 일이 없어서 피드백을 생성할 수 없습니다.
                  </div>
                  <div className="flex flex-col items-center gap-3">
                    <span className="text-sm text-gray-500 dark:text-gray-400">
                      할 일을 추가해보세요.
                    </span>
                    <button
                      onClick={() => setActiveTab('all')}
                      className="px-4 py-2 bg-blue-600 dark:bg-blue-500 text-white rounded-lg text-sm font-medium hover:bg-blue-700 dark:hover:bg-blue-600 transition"
                    >
                      전체 할 일로 이동
                    </button>
                  </div>
                </>
              ) : hasNoCompletedOrFailedTasks() ? (
                <>
                  <div className="text-gray-400 dark:text-gray-500 mb-2">
                    {activePeriod === 'day' && '오늘 완료하거나 실패한 할 일이 없습니다.'}
                    {activePeriod === 'week' && '이번 주 완료하거나 실패한 할 일이 없습니다.'}
                    {activePeriod === 'month' && '이번 달 완료하거나 실패한 할 일이 없습니다.'}
                  </div>
                  <div className="flex flex-col items-center gap-3">
                    <span className="text-sm text-gray-500 dark:text-gray-400">
                      할 일을 완료하거나 기한을 설정해보세요.
                    </span>
                    <button
                      onClick={() => setActiveTab('all')}
                      className="px-4 py-2 bg-blue-600 dark:bg-blue-500 text-white rounded-lg text-sm font-medium hover:bg-blue-700 dark:hover:bg-blue-600 transition"
                    >
                      전체 할 일로 이동
                    </button>
                  </div>
                </>
              ) : (
                <>
                  <div className="text-gray-400 dark:text-gray-500">
                    아직 피드백을 생성하지 않았습니다.
                  </div>
                  <button
                    className={`px-4 py-2 bg-blue-600 dark:bg-blue-500 text-white rounded-lg text-sm font-medium hover:bg-blue-700 dark:hover:bg-blue-600 transition flex items-center gap-2 ${isLoadingFeedback ? 'opacity-60 cursor-not-allowed' : ''}`}
                    onClick={handleRequestFeedback}
                    disabled={isLoadingFeedback}
                  >
                    <Brain className="inline w-4 h-4 -mt-1" />
                    AI 피드백 생성
                  </button>
                </>
              )}
            </div>
          )
        )}
      </div>
    </div>
  );
};