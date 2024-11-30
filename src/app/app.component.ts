import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { AuthService } from './services/authService.component';
import { AlbumsComponent } from './components/albums.component';
import { NavComponent } from './components/nav.component';
import { DataService } from './data.service';

/**
 * The root component of the application.
 * This component serves as the main entry point for the application, 
 * providing the structure and initialization logic.
 */
@Component({
  selector: 'app-root', // The selector used to include this component in the application.
  standalone: true, // Marks this component as standalone, allowing it to be used without being declared in a module.
  imports: [RouterOutlet, AlbumsComponent, NavComponent], // Components and directives used in the template.
  providers: [DataService], // Services provided at the root component level.
  templateUrl: './app.component.html' // The template file for this component.
})
export class AppComponent {
  /**
  * The title of the application.
  * @type {string}
  */
  title = 'AlbumsFE';

  /**
   * Constructor for AppComponent.
   * Injects services required by the component.
   * 
   * @param dataService - The DataService used for populating data during initialization.
   * @param authService - The AuthService used to manage user authentication status.
   */
  constructor(private dataService: DataService, private authService: AuthService) { }

  /**
   * Lifecycle hook that is called after the component is initialized.
   * Performs initial setup tasks such as populating reviews and checking authentication status.
   */
  ngOnInit() {
     // Populate reviews from the data service.
    this.dataService.populateReviews();

    // Check the user's authentication status through the AuthService.
    this.authService.checkAuthentication();
  }
}
