import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { AuthUserComponent } from '../auth/authUser.component';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { LoginComponent } from './login.component';
import { DataService } from '../data.service';
import { WebService } from '../services/web.service';

@Component({
    selector: 'ratings',
    imports: [RouterModule, LoginComponent, AuthUserComponent, CommonModule, ReactiveFormsModule],
    providers: [DataService, WebService],
    templateUrl: './albumRatings.component.html'
})

export class AlbumRatingsComponent {
    ratings: any;
    averageRating: any;

    constructor(public dataService: DataService, private webService: WebService) { }

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