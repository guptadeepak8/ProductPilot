import { Routes } from '@angular/router';

import { Dashboard } from './dashboard';

export const DASHBOARD_ROUTES: Routes = [

  {
    path: 'dashboard',

    component: Dashboard,

    children: [

      {
        path: '',
        redirectTo: 'categories',
        pathMatch: 'full',
      },

      {
        path: 'categories',
        loadChildren: () =>
          import('../../features/categories/category.routes')
            .then(m => m.CATEGORY_ROUTES),
      },

    ],

  },

];