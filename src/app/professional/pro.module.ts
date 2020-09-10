import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ProSignUpComponent } from './pro-sign-up/pro-sign-up.component';
import { FormsModule } from '@angular/forms';
import { CommonPageModule } from '../common/common-page/common-page.module';
import { proRouting } from './pro.routes';
import { ProDashboardComponent } from './pro-dashboard/pro-dashboard.component';
import { ProMainComponent } from './pro-main/pro-main.component';
import { ProMenuComponent } from './pro-menu/pro-menu.component';
import { ProDashboardHeaderComponent } from './pro-dashboard-header/pro-dashboard-header.component';
import { ProProfileWorkAvailabilityComponent } from './pro-profile-work-availability/pro-profile-work-availability.component';
import { ProProfilePersonalComponent } from './pro-profile-personal/pro-profile-personal.component';
import { ProProfileWorkExperienceComponent } from './pro-profile-work-experience/pro-profile-work-experience.component';
import { ElementModule } from '../common/element/element.module';
import { DropdownTreeviewModule } from '../common/plugins/ng2-dropdown-treeview/src/dropdown-treeview.module';
import { ProProfileCompleteComponent } from './pro-profile-complete/pro-profile-complete.component';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { ValidationModule } from '../common/validation/validation.module';
import { ProJobListComponent } from './pro-job-list/pro-job-list.component';
import { ScheduleMeetingByProComponent } from './schedule-meeting-by-pro/schedule-meeting-by-pro.component';
import { ProjectFinalizeComponent } from './project-finalize/project-finalize.component';
import { ProAcceptedJobListComponent } from './pro-accepted-job-list/pro-accepted-job-list.component';
import { ProJobHistoryComponent } from './pro-job-history/pro-job-history.component';
import { CalendarModule } from '../../../node_modules/primeng/primeng';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    CommonPageModule,
    ElementModule,
    proRouting,
    NgbModule,
    DropdownTreeviewModule,
    ValidationModule,
    CalendarModule
  ],
  declarations: [ProSignUpComponent, ProDashboardComponent, ProMainComponent,
    //  ProMenuComponent, 

    ProDashboardHeaderComponent, ProProfileWorkAvailabilityComponent, ProProfilePersonalComponent, 
    ProProfileWorkExperienceComponent, ProProfileCompleteComponent, ProJobListComponent,
    ProjectFinalizeComponent, 
     ScheduleMeetingByProComponent, ProAcceptedJobListComponent, ProJobHistoryComponent],
     entryComponents:[ScheduleMeetingByProComponent, ProjectFinalizeComponent],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  // exports: [ProMenuComponent]
  
})
export class ProfessionalModule { }
