import { Component, Inject } from '@angular/core';
import { DOCUMENT } from '@angular/common';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
})
export class LoginComponent {
    isAuthenticated: boolean = false;
  username: string | null = null;

  constructor(private router: Router) {}

  ngOnInit(): void {

  }


}
