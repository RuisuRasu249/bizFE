import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { AuthService } from './services/authService.component';
import { AlbumsComponent } from './components/albums.component';
import { NavComponent } from './components/nav.component';
import { DataService } from './data.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, AlbumsComponent, NavComponent],
  providers: [DataService],
  templateUrl: './app.component.html'
})
export class AppComponent {
  title = 'AlbumsFE';

  constructor(private dataService:DataService, private authService: AuthService){}

  ngOnInit(){
    this.dataService.populateReviews();

    this.authService.checkAuthentication(); // Initialize authentication status

  }
}
