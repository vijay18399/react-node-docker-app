import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private backendUrl = 'http://localhost:5000'; // Update with your deployed API URL

  constructor(private http: HttpClient) {}

  // LinkedIn sign-in
  signInWithLinkedIn(code: string): Observable<any> {
    return this.http.post(`${this.backendUrl}/auth/linkedin`, { token: code });
  }

  // Get token from localStorage
  getToken(): string | null {
    return localStorage.getItem('token');
  }

  // Check login status
  isLoggedIn(): boolean {
    return !!this.getToken();
  }

  // Logout
  logout(): void {
    localStorage.removeItem('token');
  }
}
