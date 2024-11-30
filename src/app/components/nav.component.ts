import { Component } from '@angular/core';
import { RouterOutlet, RouterModule, Router } from '@angular/router';
import { LoginComponent } from './login.component';
import { AuthUserComponent } from '../auth/authUser.component';
import { AuthService } from '../services/authService.component';

/**
 * The `NavComponent` is responsible for managing the application's navigation.
 * It provides authentication status display, user role handling, and navigation options based on the user's state.
 */
@Component({
  selector: 'navigation', // The selector used to include this component in the application.
  imports: [RouterOutlet, RouterModule, LoginComponent, AuthUserComponent], // Modules and components used in the template.
  templateUrl: './nav.component.html' // The associated template file for this component.
})

export class NavComponent {

  /**
   * Tracks whether the user is currently authenticated.
   * @default false
   */
  isAuthenticated: boolean = false;

  /**
   * Stores the role of the currently authenticated user (e.g., 'admin' or 'user').
   */
  userRole: string = '';

  /**
   * Constructor for `NavComponent`.
   * Injects the `AuthService` for authentication management and the `Router` for navigation.
   * 
   * @param authService - Service for managing authentication and user roles.
   * @param router - Angular Router for navigation.
   */
  constructor(private authService: AuthService, private router: Router) {}

  /**
   * Lifecycle hook called after the component is initialized.
   * Subscribes to authentication and role updates from the `AuthService`.
   */
  ngOnInit(): void {
     // Subscribe to authentication and role changes
     this.authService.isAuthenticated$.subscribe((status) => {
      this.isAuthenticated = status;
    });

    this.authService.userRole$.subscribe((role) => {
      this.userRole = role;
    });
  }

  /**
   * Handles authentication actions such as login and logout.
   * If the user is authenticated, logs out and redirects to the home page.
   * If not authenticated, navigates to the login page.
   */
  handleAuth(): void {
    if (this.isAuthenticated) {
      this.authService.logout();
      this.router.navigate(['/']); // Redirect to home after logout
    } else {
      this.router.navigate(['/login']);
    }
  }
}
