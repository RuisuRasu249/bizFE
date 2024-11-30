import { Component } from "@angular/core";
import { WebService } from "./services/web.service";
import { AuthService } from "./services/authService.component";

/**
 * The `TestWSComponent` is responsible for testing the functionality of the `WebService` and `AuthService`.
 * It includes various test cases for verifying CRUD operations, user authentication, and other key features.
 */
@Component({
    selector: 'testWS', // The selector used to include this component in the application.
    providers: [WebService], // Provides the `WebService` specifically for this component.
    templateUrl: './testWS.component.html' // The associated template file for this component.
})

export class TestWSComponent {
    /**
     * Stores the output messages for each test case.
     */
    test_output: string[] = [];

    /**
     * Stores the list of albums from the first page.
     */
    first_album_list: any[] = [];

    /**
     * Stores the list of albums from the second page.
     */
    second_album_list: any[] = [];

    /**
     * Constructor for `TestWSComponent`.
     * Injects the `WebService` and `AuthService` for testing purposes.
     * 
     * @param webService - The service used for interacting with the API.
     * @param authService - The service used for managing authentication.
     */
    constructor(private webService: WebService, private authService: AuthService) { }

    /**
     * Tests if a page of albums can be successfully fetched.
     */
    private testAlbumsFetched() {
        this.webService.getAlbums(1).subscribe((response) => {
            if (Array.isArray(response) && response.length === 9)
                this.test_output.push("Page of Albums fetched... PASS")
            else
                this.test_output.push("Page of Albums fetched... FAIL")
        })
    }

    /**
     * Tests if albums from two different pages are distinct.
     */
    private testPagesOfAlbumsAreDifferent() {
        this.webService.getAlbums(1).subscribe((response) => {
            this.first_album_list = response;
            this.webService.getAlbums(2).subscribe((response) => {
                this.second_album_list = response;
                if (this.first_album_list[0]['_id'] != this.second_album_list[0]['_id'])
                    this.test_output.push("Albums Pages 1 and 2 are different... PASS");
                else
                    this.test_output.push("Albums 1 and 2 are different... FAIL");
            })
        })
    }

    /**
     * Tests fetching an album by ID.
     */
    private testGetAlbum() {
        this.webService.getAlbum('674a22f2c95979aa6b4510d7').subscribe((response) => {
            if (response.artist === 'Pink Floyd')
                this.test_output.push("Fetch Album 0 by ID... PASS")
            else
                this.test_output.push("Fetch Album 0 by ID... FAIL")
        })
    }

    /**
     * Tests fetching reviews for a specific album.
     */
    private testGetReviews() {
        this.webService.getReviews('674a22f2c95979aa6b4510d7').subscribe((response) => {
            if (Array.isArray(response))
                this.test_output.push("Fetch Reviews of Album 0... PASS")
            else
                this.test_output.push("Fetch Reviews Album 0... FAIL")
        })
    }

    /**
     * Tests posting a review for a specific album.
     */
    private testPostReview() {
        let test_review = {
            "username": "Test User",
            "comment": "Test Comment",
            "rating": 5
        };

        this.webService.getReviews('674a22f2c95979aa6b4510d7').subscribe((response) => {
            let num_reviews = response.length;
            this.webService.postReview('674a22f2c95979aa6b4510d7', test_review)
                .subscribe((response) => {
                    this.webService.getReviews('674a22f2c95979aa6b4510d7')
                        .subscribe((response) => {
                            if (response.length == num_reviews + 1)
                                this.test_output.push("Post review... PASS (Logged in as User Or Admin)")
                            else
                                this.test_output.push("Post review... FAIL")
                        })
                })
        })
    }

