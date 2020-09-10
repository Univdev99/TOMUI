import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FirmSearchComponent } from './firm-search/firm-search.component';
import { AdminDashboardComponent } from './admin-dashboard/admin-dashboard.component';
import { ProSearchComponent } from './pro-search/pro-search.component';
import { AdminMainComponent } from './admin-main/admin-main.component';
import { AdminMenuComponent } from './admin-menu/admin-menu.component';
import { adminRouting } from './admin.routes';
import { FormsModule } from '@angular/forms';
import { ElementModule } from '../common/element/element.module';
import { MasterAdminComponent } from './master-admin/master-admin.component';
import { AdminEditModalComponent } from './master-admin/admin-edit-modal/admin-edit-modal.component';
import { ProjectDetailsWithScheduleComponent } from './project-details-with-schedule/project-details-with-schedule.component';
import { FirmProfileListComponent } from './firm-profile-list/firm-profile-list.component';
import { ProProfileListComponent } from './pro-profile-list/pro-profile-list.component';
import { ProjectFinalizeByAdminComponent } from './project-finalize-by-admin/project-finalize-by-admin.component';
import { PaymentConfirmationComponent } from './payment-confirmation/payment-confirmation.component';
import { ValidationModule } from '../common/validation/validation.module';
import { FullCalendarModule } from '@fullcalendar/angular'; // for FullCalendar!
import { CommonPageModule } from '../common/common-page/common-page.module';


@NgModule({
  declarations: [FirmSearchComponent, MasterAdminComponent
    , AdminDashboardComponent, ProSearchComponent,
    FirmProfileListComponent, ProProfileListComponent,
    AdminMainComponent, AdminMenuComponent, AdminEditModalComponent, ProjectDetailsWithScheduleComponent, ProjectFinalizeByAdminComponent, PaymentConfirmationComponent],
  imports: [
    CommonModule,
    adminRouting,
    FormsModule,
    ElementModule,
    ValidationModule,
    FullCalendarModule,
    CommonPageModule
  ],
  entryComponents: [ProjectFinalizeByAdminComponent,
    PaymentConfirmationComponent, AdminEditModalComponent, ProjectDetailsWithScheduleComponent]
})
export class AdminModule { }
