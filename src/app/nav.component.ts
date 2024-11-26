import { Component } from '@angular/core';
import { RouterOutlet, RouterModule, Router } from '@angular/router';
import { AuthButtonComponent } from './authButton.component';
import { AuthUserComponent } from './authUser.component';

@Component({
  selector: 'navigation',
  imports: [RouterOutlet, RouterModule, AuthButtonComponent, AuthUserComponent],
  templateUrl: './nav.component.html',
  styleUrl: './nav.component.css'
})
export class NavComponent {}