    /**
     * Tests searching for an album by a query string.
     */
    private testSearchAlbum() {
        const query = "Nirvana"; // Example search query
        this.webService.searchAlbum(query).subscribe((response) => {
            if (Array.isArray(response) && response.length > 0 && response.some(album => album.artist === "Nirvana")) {
                this.test_output.push("Search Album... PASS");
            } else {
                this.test_output.push("Search Album... FAIL");
            }
        });
    }

    /**
     * Tests fetching high-rated albums.
     */
    private testGetHighRated() {
        this.webService.getHighRated().subscribe((response) => {
            if (Array.isArray(response) && response.length > 0) {
                this.test_output.push("Get High Rated Albums... PASS");
            } else {
                this.test_output.push("Get High Rated Albums... FAIL");
            }
        });
    }

    /**
     * Tests fetching a genre summary for albums.
     */
    private testGetGenreRated() {
        this.webService.getGenreSummary().subscribe((response) => {
            if (Array.isArray(response) && response.length > 0) {
                this.test_output.push("Get Genre Albums... PASS");
            } else {
                this.test_output.push("Get Genre Albums... FAIL");
            }
        });
    }

    /**
    * Tests adding a new album to the database.
    * 
    * Steps:
    * - Fetches the initial list of albums to determine the count.
    * - Sends a request to add a new album.
    * - Fetches the newly added album by its ID to verify the details match.
    * - Updates the test output with PASS or FAIL based on the results.
    */
    private testAddAlbum() {
        const test_album = {
            artist: "Test Artist",
            album_title: "Test Album",
            year_of_release: 2024,
            genre: "Test Genre"
        };

        this.webService.getAlbums(1).subscribe((initialResponse) => {
            let initialCount = initialResponse.length;

            this.webService.addAlbum(test_album).subscribe((addResponse) => {
                console.log('Add Album Response:', addResponse);

                this.webService.getAlbum(addResponse.album_id).subscribe((newAlbum) => {
                    if (newAlbum.artist === test_album.artist &&
                        newAlbum.album_title === test_album.album_title) {
                        this.test_output.push("Add Album... PASS (Logged in as Admin)");
                    } else {
                        this.test_output.push("Add Album... FAIL (Album details mismatch)");
                    }
                }, (error) => {
                    console.error('Fetch Newly Added Album Error:', error);
                    this.test_output.push("Add Album... FAIL (Unable to fetch newly added album)");
                });
            }, (error) => {
                console.error("Add Album Error:", error);
                this.test_output.push("Add Album... FAIL (Permission or validation error)");
            });
        }, (error) => {
            console.error("Initial Album Fetch Error:", error);
            this.test_output.push("Add Album... FAIL (Failed to fetch initial albums)");
        });
    }

    /**
    * Tests updating an existing album in the database.
    * 
    * Steps:
    * - Fetches the list of albums and selects the first album.
    * - Sends a request to update the selected album with new details.
    * - Fetches the updated album to verify the details were correctly updated.
    * - Updates the test output with PASS or FAIL based on the results.
    */
    private testUpdateAlbum() {
        const updatedAlbum = {
            artist: "Updated Artist",
            album_title: "Updated Album",
            year_of_release: 2025
        };

        this.webService.getAlbums(1).subscribe((albums) => {
            if (albums && albums.length > 0) {
                const albumToUpdate = albums[0];
                this.webService.updateAlbum(albumToUpdate._id, updatedAlbum).subscribe({
                    next: (response) => {
                        console.log('Update Album Response:', response);
                        this.webService.getAlbum(albumToUpdate._id).subscribe((updatedAlbumDetails) => {
                            if (updatedAlbumDetails.artist === updatedAlbum.artist &&
                                updatedAlbumDetails.album_title === updatedAlbum.album_title &&
                                updatedAlbumDetails.year_of_release === updatedAlbum.year_of_release
                            ) {
                                this.test_output.push("Update Album... PASS");
                            } else {
                                this.test_output.push("Update Album... FAIL (Data mismatch)");
                            }
                        }, (error) => {
                            console.error('Fetch Updated Album Error:', error);
                            this.test_output.push("Update Album... FAIL (Unable to fetch updated album)");
                        });
                    },
                    error: (error) => {
                        console.error('Update Album Error:', error);
                        this.test_output.push("Update Album... FAIL (Permission or validation error)");
                    }
                });
            } else {
                this.test_output.push("Update Album... FAIL (No albums available to update)");
            }
        }, (error) => {
            console.error('Fetch Initial Albums Error:', error);
            this.test_output.push("Update Album... FAIL (Unable to fetch initial albums)");
        });
    }

