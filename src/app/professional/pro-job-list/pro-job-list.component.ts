import * as $ from "jquery";
import { Component, OnInit } from '@angular/core';
import { Router } from '../../../../node_modules/@angular/router';
import { allPath } from '../../allPath';
import { constants } from '../../app.constants';
import { LocalStorageService } from '../../common/local-storage.service';
import { ProService } from '../pro.service';
import { NgbModal } from '../../../../node_modules/@ng-bootstrap/ng-bootstrap';
import { ScheduleMeetingByProComponent } from '../schedule-meeting-by-pro/schedule-meeting-by-pro.component';
import { ProjectService } from '../../project/project.service';
import { ProjectFinalizeComponent } from '../project-finalize/project-finalize.component';
import { NotificationService } from '../../notification/notification.service';
import { Notification } from '../../notification/notification';

@Component({
  selector: 'app-pro-job-list',
  templateUrl: './pro-job-list.component.html',
  styleUrls: ['./pro-job-list.component.css']
})

export class ProJobListComponent implements OnInit {

  pathList = allPath;
  appConstant = constants;
  proProfileId = null;
  jobList = [];

  constructor(
    private ngbModal: NgbModal,
    private notificationService: NotificationService,
    private projectService: ProjectService,
    private localStorageService: LocalStorageService,
    private proService: ProService,
  ) { }

  ngOnInit() {
    this.proProfileId = this.localStorageService.getValue(this.appConstant.proProfileId);
    if (this.proProfileId) {
      const json = {
        'proProfileId': this.proProfileId,
        'jobStatus': this.appConstant.requested
      }
      this.proService.getProJob(json, this.proJobGetsuccess)
    }
  }

  proJobGetsuccess = (result) => {
    if (result) {
      this.jobList = result;
      this.jobList[0].isView = true;
    }
  }

  changeViewParameter(i) {
    this.callJQuery('projectDetails', 'requestedJobOverView');
    this.jobList.forEach(e => {
      e.isView = false;
    });
    this.jobList[i].isView = true;
  }

  callJQuery(hideId, showId) {
    $('#' + hideId).hide();
    $('#' + showId).show();
  }

  openScheduleByProModal(projectScheduleId, index) {
    const modalRef = this.ngbModal.open(ScheduleMeetingByProComponent);
    modalRef.componentInstance.projectScheduleId = projectScheduleId;
    modalRef.result.then((result) => {
      if (result && result.projectScheduledByPro) {
        this.jobList[index].jobStatus = this.appConstant.pendingMeeting;
        this.setAndSaveNotificationAfterAccpet(this.jobList[index].proName, this.jobList[index].businessName);
      }
    });
  }

  projectDeclineByPro(projectScheduleId, index) {
    if (projectScheduleId) {
      const projectDeclineSuccess = (result) => {
        if (result) {
          this.jobList[index].jobStatus = this.appConstant.declined;
          this.setAndSaveNotification(this.jobList[index].proFirstName, this.jobList[index].firmProfileId, this.jobList[index].proName, this.jobList[index].businessName);
        }
      }
      const json = {
        'projectScheduleId': projectScheduleId
      }
      this.projectService.projectDeclineByPro(json, projectDeclineSuccess);
    }
  }

  /* finalize modal */
  openProjectFinalizeModal(projectId, index, projectData) {
    const modalRef = this.ngbModal.open(ProjectFinalizeComponent);
    modalRef.componentInstance.projectId = projectId;
    modalRef.componentInstance.dataForNotification = projectData;
    modalRef.result.then((result) => {
      if (result && result.projectFinalizedByPro) {
        this.jobList[index].jobStatus = this.appConstant.pendingApproval;
        this.jobList[index].projectFinalizeId = result.projectFinalizeId;
      }
    });
  }
  /* finalize modal */


  projectDeclineAfterMeeting(projectId, projectScheduleId, index) {
    if (projectScheduleId && projectId) {
      const declineAfterMeetingSuccess = (result) => {
        if (result) {
          this.jobList[index].jobStatus = this.appConstant.declined;
          this.setAndSaveNotification(this.jobList[index].proFirstName, this.jobList[index].firmProfileId, this.jobList[index].proName, this.jobList[index].businessName);
        }
      }
      const json = {
        'projectId': projectId,
        'proProfileId': this.proProfileId,
        'projectScheduleId': projectScheduleId,
      }
      this.projectService.projectDeclineByProAfterMeeting(json, declineAfterMeetingSuccess)
    }
  }

  setAndSaveNotification(proFirstNameForFirm, firmProfileId, proNameForAdmin, firmNameForAdmin) {
    // notification code start
    const proProfileId = this.localStorageService.getValue(this.appConstant.proProfileId);
    const msgForFirm = proFirstNameForFirm + ' has declined the project. Head to your dashboard to search for other professionals';
    const msgForAdmin = proNameForAdmin + " declined " + firmNameForAdmin + " 's job.";
    const msgForPro = "You've declined the job request from "+firmNameForAdmin+". Stay tuned for future opportunities!"
    
    const notArray = new Array<Notification>();
    const notForFirm = new Notification();
    notForFirm.fromUserId = proProfileId;
    notForFirm.toUserId = firmProfileId; // for Firm
    notForFirm.notificationMessage = msgForFirm;
    notForFirm.notificationFor = this.appConstant.firm;

    const notForPro = new Notification();
    notForPro.fromUserId = proProfileId;
    notForPro.toUserId = proProfileId; // for professional
    notForPro.notificationMessage = msgForPro;
    notForPro.notificationFor = this.appConstant.professional;

    const notForAdmin = new Notification();
    notForAdmin.fromUserId = proProfileId;
    notForAdmin.notificationMessage = msgForAdmin;
    notForAdmin.toUserId = null; // for Admin
    notForAdmin.notificationFor = this.appConstant.admin;
    notArray.push(notForFirm);
    notArray.push(notForAdmin);
    notArray.push(notForPro);
    const json = {
      'notificationList': notArray,
    };
    const successcallback = (result) => {
      // alert("notification send!!!");
    };
    this.notificationService.notificationSave(json, successcallback);
    // notification code end
  }

  setAndSaveNotificationAfterAccpet( proName, firmName) {
    // notification code start
    const proProfileId = this.localStorageService.getValue(this.appConstant.proProfileId);
    const msgForAdmin = "Action Required! Set up a Zoom call for "+firmName+" & "+proName+" to meet";
    const notForAdmin = new Notification();
    notForAdmin.fromUserId = proProfileId;
    notForAdmin.notificationMessage = msgForAdmin;
    notForAdmin.toUserId = null; // for Admin
    notForAdmin.notificationFor = this.appConstant.admin;
    const json = {
      'notificationList': [notForAdmin],
    };
    const successcallback = (result) => {
      // alert("notification send!!!");
    };
    this.notificationService.notificationSave(json, successcallback);
    // notification code end
  }
}

