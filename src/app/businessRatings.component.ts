import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { LoginComponent } from './login.component';
import { AuthUserComponent } from './authUser.component';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { DataService } from './data.service';
import { WebService } from './web.service';
import { AuthService } from '@auth0/auth0-angular';

@Component({
    selector: 'ratings',
    imports: [RouterModule, LoginComponent, AuthUserComponent, CommonModule, ReactiveFormsModule],
    providers: [DataService, WebService],
    templateUrl: './businessRatings.component.html'
})

export class BusinessRatingsComponent {
    ratings: any;
    averageRating: any;

    constructor(public dataService: DataService, private webService: WebService, public authService: AuthService,) { }

    ngOnInit() {
        // Fetch high-rated albums
        this.webService.getHighRated()
            .subscribe((response) => {
                this.ratings = response;
            });
    }

    getRoundedRating(rating: number): number {
        return Math.round(rating);
    }
    
}