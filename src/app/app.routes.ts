import { Routes } from '@angular/router';
import { HomeComponent } from './components/home.component';
import { LoginComponent } from './components/login.component';
import { AlbumsComponent } from './components/albums.component';
import { AlbumComponent } from './components/album.component';
import { AlbumRatingsComponent } from './components/albumRatings.component';
import { AlbumGenreComponent } from './components/albumGenre.component';
import { TestWSComponent } from './testWS.component';

export const routes: Routes = [
    {
        path: '',
        component: HomeComponent
    },
    {
        path: 'albums',
        component: AlbumsComponent
    },
    {
        path: 'albums/:id',
        component: AlbumComponent
    },
    {
        path: 'ratings',
        component: AlbumRatingsComponent
    },
    {
        path: 'genre',
        component: AlbumGenreComponent
    },
    {
        path: 'login',
        component: LoginComponent
    },
    {
        path: 'test',
        component: TestWSComponent
    }
];
