import { Component } from '@angular/core';
import { ActivatedRoute, RouterOutlet } from '@angular/router';
import { DataService } from './data.service';
import { CommonModule } from '@angular/common';
@Component({
  selector: 'business',
  imports: [RouterOutlet, CommonModule],
  providers: [DataService],
  templateUrl: './business.component.html',
  styleUrl: './business.component.css'
})

export class BusinessComponent {
  business_list: any;
  loremIpsum: any;
  

  constructor(public dataService: DataService, private route: ActivatedRoute){}

  ngOnInit(){
    this.business_list = this.dataService.getBusiness(
      this.route.snapshot.paramMap.get('id')
    )

    this.dataService.getLoremIpsum(1)
    .subscribe((response: any) => {
      this.loremIpsum = response.text.slice(0, 400);
    })
  }

  getAverageRating(reviews: any[]) {
    if (!reviews || reviews.length === 0) {
      return []; // No reviews, no stars
    }
    const averageRating = reviews.reduce((sum, review) => sum + review.rating, 0) / reviews.length;
    return Array(Math.round(averageRating)).fill(0); // Create an array for stars
  }
}
