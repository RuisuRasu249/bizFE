import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, tap } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private apiUrl = 'http://127.0.0.1:5000'; // Flask server URL

  isAuthenticated$ = new BehaviorSubject<boolean>(false);
  userRole$ = new BehaviorSubject<string>(''); // Tracks user role: admin or user

  private isLoggedInSubject = new BehaviorSubject<boolean>(false);
  isLoggedIn$: Observable<boolean> = this.isLoggedInSubject.asObservable();

  constructor(private http: HttpClient) {}

  login(username: string, password: string): Observable<any> {
    return this.http.post(`${this.apiUrl}/auth/login`, { username, password }).pipe(
      tap((response: any) => {
        localStorage.setItem('token', response.token); // Save token in localStorage
        localStorage.setItem('role', response.role);  // Save role in localStorage
        this.isLoggedInSubject.next(true);
        this.isAuthenticated$.next(true);
        this.userRole$.next(response.role); // Emit the role
      })
    );
  }

  logout(): void {
    localStorage.removeItem('token');
    localStorage.removeItem('role');
    this.isLoggedInSubject.next(false);
    this.isAuthenticated$.next(false);
    this.userRole$.next('');
  }

  checkAuthentication(): void {
    const token = localStorage.getItem('token');
    const role = localStorage.getItem('role');
    this.isAuthenticated$.next(!!token); // Set authenticated if token exists
    this.userRole$.next(role || ''); // Emit role if it exists
  }

  isAuthenticated(): Observable<boolean> {
    return this.isAuthenticated$.asObservable();
  }

  getUserRole(): Observable<string> {
    return this.userRole$.asObservable();
  }
}
