import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { FirmSignUpComponent } from './firm-sign-up/firm-sign-up.component';
import { FirmDashboardComponent } from './firm-dashboard/firm-dashboard.component';
import { RouterModule } from '@angular/router';
import { DropdownModule } from 'primeng/dropdown';
import { CommonPageModule } from '../common/common-page/common-page.module';
import { ValidationModule } from '../common/validation/validation.module';
import { firmRouting } from './firm.routes';
import { FirmProfileCompleteComponent } from './firm-profile-complete/firm-profile-complete.component';
import { FirmBusinessProfileComponent } from './firm-business-profile/firm-business-profile.component';
import { FirmPersonalProfileComponent } from './firm-personal-profile/firm-personal-profile.component';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { DashboardMenuComponent } from './dashboard-menu/dashboard-menu.component';
import { DashboardHeaderComponent } from './dashboard-header/dashboard-header.component';
import { FirmMainComponent } from './firm-main/firm-main.component';
import { ElementModule } from '../common/element/element.module';
import { ProSearchResultComponent } from './pro-search-result/pro-search-result.component';
import { ConnectWithProComponent } from './connect-with-pro/connect-with-pro.component';
import { ProjectScheduleComponent } from '../project/project-schedule/project-schedule.component';
import { ProjectModule } from '../project/project.module';
import { CreateProjectComponent } from '../project/create-project/create-project.component';
import { InputMaskModule } from 'primeng/inputmask';
import { ProjectFinalizeByFirmComponent } from './project-finalize-by-firm/project-finalize-by-firm.component';
import { FirmAcceptedProjectListComponent } from './firm-accepted-project-list/firm-accepted-project-list.component';
import { FirmProjectHistoryComponent } from './firm-project-history/firm-project-history.component';
// E:\JOB\TOMUI\node_modules\primeng\components\inputmask
@NgModule({
  declarations: [FirmSignUpComponent,
    FirmMainComponent, FirmBusinessProfileComponent,
     FirmPersonalProfileComponent,
      FirmDashboardComponent, FirmProfileCompleteComponent, 
      // DashboardMenuComponent, 
      DashboardHeaderComponent,
       ProSearchResultComponent, ConnectWithProComponent,
       ProjectFinalizeByFirmComponent, FirmAcceptedProjectListComponent, 
       FirmProjectHistoryComponent],
     imports: [
      CommonModule,
      FormsModule,
      ReactiveFormsModule,
      CommonPageModule,
      ValidationModule,
      firmRouting,
      RouterModule,
      DropdownModule,
      NgbModule,
      ElementModule,
      ProjectModule,
      InputMaskModule// temp
    ],
    entryComponents: [
      CreateProjectComponent, // for open modal added
      ProSearchResultComponent,
      ConnectWithProComponent,
      ProjectScheduleComponent,
      ProjectFinalizeByFirmComponent
    ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class FirmModule { }
 