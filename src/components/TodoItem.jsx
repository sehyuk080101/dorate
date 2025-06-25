import React, { useState } from 'react';
import { Check, Clock, Flag, Trash2, Edit3, X, Calendar } from 'lucide-react';

export const TodoItem = ({ todo, onToggle, onDelete, onUpdate }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editText, setEditText] = useState(todo.text);

  const handleSave = () => {
    if (editText.trim()) {
      onUpdate(todo.id, { text: editText.trim() });
      setIsEditing(false);
    }
  };

  const handleCancel = () => {
    setEditText(todo.text);
    setIsEditing(false);
  };

  const isOverdue = todo.deadline && new Date() > todo.deadline && !todo.completed;
  const isDueToday = todo.deadline && new Date().toDateString() === todo.deadline.toDateString();

  const priorityConfig = {
    low: { 
      color: 'border-l-blue-400 dark:border-l-blue-500', 
      bg: 'bg-blue-50 dark:bg-blue-900/20', 
      text: 'text-blue-700 dark:text-blue-400' 
    },
    medium: { 
      color: 'border-l-yellow-400 dark:border-l-yellow-500', 
      bg: 'bg-yellow-50 dark:bg-yellow-900/20', 
      text: 'text-yellow-700 dark:text-yellow-400' 
    },
    high: { 
      color: 'border-l-red-400 dark:border-l-red-500', 
      bg: 'bg-red-50 dark:bg-red-900/20', 
      text: 'text-red-700 dark:text-red-400' 
    },
  };

  const categoryColors = {
    Work: '#3B82F6',
    Personal: '#8B5CF6',
    Learning: '#10B981',
    Health: '#F59E0B',
  };

  const getPriorityLabel = (priority) => {
    if (priority === 'high') return '높음';
    if (priority === 'medium') return '보통';
    return '낮음';
  };

  const getCategoryLabel = (cat) => {
    if (cat === 'Work') return '업무';
    if (cat === 'Personal') return '개인';
    if (cat === 'Learning') return '학습';
    if (cat === 'Health') return '건강';
    return cat;
  };

  return (
    <div
      className={`group bg-white dark:bg-gray-800 rounded-lg border-l-4 shadow-sm border border-gray-100 dark:border-gray-700 p-4 transition-all duration-200 hover:shadow-md ${
        priorityConfig[todo.priority].color
      } ${todo.completed ? 'opacity-75' : ''} ${isOverdue ? 'ring-2 ring-red-200 dark:ring-red-800' : ''}`}
    >
      <div className="flex items-start gap-3">
        <button
          onClick={() => onToggle(todo.id)}
          className={`flex-shrink-0 w-5 h-5 rounded-full border-2 transition-all duration-200 flex items-center justify-center ${
            todo.completed
              ? 'bg-green-500 dark:bg-green-600 border-green-500 dark:border-green-600 text-white'
              : 'border-gray-300 dark:border-gray-600 hover:border-green-500 dark:hover:border-green-400 hover:bg-green-50 dark:hover:bg-green-900/20'
          }`}
        >
          {todo.completed && <Check className="w-3 h-3" />}
        </button>

        <div className="flex-1 min-w-0">
          {isEditing ? (
            <div className="flex gap-2">
              <input
                type="text"
                value={editText}
                onChange={(e) => setEditText(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') handleSave();
                  if (e.key === 'Escape') handleCancel();
                }}
                className="flex-1 px-2 py-1 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400"
                autoFocus
              />
              <button
                onClick={handleSave}
                className="p-1 text-green-600 dark:text-green-400 hover:bg-green-50 dark:hover:bg-green-900/20 rounded"
              >
                <Check className="w-4 h-4" />
              </button>
              <button
                onClick={handleCancel}
                className="p-1 text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-700 rounded"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          ) : (
            <div>
              <p
                className={`font-medium ${
                  todo.completed ? 'line-through text-gray-500 dark:text-gray-400' : 'text-gray-900 dark:text-gray-100'
                }`}
              >
                {todo.text}
              </p>
              
              <div className="flex items-center gap-3 mt-2 text-sm text-gray-600 dark:text-gray-400">
                <div className="flex items-center gap-1">
                  <Flag className={`w-3 h-3 ${priorityConfig[todo.priority].text}`} />
                  <span className={priorityConfig[todo.priority].text}>
                    {getPriorityLabel(todo.priority)}
                  </span>
                </div>

                <div
                  className="px-2 py-1 rounded-full text-xs font-medium text-white"
                  style={{ backgroundColor: categoryColors[todo.category] || '#6B7280' }}
                >
                  {getCategoryLabel(todo.category)}
                </div>

                {todo.deadline && (
                  <div className={`flex items-center gap-1 ${
                    isOverdue ? 'text-red-600 dark:text-red-400' : isDueToday ? 'text-orange-600 dark:text-orange-400' : 'text-gray-600 dark:text-gray-400'
                  }`}>
                    <Calendar className="w-3 h-3" />
                    <span className="text-xs">
                      {todo.deadline.toLocaleDateString()}
                      {isOverdue && ' (기한 초과)'}
                      {isDueToday && ' (오늘 마감)'}
                    </span>
                  </div>
                )}

                <div className="flex items-center gap-1 text-xs text-gray-500 dark:text-gray-400">
                  <Clock className="w-3 h-3" />
                  {todo.createdAt.toLocaleDateString()}
                </div>
              </div>
            </div>
          )}
        </div>

        <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
          {!isEditing && (
            <button
              onClick={() => setIsEditing(true)}
              className="p-1.5 text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded"
            >
              <Edit3 className="w-4 h-4" />
            </button>
          )}
          <button
            onClick={() => onDelete(todo.id)}
            className="p-1.5 text-gray-600 dark:text-gray-400 hover:text-red-600 dark:hover:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 rounded"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};