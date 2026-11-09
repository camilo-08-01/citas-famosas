import type { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: 'home',
    loadComponent: () => import('./home/home.page').then((m) => m.HomePage),
  },
  {
    path: '',
    redirectTo: 'home',
    pathMatch: 'full',
  },
  {
    path: 'citas',
    loadComponent: () => import('./citas/citas.page').then((m) => m.CitasPage),
  },
  {
    path: 'configuracion',
    loadComponent: () => import('./configuracion/configuracion.page').then((m) => m.ConfiguracionPage),
  },
];
