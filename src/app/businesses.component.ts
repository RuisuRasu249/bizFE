import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';

@Component({
  selector: 'businesses',
  imports: [RouterOutlet],
  templateUrl: './businesses.component.html',
  styleUrl: './businesses.component.css'
})

export class BusinessesComponent {

  business_list = [
    {
      "name" : "Pizza Mountain",
      "town" : "Coleraine",
      "rating" :  5
    },
    {
      "name" : "Wine Lake",
      "town" : "Coleraine",
      "rating" :  3
    },
    {
      "name" : "Sweet Dessert",
      "town" : "Coleraine",
      "rating" :  4
    }
  ]
}
