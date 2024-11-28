import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { AuthButtonComponent } from './authButton.component';
import { AuthUserComponent } from './authUser.component';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { DataService } from './data.service';
import { WebService } from './web.service';
import { AuthService } from '@auth0/auth0-angular';

@Component({
    selector: 'genre',
    imports: [RouterOutlet, AuthButtonComponent, AuthUserComponent, CommonModule, ReactiveFormsModule],
    providers: [DataService, WebService],
    templateUrl: './businessGenre.component.html',
    styleUrl: './businessGenre.component.css'
})

export class BusinessGenreComponent {
    genreSummary: any;

    constructor(public dataService: DataService, private webService: WebService, public authService: AuthService,) { }

    ngOnInit() {
        // Fetch genre summary
        this.webService.getGenreSummary()
            .subscribe((response) => {
                this.genreSummary = response; // Assuming a new property for genres
            });
    }
}