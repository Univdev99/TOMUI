import { Component, OnInit, Input, ViewChild } from '@angular/core';
import { Project } from '../../project/create-project/project';
import { ProjectScheduleByPro } from '../../professional/schedule-meeting-by-pro/ProjectScheduleByPro';
import { ProjectService } from '../../project/project.service';
import { FormControl } from '../../../../node_modules/@angular/forms';
import { NgbActiveModal } from '../../../../node_modules/@ng-bootstrap/ng-bootstrap';
import { constants } from '../../app.constants';

@Component({
  selector: 'app-project-details-with-schedule',
  templateUrl: './project-details-with-schedule.component.html',
  styleUrls: ['./project-details-with-schedule.component.css']
})
export class ProjectDetailsWithScheduleComponent implements OnInit {

  todayDate = new Date();
  appConstant = constants;
  submitted = false;
  @ViewChild('adminScheduleForm', { static: false }) adminScheduleForm: FormControl;
  firmAndScheduleData; // CFO
  meetingConfirmByAdmin = false; // CFO
  scheduleDateTime1; // schedule of firm CFO
  scheduleDateTime2; // schedule of firm CFO
  scheduleDateTime3; // schedule of firm CFO
  project = new Project();
  projectScheduleByPro = new ProjectScheduleByPro();

  constructor(
    private projectService: ProjectService,
    private ngbActiveModal: NgbActiveModal
  ) { }

  ngOnInit() {
    console.log(this.firmAndScheduleData);
    this.getProject();
    this.getProSchedule();
  }

  getProject() {
    if (this.firmAndScheduleData && this.firmAndScheduleData.projectId) {
      const json = {
        'projectId': this.firmAndScheduleData.projectId
      }
      this.projectService.getProjectByProjectId(json, this.projectGetSuccess)
    }
  }

  projectGetSuccess = (result) => {
    if (result) {
      this.project = result;
    }
  }

  proScheduleGetSuccess = (result) => {
    if (result) {
      this.projectScheduleByPro = result;
      if (this.projectScheduleByPro.scheduleDateTime1) {
        this.projectScheduleByPro.o1Selected = true;
      }
      if (this.projectScheduleByPro.scheduleDateTime3) {
        this.projectScheduleByPro.o3Selected = true;
      }
      if (this.projectScheduleByPro.scheduleDateTime2) {
        this.projectScheduleByPro.o2Selected = true;
      }
    }
  }

  getProSchedule() {
    if (this.firmAndScheduleData && this.firmAndScheduleData.projectScheduleByProId) {
      const json = {
        'projectScheduleByProId': this.firmAndScheduleData.projectScheduleByProId
      }
      this.projectService.getScheduledOfPro(json, this.proScheduleGetSuccess)
    }
  }

  saveScheduleByAdmin() {
    this.submitted = true;
    if (((this.projectScheduleByPro.o1Selected && !this.projectScheduleByPro.o2Selected && !this.projectScheduleByPro.o3Selected) ||
      (this.projectScheduleByPro.o2Selected && !this.projectScheduleByPro.o1Selected && !this.projectScheduleByPro.o3Selected) ||
      (this.projectScheduleByPro.o3Selected && !this.projectScheduleByPro.o1Selected && !this.projectScheduleByPro.o2Selected)) && !this.projectScheduleByPro.isNotAvailable) {
      if (this.projectScheduleByPro.o1Selected) {
        this.projectScheduleByPro.scheduleByAdmin = this.projectScheduleByPro.scheduleDateTime1;
      } else if (this.projectScheduleByPro.o2Selected) {
        this.projectScheduleByPro.scheduleByAdmin = this.projectScheduleByPro.scheduleDateTime2;
      } else if (this.projectScheduleByPro.o3Selected) {
        this.projectScheduleByPro.scheduleByAdmin = this.projectScheduleByPro.scheduleDateTime3;
      }

      if (this.adminScheduleForm && this.adminScheduleForm.valid) {
        const json = {
          'projectScheduleByPro': this.projectScheduleByPro
        }
        this.projectService.sendScheduleByPro(json, this.adminScheduleUpdateSuccess);
      }
    } else if (this.projectScheduleByPro.isNotAvailable) {
      if (this.adminScheduleForm && this.adminScheduleForm.valid) {
        const json = {
          'projectScheduleByPro': this.projectScheduleByPro
        }
        this.projectService.sendScheduleByPro(json, this.adminScheduleUpdateSuccess);
      }
    } else {
      // alert("Please select only one value")
    }
  }

  adminScheduleUpdateSuccess = (result) => {
    if (result) {
      const json = {
        'projectReqStatus': this.appConstant.completed
      }
      this.ngbActiveModal.close(json);
      // it will subscribe in firm search page
    }
  }

  setAdminDate(argFrom, ngModal) {
    if (!ngModal) {
      if (argFrom === 'fromSchedule1') {
        this.projectScheduleByPro.o2Selected = false;
        this.projectScheduleByPro.o3Selected = false;
      } else if (argFrom === 'fromSchedule2') {
        this.projectScheduleByPro.o1Selected = false;
        this.projectScheduleByPro.o3Selected = false;
      } else if (argFrom === 'fromSchedule3') {
        this.projectScheduleByPro.o1Selected = false;
        this.projectScheduleByPro.o2Selected = false;
      }
    }

  }
}
