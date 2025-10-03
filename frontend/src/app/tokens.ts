import { InjectionToken } from '@angular/core';

// Base URL for the backend API. Override by providing a different value in appConfig if needed.
export const API_URL = new InjectionToken<string>('API_URL', {
  providedIn: 'root',
  factory: () => 'http://localhost:3000',
});
