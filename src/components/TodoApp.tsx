// Updated TodoApp.tsx with safe draggableId handling and complete code

import React, { useState, useEffect } from 'react';
import { Plus, LogOut, Search, Filter, CheckSquare } from 'lucide-react';
import { DragDropContext, Droppable, Draggable } from '@hello-pangea/dnd';
import TodoItem from './TodoItem';
import TodoForm from './TodoForm';
import { User, Todo } from '../types';
import { todoAPI } from '../services/api';

interface TodoAppProps {
  user: User;
  onLogout: () => void;
}

const TodoApp: React.FC<TodoAppProps> = ({ user, onLogout }) => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState<'all' | 'active' | 'completed'>('all');
  const [filterPriority, setFilterPriority] = useState<'all' | 'low' | 'medium' | 'high'>('all');

  useEffect(() => {
    fetchTodos();
  }, []);

  const fetchTodos = async () => {
    try {
      const todosData = await todoAPI.getTodos();
      setTodos(todosData);
    } catch (error) {
      console.error('Failed to fetch todos:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateTodo = async (todoData: Partial<Todo>) => {
    try {
      const newTodo = await todoAPI.createTodo(todoData);
      setTodos([newTodo, ...todos]);
      setShowForm(false);
    } catch (error) {
      console.error('Failed to create todo:', error);
    }
  };

  const handleUpdateTodo = async (id: string, updates: Partial<Todo>) => {
    try {
      const updatedTodo = await todoAPI.updateTodo(id, updates);
      setTodos(todos.map(todo => todo._id === id ? updatedTodo : todo));
    } catch (error) {
      console.error('Failed to update todo:', error);
    }
  };

  const handleDeleteTodo = async (id: string) => {
    try {
      await todoAPI.deleteTodo(id);
      setTodos(todos.filter(todo => todo._id !== id));
    } catch (error) {
      console.error('Failed to delete todo:', error);
    }
  };

  const handleDragEnd = async (result: any) => {
    if (!result.destination) return;

    const items = Array.from(todos);
    const [reorderedItem] = items.splice(result.source.index, 1);
    items.splice(result.destination.index, 0, reorderedItem);

    setTodos(items);

    try {
      await todoAPI.reorderTodos(items);
    } catch (error) {
      console.error('Failed to reorder todos:', error);
      fetchTodos();
    }
  };

  const filteredTodos = todos.filter(todo => {
    const matchesSearch = todo.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (todo.description && todo.description.toLowerCase().includes(searchTerm.toLowerCase()));

    const matchesStatus = filterStatus === 'all' ||
      (filterStatus === 'completed' && todo.completed) ||
      (filterStatus === 'active' && !todo.completed);

    const matchesPriority = filterPriority === 'all' || todo.priority === filterPriority;

    return matchesSearch && matchesStatus && matchesPriority;
  });

  const stats = {
    total: todos.length,
    completed: todos.filter(t => t.completed).length,
    active: todos.filter(t => !t.completed).length,
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-900">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-400"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      <div className="relative z-10 max-w-4xl mx-auto p-4">
        {/* Header */}
        <div className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-2xl p-6 mb-6 shadow-2xl">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-white mb-2">
                Welcome back, {user.name}!
              </h1>
              <div className="flex items-center gap-6 text-sm text-gray-300">
                <span className="flex items-center gap-2">
                  <CheckSquare size={16} /> {stats.total} Total
                </span>
                <span className="text-green-400">{stats.completed} Completed</span>
                <span className="text-blue-400">{stats.active} Active</span>
              </div>
            </div>
            <button
              onClick={onLogout}
              className="flex items-center gap-2 px-4 py-2 bg-red-500/20 text-red-300 rounded-lg hover:bg-red-500/30"
            >
              <LogOut size={20} /> Logout
            </button>
          </div>
        </div>

        {/* Controls */}
        <div className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-2xl p-6 mb-6 shadow-2xl">
          <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
            <div className="flex flex-col md:flex-row gap-4 flex-1">
              <div className="relative">
                <Search size={20} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search todos..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 pr-4 py-2 bg-white/5 border border-white/20 rounded-lg text-white"
                />
              </div>
              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value as any)}
                className="px-4 py-2 bg-white/5 border border-white/20 rounded-lg text-white"
              >
                <option value="all">All Tasks</option>
                <option value="active">Active</option>
                <option value="completed">Completed</option>
              </select>
              <select
                value={filterPriority}
                onChange={(e) => setFilterPriority(e.target.value as any)}
                className="px-4 py-2 bg-white/5 border border-white/20 rounded-lg text-black"
              >
                <option value="all">All Priorities</option>
                <option value="high">High Priority</option>
                <option value="medium">Medium Priority</option>
                <option value="low">Low Priority</option>
              </select>
            </div>
            <button
              onClick={() => setShowForm(true)}
              className="flex items-center gap-2 px-6 py-2 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-lg"
            >
              <Plus size={20} /> Add Todo
            </button>
          </div>
        </div>

        {/* Todo List */}
        <div className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-2xl p-6 shadow-2xl">
          {filteredTodos.length === 0 ? (
            <div className="text-center py-12">
              <CheckSquare size={48} className="text-gray-400 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-300 mb-2">
                {todos.length === 0 ? 'No todos yet' : 'No todos match your filters'}
              </h3>
              <p className="text-gray-400">
                {todos.length === 0
                  ? 'Create your first todo to get started!'
                  : 'Try adjusting your search or filters'}
              </p>
            </div>
          ) : (
            <DragDropContext onDragEnd={handleDragEnd}>
              <Droppable droppableId="todos">
                {(provided) => (
                  <div {...provided.droppableProps} ref={provided.innerRef} className="space-y-3">
                    {filteredTodos.map((todo, index) => (
                      <Draggable
                        key={todo._id ?? `todo-${index}`}
                        draggableId={(todo._id ?? `todo-${index}`).toString()}
                        index={index}
                      >
                        {(provided, snapshot) => (
                          <div
                            ref={provided.innerRef}
                            {...provided.draggableProps}
                            {...provided.dragHandleProps}
                            className={`transition-all duration-200 ${snapshot.isDragging ? 'scale-105 rotate-2' : ''}`}
                          >
                            <TodoItem
                              todo={todo}
                              onUpdate={handleUpdateTodo}
                              onDelete={handleDeleteTodo}
                            />
                          </div>
                        )}
                      </Draggable>
                    ))}
                    {provided.placeholder}
                  </div>
                )}
              </Droppable>
            </DragDropContext>
          )}
        </div>
      </div>

      {/* Todo Form Modal */}
      {showForm && (
        <TodoForm
          onSubmit={handleCreateTodo}
          onCancel={() => setShowForm(false)}
        />
      )}
    </div>
  );
};

export default TodoApp;