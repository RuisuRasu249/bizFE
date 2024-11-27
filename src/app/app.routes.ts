import { Routes } from '@angular/router';
import { HomeComponent } from './home.component';
import { BusinessesComponent } from './businesses.component';
import { BusinessComponent } from './business.component';
import { BusinessRatingsComponent } from './businessRatings.component';
import { BusinessGenreComponent } from './businessGenre.component';

export const routes: Routes = [
    {
        path: '',
        component: HomeComponent
    },
    {
        path: 'businesses',
        component: BusinessesComponent
    },
    {
        path: 'businesses/:id',
        component: BusinessComponent
    },
    {
        path: 'ratings',
        component: BusinessRatingsComponent
    },
    {
        path: 'genre',
        component: BusinessGenreComponent
    }
];
