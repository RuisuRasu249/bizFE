import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { AuthUserComponent } from '../auth/authUser.component';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { AuthService } from '@auth0/auth0-angular';
import { LoginComponent } from './login.component';
import { DataService } from '../data.service';
import { WebService } from '../services/web.service';

/**
 * The `AlbumGenreComponent` is responsible for displaying a summary of album genres.
 * It interacts with the `WebService` to fetch data and utilizes authentication services for managing user access.
 */
@Component({
    selector: 'genre', // The selector used to include this component in the application.
    imports: [RouterOutlet, LoginComponent, AuthUserComponent, CommonModule, ReactiveFormsModule], // Modules and components used in the template.
    providers: [DataService, WebService], // Services provided specifically for this component.
    templateUrl: './albumGenre.component.html' // The associated template file for this component.
})

export class AlbumGenreComponent {
    /**
     * Holds the summary of genres retrieved from the API.
     */
    genreSummary: any;

    /**
     * Constructor for `AlbumGenreComponent`.
     * Injects services for managing data, making API calls, and handling authentication.
     * 
     * @param dataService - Service for handling application-wide data operations.
     * @param webService - Service for interacting with the album API.
     * @param authService - Service for managing user authentication and access.
     */
    constructor(public dataService: DataService, private webService: WebService, public authService: AuthService,) { }

    /**
     * Lifecycle hook that is called after the component is initialized.
     * Fetches the genre summary from the API and updates the `genreSummary` property.
     */
    ngOnInit() {
        // Fetch genre summary
        this.webService.getGenreSummary()
            .subscribe((response) => {
                this.genreSummary = response; // Assuming a new property for genres
            });
    }
}