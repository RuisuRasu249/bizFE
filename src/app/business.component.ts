import { Component } from '@angular/core';
import { ActivatedRoute, RouterOutlet } from '@angular/router';
import { DataService } from './data.service';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { FormBuilder, Validators } from '@angular/forms';
import { ChangeDetectorRef } from '@angular/core';


@Component({
  selector: 'business',
  imports: [RouterOutlet, CommonModule, ReactiveFormsModule],
  providers: [DataService],
  templateUrl: './business.component.html',
  styleUrl: './business.component.css'
})

export class BusinessComponent {
  business_list: any;
  loremIpsum: any;
  business: any;
  reviewForm: any;
  

  constructor(public dataService: DataService, 
              private route: ActivatedRoute,
              private formBuilder: FormBuilder,
              private cdr: ChangeDetectorRef,
            ){}

  ngOnInit(){
    this.reviewForm = this.formBuilder.group({
      username: ["", Validators.required],
      review_text: ["", Validators.required],
      rating: 5,
    });

    this.business_list = this.dataService.getBusiness(
      this.route.snapshot.paramMap.get('id')
    )

    this.dataService.getLoremIpsum(1)
    .subscribe((response: any) => {
      this.loremIpsum = response.text.slice(0, 400);
    });
  }

  getAverageRating(reviews: any[]): number[] {
    if (!reviews || reviews.length === 0) {
      return []; // No reviews, no hearts
    }
  
    // Calculate the average rating for the current business
    const totalRating = reviews.reduce((sum, review) => sum + review.rating, 0);
    const averageRating = Math.floor(totalRating / reviews.length); // Round down to a whole number
  
    return Array(averageRating).fill(0); // Return an array with 'averageRating' elements
  }
  
  
  

  onSubmit(){
    this.dataService.postReview(
      this.route.snapshot.paramMap.get('id'),
      this.reviewForm.value);
      this.reviewForm.reset();
  }

  isInvalid(control: any){
    return this.reviewForm.controls[control].invalid &&
            this.reviewForm.controls[control].touched;
  }

  isUntouched(){
    return this.reviewForm.controls.username.pristine ||
            this.reviewForm.controls.review_text.pristine;
  }

  isIncomplete(){
    return this.isInvalid('username') ||
            this.isInvalid('review_text') ||
            this.isUntouched();
  }
}
