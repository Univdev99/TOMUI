import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AddAdminComponent } from './add-admin/add-admin.component';
import { MasterAdminDashboardComponent } from './master-admin-dashboard/master-admin-dashboard.component';



@NgModule({
  declarations: [AddAdminComponent, MasterAdminDashboardComponent],
  imports: [
    CommonModule
  ]
})
export class MasterAdminModule { }
