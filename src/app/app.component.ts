import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { BusinessesComponent } from './businesses.component';
import { NavComponent } from './nav.component';
import { DataService } from './data.service';
import { AuthService } from './authService.component';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, BusinessesComponent, NavComponent],
  providers: [DataService],
  templateUrl: './app.component.html'
})
export class AppComponent {
  title = 'My bizFE';

  constructor(private dataService:DataService, private authService: AuthService){}

  ngOnInit(){
    this.dataService.populateReviews();

    this.authService.checkAuthentication(); // Initialize authentication status

  }
}
