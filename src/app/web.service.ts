import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";

@Injectable()
export class WebService{

    constructor(private http: HttpClient){}

    getBusinesses(page: number, genre?: string) {
        const params: any = { page };
        if (genre) params.genre = genre;
        return this.http.get<any>('http://127.0.0.1:5000/albums', { params });
    }

    getBusiness(id:any){
        return this.http.get<any>('http://127.0.0.1:5000/albums/' + id);
    }

    getReviews(id: any) {
        return this.http.get<any>('http://127.0.0.1:5000/albums/' + id + '/reviews');
    }    
   
    postReview(id: any, review: any) {
        let postData = new FormData();
        postData.append("username", review.username);
        postData.append("review_text", review.review_text);
        postData.append("rating", review.rating.toString());

    
        // Ensure the URL matches the backend route
        return this.http.post<any>('http://127.0.0.1:5000/albums/' + id + '/reviews', postData);
    }
}