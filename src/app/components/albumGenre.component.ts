import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { AuthUserComponent } from '../auth/authUser.component';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { AuthService } from '@auth0/auth0-angular';
import { LoginComponent } from './login.component';
import { DataService } from '../data.service';
import { WebService } from '../services/web.service';

@Component({
    selector: 'genre',
    imports: [RouterOutlet, LoginComponent, AuthUserComponent, CommonModule, ReactiveFormsModule],
    providers: [DataService, WebService],
    templateUrl: './albumGenre.component.html'
})

export class AlbumGenreComponent {
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