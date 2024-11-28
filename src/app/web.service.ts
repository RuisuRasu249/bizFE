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

    searchBusiness(query: string) {
        return this.http.get<any[]>('http://127.0.0.1:5000/albums/search', {
            params: { query }
        });
    } 
    
    addAlbum(data: any) {
        return this.http.post<any>('http://127.0.0.1:5000/albums/', data);
    }    
    
    updateAlbum(id: string, data: any) {
        return this.http.put<any>(`http://127.0.0.1:5000/albums/${id}`, data);
    }        
    
    deleteAlbum(id: string) {
        return this.http.delete<any>(`http://127.0.0.1:5000/albums/${id}`);
    }    
    
    getGenreSummary(){
        return this.http.get<any>('http://127.0.0.1:5000/albums/genre-summary');
    }

    getHighRated(){
        return this.http.get<any>('http://127.0.0.1:5000/albums/high-rated');
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
    
    deleteReview(albumId: string, reviewId: string) {
        return this.http.delete<any>(`http://127.0.0.1:5000/albums/${albumId}/reviews/${reviewId}`);
    }
    
}