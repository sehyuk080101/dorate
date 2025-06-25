import { useState, useEffect, useCallback } from 'react';

const STORAGE_KEY = 'completedTasks';

export const useTodos = () => {
  const [todos, setTodos] = useState(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        return parsed.map((todo) => ({
          ...todo,
          createdAt: new Date(todo.createdAt),
          deadline: todo.deadline ? new Date(todo.deadline) : undefined,
          completedAt: todo.completedAt ? new Date(todo.completedAt) : undefined,
          comments: Array.isArray(todo.comments)
            ? todo.comments.map((c) => {
                if (typeof c === 'string') {
                  // string -> 객체 변환
                  return {
                    id: Math.random().toString(36).slice(2),
                    name: '익명',
                    text: c,
                    createdAt: new Date(),
                  };
                } else if (c && typeof c === 'object' && !c.id) {
                  // {text, name} -> 객체 변환
                  return {
                    id: Math.random().toString(36).slice(2),
                    name: c.name || '익명',
                    text: c.text || '',
                    createdAt: c.createdAt ? new Date(c.createdAt) : new Date(),
                  };
                } else if (c && typeof c === 'object') {
                  // 이미 정상 구조
                  return {
                    ...c,
                    createdAt: c.createdAt ? new Date(c.createdAt) : new Date(),
                  };
                }
                return c;
              })
            : [],
        }));
      } catch (error) {
        console.error('Failed to load todos from localStorage:', error);
      }
    }
    return [];
  });
  const [categories, setCategories] = useState([
    { id: '1', name: 'Work', color: '#3B82F6', count: 0 },
    { id: '2', name: 'Personal', color: '#8B5CF6', count: 0 },
    { id: '3', name: 'Learning', color: '#10B981', count: 0 },
    { id: '4', name: 'Health', color: '#F59E0B', count: 0 },
  ]);

  // Save todos to localStorage whenever todos change
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(todos));
  }, [todos]);

  // Update category counts whenever todos change
  useEffect(() => {
    const updatedCategories = categories.map(category => ({
      ...category,
      count: todos.filter(todo => todo.category === category.name && !todo.completed).length
    }));
    setCategories(updatedCategories);
    // eslint-disable-next-line
  }, [todos]);

  const addTodo = useCallback((text, priority, category, deadline, tags = []) => {
    const newTodo = {
      id: Date.now().toString(),
      text,
      completed: false,
      priority,
      category,
      deadline,
      createdAt: new Date(),
      comments: [],
      tags,
    };
    setTodos(prev => [newTodo, ...prev]);
  }, []);

  const toggleTodo = useCallback((id) => {
    setTodos(prev => prev.map(todo => 
      todo.id === id 
        ? { 
            ...todo, 
            completed: !todo.completed,
            completedAt: !todo.completed ? new Date() : undefined
          }
        : todo
    ));
  }, []);

  const deleteTodo = useCallback((id) => {
    setTodos(prev => prev.filter(todo => todo.id !== id));
  }, []);

  const updateTodo = useCallback((id, updates) => {
    setTodos(prev => prev.map(todo => 
      todo.id === id ? { ...todo, ...updates } : todo
    ));
  }, []);

  const getStats = useCallback(() => {
    const total = todos.length;
    const completed = todos.filter(todo => todo.completed).length;
    const pending = total - completed;
    const overdue = todos.filter(todo => 
      !todo.completed && 
      todo.deadline && 
      new Date() > todo.deadline
    ).length;
    const completionRate = total > 0 ? Math.round((completed / total) * 100) : 0;

    return { total, completed, pending, overdue, completionRate };
  }, [todos]);

  const getTodaysTodos = useCallback(() => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    return todos.filter(todo => {
      if (!todo.deadline) return false;
      return todo.deadline >= today && todo.deadline < tomorrow;
    });
  }, [todos]);

  // 기간별 완료/실패 task 추출
  const getPeriodTasks = (period) => {
    const now = new Date();
    let start;
    if (period === 'day') {
      start = new Date(now);
      start.setHours(0, 0, 0, 0);
    } else if (period === 'week') {
      start = new Date(now);
      const day = start.getDay();
      start.setDate(start.getDate() - day); // 일요일 기준
      start.setHours(0, 0, 0, 0);
    } else if (period === 'month') {
      start = new Date(now.getFullYear(), now.getMonth(), 1);
    } else {
      // 기본값: 오늘 하루
      start = new Date(now);
      start.setHours(0, 0, 0, 0);
    }
    
    // 해당 기간의 모든 할 일
    const allTasksInPeriod = todos.filter(todo => {
      // 생성된 할 일이 해당 기간 내에 있거나
      // 완료된 할 일이 해당 기간 내에 있거나
      // 기한이 해당 기간 내에 있는 할 일
      return (todo.createdAt && todo.createdAt >= start) ||
             (todo.completedAt && todo.completedAt >= start) ||
             (todo.deadline && todo.deadline >= start);
    });
    
    // 완료한 일
    const completedTasks = allTasksInPeriod.filter(todo =>
      todo.completed && todo.completedAt && todo.completedAt >= start
    );
    
    // 실패한 일: 기한이 지났고 미완료
    const failedTasks = allTasksInPeriod.filter(todo =>
      !todo.completed && todo.deadline && todo.deadline < now && todo.deadline >= start
    );
    
    // 미완료된 일 (기한이 있지만 아직 지나지 않음)
    const pendingTasksWithDeadline = allTasksInPeriod.filter(todo =>
      !todo.completed && todo.deadline && todo.deadline >= now
    );
    
    // 기한이 없는 미완료된 일
    const pendingTasksWithoutDeadline = allTasksInPeriod.filter(todo =>
      !todo.completed && !todo.deadline
    );
    
    // 성공률 계산: 완료된 할 일 / 전체 할 일
    const totalTasks = allTasksInPeriod.length;
    const successRate = totalTasks > 0 ? Math.round((completedTasks.length / totalTasks) * 100) : 0;
    
    return { completedTasks, failedTasks, successRate, allTasksInPeriod };
  };

  // 댓글 추가
  const addComment = useCallback((todoId, comment) => {
    setTodos(prev => prev.map(todo =>
      todo.id === todoId
        ? { ...todo, comments: [...(todo.comments || []), { id: Date.now().toString(), name: comment.name, text: comment.text, createdAt: new Date() }] }
        : todo
    ));
  }, []);
  // 댓글 삭제
  const deleteComment = useCallback((todoId, commentId) => {
    setTodos(prev => prev.map(todo =>
      todo.id === todoId
        ? { ...todo, comments: (todo.comments || []).filter(c => c.id !== commentId) }
        : todo
    ));
  }, []);
  // 태그 추가
  const addTag = useCallback((todoId, tag) => {
    setTodos(prev => prev.map(todo =>
      todo.id === todoId
        ? { ...todo, tags: [...(todo.tags || []), tag] }
        : todo
    ));
  }, []);
  // 태그 삭제
  const deleteTag = useCallback((todoId, tag) => {
    setTodos(prev => prev.map(todo =>
      todo.id === todoId
        ? { ...todo, tags: (todo.tags || []).filter(t => t !== tag) }
        : todo
    ));
  }, []);

  return {
    todos,
    categories,
    addTodo,
    toggleTodo,
    deleteTodo,
    updateTodo,
    getStats,
    getTodaysTodos,
    setTodos,
    getPeriodTasks,
    addComment,
    deleteComment,
    addTag,
    deleteTag,
  };
};