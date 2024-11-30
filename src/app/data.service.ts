import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import jsonData from '../assets/albumdb.albums.json'

@Injectable({
    providedIn: 'root'
})
export class DataService{

    pageSize: number = 11;

    constructor(private http: HttpClient){}

    getAlbums(page: number){
        let pageStart = (page - 1) * this.pageSize;
        let pageEnd = pageStart + this.pageSize;
        return jsonData.slice(pageStart, pageEnd);
    }

    getLastPageNumber(){
        return Math.ceil(jsonData.length / this.pageSize);
    }

    getAlbum(id: any){
        let dataToReturn: any[] = [];
        jsonData.forEach(function(album){
            if(album['_id']['$oid'] == id){
                dataToReturn.push(album)
            }
        })
        return dataToReturn;
    }

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

    getLoremIpsum(paragraphs: number): Observable<any>{

        let API_key = 'OTICg67nm4BTJAj3FaYxKg==w8YD3uEtrTX2s8FV';
        return this.http.get<any>(
            'https://api.api-ninjas.com/v1/loremipsum?paragraphs=' + paragraphs,
            {headers: {'X-Api-Key': API_key}}
        );
    }

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