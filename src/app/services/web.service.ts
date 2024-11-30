import { HttpClient, HttpHeaders } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable, throwError } from "rxjs";

@Injectable()
export class WebService {
    private baseUrl = 'http://127.0.0.1:5000/albums';

    constructor(private http: HttpClient) { }

    getAlbums(page: number, genre?: string) {
        const params: any = { page };
        if (genre) params.genre = genre;
        return this.http.get<any>('http://127.0.0.1:5000/albums', { params });
    }

    getAlbum(id: any) {
        return this.http.get<any>('http://127.0.0.1:5000/albums/' + id);
    }

    searchAlbum(query: string) {
        return this.http.get<any[]>('http://127.0.0.1:5000/albums/search', {
            params: { query }
        });
    }

    // Add Album
    addAlbum(album: any): Observable<any> {
        const token = localStorage.getItem('token'); // Retrieve the admin token
        const headers = new HttpHeaders().set('x-access-token', token || '');

        const formData = new FormData();
        formData.append('artist', album.artist);
        formData.append('album_title', album.album_title);
        formData.append('year_of_release', album.year_of_release.toString());
        formData.append('genre', album.genre);

        return this.http.post(`${this.baseUrl}/`, formData, { headers });
    }

    updateAlbum(albumId: string, album: any): Observable<any> {
        const token = localStorage.getItem('token');
        const headers = new HttpHeaders().set('x-access-token', token || '');

        const formData = new FormData();
        formData.append('artist', album.artist);
        formData.append('album_title', album.album_title);
        formData.append('year_of_release', album.year_of_release.toString());

        return this.http.put(`${this.baseUrl}/${albumId}`, formData, { headers });
    }

    // Delete Album
    deleteAlbum(albumId: string): Observable<any> {
        const token = localStorage.getItem('token');
        const headers = new HttpHeaders().set('x-access-token', token || '');

        return this.http.delete(`${this.baseUrl}/${albumId}`, { headers });
    }

    getGenreSummary() {
        return this.http.get<any>('http://127.0.0.1:5000/albums/genre-summary');
    }

    getHighRated() {
        return this.http.get<any>('http://127.0.0.1:5000/albums/high-rated');
    }

    getReviews(id: any) {
        return this.http.get<any>('http://127.0.0.1:5000/albums/' + id + '/reviews');
    }

    postReview(id: string, review: any): Observable<any> {
        const token = localStorage.getItem('token'); // Retrieve the token
        const headers = new HttpHeaders().set('x-access-token', token || '');

        const postData = new FormData();
        postData.append("username", review.username);
        postData.append("review_text", review.review_text);
        postData.append("rating", review.rating.toString());

        return this.http.post<any>(`${this.baseUrl}/${id}/reviews`, postData, { headers });
    }


    deleteReview(albumId: string, reviewId: string): Observable<any> {
        const token = localStorage.getItem('token');
        const headers = new HttpHeaders().set('x-access-token', token || '');

        return this.http.delete<any>(
            `${this.baseUrl}/${albumId}/reviews/${reviewId}`, { headers });
    }
}