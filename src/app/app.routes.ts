import { Routes } from '@angular/router';

import { HomeComponent }         from './pages/home/home.component';
import { ProductListComponent }  from './pages/product-list/product-list.component';
import { LogoutComponent }       from './pages/logout/logout.component';

export const appRoutes: Routes = [
  // Homepage
  { path: '',        component: HomeComponent },
  { path: 'home',    component: HomeComponent },

  // Lista prodotti
  { path: 'products', component: ProductListComponent },

  // Logout
  { path: 'logout',  component: LogoutComponent },

  // Wildcard: redirect a home per percorsi non riconosciuti
  { path: '**',      redirectTo: '', pathMatch: 'full' },
];
