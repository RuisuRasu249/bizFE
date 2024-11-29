import { Component } from '@angular/core';
import { RouterOutlet, RouterModule, Router } from '@angular/router';
import { LoginComponent } from './login.component';
import { AuthUserComponent } from './authUser.component';

@Component({
  selector: 'navigation',
  imports: [RouterOutlet, RouterModule, LoginComponent, AuthUserComponent],
  templateUrl: './nav.component.html'
})
export class NavComponent {}
