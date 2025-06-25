// React를 가져옵니다
import React from 'react';
// Lucide React에서 X 아이콘을 가져옵니다
import { X } from 'lucide-react';

// 재사용 가능한 모달 컴포넌트
export const Modal = ({ 
  open,      // 모달 표시 여부
  onClose,   // 모달 닫기 함수
  children   // 모달 내부에 표시할 내용
}) => {
  // 모달이 닫혀있으면 아무것도 렌더링하지 않습니다
  if (!open) return null;
  
  return (
    // 모달 오버레이 (배경)
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
      {/* 모달 컨테이너 */}
      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-hidden flex flex-col border border-gray-200 dark:border-gray-700">
        {/* 모달 헤더 */}
        <div className="flex items-center justify-between p-6 border-b border-gray-100 dark:border-gray-700">
          {/* 모달 제목 */}
          <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100">할 일 상세</h2>
          {/* 닫기 버튼 */}
          <button
            className="p-2 text-gray-400 dark:text-gray-500 hover:text-gray-600 dark:hover:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
            onClick={onClose}
            aria-label="닫기"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
        
        {/* 모달 내용 영역 */}
        <div className="flex-1 overflow-auto">
          {children}
        </div>
      </div>
    </div>
  );
}; 