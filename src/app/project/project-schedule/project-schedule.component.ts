import { Component, OnInit, ViewChild, Input } from '@angular/core';
import { ProjectSchedule } from './project-schedule';
import { ProjectService } from '../project.service';
import { FormControl } from '@angular/forms';
import { constants } from '../../app.constants';
import { ProService } from '../../professional/pro.service';
import { LocalStorageService } from '../../common/local-storage.service';
import { NgbModal, NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { ProjectSentCompletedComponent } from '../project-sent-completed/project-sent-completed.component';
import { NotificationService } from 'src/app/notification/notification.service';
import { Notification } from 'src/app/notification/notification';
import { AssertNotNull } from '@angular/compiler';

@Component({
  selector: 'app-project-schedule',
  templateUrl: './project-schedule.component.html',
  styleUrls: ['./project-schedule.component.css']
})
export class ProjectScheduleComponent implements OnInit {

  @ViewChild('projectScheduleForm', { static: false }) projectScheduleForm: FormControl;
  submitted = false;
  appConstant = constants;
  prjSchedule = new ProjectSchedule();

  @Input() firmProfileId = null;
  @Input() projectId = null;

  constructor(
    private projectService: ProjectService,
    private proService: ProService,
    private ngbModal: NgbModal,
    private ngbActiveModal: NgbActiveModal,
    private localStorageService: LocalStorageService,
    private notificationService: NotificationService
  ) { }

  ngOnInit() {
    this.prjSchedule.proProfileId = this.proService.proProfileId
    this.prjSchedule.adminProfit = this.proService.adminProfit;
    this.prjSchedule.firmProfileId = this.localStorageService.getValue(this.appConstant.firmProfileId);
    this.prjSchedule.projectId = this.projectId;
  }

  saveProjectSchedule() {
    this.submitted = true;
    if (this.projectScheduleForm.valid) {
      if (this.prjSchedule.proProfileId && this.prjSchedule.firmProfileId && this.prjSchedule.projectId && this.prjSchedule.adminProfit) {
        const json = {
          'projectSchedule': this.prjSchedule
        }
        this.projectService.peojectSchedule(json, this.scheduleSaveSuccess);
      }
    }
  }

  scheduleSaveSuccess = (result) => {
    if (result) {
      this.ngbActiveModal.close();
      // notification code start
      this.setAndSendNotification();
      // notification code end
      this.ngbModal.open(ProjectSentCompletedComponent);
    }
  }

  setAndSendNotification() {
    if (this.localStorageService.getValue(this.appConstant.user)) {
      const fromUserId = this.localStorageService.getValue(this.appConstant.user)['userId'];
      const lastName = this.localStorageService.getValue(this.appConstant.user)['lastName'];
      const firstName = this.localStorageService.getValue(this.appConstant.user)['firstName'];
      const toUserId = this.localStorageService.getValue(this.appConstant.toUserForNotification);
      const toUserName = this.localStorageService.getValue(this.appConstant.proNameForNotification);

      const msg = lastName + ', ' + firstName + ' just sent ' + toUserName + ' a request to connect. Stay tuned!';

      const notificationAry = new Array<Notification>();
      // for pro
      const notification = new Notification();
      notification.notificationMessage = msg;
      notification.toUserId = null;
      notification.fromUserId = fromUserId;
      notificationAry.push(notification);
      // for admin
      const notification1 = new Notification();
      notification1.notificationMessage = lastName + ', ' + firstName +
        ' thinks you might be a good fit for their project. Go to Job Requests for next steps!';
      notification1.toUserId = toUserId;
      notification1.fromUserId = fromUserId;
      notificationAry.push(notification1);

      const json2 = {
        notificationList: notificationAry,
      };

      const successcallback = (result) => {
        // // alert("notification send!!!");
      };
      this.notificationService.notificationSave(json2, successcallback);
    }
  }

}
