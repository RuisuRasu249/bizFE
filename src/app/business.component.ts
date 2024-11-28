import { Component } from '@angular/core';
import { ActivatedRoute, RouterOutlet } from '@angular/router';
import { DataService } from './data.service';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { FormBuilder, Validators } from '@angular/forms';
import { ChangeDetectorRef } from '@angular/core';
import { AuthService } from '@auth0/auth0-angular';
import { WebService } from './web.service';


@Component({
  selector: 'business',
  imports: [RouterOutlet, CommonModule, ReactiveFormsModule],
  providers: [DataService, WebService],
  templateUrl: './business.component.html',
  styleUrl: './business.component.css'
})

export class BusinessComponent {
  business_list: any;
  loremIpsum: any;
  business: any;
  reviewForm: any;
  reviews_list: any;
  averageRating: any;

  reviewPage: number = 1; // Current review page
  reviewsPerPage: number = 4; // Number of reviews per page
  totalReviewPages: number = 0; // Total number of pages for reviews
  paginatedReviews: any[] = []; // Reviews to display on the current page

  constructor(public dataService: DataService,
    private route: ActivatedRoute,
    private formBuilder: FormBuilder,
    private cdr: ChangeDetectorRef,
    public authService: AuthService,
    private webService: WebService
  ) { }

  ngOnInit() {
    this.reviewForm = this.formBuilder.group({
      username: ["", Validators.required],
      review_text: ["", Validators.required],
      rating: 0,
    });

    this.webService.getBusiness(this.route.snapshot.paramMap.get('id'))
      .subscribe((response) => {
        this.business_list = [response];
        this.dataService.getLoremIpsum(1)
          .subscribe((response: any) => {
            this.loremIpsum = response.text.slice(0, 400);
          });
      });

    this.webService.getReviews(this.route.snapshot.paramMap.get('id'))
      .subscribe((response) => {
        this.reviews_list = response;
        this.paginateReviews();
      });
  }

  onSubmit() {
    if (this.reviewForm.valid) {
      const newReview = this.reviewForm.value;

      const businessId = this.route.snapshot.paramMap.get('id');
      const business = this.business_list.find((b: { _id: { $oid: string } }) => b._id.$oid === businessId);

      this.webService.postReview(this.route.snapshot.paramMap.get('id'), newReview).subscribe({

        next: (reviews) => {
          console.log('Review saved successfully:', reviews);
          this.reviews_list = reviews; // Update the UI
          this.getAverageRating(this.reviews_list);
          this.paginateReviews(); // Recalculate pagination
        },
        error: (error) => {
          console.error('Error adding review:', error);
          alert('There was an error submitting your review. Please try again.');
        }
      });
      this.reviewForm.reset();
      this.reviewForm.patchValue({ rating: 5 }); // Default rating
    }
  }

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

  paginateReviews() {
    if (this.reviews_list && this.reviews_list.length > 0) {
      this.totalReviewPages = Math.ceil(this.reviews_list.length / this.reviewsPerPage);
      const startIndex = (this.reviewPage - 1) * this.reviewsPerPage;
      const endIndex = startIndex + this.reviewsPerPage;
      this.paginatedReviews = this.reviews_list.slice(startIndex, endIndex);
    } else {
      this.paginatedReviews = [];
      this.totalReviewPages = 0;
    }
  }

  previousReviewPage() {
    if (this.reviewPage > 1) {
      this.reviewPage--;
      this.paginateReviews();
    }
  }

  nextReviewPage() {
    if (this.reviewPage < this.totalReviewPages) {
      this.reviewPage++;
      this.paginateReviews();
    }
  }

  isInvalid(control: any) {
    return this.reviewForm.controls[control].invalid &&
      this.reviewForm.controls[control].touched;
  }

  isUntouched() {
    return this.reviewForm.controls.username.pristine ||
      this.reviewForm.controls.review_text.pristine;
  }

  isIncomplete() {
    return this.isInvalid('username') ||
      this.isInvalid('review_text') ||
      this.isUntouched();
  }
}
