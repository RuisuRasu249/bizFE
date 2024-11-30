import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, tap } from 'rxjs';

/**
 * The `AuthService` manages user authentication and role-based access.
 * It interacts with the server for login and logout operations and maintains authentication state.
 */
@Injectable({
  providedIn: 'root', // This service is provided at the root level, making it available throughout the app.
})
export class AuthService {
  /**
   * The base URL of the Flask server.
   */
  private apiUrl = 'http://127.0.0.1:5000';

  /**
   * Observable that tracks whether the user is authenticated.
   */
  isAuthenticated$ = new BehaviorSubject<boolean>(false);

  /**
   * Observable that tracks the current user's role (e.g., 'admin' or 'user').
   */
  userRole$ = new BehaviorSubject<string>('');

  /**
   * Private subject that tracks login state.
   */
  private isLoggedInSubject = new BehaviorSubject<boolean>(false);

  /**
   * Public Observable derived from `isLoggedInSubject`.
   */
  isLoggedIn$: Observable<boolean> = this.isLoggedInSubject.asObservable();

  /**
   * Constructor for `AuthService`.
   * Injects the `HttpClient` for making HTTP requests.
   * 
   * @param http - The Angular HttpClient used to perform HTTP requests.
   */
  constructor(private http: HttpClient) {}

  /**
   * Handles user login by sending credentials to the server.
   * On successful login, saves the authentication token and user role to localStorage
   * and updates the authentication state.
   * 
   * @param username - The username provided by the user.
   * @param password - The password provided by the user.
   * @returns An Observable of the login response.
   */
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

  /**
   * Logs the user out by clearing the authentication token and role from localStorage.
   * Updates the authentication and role observables to reflect the logged-out state.
   */
  logout(): void {
    localStorage.removeItem('token');
    localStorage.removeItem('role');
    this.isLoggedInSubject.next(false);
    this.isAuthenticated$.next(false);
    this.userRole$.next('');
  }

  /**
   * Checks the current authentication state by verifying the presence of a token in localStorage.
   * Updates the authentication and role observables based on the stored values.
   */
  checkAuthentication(): void {
    const token = localStorage.getItem('token');
    const role = localStorage.getItem('role');
    this.isAuthenticated$.next(!!token); // Set authenticated if token exists
    this.userRole$.next(role || ''); // Emit role if it exists
  }

  /**
   * Returns an Observable of the current authentication state.
   * 
   * @returns An Observable that emits the current authentication state.
   */
  isAuthenticated(): Observable<boolean> {
    return this.isAuthenticated$.asObservable();
  }

  /**
   * Returns an Observable of the current user's role.
   * 
   * @returns An Observable that emits the current user role.
   */
  getUserRole(): Observable<string> {
    return this.userRole$.asObservable();
  }
}
