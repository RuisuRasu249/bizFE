import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { AuthUserComponent } from '../auth/authUser.component';
import { LoginComponent } from './login.component';

/**
 * The `HomeComponent` serves as the main landing page of the application.
 * It provides navigation and integrates authentication-related components.
 */
@Component({
  selector: 'home', // The selector used to include this component in the application.
  imports: [RouterOutlet, LoginComponent, AuthUserComponent], // Modules and components used in the template.
  templateUrl: './home.component.html', // The associated template file for this component.
  styleUrl: './home.component.css' // The associated stylesheet for styling this component.
})

export class HomeComponent {
  /**
   * Constructor for `HomeComponent`.
   * Currently, this component does not require additional services or initialization logic.
   */
  constructor(){}
}
