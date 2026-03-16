import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    redirectTo: 'fondos',
    pathMatch: 'full',
  },
  {
    path: 'fondos',
    loadComponent: () =>
      import('./features/fondos/fondos.component').then((m) => m.FondosComponent),
    title: 'Fondos disponibles · BTG Pactual',
  },
  {
    path: 'historial',
    loadComponent: () =>
      import('./features/historial/historial.component.').then((m) => m.HistorialComponent),
    title: 'Historial · BTG Pactual',
  },
  {
    path: '**',
    redirectTo: 'fondos',
  },
];
