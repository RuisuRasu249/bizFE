import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import jsonData from '../assets/albumdb.albums.json'

/**
 * The `DataService` provides functionality for managing and retrieving album data from a local JSON file.
 * It also integrates with external APIs for generating lorem ipsum text and supports adding reviews to albums.
 */
@Injectable({
    providedIn: 'root'
})
export class DataService{

    /**
     * The number of albums displayed per page.
     * @default 11
     */
    pageSize: number = 11;

    /**
     * Constructor for `DataService`.
     * Injects the `HttpClient` for making HTTP requests.
     * 
     * @param http - The Angular HttpClient used to perform HTTP requests.
     */
    constructor(private http: HttpClient){}

    /**
     * Retrieves a page of albums from the JSON data based on the given page number.
     * 
     * @param page - The page number to retrieve.
     * @returns An array of albums for the specified page.
     */
    getAlbums(page: number){
        let pageStart = (page - 1) * this.pageSize;
        let pageEnd = pageStart + this.pageSize;
        return jsonData.slice(pageStart, pageEnd);
    }

    /**
     * Calculates the total number of pages based on the size of the album data.
     * 
     * @returns The total number of pages.
     */
    getLastPageNumber(){
        return Math.ceil(jsonData.length / this.pageSize);
    }

    /**
     * Retrieves a specific album by its ID.
     * 
     * @param id - The unique ID of the album.
     * @returns An array containing the album with the specified ID.
     */
    getAlbum(id: any){
        let dataToReturn: any[] = [];
        jsonData.forEach(function(album){
            if(album['_id']['$oid'] == id){
                dataToReturn.push(album)
            }
        })
        return dataToReturn;
    }

    /**
     * Populates the JSON data with random reviews using lorem ipsum text.
     * Makes use of the `getLoremIpsum` method to fetch lorem ipsum content.
     */
    populateReviews(){
        let loremIpsum = <String>"";

        this.getLoremIpsum(1).subscribe((response: any) => {

            loremIpsum = response.text;

            jsonData.forEach(function(album){
                let numReviews = Math.floor(Math.random() * 10);
                for (var i=0; i < numReviews; i++){
                    let textSize = Math.floor(Math.random() * 290 + 10);
                    let textStart = Math.floor(Math.random() * 
                                (loremIpsum.length - textSize));
                }
            })
        })
    }

    /**
     * Fetches lorem ipsum text from an external API.
     * 
     * @param paragraphs - The number of paragraphs of lorem ipsum text to retrieve.
     * @returns An Observable containing the response from the API.
     */
    getLoremIpsum(paragraphs: number): Observable<any>{

        let API_key = 'OTICg67nm4BTJAj3FaYxKg==w8YD3uEtrTX2s8FV';
        return this.http.get<any>(
            'https://api.api-ninjas.com/v1/loremipsum?paragraphs=' + paragraphs,
            {headers: {'X-Api-Key': API_key}}
        );
    }

    /**
     * Adds a new review to the album with the specified ID.
     * 
     * @param id - The unique ID of the album to which the review will be added.
     * @param review - The review data to add.
     * @returns An Observable indicating the success of the operation.
     */
    postReview(id: string, review: any): Observable<any> {
        return new Observable((observer) => {
          jsonData.forEach((album) => {
            if (album['_id']['$oid'] === id) {
                album['reviews'].push(review);
              console.log('New review added to jsonData:', review); // Log here
              observer.next({ success: true });
              observer.complete();
            }
          });
        });
      }
}