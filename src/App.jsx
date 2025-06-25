import React, { useState, useEffect } from 'react';
import { useTodos } from './hooks/useTodos';
import { Sidebar } from './components/Sidebar';
import { Header } from './components/Header';
import { Dashboard } from './components/Dashboard';
import { TaskView } from './components/TaskView';
import { AIFeedbackComponent } from './components/AIFeedback';
import { StatsBlock } from './components/StatsBlock';

/**
 * DoRate 앱의 메인 컴포넌트
 * 전체 앱의 상태 관리와 레이아웃을 담당합니다
 */
function App() {
  // useTodos 훅에서 할 일 관련 함수들과 데이터를 가져옵니다
  const {
    todos,           // 할 일 목록
    categories,      // 카테고리 목록
    addTodo,         // 할 일 추가 함수
    toggleTodo,      // 할 일 완료/미완료 토글 함수
    deleteTodo,      // 할 일 삭제 함수
    updateTodo,      // 할 일 수정 함수
    getStats,        // 통계 계산 함수
    setTodos,        // 할 일 목록 직접 설정 함수
    getPeriodTasks,  // 기간별 할 일 조회 함수
    addComment,      // 댓글 추가 함수
    deleteComment,   // 댓글 삭제 함수
    addTag,          // 태그 추가 함수
    deleteTag,       // 태그 삭제 함수
  } = useTodos();

  // 현재 활성 탭 상태 (기본값: 'all' - 전체 할 일)
  const [activeTab, setActiveTab] = useState('all');
  
  // 검색어 상태
  const [searchTerm, setSearchTerm] = useState('');
  
  // 다크 모드 상태 (로컬 스토리지에서 초기값 가져오기)
  const [darkMode, setDarkMode] = useState(() => {
    const saved = localStorage.getItem('dorate-dark-mode');
    return saved === 'true' ? true : false;
  });
  
  // 댓글 작성자 이름 상태 (로컬 스토리지에서 초기값 가져오기)
  const [commentName, setCommentName] = useState(() => {
    const saved = localStorage.getItem('dorate-comment-name');
    return saved || '익명';
  });
  
  // 리셋 모달 상태
  const [showResetModal, setShowResetModal] = useState(false);

  // URL 해시를 확인하여 초기 탭을 설정하는 효과
  useEffect(() => {
    const hash = window.location.hash.slice(2); // '#/' 제거
    // 유효한 탭인지 확인하고 설정
    if (hash && ['dashboard', 'all', 'pending', 'completed', 'overdue', 'today', 'ai-insights', 'analytics', 'settings'].includes(hash)) {
      setActiveTab(hash);
    }
  }, []);

  /**
   * 탭 변경 핸들러
   * @param {string} newTab - 새로운 탭 ID
   */
  const handleTabChange = (newTab) => {
    setActiveTab(newTab);
    // URL 해시도 함께 업데이트하여 브라우저 히스토리 지원
    window.location.hash = `#/${newTab}`;
  };

  // 통계 데이터 계산 (기본 통계 + 오늘 마감 할 일 개수)
  const stats = {
    ...getStats(), // 기본 통계 (전체, 완료, 미완료, 기한 초과, 완료율)
    todayCount: todos.filter(todo => {
      if (!todo.deadline || todo.completed) return false;
      const today = new Date();
      today.setHours(0, 0, 0, 0); // 오늘 자정
      // 오늘 날짜에 마감인 할 일만 카운트
      return todo.deadline >= today && todo.deadline < new Date(today.getTime() + 24*60*60*1000);
    }).length,
  };

  // 다크 모드 변경 시 HTML 클래스와 로컬 스토리지 업데이트
  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
    // 로컬 스토리지에 다크 모드 설정 저장
    localStorage.setItem('dorate-dark-mode', darkMode.toString());
  }, [darkMode]);

  /**
   * 댓글 작성자 이름 변경 핸들러
   * @param {Event} e - 입력 이벤트
   */
  const handleCommentNameChange = (e) => {
    setCommentName(e.target.value);
    // 로컬 스토리지에 댓글 작성자 이름 저장
    localStorage.setItem('dorate-comment-name', e.target.value);
  };

  /**
   * 현재 활성 탭에 따라 적절한 콘텐츠를 렌더링하는 함수
   * @returns {JSX.Element} 렌더링할 컴포넌트
   */
  const renderContent = () => {
    switch (activeTab) {
      case 'dashboard':
        // 대시보드 탭: 할 일 요약 정보 표시
        return <Dashboard todos={todos} stats={stats} />;
        
      case 'ai-insights':
        // AI 인사이트 탭: AI 기반 분석 및 제안
        return (
          <div className="p-6">
            <AIFeedbackComponent
              todos={todos}
              getPeriodTasks={getPeriodTasks}
              stats={stats}
              onAdd={addTodo}
              setActiveTab={handleTabChange}
            />
          </div>
        );
        
      case 'analytics':
        // 분석 탭: 상세 통계 정보 표시
        return <StatsBlock stats={stats} />;
        
      case 'settings':
        // 설정 탭: 앱 설정 관리
        return (
          <div className="p-2 md:p-6 space-y-4 md:space-y-6">
            <div className="space-y-4">
              {/* 외관 설정 섹션 */}
              <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700">
                <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
                  <h2 className="text-lg font-medium text-gray-900 dark:text-gray-100">외관</h2>
                  <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">앱의 외관을 커스터마이징하세요.</p>
                </div>
                <div className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="text-sm font-medium text-gray-900 dark:text-gray-100">다크 모드</h3>
                      <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                        어두운 테마로 앱을 사용하세요.
                      </p>
                    </div>
                    {/* 다크 모드 토글 스위치 */}
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        checked={darkMode}
                        onChange={() => setDarkMode((v) => !v)}
                        className="sr-only peer"
                      />
                      <div className="w-11 h-6 bg-gray-200 dark:bg-gray-700 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600"></div>
                    </label>
                  </div>
                </div>
              </div>

              {/* 사용자 설정 섹션 */}
              <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700">
                <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
                  <h2 className="text-lg font-medium text-gray-900 dark:text-gray-100">사용자</h2>
                  <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">사용자 관련 설정을 관리하세요.</p>
                </div>
                <div className="p-6">
                  <div className="space-y-4">
                    <div>
                      <label htmlFor="commentName" className="block text-sm font-medium text-gray-900 dark:text-gray-100 mb-2">
                        댓글 작성자 이름
                      </label>
                      {/* 댓글 작성자 이름 입력 필드 */}
                      <input
                        id="commentName"
                        type="text"
                        value={commentName}
                        onChange={handleCommentNameChange}
                        className="w-full max-w-md px-3 py-2 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 focus:border-transparent transition-colors"
                        placeholder="이름을 입력하세요"
                      />
                      <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                        할 일에 댓글을 달 때 사용할 이름을 설정하세요.
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* 데이터 관리 섹션 */}
              <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700">
                <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
                  <h2 className="text-lg font-medium text-gray-900 dark:text-gray-100">데이터 관리</h2>
                  <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">앱 데이터를 관리하세요.</p>
                </div>
                <div className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="text-sm font-medium text-gray-900 dark:text-gray-100">데이터 초기화</h3>
                      <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                        모든 할 일과 설정을 초기화합니다. 이 작업은 되돌릴 수 없습니다.
                      </p>
                    </div>
                    {/* 데이터 초기화 버튼 */}
                    <button
                      onClick={() => setShowResetModal(true)}
                      className="px-4 py-2 bg-red-600 dark:bg-red-500 text-white text-sm font-medium rounded-md hover:bg-red-700 dark:hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-red-500 dark:focus:ring-red-400 focus:ring-offset-2 dark:focus:ring-offset-gray-800 transition-colors"
                    >
                      초기화
                    </button>
                  </div>
                </div>
              </div>

              {/* 앱 정보 섹션 */}
              <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700">
                <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
                  <h2 className="text-lg font-medium text-gray-900 dark:text-gray-100">앱 정보</h2>
                  <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">DoRate 앱에 대한 정보입니다.</p>
                </div>
                <div className="p-6">
                  <div className="space-y-3">
                    {/* 버전 정보 */}
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-600 dark:text-gray-400">버전</span>
                      <span className="text-sm font-medium text-gray-900 dark:text-gray-100">1.0.0</span>
                    </div>
                    {/* 할 일 개수 */}
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-600 dark:text-gray-400">할 일 개수</span>
                      <span className="text-sm font-medium text-gray-900 dark:text-gray-100">{todos.length}개</span>
                    </div>
                    {/* 완료된 할 일 개수 */}
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-600 dark:text-gray-400">완료된 할 일</span>
                      <span className="text-sm font-medium text-gray-900 dark:text-gray-100">{todos.filter(todo => todo.completed).length}개</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        );
        
      default:
        // 기본적으로 할 일 관련 탭들 (all, pending, completed, overdue, today)은 TaskView 컴포넌트 사용
        return (
          <TaskView
            todos={todos}
            categories={categories}
            filter={activeTab}
            searchTerm={searchTerm}
            onAdd={addTodo}
            onToggle={toggleTodo}
            onDelete={deleteTodo}
            onUpdate={updateTodo}
            setTodos={setTodos}
            addComment={addComment}
            deleteComment={deleteComment}
            addTag={addTag}
            deleteTag={deleteTag}
            commentName={commentName}
          />
        );
    }
  };

  // 메인 앱 렌더링
  return (
    // 다크 모드 클래스를 조건부로 적용하여 전체 앱의 테마 설정
    <div className={`${darkMode ? 'dark' : ''} bg-gray-50 dark:bg-gray-900`}>
      {/* 헤더 컴포넌트 - 검색, 다크 모드 토글, 사용자 메뉴 포함 */}
      <Header 
        activeTab={activeTab}
        searchTerm={searchTerm}
        onSearchChange={setSearchTerm}
        darkMode={darkMode}
        setDarkMode={setDarkMode}
        setActiveTab={handleTabChange}
        showResetModal={showResetModal}
        setShowResetModal={setShowResetModal}
        onReset={() => {
          // 데이터 초기화 함수: 모든 할 일 삭제, 댓글 이름 초기화
          setTodos([]);
          localStorage.removeItem('dorate-comment-name');
          setCommentName('익명');
        }}
      />
      
      {/* 메인 레이아웃 - 사이드바와 콘텐츠 영역 */}
      <div className="flex">
        {/* 사이드바 - 데스크톱에서만 표시 (모바일에서는 숨김) */}
        <div className="hidden md:block fixed top-20 md:top-24 left-0 z-20 w-56 md:w-64 h-[calc(100vh-5rem)] md:h-[calc(100vh-6rem)]">
          <Sidebar 
            activeTab={activeTab} 
            onTabChange={handleTabChange} 
            stats={stats}
            showResetModal={showResetModal}
          />
        </div>
        
        {/* 메인 콘텐츠 영역 - 사이드바 너비만큼 여백 확보 */}
        <div className="flex-1 min-w-0 ml-0 md:ml-64 h-screen flex flex-col">
          <main className="flex-1 min-h-0 overflow-auto pt-20 md:pt-24">
            {/* 현재 활성 탭에 따라 콘텐츠 렌더링 */}
            {activeTab === 'dashboard' || activeTab === 'all' || activeTab === 'pending' || activeTab === 'completed' || activeTab === 'overdue' || activeTab === 'today' ? (
              // 할 일 관련 탭들은 TaskView 컴포넌트 사용 (할 일 목록 표시)
              <TaskView
                todos={todos}
                categories={categories}
                filter={activeTab}
                searchTerm={searchTerm}
                onAdd={addTodo}
                onToggle={toggleTodo}
                onDelete={deleteTodo}
                onUpdate={updateTodo}
                setTodos={setTodos}
                addComment={addComment}
                deleteComment={deleteComment}
                addTag={addTag}
                deleteTag={deleteTag}
                commentName={commentName}
              />
            ) : (
              // AI 인사이트, 분석, 설정 탭들은 별도 컴포넌트 사용
              renderContent()
            )}
          </main>
        </div>
      </div>
      
      {/* 데이터 초기화 확인 모달 - 모달이 표시될 때만 렌더링 */}
      {showResetModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-[9999]">
          <div className="bg-white dark:bg-gray-800 rounded-lg p-6 max-w-md w-full mx-4 shadow-xl">
            {/* 모달 헤더 - 경고 아이콘과 제목 */}
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 bg-red-100 dark:bg-red-900/20 rounded-full flex items-center justify-center">
                <svg className="w-5 h-5 text-red-600 dark:text-red-400" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                </svg>
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                  초기화 확인
                </h3>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  모든 데이터를 초기화합니다
                </p>
              </div>
            </div>
            
            {/* 모달 내용 - 삭제될 데이터 목록 */}
            <div className="mb-6">
              <p className="text-gray-700 dark:text-gray-300 mb-3">
                다음 데이터가 모두 삭제됩니다:
              </p>
              <ul className="text-sm text-gray-600 dark:text-gray-400 space-y-1">
                <li>• 모든 할 일 목록</li>
                <li>• 댓글 작성자 이름 설정</li>
                <li>• 기타 저장된 데이터</li>
              </ul>
              <p className="text-sm text-red-600 dark:text-red-400 mt-3 font-medium">
                ⚠️ 이 작업은 되돌릴 수 없습니다.
              </p>
            </div>
            
            {/* 모달 버튼들 - 취소와 초기화 */}
            <div className="flex gap-3">
              {/* 취소 버튼 - 모달만 닫기 */}
              <button
                onClick={() => setShowResetModal(false)}
                className="flex-1 px-4 py-2 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg font-medium hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
              >
                취소
              </button>
              {/* 초기화 버튼 - 실제 데이터 삭제 실행 */}
              <button
                onClick={() => {
                  // 실제 데이터 초기화 실행
                  setTodos([]); // 할 일 목록 비우기
                  localStorage.removeItem('dorate-comment-name'); // 로컬 스토리지에서 댓글 이름 삭제
                  setCommentName('익명'); // 댓글 이름을 기본값으로 설정
                  setShowResetModal(false); // 모달 닫기
                }}
                className="flex-1 px-4 py-2 bg-red-600 dark:bg-red-500 text-white rounded-lg font-medium hover:bg-red-700 dark:hover:bg-red-600 transition-colors"
              >
                초기화
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// App 컴포넌트를 내보냅니다
export default App;