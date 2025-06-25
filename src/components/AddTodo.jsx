import React, { useState } from 'react';
import { Plus, Calendar, Flag, Tag } from 'lucide-react';

export const AddTodo = ({ onAdd, categories, isExpanded: externalExpanded, setIsExpanded: setExternalExpanded }) => {
  const [text, setText] = useState('');
  const [priority, setPriority] = useState('medium');
  const [category, setCategory] = useState(categories[0]?.name || 'Work');
  const [date, setDate] = useState('');
  const [time, setTime] = useState('');
  const [isExpanded, setIsExpanded] = useState(false);
  // 미리보기용 state
  const [previewDate, setPreviewDate] = useState('');
  const [previewTime, setPreviewTime] = useState('');

  // 외부 제어 우선
  const expanded = externalExpanded !== undefined ? externalExpanded : isExpanded;
  const setExpand = setExternalExpanded || setIsExpanded;

  // 텍스트에서 날짜/시간 파싱 (한국어 주요 패턴 지원)
  const parseDateTimeFromText = (input) => {
    let now = new Date();
    let matched = false;
    let newDate = '';
    let newTime = '';
    let newText = input;
    // 내일/오늘/모레 (어제 제거)
    const dayPatterns = [
      { regex: /내일/, offset: 1 },
      { regex: /모레/, offset: 2 },
      { regex: /오늘/, offset: 0 },
    ];
    for (const p of dayPatterns) {
      // '내일', '내일까지', '내일에', '내일부터' 등 조사 포함 제거
      const pattern = new RegExp(p.regex.source + '(까지|부터|에)?');
      if (pattern.test(newText)) {
        let d = new Date(now);
        d.setDate(now.getDate() + p.offset);
        // 로컬 기준 날짜로 변환
        const yyyy = d.getFullYear();
        const mm = String(d.getMonth() + 1).padStart(2, '0');
        const dd = String(d.getDate()).padStart(2, '0');
        newDate = `${yyyy}-${mm}-${dd}`;
        newText = newText.replace(pattern, '');
        matched = true;
        break;
      }
    }
    // 다음주 (월~일) + 조사
    const weekDays = ['일', '월', '화', '수', '목', '금', '토'];
    const nextWeekMatch = newText.match(/다음주\s*([월화수목금토일])요일?(까지|부터|에)?/);
    if (nextWeekMatch) {
      let today = now.getDay();
      let target = weekDays.indexOf(nextWeekMatch[1]);
      let daysToAdd = 7 + ((target - today + 7) % 7);
      let d = new Date(now);
      d.setDate(now.getDate() + daysToAdd);
      newDate = d.toISOString().slice(0, 10);
      newText = newText.replace(nextWeekMatch[0], '');
      matched = true;
    }
    // 이번주 (월~일) + 조사 - 오늘 이전 요일은 제외
    const thisWeekMatch = newText.match(/이번주\s*([월화수목금토일])요일?(까지|부터|에)?/);
    if (thisWeekMatch) {
      let today = now.getDay();
      let target = weekDays.indexOf(thisWeekMatch[1]);
      let daysToAdd = (target - today + 7) % 7;
      // 오늘 이전 요일이면 다음주로 설정
      if (daysToAdd === 0 && target < today) {
        daysToAdd = 7;
      }
      let d = new Date(now);
      d.setDate(now.getDate() + daysToAdd);
      newDate = d.toISOString().slice(0, 10);
      newText = newText.replace(thisWeekMatch[0], '');
      matched = true;
    }
    // 시간 (오전/오후/AM/PM 지원) + 조사 (분까지 지원)
    const timeMatch = newText.match(/(오전|오후)?\s*(\d{1,2})시(\s*(\d{1,2})분)?(까지|부터|에)?/);
    if (timeMatch) {
      let hour = parseInt(timeMatch[2], 10);
      let minute = timeMatch[4] ? parseInt(timeMatch[4], 10) : 0;
      if (timeMatch[1] === '오후' && hour < 12) hour += 12;
      if (timeMatch[1] === '오전' && hour === 12) hour = 0;
      newTime = `${hour.toString().padStart(2, '0')}:${minute.toString().padStart(2, '0')}`;
      newText = newText.replace(timeMatch[0], '');
      matched = true;
    }
    // 콜론(:) 기반 시간(2:30, 14:30 등) 파싱 (항상 동작)
    const colonTimeRegex = /\b(\d{1,2}):(\d{2})\b/;
    const colonTimeMatch = newText.match(colonTimeRegex);
    if (colonTimeMatch) {
      let hour = parseInt(colonTimeMatch[1], 10);
      let minute = parseInt(colonTimeMatch[2], 10);
      newTime = `${hour.toString().padStart(2, '0')}:${minute.toString().padStart(2, '0')}`;
      newText = newText.replace(colonTimeRegex, '');
      matched = true;
    }
    // fallback: 15:30 등 기존 포맷 + 조사
    if (!matched) {
      const dateRegex = /(\d{4}-\d{2}-\d{2})(?:[ T](\d{2}:\d{2}))?(까지|부터|에)?/;
      const dateMatch = input.match(dateRegex);
      if (dateMatch) {
        newDate = dateMatch[1];
        if (dateMatch[2]) newTime = dateMatch[2];
        return { newText: input.replace(dateRegex, '').trim(), newDate, newTime };
      }
      const timeRegex = /\b(\d{2}:\d{2})(까지|부터|에)?\b/;
      const timeMatch2 = input.match(timeRegex);
      if (timeMatch2) {
        newTime = timeMatch2[1];
        return { newText: input.replace(timeRegex, '').trim(), newDate, newTime };
      }
      return { newText: input, newDate: '', newTime: '' };
    }
    
    // 파싱된 날짜가 현재 시간보다 이전인지 확인
    if (newDate) {
      const parsedDate = new Date(newDate + (newTime ? 'T' + newTime : ''));
      const now = new Date();
      if (parsedDate <= now) {
        // 현재 시간보다 이전이면 날짜와 시간을 초기화
        newDate = '';
        newTime = '';
      }
    }
    
    return { newText: newText.trim(), newDate, newTime };
  };

  // 텍스트 입력 시에는 미리보기만 업데이트
  const handleTextChange = (e) => {
    const value = e.target.value;
    setText(value);
    const preview = parseDateTimeFromText(value);
    setPreviewDate(preview.newDate);
    setPreviewTime(preview.newTime);
    setExpand(true);
    setTimeout(() => {
      if (e.target.setSelectionRange) {
        e.target.setSelectionRange(value.length, value.length);
      }
    }, 0);
  };

  // 제출 시에만 실제 파싱해서 필드에 반영
  const handleSubmit = (e) => {
    e.preventDefault();
    if (text.trim()) {
      const parsed = parseDateTimeFromText(text);
      let deadlineDate = undefined;
      if (parsed.newDate) {
        setDate(parsed.newDate);
      }
      if (parsed.newTime) {
        setTime(parsed.newTime);
      }
      if (parsed.newDate) {
        deadlineDate = new Date(`${parsed.newDate}${parsed.newTime ? 'T' + parsed.newTime : ''}`);
      } else if (date) {
        deadlineDate = new Date(`${date}${time ? 'T' + time : ''}`);
      }
      onAdd(parsed.newText.trim(), priority, category, deadlineDate);
      setText('');
      setDate('');
      setTime('');
      setPreviewDate('');
      setPreviewTime('');
    }
  };

  const priorityColors = {
    low: 'text-blue-600 bg-blue-50 border-blue-200 dark:text-blue-400 dark:bg-blue-900/50 dark:border-blue-800',
    medium: 'text-yellow-600 bg-yellow-50 border-yellow-200 dark:text-yellow-400 dark:bg-yellow-900/50 dark:border-yellow-800',
    high: 'text-red-600 bg-red-50 border-red-200 dark:text-red-400 dark:bg-red-900/50 dark:border-red-800',
  };

  // 카테고리 한글 변환 함수
  const getCategoryLabel = (cat) => {
    if (cat === 'Work') return '업무';
    if (cat === 'Personal') return '개인';
    if (cat === 'Learning') return '학습';
    if (cat === 'Health') return '건강';
    return cat;
  };

  // 입력란 포커스/블러 핸들러
  const handleInputFocus = () => setExpand(true);
  const handleInputBlur = (e) => {
    // 폼 내 다른 요소 클릭 시에는 유지, 폼 전체 포커스 아웃 시에만 닫힘
    if (!e.currentTarget.contains(e.relatedTarget)) setExpand(false);
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-3 md:p-6 mb-4 md:mb-6">
      <form onSubmit={handleSubmit} className="space-y-3 md:space-y-4" tabIndex={-1} onBlur={handleInputBlur}>
        <div className="flex flex-col md:flex-row gap-2 md:gap-3">
          <input
            type="text"
            value={text}
            onChange={handleTextChange}
            onFocus={handleInputFocus}
            placeholder="새 할 일을 입력하세요... (예: 내일 15:30 회의)"
            className="flex-1 px-4 py-3 border border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 placeholder-gray-500 dark:placeholder-gray-400 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 focus:border-transparent transition-all duration-200"
          />
          <button
            type="submit"
            disabled={!text.trim()}
            className={`px-6 py-3 rounded-lg font-medium transition-all duration-200 flex items-center gap-2 ${
              text.trim()
                ? 'bg-blue-600 dark:bg-blue-500 text-white hover:bg-blue-700 dark:hover:bg-blue-600 shadow-sm hover:shadow-md'
                : 'bg-gray-100 dark:bg-gray-700 text-gray-400 dark:text-gray-500 cursor-not-allowed'
            }`}
          >
            <Plus className="w-4 h-4" />
            추가
          </button>
        </div>
        {/* 실시간 파싱 미리보기 */}
        {(previewDate || previewTime) && (
          <div className="text-xs text-gray-500 dark:text-gray-400 pt-1 pl-1">
            파싱 결과: {previewDate} {previewTime}
          </div>
        )}
        {expanded && (
          <div className="flex flex-wrap gap-2 md:gap-3 pt-2 border-t border-gray-100 dark:border-gray-700">
            <div className="flex items-center gap-2">
              <Flag className="w-4 h-4 text-gray-500 dark:text-gray-400" />
              <select
                value={priority}
                onChange={(e) => setPriority(e.target.value)}
                className={`px-3 py-1.5 text-sm rounded-lg border ${priorityColors[priority]} focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400`}
              >
                <option value="low">낮음</option>
                <option value="medium">보통</option>
                <option value="high">높음</option>
              </select>
            </div>
            <div className="flex items-center gap-2">
              <Tag className="w-4 h-4 text-gray-500 dark:text-gray-400" />
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="px-3 py-1.5 text-sm border border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400"
              >
                {categories.map((cat) => (
                  <option key={cat.id} value={cat.name}>
                    {getCategoryLabel(cat.name)}
                  </option>
                ))}
              </select>
            </div>
            <div className="flex items-center gap-2">
              <Calendar className="w-4 h-4 text-gray-500 dark:text-gray-400" />
              <input
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className="px-3 py-1.5 text-sm border border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400"
                min={new Date().toISOString().split('T')[0]}
                placeholder="마감일"
              />
              <input
                type="time"
                value={time}
                onChange={(e) => setTime(e.target.value)}
                className="px-3 py-1.5 text-sm border border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400"
                placeholder="시간"
              />
            </div>
          </div>
        )}
      </form>
    </div>
  );
};