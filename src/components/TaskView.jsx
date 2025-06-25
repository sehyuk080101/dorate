import React, { useState, useMemo } from 'react';
import { AddTodo } from './AddTodo';
import { TodoList } from './TodoList';

export const TaskView = ({
  todos,
  categories,
  filter,
  searchTerm,
  onAdd,
  onToggle,
  onDelete,
  onUpdate,
  setTodos,
  addTodoExpandControl,
  addComment,
  deleteComment,
  addTag,
  deleteTag,
  commentName,
}) => {
  const [internalExpanded, setInternalExpanded] = useState(false);
  const expandControl = addTodoExpandControl || { isExpanded: internalExpanded, setIsExpanded: setInternalExpanded };

  const filteredTodos = useMemo(() => {
    return todos.filter(todo => {
      const matchesSearch = todo.text.toLowerCase().includes(searchTerm.toLowerCase()) ||
        todo.category.toLowerCase().includes(searchTerm.toLowerCase());
      if (!matchesSearch) return false;
      switch (filter) {
        case 'pending': return !todo.completed;
        case 'completed': return todo.completed;
        case 'overdue': return !todo.completed && todo.deadline && new Date() > todo.deadline;
        case 'today':
          if (!todo.deadline) return false;
          const today = new Date();
          return todo.deadline.toDateString() === today.toDateString();
        case 'all':
        default: return true;
      }
    });
  }, [todos, filter, searchTerm]);

  return (
    <div className="p-6 space-y-6">
      {filter === 'all' && (
        <AddTodo onAdd={onAdd} categories={categories} isExpanded={expandControl.isExpanded} setIsExpanded={expandControl.setIsExpanded} />
      )}
      <TodoList 
        todos={filteredTodos}
        onToggle={onToggle}
        onDelete={onDelete}
        onUpdate={onUpdate}
        hideFilters={true}
        onReorder={setTodos ? (newTodos) => setTodos(newTodos) : undefined}
        addComment={addComment}
        deleteComment={deleteComment}
        addTag={addTag}
        deleteTag={deleteTag}
        commentName={commentName}
      />
    </div>
  );
};