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
      rating: 0,
    });

    this.business_list = this.dataService.getBusiness(
      this.route.snapshot.paramMap.get('id')
    )

    this.dataService.getLoremIpsum(1)
    .subscribe((response: any) => {
      this.loremIpsum = response.text.slice(0, 400);
    });
  }

  onSubmit() {
    if (this.reviewForm.valid) {
      const newReview = this.reviewForm.value;

    const businessId = this.route.snapshot.paramMap.get('id');
    const business = this.business_list.find((b: { _id: { $oid: string } }) => b._id.$oid === businessId);

    if (business) {
      // Update the reviews array
      business.reviews = [...business.reviews, newReview];
      console.log('Updated reviews:', business.reviews);

      // Recalculate the average
      this.getAverageRating(business.reviews);

      // Reset the form
      this.reviewForm.reset();
      this.reviewForm.patchValue({ rating: 0 }); // Default rating
    }
    }
  }
  

  averageRating: any;

  getAverageRating(reviews: any[]) {
    console.log('Calculating average rating. Reviews:', reviews);

  if (!reviews || reviews.length === 0) {
    this.averageRating = 0;
    return;
  }

  // Convert rating to a number before summing
  const totalRating = reviews.reduce((sum, review) => sum + Number(review.rating), 0);

  console.log('Total rating:', totalRating);

  this.averageRating = Math.floor(totalRating / reviews.length); // Round down to nearest whole number
  console.log('Updated average rating:', this.averageRating);
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
