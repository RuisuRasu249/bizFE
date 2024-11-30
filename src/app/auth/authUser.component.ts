import { Component } from "@angular/core";
import { AuthService } from "@auth0/auth0-angular";
import { AsyncPipe } from "@angular/common";
import { CommonModule } from "@angular/common";

/**
 * The `AuthUserComponent` is responsible for displaying the authenticated user's profile information.
 * It uses the Auth0 `AuthService` to retrieve and display user authentication details.
 */
@Component({
    selector: 'user-profile', // The selector used to include this component in the application.
    templateUrl: 'authUser.component.html', // The template file associated with this component.
    imports: [AsyncPipe, CommonModule] // Imports used within this component's template.
})

export class AuthUserComponent {

    /**
     * Constructor for `AuthUserComponent`.
     * Injects the `AuthService` to access authentication methods and user profile data.
     * 
     * @param auth - The Auth0 Angular AuthService instance, used to manage user authentication and retrieve user details.
     */
    constructor(public auth: AuthService) { }
}