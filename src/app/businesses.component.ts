import { Component } from '@angular/core';
import { RouterOutlet, RouterModule } from '@angular/router';
import { DataService } from './data.service';
import { WebService } from './web.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms'; // For ngModel

@Component({
  selector: 'businesses',
  imports: [RouterOutlet, RouterModule, CommonModule, FormsModule],
  providers: [DataService, WebService],
  templateUrl: './businesses.component.html',
  styleUrl: './businesses.component.css'
})

export class BusinessesComponent {

  business_list: any;
  page: number = 1;
  searchQuery: string = '';
  searchResults: any;

  constructor(public dataService: DataService, private webService: WebService){}

  ngOnInit(){
    if(sessionStorage['page']){
      this.page = Number(sessionStorage['page']);
    }
    //this.business_list = this.dataService.getBusinesses(this.page);
    this.webService.getBusinesses(this.page)
        .subscribe((response) => {
        this.business_list = response
    })
  }

  previousPage(){
    if(this.page > 1){
      this.page = this.page - 1;
      sessionStorage['page'] = this.page;

      this.webService.getBusinesses(this.page)
        .subscribe((response) => {
        this.business_list = response
      })
    }
  }

  nextPage(){
    if(this.page < this.dataService.getLastPageNumber()){
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
      this.business_list;
    }
  }
}
