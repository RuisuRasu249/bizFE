import { Component } from "@angular/core";
import { WebService } from "./services/web.service";
import { AuthService } from "./services/authService.component";

@Component({
    selector: 'testWS',
    providers: [WebService],
    templateUrl: './testWS.component.html'
})

export class TestWSComponent {
    test_output: string[] = []
    first_album_list: any[] = []
    second_album_list: any[] = []

    constructor(private webService: WebService, private authService: AuthService) { }

    private testAlbumsFetched() {
        this.webService.getAlbums(1).subscribe((response) => {
            if (Array.isArray(response) && response.length === 9)
                this.test_output.push("Page of Albums fetched... PASS")
            else
                this.test_output.push("Page of Albums fetched... FAIL")
        })
    }

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

    private testGetAlbum() {
        this.webService.getAlbum('674a22f2c95979aa6b4510d7').subscribe((response) => {
            if (response.artist === 'Pink Floyd')
                this.test_output.push("Fetch Album 0 by ID... PASS")
            else
                this.test_output.push("Fetch Album 0 by ID... FAIL")
        })
    }

    private testGetReviews() {
        this.webService.getReviews('674a22f2c95979aa6b4510d7').subscribe((response) => {
            if (Array.isArray(response))
                this.test_output.push("Fetch Reviews of Album 0... PASS")
            else
                this.test_output.push("Fetch Reviews Album 0... FAIL")
        })
    }

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

    private testGetHighRated() {
        this.webService.getHighRated().subscribe((response) => {
            if (Array.isArray(response) && response.length > 0) {
                this.test_output.push("Get High Rated Albums... PASS");
            } else {
                this.test_output.push("Get High Rated Albums... FAIL");
            }
        });
    }

    private testGetGenreRated() {
        this.webService.getGenreSummary().subscribe((response) => {
            if (Array.isArray(response) && response.length > 0) {
                this.test_output.push("Get Genre Albums... PASS");
            } else {
                this.test_output.push("Get Genre Albums... FAIL");
            }
        });
    }

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
    

    testIsAuthenticated() {
        this.authService.isAuthenticated$.next(true);
    
        this.authService.isAuthenticated().subscribe((isAuthenticated) => {
            if (isAuthenticated) {
                this.test_output.push("IsAuthenticated User... PASS");
            } 
        });
        this.authService.isAuthenticated$.next(false);
    }
    

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