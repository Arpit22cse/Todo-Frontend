export interface User {
  id: number;
  email: string;
  name: string;
}

export interface Todo {
  _id: string;
  user_id: number;
  title: string;
  description?: string;
  completed: boolean;
  priority: 'low' | 'medium' | 'high';
  position: number;
  created_at: string;
  updated_at: string;
}

export interface AuthResponse {
  message: string;
  token: string;
  user: User;
}