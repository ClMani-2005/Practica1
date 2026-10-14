import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    redirectTo: 'home', // Al abrir la app, redirige automáticamente a Home
    pathMatch: 'full'
  },

  {
    path: 'home',
    loadChildren: () => import('./home/home.page').then(m => m.HomePage)
  },

  //{
    //path: 'dashboard', // Esta es la página a la que te mandará el formulario
    //loadChildren: () => import('./dashboard/dashboard.module').then(m => m.DashboardPageModule)
  //},

  {
    path: 'registro',
    loadComponent: () => import('./registro/registro.page').then( m => m.RegistroPage)
  },
  {
    path: 'detalles', // 👈 Añadimos la ruta para detalles
    loadComponent: () => import('./detalles/detalles.page').then( m => m.DetallesPage)
  },
  {
    path: 'gestion-alumnos',
    loadComponent: () => import('./gestion-alumnos/gestion-alumnos.page').then( m => m.GestionAlumnosPage)
  },
  {
    path: 'carreras',
    loadComponent: () => import('./carreras/carreras.page').then( m => m.CarrerasPage)
  }
];
