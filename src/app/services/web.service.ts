import { HttpClient, HttpHeaders } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable, throwError } from "rxjs";

/**
 * The WebService class provides a collection of methods for interacting with the Albums Directory API.
 * This service includes CRUD operations for albums, as well as methods for searching,
 * reviewing, and retrieving summaries or statistics.
 */
@Injectable()
export class WebService {
    /**
     * The base URL for the Albums Directory API.
     * @type {string}
     */
    private baseUrl = 'http://127.0.0.1:5000/albums';

    /**
     * Constructor for WebService.
     * Injects HttpClient for making HTTP requests.
     * 
     * @param http - The Angular HttpClient used to perform HTTP requests.
     */
    constructor(private http: HttpClient) { }

    /**
     * Fetches a page of albums with optional genre filtering.
     * @param page - The page number to fetch.
     * @param genre - (Optional) The genre of albums to filter by.
     * @returns An Observable for the list of albums.
     */
    getAlbums(page: number, genre?: string) {
        const params: any = { page };
        if (genre) params.genre = genre;
        return this.http.get<any>('http://127.0.0.1:5000/albums', { params });
    }
    
    /**
     * Fetches details of a single album by its ID.
     * @param id - The ID of the album to fetch.
     * @returns An Observable for the album details.
     */
    getAlbum(id: any) {
        return this.http.get<any>('http://127.0.0.1:5000/albums/' + id);
    }

    /**
     * Searches for albums by a query string.
     * @param query - The search query string.
     * @returns An Observable for the list of matching albums.
     */
    searchAlbum(query: string) {
        return this.http.get<any[]>('http://127.0.0.1:5000/albums/search', {
            params: { query }
        });
    }

    /**
     * Adds a new album to the directory.
     * @param album - The album details to add.
     * @returns An Observable for the response of the addition operation.
     */
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

    /**
     * Updates an existing album's details.
     * @param albumId - The ID of the album to update.
     * @param album - The updated album details.
     * @returns An Observable for the response of the update operation.
     */
    updateAlbum(albumId: string, album: any): Observable<any> {
        const token = localStorage.getItem('token');
        const headers = new HttpHeaders().set('x-access-token', token || '');

        const formData = new FormData();
        formData.append('artist', album.artist);
        formData.append('album_title', album.album_title);
        formData.append('year_of_release', album.year_of_release.toString());

        return this.http.put(`${this.baseUrl}/${albumId}`, formData, { headers });
    }

    /**
     * Deletes an album by its ID.
     * @param albumId - The ID of the album to delete.
     * @returns An Observable for the response of the delete operation.
     */
    deleteAlbum(albumId: string): Observable<any> {
        const token = localStorage.getItem('token');
        const headers = new HttpHeaders().set('x-access-token', token || '');

        return this.http.delete(`${this.baseUrl}/${albumId}`, { headers });
    }

    /**
     * Fetches a summary of albums grouped by genre.
     * @returns An Observable for the genre summary.
     */
    getGenreSummary() {
        return this.http.get<any>('http://127.0.0.1:5000/albums/genre-summary');
    }

    /**
     * Fetches a list of highly rated albums.
     * @returns An Observable for the list of high-rated albums.
     */
    getHighRated() {
        return this.http.get<any>('http://127.0.0.1:5000/albums/high-rated');
    }

    /**
     * Fetches reviews for a specific album.
     * @param id - The ID of the album.
     * @returns An Observable for the list of reviews.
     */
    getReviews(id: any) {
        return this.http.get<any>('http://127.0.0.1:5000/albums/' + id + '/reviews');
    }

    /**
     * Posts a new review for a specific album.
     * @param id - The ID of the album to review.
     * @param review - The review details.
     * @returns An Observable for the response of the post operation.
     */
    postReview(id: string, review: any): Observable<any> {
        const token = localStorage.getItem('token'); // Retrieve the token
        const headers = new HttpHeaders().set('x-access-token', token || '');

        const postData = new FormData();
        postData.append("username", review.username);
        postData.append("review_text", review.review_text);
        postData.append("rating", review.rating.toString());

        return this.http.post<any>(`${this.baseUrl}/${id}/reviews`, postData, { headers });
    }

    /**
     * Deletes a specific review for an album.
     * @param albumId - The ID of the album.
     * @param reviewId - The ID of the review to delete.
     * @returns An Observable for the response of the delete operation.
     */
    deleteReview(albumId: string, reviewId: string): Observable<any> {
        const token = localStorage.getItem('token');
        const headers = new HttpHeaders().set('x-access-token', token || '');

        return this.http.delete<any>(
            `${this.baseUrl}/${albumId}/reviews/${reviewId}`, { headers });
    }
}