import React, { useState } from 'react';
import { Check, Edit2, Trash2, GripVertical, AlertCircle, Circle, CheckCircle2 } from 'lucide-react';
import { Todo } from '../types';

interface TodoItemProps {
  todo: Todo;
  onUpdate: (id: string, updates: Partial<Todo>) => void;
  onDelete: (id: string) => void;
}

const TodoItem: React.FC<TodoItemProps> = ({ todo, onUpdate, onDelete }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editTitle, setEditTitle] = useState(todo.title);
  const [editDescription, setEditDescription] = useState(todo.description || '');
  const [editPriority, setEditPriority] = useState(todo.priority);

  const handleSave = () => {
    if (!editTitle.trim()) return; // Prevent saving empty title
    onUpdate(todo._id, {
      title: editTitle,
      description: editDescription,
      priority: editPriority,
    });
    setIsEditing(false);
  };

  const handleCancel = () => {
    setEditTitle(todo.title);
    setEditDescription(todo.description || '');
    setEditPriority(todo.priority);
    setIsEditing(false);
  };

  const toggleComplete = () => {
    onUpdate(todo._id, { completed: !todo.completed });
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high':
        return 'bg-red-500/20 text-red-300 border-red-500/30';
      case 'medium':
        return 'bg-yellow-500/20 text-yellow-300 border-yellow-500/30';
      case 'low':
        return 'bg-green-500/20 text-green-300 border-green-500/30';
      default:
        return 'bg-gray-500/20 text-gray-300 border-gray-500/30';
    }
  };

  const getPriorityIcon = (priority: string) => {
    switch (priority) {
      case 'high':
        return <AlertCircle size={16} />;
      case 'medium':
      case 'low':
      default:
        return <Circle size={16} />;
    }
  };

  if (isEditing) {
    return (
      <div className="bg-white/5 border border-white/20 rounded-xl p-4 hover:bg-white/10 transition-all duration-200">
        <div className="space-y-3">
          <input
            type="text"
            value={editTitle}
            onChange={(e) => setEditTitle(e.target.value)}
            className="w-full px-3 py-2 bg-white/5 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-colors"
            placeholder="Todo title"
          />
          <textarea
            value={editDescription}
            onChange={(e) => setEditDescription(e.target.value)}
            className="w-full px-3 py-2 bg-white/5 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-colors resize-none"
            placeholder="Description (optional)"
            rows={2}
          />
          <select
            value={editPriority}
            onChange={(e) => setEditPriority(e.target.value as 'low' | 'medium' | 'high')}
            className="px-3 py-2 bg-white/5 border border-white/20 rounded-lg text-white focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-colors"
          >
            <option value="low">Low Priority</option>
            <option value="medium">Medium Priority</option>
            <option value="high">High Priority</option>
          </select>
          <div className="flex gap-2">
            <button
              onClick={handleSave}
              className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors"
            >
              Save
            </button>
            <button
              onClick={handleCancel}
              className="px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition-colors"
            >
              Cancel
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={`bg-white/5 border border-white/20 rounded-xl p-4 hover:bg-white/10 transition-all duration-200 group ${
      todo.completed ? 'opacity-75' : ''
    }`}>
      <div className="flex items-start gap-4">
        <div className="flex items-center gap-3">
          <GripVertical size={20} className="text-gray-400 cursor-grab active:cursor-grabbing" />
          <button
            onClick={toggleComplete}
            className={`flex items-center justify-center w-6 h-6 rounded-full border-2 transition-all duration-200 ${
              todo.completed
                ? 'bg-green-500 border-green-500 text-white'
                : 'border-gray-400 hover:border-green-400'
            }`}
          >
            {todo.completed && <CheckCircle2 size={16} />}
          </button>
        </div>

        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-4">
            <div className="flex-1">
              <h3 className={`font-medium text-white mb-1 ${
                todo.completed ? 'line-through text-gray-400' : ''
              }`}>
                {todo.title}
              </h3>
              {todo.description && (
                <p className={`text-sm text-gray-300 mb-2 ${
                  todo.completed ? 'line-through text-gray-500' : ''
                }`}>
                  {todo.description}
                </p>
              )}
              <div className="flex items-center gap-2">
                <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium border ${getPriorityColor(todo.priority)}`}>
                  {getPriorityIcon(todo.priority)}
                  {todo.priority}
                </span>
                <span className="text-xs text-gray-400">
                  {new Date(todo.created_at).toLocaleDateString()}
                </span>
              </div>
            </div>

            <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
              <button
                onClick={() => setIsEditing(true)}
                className="p-2 text-gray-400 hover:text-blue-400 hover:bg-blue-500/20 rounded-lg transition-all duration-200"
              >
                <Edit2 size={16} />
              </button>
              <button
                onClick={() => onDelete(todo._id)}
                className="p-2 text-gray-400 hover:text-red-400 hover:bg-red-500/20 rounded-lg transition-all duration-200"
              >
                <Trash2 size={16} />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TodoItem;