import { Routes } from '@angular/router';

export const routes: Routes = [

    {
        path:'',
        redirectTo:'login',
        pathMatch:'full'
    },
    {
        path:'',
        loadChildren:()=>import('./features/auth/auth.routes')
        .then(r=>r.AUTH_ROUTES)
    },
     {
        path:'',
        loadChildren:() =>
            import('./layout/dashboard/dashboard.routes')
            .then(m => m.DASHBOARD_ROUTES)
    }
];