import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, BehaviorSubject } from 'rxjs';
import { tap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private readonly API_URL = 'http://localhost:3000/api/auth';
  private token: string | null = null;
  private user$: BehaviorSubject<string | null> = new BehaviorSubject<string | null>(null);

  constructor(private http: HttpClient) { }

  register(userData: any): Observable<any> {
    return this.http.post(`${this.API_URL}/register`, userData)
      .pipe(
        tap((response: any) => {
          this.setToken(response.token);
          this.setUser(response.username);
        })
      );
  }

  login(credentials: any): Observable<any> {
    return this.http.post(`${this.API_URL}/login`, credentials)
      .pipe(
        tap((response: any) => {
          this.setToken(response.token);
          this.setUser(response.username);
        })
      );
  }

  logout(): void {
    this.setToken(null);
    this.setUser(null);
  }

  getToken(): string | null {
    return this.token;
  }

  isAuthenticated(): boolean {
    return !!this.token;
  }

  private setToken(token: string | null): void {
    this.token = token;
    if (token) {
      localStorage.setItem('token', token);
    } else {
      localStorage.removeItem('token');
    }
  }

  private setUser(username: string | null): void {
    this.user$.next(username);
  }

  getUser(): Observable<string | null> {
    return this.user$.asObservable();
  }

  initAuth(): void {
    const token = localStorage.getItem('token');
    if (token) {
      this.setToken(token);
    }
  }
}
