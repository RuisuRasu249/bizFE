import { Component } from '@angular/core';
import { RouterOutlet, RouterModule, Router } from '@angular/router';
import { LoginComponent } from './login.component';
import { AuthUserComponent } from './authUser.component';
import { AuthService } from './authService.component';

@Component({
  selector: 'navigation',
  imports: [RouterOutlet, RouterModule, LoginComponent, AuthUserComponent],
  templateUrl: './nav.component.html'
})

export class NavComponent {

  isAuthenticated: boolean = false;
  userRole: string = ''; // admin or user
  
  constructor(private authService: AuthService, private router: Router) {}

  ngOnInit(): void {
     // Subscribe to authentication and role changes
     this.authService.isAuthenticated$.subscribe((status) => {
      this.isAuthenticated = status;
    });

    this.authService.userRole$.subscribe((role) => {
      this.userRole = role;
    });
  }

  handleAuth(): void {
    if (this.isAuthenticated) {
      this.authService.logout();
      this.router.navigate(['/']); // Redirect to home after logout
    } else {
      this.router.navigate(['/login']);
    }
  }
}
