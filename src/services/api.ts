import axios from 'axios';
import { User, Todo, AuthResponse } from '../types';

const API_BASE_URL = 'https://todo-backend-93bh.onrender.com';

const api = axios.create({
  baseURL: API_BASE_URL,
});

// Add auth token to requests
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Auth API
export const authAPI = {
  login: async (email: string, password: string): Promise<AuthResponse> => {
    const response = await api.post('/login', { email, password });
    return response.data;
  },

  register: async (email: string, password: string, name: string): Promise<AuthResponse> => {
    const response = await api.post('/register', { email, password, name });
    return response.data;
  },
};

// Todo API
export const todoAPI = {
  getTodos: async (): Promise<Todo[]> => {
    const response = await api.get('/todos');
    return response.data;
  },

  createTodo: async (todo: Partial<Todo>): Promise<Todo> => {
    const response = await api.post('/todos', todo);
    return response.data;
  },

  updateTodo: async (id:string , updates: Partial<Todo>): Promise<Todo> => {
    const response = await api.put(`/todos/${id}`, updates);
    return response.data;
  },

  deleteTodo: async (id: string): Promise<void> => {
    await api.delete(`/todos/${id}`);
  },

  reorderTodos: async (todos: Todo[]): Promise<void> => {
    await api.put('/todos/reorder', { todos });
  },
};