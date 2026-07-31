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
          import('../../features/categories/category.routes').then((m) => m.CATEGORY_ROUTES),
      },
      {
        path: 'products',

        loadChildren: () =>
          import('../../features/products/product.routes').then((m) => m.PRODUCT_ROUTES),
      },
      {
        path: 'upload',
        loadChildren: () =>
          import('../../features/upload/upload.routes').then((m) => m.UPLOAD_ROUTES),
      },
      {
  path: 'reports',
  loadChildren: () =>
    import('../../features/reports/report.routes')
      .then(m => m.REPORT_ROUTES),
},
    ],
  },
];
