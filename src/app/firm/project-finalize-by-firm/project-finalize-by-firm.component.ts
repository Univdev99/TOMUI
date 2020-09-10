import { Component, OnInit } from '@angular/core';
import { ProjectService } from '../../project/project.service';
import { NgbActiveModal } from '../../../../node_modules/@ng-bootstrap/ng-bootstrap';
import { constants } from '../../app.constants';
import { LocalStorageService } from '../../common/local-storage.service';
import { Notification } from '../../notification/notification';
import { NotificationService } from '../../notification/notification.service';

@Component({
  selector: 'app-project-finalize-by-firm',
  templateUrl: './project-finalize-by-firm.component.html',
  styleUrls: ['./project-finalize-by-firm.component.css']
})
export class ProjectFinalizeByFirmComponent implements OnInit {

  /* value from addtionan time */
  isForAdditionalTime = false;
  /* value from addtionan time */

  projectProData; // set data from pro-req list and pro acceptList
  appConstant = constants;
  amendsByFirm;
  showAmends = false;

  constructor(
    private projectService: ProjectService,
    private notificationService: NotificationService,
    private localStorageService: LocalStorageService,
    private ngbActiveModal: NgbActiveModal,
  ) { }

  ngOnInit() {
  }

  projectDeclineAfterMeeting() {
    if (this.projectProData.projectId && this.projectProData.proProfileId) {
      const meetingDeclineSuccess = (result) => {
        if (result) {
          const json = {
            'declinedSuccess': true
          }
          this.ngbActiveModal.close(json);
        }
      };
      const json = {
        'projectId': this.projectProData.projectId,
        'proProfileId': this.projectProData.proProfileId,
      }
      this.projectService.projectDeclineByFirmAfterMeeting(json, meetingDeclineSuccess)
    }
  }

  projectFinalizeByFirm() {
    if (this.projectProData.projectFinalizeId) {
      const projectFinalizeByFirmSuccess = (result) => {
        if (result) {
          this.setAndSaveNotification();
          const json = {
            'acceptSuccess': true
          }
          this.ngbActiveModal.close(json);
        }
      };
      const json = {
        'projectFinalizeId': this.projectProData.projectFinalizeId,
      }
      this.projectService.projectFinalizeByFirm(json, projectFinalizeByFirmSuccess)
    }
  }

  hideShowAmends() {
    this.showAmends = true;
  }

  saveAmendOfFirm() {
    if (this.projectProData.projectFinalizeId) {
      const json = {
        'projectFinalizeId': this.projectProData.projectFinalizeId,
        'amends': this.amendsByFirm,
        'userId': this.localStorageService.getValue(this.appConstant.user).userId
      }
      this.projectService.saveAmends(json, this.saveAmendsSuccess);
    } else if (this.projectProData.projectAdditionalTimeId) {
      const json = {
        'projectAdditionalTimeId': this.projectProData.projectAdditionalTimeId,
        'amends': this.amendsByFirm,
        'userId': this.localStorageService.getValue(this.appConstant.user).userId
      }
      this.projectService.saveAmendOfAddtitionalReq(json, this.saveAmendsSuccess);
    }
  }

  saveAmendsSuccess = (result) => {
    if (result) {
      this.showAmends = false;
      const json = {
        'amendsByFirm': this.amendsByFirm
      }
      this.ngbActiveModal.close(json);
    }
  }

  /* ADDITIONAL REQUEST */
  addtionalReqFinalizeByFirm() {
    if (this.projectProData.projectAdditionalTimeId) {
      const addtionalReqFinalizeByFirmSuccess = (result) => {
        if (result) {
          // this.setAndSaveNotification();
          const json = {
            'isFinalizeByFirm': true
          }
          this.ngbActiveModal.close(json);
        } 
      };
      const json = {
        'projectAdditionalTimeId': this.projectProData.projectAdditionalTimeId,
      }
      this.projectService.addtionalReqFinalizeByFirm(json, addtionalReqFinalizeByFirmSuccess)
    }
  }

  declineAddionalRequest() {
    if (this.projectProData.projectAdditionalTimeId) {
      const reqDeclineSuccess = (result) => {
        if (result) {
          const json = {
            'isDeclineByFirm': true
          }
          this.ngbActiveModal.close(json);
        }
      };
      const json = {
        'projectAdditionalTimeId': this.projectProData.projectAdditionalTimeId,
      }
      this.projectService.declineAddionalRequestByFirm(json, reqDeclineSuccess)
    }
  }
  /* ADDITIONAL REQUEST */

  saveAmendOfAddtionalReqByFirm() {
    if (this.projectProData.projectAdditionalTimeId) {
      const json = {
        'projectAdditionalTimeId': this.projectProData.projectAdditionalTimeId,
        'amends': this.amendsByFirm,
        'userId': this.localStorageService.getValue(this.appConstant.user).userId
      }
      this.projectService.saveAmendOfAddtitionalReq(json, this.addtitionalReqAmendsSuccess);
    }
  }

  addtitionalReqAmendsSuccess = (result) => {
    if (result) {

    }
  }
  /* ADDITIONAL REQUEST */

  setAndSaveNotification() {
    // notification code start
    const firmProfileId = this.localStorageService.getValue(this.appConstant.firmProfileId);
    const msgForAdmin = "Action Required! Final project details for " + this.projectProData.businessName + " & " + this.projectProData.proName + " are ready for review."

    const notForAdmin = new Notification();
    notForAdmin.fromUserId = firmProfileId;
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

