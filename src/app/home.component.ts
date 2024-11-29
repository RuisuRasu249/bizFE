import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { AuthUserComponent } from './authUser.component';
import { LoginComponent } from './login.component';

@Component({
  selector: 'home',
  imports: [RouterOutlet, LoginComponent, AuthUserComponent],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})
export class HomeComponent {}
