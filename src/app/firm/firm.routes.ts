import { RouterModule, Routes } from '@angular/router';
import { ModuleWithProviders } from '@angular/core';
import { FirmSignUpComponent } from './firm-sign-up/firm-sign-up.component';
import { FirmDashboardComponent } from './firm-dashboard/firm-dashboard.component';
import { FirmProfileCompleteComponent } from './firm-profile-complete/firm-profile-complete.component';
import { FirmBusinessProfileComponent } from './firm-business-profile/firm-business-profile.component';
import { FirmPersonalProfileComponent } from './firm-personal-profile/firm-personal-profile.component';
import { FirmMainComponent } from './firm-main/firm-main.component';
import { ProjectListComponent } from '../project/project-list/project-list.component';
import { FirmAuthGuard } from '../common/element/firm.authguard';
import { IsAlreadyLoggedinService } from '../common/is-already-logged-in.service';
import { FirmActiveUserAuthGuard } from '../common/element/firm-active-user.authguard';
import { FirmAcceptedProjectListComponent } from './firm-accepted-project-list/firm-accepted-project-list.component';
import { FirmProjectHistoryComponent } from './firm-project-history/firm-project-history.component';
import { HelpComponent } from '../common/common-page/help/help.component';

const firmRoutes: Routes = [
  {
    path: 'sign-up', component: FirmSignUpComponent, canActivate: [IsAlreadyLoggedinService]
  },
  {
    path: 'profile/business', component: FirmBusinessProfileComponent,
    canActivate: [FirmAuthGuard]
  },
  {
    path: 'profile/personal', component: FirmPersonalProfileComponent,
    canActivate: [FirmAuthGuard]
  },
  {
    path: 'profile/complete', component: FirmProfileCompleteComponent,
  },
  {
    path: 'help',
    component: HelpComponent, canActivate: [FirmActiveUserAuthGuard]
  },
  {
    path: 'firm-main', component: FirmMainComponent,
    canActivate: [FirmActiveUserAuthGuard],
    children: [
      {
        path: 'dashboard',
        component: FirmDashboardComponent, canActivate: [FirmActiveUserAuthGuard]
      },
      {
        path: 'open-project',
        component: ProjectListComponent, canActivate: [FirmActiveUserAuthGuard]
      },
      {
        path: 'accepted-project',
        component: FirmAcceptedProjectListComponent, canActivate: [FirmActiveUserAuthGuard]
      },
      {
        path: 'history-project',
        component: FirmProjectHistoryComponent, canActivate: [FirmActiveUserAuthGuard]
      },

    ]
  }
];
export const firmRouting: ModuleWithProviders = RouterModule.forChild(firmRoutes);
