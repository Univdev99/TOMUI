import { RouterModule, Routes } from '@angular/router';
import { ModuleWithProviders } from '@angular/core';
import { IsAlreadyLoggedinService } from '../common/is-already-logged-in.service';
import { AdminMainComponent } from './admin-main/admin-main.component';
import { AdminAuthGuard } from '../common/admin-authguard';
import { AdminDashboardComponent } from './admin-dashboard/admin-dashboard.component';
import { FirmSearchComponent } from './firm-search/firm-search.component';
import { ProSearchComponent } from './pro-search/pro-search.component';
import { MasterAdminComponent } from './master-admin/master-admin.component';
import { FirmProfileListComponent } from './firm-profile-list/firm-profile-list.component';
import { ProProfileListComponent } from './pro-profile-list/pro-profile-list.component';

const adminRoutes: Routes = [

  {
    path: 'admin-main', component: AdminMainComponent,
    // canActivate: [AdminAuthGuard],
    children: [
      {
        path: 'dashboard',
        component: AdminDashboardComponent,// canActivate: [AdminAuthGuard]
      },
      {
        path: 'addedit',
        component: MasterAdminComponent,// canActivate: [AdminAuthGuard]
      },
      {
        path: 'firm-search',
        component: FirmSearchComponent,// canActivate: [AdminAuthGuard]
      },
      {
        path: 'firm-profiles',
        component: FirmProfileListComponent,// canActivate: [AdminAuthGuard]
      },
      {
        path: 'pro-search',
        component: ProSearchComponent,// canActivate: [AdminAuthGuard]
      },
      {
        path: 'prof-profiles',
        component: ProProfileListComponent,// canActivate: [AdminAuthGuard]
      },
    ]
  }
];
export const adminRouting: ModuleWithProviders = RouterModule.forChild(adminRoutes);
