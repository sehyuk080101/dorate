import React, { useState, useEffect } from 'react';
import { Filter, Search, SortAsc, Calendar, Flag, Tag, MessageCircle, Clock, Check, X, Trash2 } from 'lucide-react';
import { TodoItem } from './TodoItem';
import { DragDropContext, Droppable, Draggable } from '@hello-pangea/dnd';
import { Modal } from './Modal';

export const TodoList = ({ 
  todos, 
  onToggle, 
  onDelete, 
  onUpdate, 
  hideFilters = false, 
  onReorder,
  addComment,
  deleteComment,
  addTag,
  deleteTag,
  commentName,
}) => {
  const [filter, setFilter] = useState('all');
  const [sort, setSort] = useState('created');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedTodo, setSelectedTodo] = useState(null);

  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const todayCount = todos.filter(t => t.deadline && !t.completed && t.deadline >= today && t.deadline < new Date(today.getTime() + 24*60*60*1000)).length;

  const filteredTodos = hideFilters ? todos : todos.filter(todo => {
    const matchesSearch = todo.text.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         todo.category.toLowerCase().includes(searchTerm.toLowerCase());
    
    if (!matchesSearch) return false;

    switch (filter) {
      case 'pending':
        return !todo.completed;
      case 'completed':
        return todo.completed;
      case 'overdue':
        return !todo.completed && todo.deadline && new Date() > todo.deadline;
      default:
        return true;
    }
  });

  const sortedTodos = [...filteredTodos].sort((a, b) => {
    switch (sort) {
      case 'deadline':
        if (!a.deadline && !b.deadline) return 0;
        if (!a.deadline) return 1;
        if (!b.deadline) return -1;
        return a.deadline.getTime() - b.deadline.getTime();
      case 'priority':
        const priorityOrder = { high: 3, medium: 2, low: 1 };
        return priorityOrder[b.priority] - priorityOrder[a.priority];
      case 'alphabetical':
        return a.text.localeCompare(b.text);
      default:
        return b.createdAt.getTime() - a.createdAt.getTime();
    }
  });

  const filterButtons = [
    { type: 'all', label: '전체', count: todos.length },
    { type: 'pending', label: '미완료', count: todos.filter(t => !t.completed).length },
    { type: 'completed', label: '완료', count: todos.filter(t => t.completed).length },
    { type: 'overdue', label: '기한 초과', count: todos.filter(t => !t.completed && t.deadline && new Date() > t.deadline).length },
    { type: 'today', label: '오늘 마감', count: todayCount },
  ];

  const handleDragEnd = (result) => {
    if (!result.destination) return;
    const reordered = Array.from(todos);
    const [removed] = reordered.splice(result.source.index, 1);
    reordered.splice(result.destination.index, 0, removed);
    if (onReorder) onReorder(reordered);
  };

  const handleOpenModal = (todo) => {
    setSelectedTodo(todo);
  };

  const handleCloseModal = () => {
    setSelectedTodo(null);
  };

  const handleAddComment = (todoId, value) => {
    addComment(todoId, { text: value, name: commentName });
    const updated = todos.find(t => t.id === todoId);
    if (updated) setSelectedTodo({ ...updated });
  };

  useEffect(() => {
    if (selectedTodo && selectedTodo.id) {
      const updated = todos.find(t => t.id === selectedTodo.id);
      if (updated) setSelectedTodo(updated);
    }
  }, [todos]);

  // 우선순위 한글 변환 함수
  const getPriorityLabel = (priority) => {
    if (priority === 'high') return '높음';
    if (priority === 'medium') return '보통';
    return '낮음';
  };

  // 카테고리 한글 변환 함수
  const getCategoryLabel = (cat) => {
    if (cat === 'Work') return '업무';
    if (cat === 'Personal') return '개인';
    if (cat === 'Learning') return '학습';
    if (cat === 'Health') return '건강';
    return cat;
  };

  // 우선순위 색상 설정
  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'high': return 'text-red-600 bg-red-50 dark:text-red-400 dark:bg-red-900/20';
      case 'medium': return 'text-yellow-600 bg-yellow-50 dark:text-yellow-400 dark:bg-yellow-900/20';
      case 'low': return 'text-blue-600 bg-blue-50 dark:text-blue-400 dark:bg-blue-900/20';
      default: return 'text-gray-600 bg-gray-50 dark:text-gray-400 dark:bg-gray-700';
    }
  };

  // 카테고리 색상 설정
  const getCategoryColor = (category) => {
    switch (category) {
      case 'Work': return 'bg-blue-100 text-blue-800 dark:bg-blue-900/50 dark:text-blue-300';
      case 'Personal': return 'bg-purple-100 text-purple-800 dark:bg-purple-900/50 dark:text-purple-300';
      case 'Learning': return 'bg-green-100 text-green-800 dark:bg-green-900/50 dark:text-green-300';
      case 'Health': return 'bg-orange-100 text-orange-800 dark:bg-orange-900/50 dark:text-orange-300';
      default: return 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300';
    }
  };

  // TodoItem 클릭 시 모달 오픈 핸들러
  const handleItemClick = (e, todo) => {
    // 버튼(완료, 연필, 쓰레기통) 클릭 시에는 모달 오픈 방지
    if (
      e.target.closest('button') ||
      e.target.closest('svg')
    ) return;
    handleOpenModal(todo);
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-2 md:p-6">
      {!hideFilters && !selectedTodo && (
        <div className="p-6 border-b border-gray-200 dark:border-gray-700">
          <div className="flex flex-col lg:flex-row gap-4">
            <div className="flex-1">
              <div className="flex items-center bg-white dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg px-3 py-2">
                <Search className="text-gray-400 dark:text-gray-500 w-5 h-5 flex-shrink-0 mr-2" />
                <input
                  type="text"
                  placeholder="할 일 검색..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full bg-transparent outline-none text-gray-900 dark:text-gray-100 placeholder-gray-500 dark:placeholder-gray-400"
                />
              </div>
            </div>

            <div className="flex flex-wrap gap-2">
              <div className="flex items-center gap-1">
                <Filter className="w-4 h-4 text-gray-500 dark:text-gray-400" />
                {filterButtons.map(({ type, label, count }) => (
                  <button
                    key={type}
                    onClick={() => setFilter(type)}
                    className={`px-3 py-1.5 text-sm rounded-lg transition-all duration-200 ${
                      filter === type
                        ? 'bg-blue-600 dark:bg-blue-500 text-white shadow-sm'
                        : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
                    }`}
                  >
                    {label} {typeof count === 'number' ? `(${count})` : ''}
                  </button>
                ))}
              </div>

              <div className="flex items-center gap-1">
                <SortAsc className="w-4 h-4 text-gray-500 dark:text-gray-400" />
                <select
                  value={sort}
                  onChange={(e) => setSort(e.target.value)}
                  className="px-3 py-1.5 text-sm border border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400"
                >
                  <option value="created">생성일</option>
                  <option value="deadline">마감일</option>
                  <option value="priority">우선순위</option>
                  <option value="alphabetical">가나다순</option>
                </select>
              </div>
            </div>
          </div>
        </div>
      )}

      <div className="p-0 md:p-6">
        <div className="space-y-2 md:space-y-3">
          <DragDropContext onDragEnd={handleDragEnd}>
            <Droppable droppableId="todo-list">
              {(provided) => (
                <div ref={provided.innerRef} {...provided.droppableProps}>
                  {todos.length === 0 ? (
                    <div className="text-center py-12 text-gray-500 dark:text-gray-400">
                      <div className="w-16 h-16 mx-auto mb-4 bg-gray-100 dark:bg-gray-700 rounded-full flex items-center justify-center">
                        <Search className="w-8 h-8 text-gray-400 dark:text-gray-500" />
                      </div>
                      <p className="text-lg font-medium mb-2">할 일을 찾을 수 없습니다</p>
                      <p className="text-sm">
                        {searchTerm ? '검색어를 바꿔보세요' : '할 일을 추가해 시작해보세요!'}
                      </p>
                    </div>
                  ) : (
                    todos.map((todo, index) => (
                      <Draggable key={todo.id} draggableId={todo.id} index={index}>
                        {(provided, snapshot) => (
                          <div
                            ref={provided.innerRef}
                            {...provided.draggableProps}
                            {...provided.dragHandleProps}
                            className="mb-3"
                            style={{
                              ...provided.draggableProps.style,
                              opacity: snapshot.isDragging ? 0.7 : 1,
                            }}
                          >
                            <div onClick={e => handleItemClick(e, todo)}>
                              <TodoItem
                                todo={todo}
                                onToggle={onToggle}
                                onDelete={onDelete}
                                onUpdate={onUpdate}
                              />
                            </div>
                          </div>
                        )}
                      </Draggable>
                    ))
                  )}
                  {provided.placeholder}
                </div>
              )}
            </Droppable>
          </DragDropContext>
        </div>
      </div>

      <Modal open={!!selectedTodo} onClose={handleCloseModal}>
        {selectedTodo && (
          <div className="flex flex-col w-full max-w-2xl mx-auto p-0 bg-transparent h-[550px]">
            {/* 제목 및 정보 */}
            <div className="px-4 pt-6 pb-4 flex-shrink-0">
              <div className="flex items-center justify-between gap-4 mb-3">
                <h3 className={`text-3xl font-bold break-words tracking-tight leading-relaxed ${selectedTodo.completed ? 'line-through text-gray-400 dark:text-gray-500' : 'text-gray-900 dark:text-gray-100'}`}>{selectedTodo.text}</h3>
                <button
                  onClick={() => { onDelete(selectedTodo.id); handleCloseModal(); }}
                  className="p-2 text-zinc-300 dark:text-zinc-600 hover:text-red-500 dark:hover:text-red-400 rounded-full transition-colors"
                  title="삭제"
                >
                  <Trash2 className="w-6 h-6" />
                </button>
              </div>
              <div className="flex flex-wrap items-center gap-3 mb-3">
                <div className="flex items-center gap-1">
                  <Tag className="w-3 h-3 text-gray-500 dark:text-gray-400" />
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${getCategoryColor(selectedTodo.category)}`}>{getCategoryLabel(selectedTodo.category)}</span>
                </div>
                <div className="flex items-center gap-1">
                  <Flag className="w-3 h-3 text-gray-500 dark:text-gray-400" />
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${getPriorityColor(selectedTodo.priority)}`}>{getPriorityLabel(selectedTodo.priority)}</span>
                </div>
                {(selectedTodo.tags && selectedTodo.tags.length > 0) && selectedTodo.tags.map((tag, i) => (
                  <div key={tag + i} className="flex items-center gap-1">
                    <span className="w-2 h-2 bg-blue-500 rounded-full"></span>
                    <span className="bg-blue-100 dark:bg-blue-900/50 text-blue-700 dark:text-blue-300 px-2 py-1 rounded-full text-xs">{tag}</span>
                  </div>
                ))}
              </div>
              <div className="border-t border-zinc-200 dark:border-zinc-800 my-4" />
              <div className="flex flex-wrap gap-6 text-sm text-zinc-500 dark:text-zinc-400 mb-3">
                <div className="flex items-center gap-1">
                  <Calendar className="w-4 h-4" />
                  <span>마감일:</span>
                  <span className="font-medium text-zinc-700 dark:text-zinc-200">{selectedTodo.deadline ? new Date(selectedTodo.deadline).toLocaleString() : '설정되지 않음'}</span>
                </div>
                <div className="flex items-center gap-1">
                  <Clock className="w-4 h-4" />
                  <span>생성일:</span>
                  <span className="font-medium text-zinc-700 dark:text-zinc-200">{selectedTodo.createdAt.toLocaleString()}</span>
                </div>
              </div>
            </div>
            <div className="border-t border-zinc-200 dark:border-zinc-800 mb-4 flex-shrink-0" />
            {/* 댓글 섹션 */}
            <div className="px-4 flex flex-col flex-1 min-h-0">
              <div className="flex items-center gap-2 mb-4 flex-shrink-0">
                <MessageCircle className="w-5 h-5 text-zinc-400 dark:text-zinc-600" />
                <h4 className="text-lg font-medium text-zinc-700 dark:text-zinc-200">댓글</h4>
                <span className="bg-zinc-100 dark:bg-zinc-800 text-zinc-500 dark:text-zinc-400 text-xs px-2 py-1 rounded-full">
                  {(selectedTodo.comments || []).length}
                </span>
              </div>
              {/* 댓글 리스트 */}
              <div className="space-y-4 overflow-y-auto flex-1 mb-4">
                {(selectedTodo.comments || []).length > 0 ? (
                  selectedTodo.comments.map((comment) => (
                    <div key={comment.id} className="bg-zinc-50 dark:bg-zinc-900 rounded-lg p-4">
                      <div className="flex items-start justify-between gap-2">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <span className="bg-blue-600 dark:bg-blue-500 text-white text-xs font-medium px-2 py-1 rounded-full">
                              {comment.name || '익명'}
                            </span>
                            <span className="text-xs text-zinc-400 dark:text-zinc-500">
                              {comment.createdAt ? new Date(comment.createdAt).toLocaleString() : ''}
                            </span>
                          </div>
                          <p className="text-sm text-zinc-800 dark:text-zinc-200">{comment.text}</p>
                        </div>
                        <button
                          onClick={() => deleteComment(selectedTodo.id, comment.id)}
                          className="text-zinc-400 dark:text-zinc-500 hover:text-red-500 dark:hover:text-red-400 transition-colors p-1"
                          title="댓글 삭제"
                        >
                          <X className="w-3 h-3" />
                        </button>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="text-center text-zinc-400 dark:text-zinc-600 leading-relaxed py-4">
                    <MessageCircle className="w-8 h-8 mx-auto mb-2" />
                    <p className="text-sm">아직 댓글이 없습니다</p>
                  </div>
                )}
              </div>
            </div>
            {/* 댓글 입력란 - 모달 하단에 완전히 분리하여 고정 */}
            <div className="px-4 pb-8 flex-shrink-0">
              <form 
                className="flex gap-2" 
                onSubmit={e => {
                  e.preventDefault();
                  const value = e.target.comment.value.trim();
                  if (value) {
                    handleAddComment(selectedTodo.id, value);
                    e.target.comment.value = '';
                  }
                }}
              >
                <input 
                  name="comment" 
                  type="text" 
                  placeholder="댓글을 입력하세요..." 
                  className="flex-1 border border-zinc-200 dark:border-zinc-700 bg-transparent text-zinc-900 dark:text-zinc-100 placeholder-zinc-400 dark:placeholder-zinc-500 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 focus:border-transparent" 
                  autoComplete="off" 
                />
                <button 
                  type="submit" 
                  className="px-4 py-2 bg-blue-600 dark:bg-blue-500 text-white rounded-lg text-sm font-medium hover:bg-blue-700 dark:hover:bg-blue-600 transition-colors"
                >
                  추가
                </button>
              </form>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
};