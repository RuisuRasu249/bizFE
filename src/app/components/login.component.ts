import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { ReactiveFormsModule, FormsModule } from '@angular/forms'; // For ngModel
import { AuthService } from '../services/authService.component';

/**
 * The `LoginComponent` handles the user login functionality.
 * It provides a form for entering credentials and interacts with the `AuthService` to authenticate the user.
 */
@Component({
  selector: 'app-login', // The selector used to include this component in the application.
  imports: [FormsModule, ReactiveFormsModule], // Modules used in the template for form handling.
  templateUrl: './login.component.html', // The associated template file for this component.
  styleUrl: './login.component.css' // The associated stylesheet for styling this component.
})
export class LoginComponent {
  /**
   * The username entered by the user in the login form.
   */
  username: string = '';

  /**
   * The password entered by the user in the login form.
   */
  password: string = '';

  /**
   * The error message displayed if login fails.
   */
  errorMessage: string = '';

  /**
   * Constructor for `LoginComponent`.
   * Injects the `AuthService` for handling authentication and `Router` for navigation.
   * 
   * @param authService - Service for managing authentication.
   * @param router - Angular Router for navigation after successful login.
   */
  constructor(private authService: AuthService, private router: Router) { }

  /**
   * Handles the login process when the user submits the login form.
   * Calls the `AuthService` to authenticate the user and navigates to the home page upon success.
   * Displays an error message if the login attempt fails.
   */
  onLogin(): void {
    this.authService.login(this.username, this.password).subscribe(
      (response) => {
        console.log('Login successful', response);
        this.router.navigate(['/']);
      },
      (error) => {
        console.error('Login failed', error);
        this.errorMessage = 'Invalid username or password';
      }
    );
  }

}
