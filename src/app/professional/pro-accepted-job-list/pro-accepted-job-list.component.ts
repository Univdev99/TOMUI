import { Component, OnInit } from '@angular/core';
import { constants } from '../../app.constants';
import { allPath } from '../../allPath';
import { ProService } from '../pro.service';
import * as _ from "lodash";
import { LocalStorageService } from '../../common/local-storage.service';
import { ProjectComplete } from '../../project/ProjectComplete';
import { NotificationService } from '../../notification/notification.service';
import { Notification } from '../../notification/notification';
import { NgbModal } from '../../../../node_modules/@ng-bootstrap/ng-bootstrap';
import { ProjectFinalizeComponent } from '../project-finalize/project-finalize.component';

@Component({
  selector: 'app-pro-accepted-job-list',
  templateUrl: './pro-accepted-job-list.component.html',
  styleUrls: ['./pro-accepted-job-list.component.css']
})
export class ProAcceptedJobListComponent implements OnInit {

  appConstant = constants;
  pathList = allPath;
  projectNameList = [];
  projectList = [];
  proProfileId = null;
  constructor(
    private notificationService: NotificationService,
    private proService: ProService,
    private ngbModal: NgbModal,
    private localStorageService: LocalStorageService
  ) { }

  ngOnInit() {
    this.proProfileId = this.localStorageService.getValue(this.appConstant.proProfileId);
    if (this.proProfileId) { // set from firm-sign-up
      const json = {
        'proProfileId': this.proProfileId
      };
      this.proService.getAccpetedProProject(json, this.getProjectSuccess);
    }
  }

  getProjectSuccess = (result) => {
    if (result) {
      this.projectNameList = result.map(e => {
        return {
          'projectName': e.projectName,
          'businessName': e.businessName,
          'projectId': e.projectId,
          'isView': false,
        }
      });
      this.projectList = result;
      this.changeViewParameter(this.projectNameList[0].projectId, null);
    }
  }

  changeViewParameter(projectId, nameIndex = null) {
    if (nameIndex != null) {
      this.projectNameList.forEach(nameProject => {
        nameProject.isView = false;
      });
      this.projectNameList[nameIndex].isView = true;
      this.projectList.forEach(mainProject => {
        mainProject.isView = false;
      });
    }
    const index = this.projectList.findIndex(e => Number(e.projectId) === projectId);
    if (index > -1) {
      this.projectList[index].isView = true;
    }
  }

  projectCompletedByPro(projectData, index) {
    const success = (result) => {
      if (result) {
        this.projectList[index].projectCompleteId = result.projectCompleteId;
        this.setAndSaveNotification(this.projectList[index].proFirstName,
          this.projectList[index].firmProfileId,
          this.projectList[index].proName, this.projectList[index].businessName);
      }
    }
    const projectComplete = new ProjectComplete();
    projectComplete.projectId = projectData.projectId;
    projectComplete.firmProfileId = projectData.firmProfileId;
    projectComplete.proProfileId = this.proProfileId;
    projectComplete.isCompletedByPro = true;
    const json = {
      'projectComplete': projectComplete
    }
    this.proService.projectCompleted(json, success)
  }


  setAndSaveNotification(proFirstNameForFirm, firmProfileId, proNameForAdmin, firmNameForAdmin) {
    // notification code start
    const proProfileId = this.localStorageService.getValue(this.appConstant.proProfileId);
    const msgForFirm = proFirstNameForFirm + " is done! Confirm job completion in Accepted Projects or contact Top of Mind if not complete."
    const msgForAdmin = "Stay on top of this! " + proNameForAdmin + " has completed the job. Awaiting " + firmNameForAdmin + "'s confirmation.";

    const notArray = new Array<Notification>();
    const notForFirm = new Notification();
    notForFirm.fromUserId = proProfileId;
    notForFirm.toUserId = firmProfileId; // for Firm
    notForFirm.notificationMessage = msgForFirm;
    notForFirm.notificationFor = this.appConstant.firm;

    const notForAdmin = new Notification();
    notForAdmin.fromUserId = proProfileId;
    notForAdmin.notificationMessage = msgForAdmin;
    notForAdmin.toUserId = null; // for Admin
    notForAdmin.notificationFor = this.appConstant.admin;
    notArray.push(notForFirm);
    notArray.push(notForAdmin);
    const json = {
      'notificationList': notArray,
    };
    const successcallback = (result) => {
      // alert("notification send!!!");
    };
    this.notificationService.notificationSave(json, successcallback);
    // notification code end
  }

  openAdditionalTimeModal(projectData) {
    /* finalize modal */
    const modalRef = this.ngbModal.open(ProjectFinalizeComponent);
    modalRef.componentInstance.projectId = projectData.projectId;
    modalRef.componentInstance.projectFinalizeId = projectData.projectFinalizeId;
    modalRef.componentInstance.dataForNotification = projectData;
    modalRef.componentInstance.isForAdditionalTime = true;
    modalRef.result.then((result) => {
      if (result && result.additonalTimeSaveSuccess) {
        this.setAndSaveNotificationOfAdditionalTime(projectData);
      }
    });
    /* finalize modal */
  }


  setAndSaveNotificationOfAdditionalTime(projectData) { //addtional time request
    // notification code start
    const proProfileId = this.localStorageService.getValue(this.appConstant.proProfileId);
    const msgForFirm = projectData.proFirstName + ", " + projectData.proFirstName.charAt(0) + " requested additional time to complete the project. Visit Accepted Projects to accept or decline";
    const msgForAdmin = "Keep an eye on this. " + projectData.proName + " requested additional time from " + projectData.businessName + ".";

    const notArray = new Array<Notification>();
    const notForFirm = new Notification();
    notForFirm.fromUserId = proProfileId;
    notForFirm.toUserId = projectData.firmProfileId; // for Firm
    notForFirm.notificationMessage = msgForFirm;
    notForFirm.notificationFor = this.appConstant.firm;

    const notForAdmin = new Notification();
    notForAdmin.fromUserId = proProfileId;
    notForAdmin.notificationMessage = msgForAdmin;
    notForAdmin.toUserId = null; // for Admin
    notForAdmin.notificationFor = this.appConstant.admin;
    notArray.push(notForFirm);
    notArray.push(notForAdmin);
    const json = {
      'notificationList': notArray,
    };
    const successcallback = (result) => {
      // alert("notification send!!!");
    };
    this.notificationService.notificationSave(json, successcallback);
    // notification code end
  }
}





