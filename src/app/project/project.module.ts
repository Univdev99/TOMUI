import { CommonModule } from '@angular/common';
import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { CreateProjectComponent } from './create-project/create-project.component';
import { ProjectListComponent } from './project-list/project-list.component';
import { FormsModule } from '@angular/forms';
import { ElementModule } from '../common/element/element.module';
import { CalendarModule } from 'primeng/calendar';
import { ProjectScheduleComponent } from './project-schedule/project-schedule.component';
import { ProjectSentCompletedComponent } from './project-sent-completed/project-sent-completed.component';
import { InputMaskModule } from 'primeng/inputmask';

@NgModule({
  imports: [
    CommonModule,
    CalendarModule,
    FormsModule,
    ElementModule,
    InputMaskModule
  ], 
  declarations: [CreateProjectComponent, ProjectListComponent, ProjectScheduleComponent, ProjectSentCompletedComponent],
  entryComponents: [ProjectSentCompletedComponent]
})
export class ProjectModule { }
