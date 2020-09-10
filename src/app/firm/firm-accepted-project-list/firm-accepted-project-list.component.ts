
import { Component, OnInit } from '@angular/core';
import { allPath } from '../../allPath';
import { constants } from '../../app.constants';
import { FirmService } from '../firm.service';
import { LocalStorageService } from '../../common/local-storage.service';
import { NgbModal } from '../../../../node_modules/@ng-bootstrap/ng-bootstrap';
import { ProProfileViewComponent } from '../../common/common-page/pro-profile-view/pro-profile-view.component';
import { NotificationService } from '../../notification/notification.service';
import { Notification } from '../../notification/notification';
import { ProjectFinalizeByFirmComponent } from '../project-finalize-by-firm/project-finalize-by-firm.component';

@Component({
  selector: 'app-firm-accepted-project-list',
  templateUrl: './firm-accepted-project-list.component.html',
  styleUrls: ['./firm-accepted-project-list.component.css']
})

export class FirmAcceptedProjectListComponent implements OnInit {

  appConstant = constants;
  pathList = allPath;
  projectNameList = [];
  projectList = [];
  userId = null;
  constructor(
    private ngbModal: NgbModal,
    private notificationService: NotificationService,
    private firmService: FirmService,
    private localStorageService: LocalStorageService
  ) { }

  ngOnInit() {
    this.userId = this.localStorageService.getValue(this.appConstant.user).userId;
    if (this.userId) {
      const json = {
        'userId': this.userId
      };
      this.firmService.getAccpetedFirmProject(json, this.projectAcceptedSuccess)
    }
  }

  projectAcceptedSuccess = (result) => {
    if (result) {
      this.projectNameList = result.map(e => {
        return {
          'projectName': e.projectName,
          'createdDate': e.createdDate,
          'projectId': e.projectId,
          'isView': false,
        }
      });
      this.projectList = result;
      this.projectNameList[0].isView = true;
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

  projectCompletedByFirm(projectDetail, index) {
    if (projectDetail.isCompletedByFirm) {
      return;
    }
    if (projectDetail.projectCompleteId) {
      const success = (result) => {
        if (result) {
          this.projectList[index].isCompletedByFirm = true;
          const proName = this.projectList[index].proName;
          const businessName = this.projectList[index].businessName;
          this.setAndSaveNotification(proName, businessName)
        }
      }
      const json = {
        'projectCompleteId': projectDetail.projectCompleteId
      }
      this.firmService.projectCompleted(json, success)
    }
  }

  viewProProfile(proDetails) {
    const modalRef = this.ngbModal.open(ProProfileViewComponent);
    modalRef.componentInstance.isSampleProfile = false
    modalRef.componentInstance.argFrom = this.appConstant.fromFirm;
    modalRef.componentInstance.proProfileId = proDetails.proProfileId;
  }


  viewfinalizeAddtionalTimeRequest(projectProData, index) {
    const modalRef = this.ngbModal.open(ProjectFinalizeByFirmComponent);
    modalRef.componentInstance.isForAdditionalTime = true;
    modalRef.componentInstance.projectProData = {
      'projectAdditionalTimeId': projectProData.projectAdditionalTimeId,
      'proName': projectProData.proName,
      'proReviewCount': projectProData.proReviewCount,
      'avgProRating': projectProData.avgProRating,
      'hourlyFee': projectProData.hourlyFee,
      'picBase64': projectProData.picBase64,
      'workAvailability': projectProData.workAvailability,
      'projectName': projectProData.projectName,
      'requiredHours': projectProData.additionalTime,
      'workScope': projectProData.additionalWorkScope,
      'deadLine': projectProData.additionalDeadLine,
      'amendsByFirm': projectProData.additionalAmends,
      'isFinalizeByFirm': projectProData.isFinalizeByFirm,
      'isDeclineByFirm': projectProData.isDeclineByFirm,

    },
      modalRef.result.then((result) => {
        if (result) {
          if (result.isDeclineByFirm) {
            this.projectList[index].isDeclineByFirm = result.isDeclineByFirm
          } else if (result.isFinalizeByFirm) {
            this.projectList[index].isFinalizeByFirm = result.isFinalizeByFirm
          } else if (result.amendsByFirm) {
            this.projectList[index].additionalAmends = result.amendsByFirm
          }
        }
      });
  }

  setAndSaveNotification(proName, businessName) {
    const firmProfileId = this.localStorageService.getValue(this.appConstant.firmProfileId);
    const msgForAdmin = "Action Required! " + proName + " & " + businessName + " have confirmed job completion. Confirm on your end!";

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