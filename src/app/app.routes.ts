import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    title: 'WeatherNow - Modern Weather Dashboard',
    loadComponent: () =>
      import('./layouts/main-layout/main-layout.component').then(
        (m) => m.MainLayoutComponent
      ),
    children: [
      {
        path: '',
        loadComponent: () =>
          import('./features/dashboard/dashboard.component').then(
            (m) => m.DashboardComponent
          ),
      },
    ],
  },
  {
    path: '**',
    redirectTo: '/',
  },
];
