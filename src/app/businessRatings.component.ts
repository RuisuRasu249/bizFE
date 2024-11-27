import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { AuthButtonComponent } from './authButton.component';
import { AuthUserComponent } from './authUser.component';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { DataService } from './data.service';
import { WebService } from './web.service';


@Component({
    selector: 'ratings',
    imports: [RouterModule, AuthButtonComponent, AuthUserComponent, CommonModule, ReactiveFormsModule],
    providers: [DataService, WebService],
    templateUrl: './businessRatings.component.html',
    styleUrl: './businessRatings.component.css'
})

export class BusinessRatingsComponent {
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