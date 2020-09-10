import { Component, OnInit, Input } from '@angular/core';
import { ProService } from '../pro.service';
import { ProjectService } from '../../project/project.service';
import { ProjectSchedule } from '../../project/project-schedule/project-schedule';
import { constants } from '../../app.constants';
import { ProjectScheduleByPro } from './ProjectScheduleByPro';
import { NgbActiveModal } from '../../../../node_modules/@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-schedule-meeting-by-pro',
  templateUrl: './schedule-meeting-by-pro.component.html',
  styleUrls: ['./schedule-meeting-by-pro.component.css']
})
export class ScheduleMeetingByProComponent implements OnInit {

  @Input() projectScheduleId = null;
  projectSchedule = new ProjectSchedule();
  projectScheduleByPro = new ProjectScheduleByPro();
  appConstnt = constants;
  valMessage: string;
  constructor(
    private projectService: ProjectService,
    private ngbActiveModal: NgbActiveModal,


  ) { }

  ngOnInit() {
    if (this.projectScheduleId) {
      const json = {
        'projectScheduleId': this.projectScheduleId
      }
      this.projectService.getScheduledOfFirm(json, this.getScheduleGetSuccess)
    }
  }

  getScheduleGetSuccess = (result) => {
    if (result) {
      this.projectSchedule = result;
    }
  }

  sendScheduleByPro() {
    this.valMessage = '';
    if (!this.projectScheduleByPro.o1Selected && !this.projectScheduleByPro.o2Selected && !this.projectScheduleByPro.o3Selected && !this.projectScheduleByPro.isNotAvailable) {
      this.valMessage = 'Please select atleast one option';
      return;
    }
    if (this.projectScheduleId) {
      this.projectScheduleByPro.projectScheduleId = this.projectScheduleId;
    }
    if (this.projectScheduleByPro.o1Selected) {
      this.projectScheduleByPro.scheduleDateTime1 = this.projectSchedule.scheduleDateTime1;
    }
    if (this.projectScheduleByPro.o2Selected) {
      this.projectScheduleByPro.scheduleDateTime2 = this.projectSchedule.scheduleDateTime2;
    }
    if (this.projectScheduleByPro.o3Selected) {
      this.projectScheduleByPro.scheduleDateTime3 = this.projectSchedule.scheduleDateTime3;
    }
    const json = {
      'projectScheduleByPro': this.projectScheduleByPro
    }
    this.projectService.sendScheduleByPro(json, this.scheduleSuccess);
  }

  scheduleSuccess = (result) => {
    if (result) {
      const json = {
        'projectScheduledByPro': true
      }
      this.ngbActiveModal.close(json);
    }
  }
}

