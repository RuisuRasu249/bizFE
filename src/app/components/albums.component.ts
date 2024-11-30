import { Component } from '@angular/core';
import { RouterOutlet, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { ReactiveFormsModule, FormsModule } from '@angular/forms'; // For ngModel
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { DataService } from '../data.service';
import { WebService } from '../services/web.service';
import { AuthService } from '../services/authService.component';

/**
 * The `AlbumsComponent` is responsible for managing the list of albums.
 * It supports CRUD operations (create, read, update, delete) and provides features such as pagination and search.
 * It also integrates with user authentication and role management.
 */
@Component({
  selector: 'albums', // The selector used to include this component in the application.
  imports: [RouterOutlet, RouterModule, CommonModule, FormsModule, ReactiveFormsModule], // Modules and components used in the template.
  providers: [DataService, WebService], // Services provided specifically for this component.
  templateUrl: './albums.component.html' // The associated template file for this component.
})

export class AlbumsComponent {
  /**
   * The list of albums retrieved from the API.
   */
  album_list: any;

  /**
   * The current page of albums being displayed.
   * @default 1
   */
  page: number = 1;

  /**
   * The user's search query for filtering albums.
   */
  searchQuery: string = '';

  /**
   * The results of the search query.
   */
  searchResults: any;

  /**
   * The reactive form group for adding a new album.
   */
  addAlbumForm: any;

  /**
   * The ID of the album currently being edited.
   */
  editingAlbumId: string | null = null;

  /**
   * A flag to track whether the add album form is visible.
   * @default false
   */
  showAddAlbumForm: boolean = false;

  /**
   * A flag to indicate if the current user has admin privileges.
   * @default false
   */
  isAdmin: boolean = false;

  /**
   * Constructor for `AlbumsComponent`.
   * Initializes the `addAlbumForm` and injects required services.
   * 
   * @param dataService - Service for application-wide data operations.
   * @param webService - Service for interacting with the album API.
   * @param formBuilder - Service for building reactive forms.
   * @param authService - Service for managing user authentication and roles.
   * @param router - Angular Router for navigation.
   */
  constructor(public dataService: DataService,
    private webService: WebService,
    private formBuilder: FormBuilder,
    private authService: AuthService,
    private router: Router,) {
    // Initialize the form group for adding a new album
    this.addAlbumForm = this.formBuilder.group({
      artist: ['', Validators.required],
      album_title: ['', Validators.required],
      year_of_release: [
        '',
        [Validators.required, Validators.min(1900), Validators.max(new Date().getFullYear())],
      ],
      genre: ['', Validators.required],
    });
  }

  /**
   * Lifecycle hook that is called after the component is initialized.
   * Loads the album list and checks the user's admin role.
   */
  ngOnInit() {
    if (sessionStorage['page']) {
      this.page = Number(sessionStorage['page']);
    }

    this.authService.userRole$.subscribe((role) => {
      this.isAdmin = role === 'admin'; // Set isAdmin to true if role is 'admin'
    });

    this.webService.getAlbums(1).subscribe((response) => {
      this.album_list = response;
    });

  }

  /**
   * Submits the form to add a new album.
   * If the form is valid, the album is sent to the API, and the list is refreshed.
   */
  onAddAlbum() {
    if (this.addAlbumForm.valid) {
      const newAlbum = this.addAlbumForm.value;
      console.log('Adding Album:', newAlbum); // Debug log
      this.webService.addAlbum(newAlbum).subscribe({
        next: (response) => {
          console.log('Album added successfully:', response);
          alert('Album added successfully!');
          this.album_list.push(response.data); // Update the local list
          this.addAlbumForm.reset(); // Reset form
          this.ngOnInit(); // Refresh album list
        },
        error: (error) => {
          console.error('Error adding album:', error); // Debug log
          alert('Failed to add album. Please try again.');
        },
      });
    }
  }

  /**
   * Toggles the visibility of the add album form.
   */
  toggleAddAlbumForm() {
    this.showAddAlbumForm = !this.showAddAlbumForm;
  }

  /**
   * Cancels the add album form and resets its state.
   */
  onCancelForm() {
    this.addAlbumForm.reset(); // Clear all input fields
    this.showAddAlbumForm = false; // Collapse the form
  }

  /**
   * Checks if a specific form control is invalid and touched.
   * 
   * @param control - The name of the form control to check.
   * @returns True if the control is invalid and touched, false otherwise.
   */
  isInvalid(control: string): boolean {
    return (
      this.addAlbumForm.controls[control].invalid &&
      this.addAlbumForm.controls[control].touched
    );
  }

  /**
   * Checks if the add album form is incomplete.
   * 
   * @returns True if any required form field is invalid, false otherwise.
   */
  isIncomplete(): boolean {
    return (
      this.isInvalid('artist') ||
      this.isInvalid('album_title') ||
      this.isInvalid('year_of_release') ||
      this.isInvalid('genre')
    );
  }

  /**
   * Enables edit mode for a specific album by its ID.
   * 
   * @param albumId - The ID of the album to edit.
   */
  editAlbum(albumId: string) {
    this.editingAlbumId = albumId; // Enable edit mode
  }

  /**
   * Updates an album's details.
   * Sends the updated album data to the API and refreshes the album list.
   * 
   * @param album - The album data to update.
   */
  updateAlbum(album: any) {
    this.webService.updateAlbum(album._id, {
      artist: album.artist,
      album_title: album.album_title,
      year_of_release: album.year_of_release,
      genre: album.genre,
    }).subscribe({
      next: (response) => {
        alert('Album updated successfully!');
        this.editingAlbumId = null; // Exit edit mode
        this.ngOnInit(); // Refresh album list
      },
      error: (error) => {
        console.error('Error updating album:', error);
        alert('Failed to update album.');
      },
    });
  }

  /**
   * Deletes an album by its ID after user confirmation.
   * 
   * @param id - The ID of the album to delete.
   */
  deleteAlbum(id: string) {
    if (confirm('Are you sure you want to delete this album?')) {
      this.webService.deleteAlbum(id).subscribe({
        next: (response) => {
          alert('Album deleted successfully!');
          this.ngOnInit(); // Refresh album list
        },
        error: (error) => {
          console.error('Error deleting album:', error);
          alert('Failed to delete album. Please try again.');
        },
      });
    }
  }

  /**
   * Navigates to the previous page of albums if available.
   */
  previousPage() {
    if (this.page > 1) {
      this.page = this.page - 1;
      sessionStorage['page'] = this.page;

      this.webService.getAlbums(this.page)
        .subscribe((response) => {
          this.album_list = response
        })
    }
  }

  /**
   * Navigates to the next page of albums if available.
   */
  nextPage() {
    this.webService.getAlbums(this.page + 1).subscribe((response) => {
      if (response && response.length > 0) {
        this.page += 1; // Increment the page only if there are albums on the next page
        sessionStorage['page'] = this.page;
        this.album_list = response;
      } else {
        console.log('No more albums on the next page.');
      }
    }, (error) => {
      console.error('Error fetching the next page of albums:', error);
    });
  }

  /**
   * Searches for albums based on the user's query.
   * If the query is empty, reloads the full album list.
   */
  searchAlbums(): void {
    if (this.searchQuery.trim()) {
      // Fetch albums based on the search query
      this.webService.searchAlbum(this.searchQuery).subscribe({
        next: (data: any[]) => {
          this.album_list = data;
        }
      });
    } else {
      // Fetch all albums if search query is empty
      this.router.navigate(['/albums']); // Navigate back to albums page
    }
  }
}
