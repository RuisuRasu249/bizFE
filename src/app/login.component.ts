import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from './authService.component';
import { ReactiveFormsModule, FormsModule } from '@angular/forms'; // For ngModel

@Component({
  selector: 'app-login',
  imports: [FormsModule, ReactiveFormsModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent {
  username: string = '';
  password: string = '';
  errorMessage: string = '';

  constructor(private authService: AuthService, private router: Router) { }

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
