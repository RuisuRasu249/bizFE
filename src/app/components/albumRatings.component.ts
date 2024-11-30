import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { AuthUserComponent } from '../auth/authUser.component';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { LoginComponent } from './login.component';
import { DataService } from '../data.service';
import { WebService } from '../services/web.service';

/**
 * The `AlbumRatingsComponent` is responsible for displaying a list of high-rated albums and their average ratings.
 * It interacts with the `WebService` to fetch rating data and provides utility methods for processing ratings.
 */
@Component({
    selector: 'ratings', // The selector used to include this component in the application.
    imports: [RouterModule, LoginComponent, AuthUserComponent, CommonModule, ReactiveFormsModule], // Modules and components used in the template.
    providers: [DataService, WebService], // Services provided specifically for this component.
    templateUrl: './albumRatings.component.html' // The associated template file for this component.
})

export class AlbumRatingsComponent {
    /**
     * Holds the list of high-rated albums retrieved from the API.
     */
    ratings: any;
    /**
     * Holds the calculated average rating for displayed albums.
     */
    averageRating: any;

    /**
     * Constructor for `AlbumRatingsComponent`.
     * Injects services for managing data and making API calls.
     * 
     * @param dataService - Service for handling application-wide data operations.
     * @param webService - Service for interacting with the album API.
     */
    constructor(public dataService: DataService, private webService: WebService) { }

    /**
     * Lifecycle hook that is called after the component is initialized.
     * Fetches the list of high-rated albums from the API and assigns it to the `ratings` property.
     */
    ngOnInit() {
        // Fetch high-rated albums
        this.webService.getHighRated()
            .subscribe((response) => {
                this.ratings = response;
            });
    }

    /**
     * Rounds a given rating to the nearest whole number.
     * 
     * @param rating - The rating value to round.
     * @returns The rounded rating.
     */
    getRoundedRating(rating: number): number {
        return Math.round(rating);
    }
    
}