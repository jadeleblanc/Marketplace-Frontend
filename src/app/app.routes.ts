import { Routes } from '@angular/router';
import { authGuard } from './guards/auth.guard';

export const routes: Routes = [
    { path: '', redirectTo: 'listings', pathMatch: 'full' },

    {
        path: 'login',
        loadComponent: () => import('./components/login/login.component').then((m) => m.LoginComponent),
    },
    {
        path: 'signup',
        loadComponent: () =>
            import('./components/signup/signup.component').then((m) => m.SignupComponent),
    },

    // listings avant les routes avec paramètres
    {
        path: 'listings',
        loadComponent: () =>
            import('./components/listingsList/listingList.component').then(
                (m) => m.ListingsListComponent,
            ),
    },

    // routes statiques avant :id
    {
        path: 'listings/create',
        canActivate: [authGuard],
        loadComponent: () =>
            import('./components/listingForm/listingForm.component').then((m) => m.ListingFormComponent),
    },
    {
        path: 'listings/edit/:id',
        canActivate: [authGuard],
        loadComponent: () =>
            import('./components/listingForm/listingForm.component').then((m) => m.ListingFormComponent),
    },

    // :id en dernier
    {
        path: 'listings/:id',
        loadComponent: () =>
            import('./components/listingDetail/listingDetail.component').then(
                (m) => m.ListingDetailComponent,
            ),
    },

    { path: '**', redirectTo: 'listings' },
];
