import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { API_URL } from '../tokens';
import { CreateTaskRequest, TaskDto, UpdateTaskRequest } from '../models';

@Injectable({ providedIn: 'root' })
export class TaskService {
  private readonly http = inject(HttpClient);
  private readonly api = inject(API_URL);

  getTasks() {
    return this.http.get<TaskDto[]>(`${this.api}/tasks`);
  }

  createTask(payload: CreateTaskRequest) {
    return this.http.post<TaskDto>(`${this.api}/tasks`, payload);
  }

  updateTask(id: number, payload: UpdateTaskRequest) {
    return this.http.patch<TaskDto>(`${this.api}/tasks/${id}`, payload);
  }

  deleteTask(id: number) {
    return this.http.delete<void>(`${this.api}/tasks/${id}`);
  }
}