    /**
    * Tests deleting an album from the database.
    * 
    * Steps:
    *  - Adds a fake album to the database for testing purposes.
    * - Sends a request to delete the newly added fake album.
    *  - Attempts to fetch the deleted album to verify it no longer exists.
    * - Updates the test output with PASS or FAIL based on the results.
    */
    private testDeleteAlbum() {
        const fakeAlbum = {
            artist: "Fake Artist",
            album_title: "Fake Album",
            year_of_release: 2024,
            genre: "Fake Genre"
        };

        this.webService.addAlbum(fakeAlbum).subscribe((addResponse) => {
            console.log('Fake Album Added:', addResponse);

            this.webService.deleteAlbum(addResponse.album_id).subscribe({
                next: () => {
                    console.log('Fake Album Deleted Successfully');
                    this.webService.getAlbum(addResponse.album_id).subscribe({
                        next: () => {
                            this.test_output.push("Delete Album... FAIL (Fake album still exists)");
                        },
                        error: () => {
                            this.test_output.push("Delete Album... PASS (Fake album successfully deleted)");
                        }
                    });
                },
                error: (error) => {
                    console.error('Delete Album Error:', error);
                    this.test_output.push("Delete Album... FAIL (Error deleting fake album)");
                }
            });
        }, (error) => {
            console.error('Add Fake Album Error:', error);
            this.test_output.push("Delete Album... FAIL (Unable to add fake album for testing)");
        });
    }

    /**
     * Tests login functionality.
     */
    testLogin() {
        const fakeCredentials = { username: "kyrie10101", password: "user123" };

        this.authService.login(fakeCredentials.username, fakeCredentials.password).subscribe({
            next: (response) => {
                if (localStorage.getItem('token') && localStorage.getItem('role') === response.role) {
                    this.test_output.push("Login... PASS");
                } else {
                    this.test_output.push("Login... FAIL (Token or role not set properly)");
                }
            }
        });
    }
    

    /**
     * Tests the `isAuthenticated` observable in the `AuthService`.
     */
    testIsAuthenticated() {
        this.authService.isAuthenticated$.next(true);
    
        this.authService.isAuthenticated().subscribe((isAuthenticated) => {
            if (isAuthenticated) {
                this.test_output.push("IsAuthenticated User... PASS");
            } 
        });
        this.authService.isAuthenticated$.next(false);
    }
    

    /**
     * Tests the `userRole` observable in the `AuthService`.
     */
    testUserRole() {
        // Simulate a user role
        this.authService.userRole$.next('admin');
    
        this.authService.getUserRole().subscribe((role) => {
            if (role === 'admin') {
                this.test_output.push("UserRole Observable... PASS");
            } 
        });
    
        // Reset state
        this.authService.userRole$.next('');
    }
    
    /**
     * Lifecycle hook that initializes the component and runs all test cases.
     */
    ngOnInit() {
        this.testLogin();
        this.testIsAuthenticated();
        this.testUserRole();
        this.testAlbumsFetched();
        this.testPagesOfAlbumsAreDifferent();
        this.testGetAlbum();
        this.testGetReviews();
        this.testPostReview();
        this.testSearchAlbum();
        this.testAddAlbum();
        this.testUpdateAlbum();
        this.testGetHighRated();
        this.testGetGenreRated();
        this.testDeleteAlbum();
    }
}