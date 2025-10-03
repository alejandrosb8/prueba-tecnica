// Shared API models

// Auth
export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterRequest {
  email: string;
  password: string;
}

export interface RegisterResponse {
  id: number;
  email: string;
}

export interface LoginResponse {
  access_token: string;
}

// Tasks
export interface TaskDto {
  id: number;
  title: string;
  description: string;
  userId?: number;
}

export interface CreateTaskRequest {
  title: string;
  description?: string;
}

export interface UpdateTaskRequest {
  title?: string;
  description?: string;
}
