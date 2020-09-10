import { RouterModule, Routes } from '@angular/router';
import { ModuleWithProviders } from '@angular/core';
import { ProSignUpComponent } from './pro-sign-up/pro-sign-up.component';
import { ProDashboardComponent } from './pro-dashboard/pro-dashboard.component';
import { ProMainComponent } from './pro-main/pro-main.component';
import { ProProfileWorkAvailabilityComponent } from './pro-profile-work-availability/pro-profile-work-availability.component';
import { ProProfilePersonalComponent } from './pro-profile-personal/pro-profile-personal.component';
import { ProProfileWorkExperienceComponent } from './pro-profile-work-experience/pro-profile-work-experience.component';
import { ProAuthGuard } from '../common/element/pro.authguard';
import { ProProfileCompleteComponent } from './pro-profile-complete/pro-profile-complete.component';
import { IsAlreadyLoggedinService } from '../common/is-already-logged-in.service';
import { ProJobListComponent } from './pro-job-list/pro-job-list.component';
import { ProAcceptedJobListComponent } from './pro-accepted-job-list/pro-accepted-job-list.component';
import { ProJobHistoryComponent } from './pro-job-history/pro-job-history.component';
import { ProActiveUserAuthGuard } from '../common/element/pro-active-user.authguard';
import { HelpComponent } from '../common/common-page/help/help.component';

const proRoutes: Routes = [
    {
        path: 'sign-up', component: ProSignUpComponent, canActivate: [IsAlreadyLoggedinService]
    },
    {
        path: 'work-availability', component: ProProfileWorkAvailabilityComponent,
        canActivate: [ProAuthGuard]
    },
    {
        path: 'personal', component: ProProfilePersonalComponent,
        canActivate: [ProAuthGuard]
    },
    {
        path: 'work-experience', component: ProProfileWorkExperienceComponent,
        canActivate: [ProAuthGuard]
    },
    {
        path: 'complete', component: ProProfileCompleteComponent,
    },
    {
        path: 'help',
        component: HelpComponent, canActivate: [ProActiveUserAuthGuard]
      },
    {
        path: 'pro-main', component: ProMainComponent,
        children: [
            {
                path: 'dashboard',
                component: ProDashboardComponent,
                canActivate: [ProActiveUserAuthGuard]
            },
            {
                path: 'requested-job',
                component: ProJobListComponent, canActivate: [ProActiveUserAuthGuard]
            },
            {
                path: 'accepted-job',
                component: ProAcceptedJobListComponent, canActivate: [ProActiveUserAuthGuard]
            },
            {
                path: 'history-job',
                component: ProJobHistoryComponent, canActivate: [ProActiveUserAuthGuard]
            },
        ]
    }
];
export const proRouting: ModuleWithProviders = RouterModule.forChild(proRoutes);
