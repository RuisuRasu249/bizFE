import { Component } from '@angular/core';
import { ActivatedRoute, RouterOutlet } from '@angular/router';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { FormBuilder, Validators } from '@angular/forms';
import { ChangeDetectorRef } from '@angular/core';
import { DataService } from '../data.service';
import { WebService } from '../services/web.service';
import { AuthService } from '../services/authService.component';
/**
 * The `AlbumComponent` manages the display of a specific album, its reviews, and user interactions,
 * including adding, deleting, and paginating reviews. It also handles user authentication and authorization checks.
 */
@Component({
  selector: 'album', // The selector used to include this component in templates.
  imports: [RouterOutlet, CommonModule, ReactiveFormsModule], // Modules used in this component's template.
  providers: [DataService, WebService], // Services provided specifically for this component.
  templateUrl: './album.component.html' // The associated template for this component.
})

export class AlbumComponent {
  /**
   * List of albums retrieved from the API.
   */
  album_list: any;

  /**
   * Placeholder text for lorem ipsum content.
   */
  loremIpsum: any;

  /**
   * Current album details.
   */
  album: any;

  /**
   * Reactive form group for submitting reviews.
   */
  reviewForm: any;

  /**
   * List of reviews for the current album.
   */
  reviews_list: any;

  /**
   * Average rating for the current album.
   */
  averageRating: any;

  /**
   * Current page of reviews being displayed.
   * @default 1
   */
  reviewPage: number = 1;

  /**
   * Number of reviews displayed per page.
   * @default 4
   */
  reviewsPerPage: number = 4;

  /**
   * Total number of review pages.
   */
  totalReviewPages: number = 0;

  /**
   * Paginated reviews to display on the current page.
   */
  paginatedReviews: any[] = [];

  /**
   * Indicates if the current user is an admin.
   * @default false
   */
  isAdmin: boolean = false;

  /**
   * Indicates if the current user is logged in.
   * @default false
   */
  isLoggedIn: boolean = false;

  /**
   * Constructor for `AlbumComponent`.
   * Injects necessary services and utilities for managing album data, reviews, and user authentication.
   * 
   * @param dataService - Service for retrieving data like lorem ipsum content.
   * @param route - Service for accessing the active route and its parameters.
   * @param formBuilder - Service for building reactive forms.
   * @param cdr - Service for manually triggering change detection.
   * @param authService - Service for managing user authentication and roles.
   * @param webService - Service for making API calls related to albums and reviews.
   */
  constructor(public dataService: DataService,
    private route: ActivatedRoute,
    private formBuilder: FormBuilder,
    private cdr: ChangeDetectorRef,
    public authService: AuthService,
    private webService: WebService,
  ) { }

  /**
   * Lifecycle hook called after the component is initialized.
   * Sets up the review form, fetches album details, retrieves reviews, and populates lorem ipsum text.
   */
  ngOnInit() {
    this.reviewForm = this.formBuilder.group({
      username: ["", Validators.required],
      review_text: ["", Validators.required],
      rating: 0,
    });

    this.authService.isLoggedIn$.subscribe((loggedIn) => {
      this.isLoggedIn = loggedIn;
    });

    this.authService.userRole$.subscribe((role) => {
      this.isAdmin = role === 'admin'; // Set isAdmin to true if role is 'admin'
    });

    this.webService.getAlbum(this.route.snapshot.paramMap.get('id'))
      .subscribe((response) => {
        this.album_list = [response];
      });

    this.dataService.getLoremIpsum(1)
      .subscribe((response: any) => {
        this.loremIpsum = response.text.slice(0, 400);
      });

    this.webService.getReviews(this.route.snapshot.paramMap.get('id'))
      .subscribe((response) => {
        this.reviews_list = response;
        this.paginateReviews();
      });
  }

  /**
   * Submits a new review for the current album.
   * Validates the form before submission and updates the reviews list and average rating upon success.
   */
  onSubmit() {
    if (this.reviewForm.valid) {
      const newReview = this.reviewForm.value;
      console.log('Submitting Review:', newReview);

      const albumId = this.route.snapshot.paramMap.get('id')!;
      this.webService.postReview(albumId, newReview).subscribe({
        next: (reviews) => {
          console.log('Review saved successfully:', reviews);
          this.reviews_list = reviews; // Update the reviews list
          this.getAverageRating(this.reviews_list); // Update the average rating
          this.paginateReviews(); // Recalculate pagination
        },
        error: (error) => {
          console.error('Error adding review:', error);
          alert('There was an error submitting your review. Please try again.');
        },
      });


      this.reviewForm.reset();
      this.reviewForm.patchValue({ rating: 5 }); // Default rating
    }
  }

  /**
   * Deletes a review by its ID for the current album.
   * Prompts the user for confirmation before performing the deletion.
   * 
   * @param reviewId - The ID of the review to delete.
   */
  deleteReview(reviewId: string) {
    const albumId = this.route.snapshot.paramMap.get('id'); // Get the current album ID

    if (!albumId || !reviewId) {
      alert('Invalid album or review ID');
      return;
    }

    if (confirm('Are you sure you want to delete this review?')) {
      this.webService.deleteReview(albumId, reviewId).subscribe({
        next: (response) => {
          alert('Review deleted successfully!');
          this.reviews_list = this.reviews_list.filter(
            (review: any) => review.review_id !== reviewId
          ); // Remove the deleted review from the list
          this.paginateReviews(); // Recalculate pagination
          this.getAverageRating(this.reviews_list); // Update the average rating
        },
        error: (error) => {
          console.error('Error deleting review:', error);
          alert('Failed to delete review. Please try again.');
        },
      });
    }
  }

  /**
   * Calculates the average rating based on the current reviews list.
   * 
   * @param reviews - Array of reviews to calculate the average rating from.
   */
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

  /**
   * Paginates the reviews list for the current page.
   * Updates the `paginatedReviews` array and calculates the total number of pages.
   */
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

  /**
   * Navigates to the previous page of reviews, if available.
   */
  previousReviewPage() {
    if (this.reviewPage > 1) {
      this.reviewPage--;
      this.paginateReviews();
    }
  }

  /**
   * Navigates to the next page of reviews, if available.
   */
  nextReviewPage() {
    if (this.reviewPage < this.totalReviewPages) {
      this.reviewPage++;
      this.paginateReviews();
    }
  }

  /**
   * Checks if a specific form control is invalid and touched.
   * 
   * @param control - The name of the control to check.
   * @returns True if the control is invalid and touched, false otherwise.
   */
  isInvalid(control: any) {
    return this.reviewForm.controls[control].invalid &&
      this.reviewForm.controls[control].touched;
  }

  /**
   * Checks if the review form is untouched.
   * 
   * @returns True if any control in the form is pristine, false otherwise.
   */
  isUntouched() {
    return this.reviewForm.controls.username.pristine ||
      this.reviewForm.controls.review_text.pristine;
  }

  /**
   * Checks if the review form is incomplete.
   * 
   * @returns True if the form is invalid, untouched, or incomplete, false otherwise.
   */
  isIncomplete() {
    return this.isInvalid('username') ||
      this.isInvalid('review_text') ||
      this.isUntouched();
  }
}
