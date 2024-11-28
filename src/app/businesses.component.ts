import { Component } from '@angular/core';
import { RouterOutlet, RouterModule } from '@angular/router';
import { DataService } from './data.service';
import { WebService } from './web.service';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { ReactiveFormsModule, FormsModule } from '@angular/forms'; // For ngModel
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'businesses',
  imports: [RouterOutlet, RouterModule, CommonModule, FormsModule, ReactiveFormsModule],
  providers: [DataService, WebService],
  templateUrl: './businesses.component.html',
  styleUrl: './businesses.component.css'
})

export class BusinessesComponent {

  business_list: any;
  page: number = 1;
  searchQuery: string = '';
  searchResults: any;
  addAlbumForm: any;
  editingAlbumId: string | null = null; // To track the currently edited album
  showAddAlbumForm: boolean = false; // To track form visibility
  
  constructor(public dataService: DataService,
    private webService: WebService,
    private formBuilder: FormBuilder,
    private router: Router,) {
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

  ngOnInit() {
    if (sessionStorage['page']) {
      this.page = Number(sessionStorage['page']);
    }

    this.webService.getBusinesses(this.page)
      .subscribe((response) => {
        this.business_list = response
      });
  }

  onAddAlbum() {
    if (this.addAlbumForm.valid) {
      const newAlbum = this.addAlbumForm.value;
      this.webService.addAlbum(newAlbum).subscribe({
        next: (response) => {
          console.log('Album added successfully:', response);
          alert('Album added successfully!');
          this.business_list.push(response.data); // Update the local list of albums
          this.addAlbumForm.reset(); // Reset the form
          this.ngOnInit(); // Refresh album list
        },
        error: (error) => {
          console.error('Error adding album:', error);
          alert('Failed to add album. Please try again.');
        },
      });
    }
  }

  toggleAddAlbumForm() {
    this.showAddAlbumForm = !this.showAddAlbumForm;
  }


  isInvalid(control: string): boolean {
    return (
      this.addAlbumForm.controls[control].invalid &&
      this.addAlbumForm.controls[control].touched
    );
  }

  isIncomplete(): boolean {
    return (
      this.isInvalid('artist') ||
      this.isInvalid('album_title') ||
      this.isInvalid('year_of_release') ||
      this.isInvalid('genre')
    );
  }

  editAlbum(albumId: string) {
    this.editingAlbumId = albumId; // Enable edit mode
  }

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

  previousPage() {
    if (this.page > 1) {
      this.page = this.page - 1;
      sessionStorage['page'] = this.page;

      this.webService.getBusinesses(this.page)
        .subscribe((response) => {
          this.business_list = response
        })
    }
  }

  nextPage() {
    if (this.page < this.dataService.getLastPageNumber()) {
      this.page = this.page + 1;
      sessionStorage['page'] = this.page;
      this.webService.getBusinesses(this.page)
        .subscribe((response) => {
          this.business_list = response
        })
    }
  }

  searchBusinesses(): void {
    if (this.searchQuery.trim()) {
      // Fetch albums based on the search query
      this.webService.searchBusiness(this.searchQuery).subscribe({
        next: (data: any[]) => {
          this.business_list = data;
        }
      });
    } else {
      // Fetch all albums if search query is empty
      this.router.navigate(['/businesses']); // Navigate back to albums page
    }
  }
}
