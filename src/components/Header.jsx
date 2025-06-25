import React, { useEffect, useState } from 'react';
import { Search, Bell, User, Moon, Sun, Settings, RefreshCw } from 'lucide-react';

export const Header = ({ activeTab, searchTerm, onSearchChange, darkMode, setDarkMode, setActiveTab, onReset, showResetModal, setShowResetModal }) => {
  const [showUserMenu, setShowUserMenu] = useState(false);

  const getPageTitle = (tab) => {
    const titles = {
      dashboard: '대시보드',
      all: '전체 할 일',
      pending: '미완료',
      completed: '완료',
      overdue: '기한 초과',
      today: '오늘 마감',
      analytics: '분석',
      'ai-insights': 'AI 인사이트',
      settings: '설정',
    };
    return titles[tab] || 'DoRate';
  };

  const handleSettingsClick = () => {
    setActiveTab('settings');
    setShowUserMenu(false);
  };

  const handleResetClick = () => {
    setShowResetModal(true);
    setShowUserMenu(false);
  };

  // 드롭다운 메뉴 외부 클릭 시 닫기
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (showUserMenu && !event.target.closest('.user-menu')) {
        setShowUserMenu(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [showUserMenu]);

  return (
    <header className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 px-2 md:px-6 py-2 md:py-4 h-20 md:h-24 fixed top-0 left-0 w-full z-10 flex items-center">
      <div className="flex w-full items-center">
        <div className="flex items-center gap-3">
          <div 
            onClick={() => setActiveTab('all')}
            className="w-10 h-10 bg-blue-600 dark:bg-blue-500 rounded-lg flex items-center justify-center cursor-pointer hover:bg-blue-700 dark:hover:bg-blue-600 transition-colors"
          >
            <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2l4 -4" /><rect x="3" y="3" width="18" height="18" rx="2" ry="2" /></svg>
          </div>
          <div 
            onClick={() => setActiveTab('all')}
            className="cursor-pointer hover:opacity-80 transition-opacity"
          >
            <h1 className="text-2xl font-semibold text-gray-900 dark:text-gray-100">DoRate</h1>
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
              DoRate와 함께 AI 기반 생산성 관리 시작하기
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2 md:gap-4 ml-auto">
          {/* Search */}
          <div className="flex items-center bg-white dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg px-3 py-2">
            <Search className="text-gray-400 dark:text-gray-500 w-5 h-5 flex-shrink-0 mr-2" />
            <input
              type="text"
              className="w-full bg-transparent outline-none text-gray-900 dark:text-gray-100 placeholder-gray-500 dark:placeholder-gray-400"
              placeholder="할 일 검색..."
              value={searchTerm}
              onChange={(e) => onSearchChange(e.target.value)}
            />
          </div>

          {/* Dark Mode Toggle */}
          <button 
            onClick={() => setDarkMode(!darkMode)}
            className="p-2 text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
          >
            {darkMode ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
          </button>

          {/* Profile */}
          <div className="relative user-menu">
            <button 
              onClick={() => setShowUserMenu(!showUserMenu)}
              className="flex items-center gap-2 p-2 text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
            >
              <div className="w-8 h-8 bg-blue-600 dark:bg-blue-500 rounded-full flex items-center justify-center">
                <User className="w-4 h-4 text-white" />
              </div>
            </button>
            
            {showUserMenu && (
              <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-lg z-50">
                <button
                  onClick={handleSettingsClick}
                  className="w-full flex items-center gap-3 px-4 py-3 text-left text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors rounded-t-lg"
                >
                  <Settings className="w-4 h-4" />
                  설정
                </button>
                <button
                  onClick={handleResetClick}
                  className="w-full flex items-center gap-3 px-4 py-3 text-left text-red-600 dark:text-red-400 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors rounded-b-lg"
                >
                  <RefreshCw className="w-4 h-4" />
                  초기화
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};