import { Component, OnInit } from '@angular/core';
import { AdminService } from '../admin.service';
import * as _ from "lodash";
import * as $ from "jquery";
import { NgbModal } from '../../../../node_modules/@ng-bootstrap/ng-bootstrap';
import { ProjectDetailsWithScheduleComponent } from '../project-details-with-schedule/project-details-with-schedule.component';
import { ProjectService } from '../../project/project.service';
import { constants } from '../../app.constants';
import { ProjectFinalize } from '../../professional/pro-job-list/project-finalize';
import { ProjectFinalizeByAdminComponent } from '../project-finalize-by-admin/project-finalize-by-admin.component';
import { PaymentConfirmationComponent } from '../payment-confirmation/payment-confirmation.component';
import { ReviewComponent } from '../../common/common-page/review/review.component';
import { ElementService } from '../../common/element/element.service';
import { Notification } from 'src/app/notification/notification';
import { NotificationService } from 'src/app/notification/notification.service';

@Component({
  selector: 'app-firm-search',
  templateUrl: './firm-search.component.html',
  styleUrls: ['./firm-search.component.css']
})
export class FirmSearchComponent implements OnInit {

  appConstant = constants;
  firmNameList = []; // contain id and name of firm
  firmList = [];
  constructor(
    private adminService: AdminService,
    private elementService: ElementService,
    private projectService: ProjectService,
    private ngbModal: NgbModal,
    private notificationService: NotificationService
  ) {
  }

  ngOnInit() {
    this.adminService.searchAllFirms('', this.firmGetSuccess);
  }

  firmGetSuccess = (result) => {
    if (result) {
      this.firmNameList = _.uniqBy(result.map(e => {
        return {
          'businessName': e.businessName,
          'firmProfileId': e.firmProfileId,
          'isView': false,
        }
      }), 'firmProfileId');
      this.firmNameList = _.orderBy(this.firmNameList, ['businessName'], ['asc']);
      this.firmNameList[0].isView = true;
      this.firmList = result;
      this.firmList = _.orderBy(this.firmList, ['createdDate'], ['desc']);
      this.setViewOfFirm(this.firmNameList[0].firmProfileId);
    }
  }

  setViewOfFirm(firmProfileId, index = null) {
    if (index !== null) {
      this.firmNameList.forEach(element => { element.isView = false });
      this.firmNameList[index].isView = true;
    }
    for (const firm of this.firmList) {
      if (firm.firmProfileId === firmProfileId) {
        firm.isView = true;
      } else {
        firm.isView = false;
      }
    }
    $('#firmOverViewSection').show();
    $('#firmDetailSection').hide();
  }

  callJQuery(hideId, showId, argFrom, firmData) {
    $('#' + hideId).hide();
    $('#' + showId).show();

    if (argFrom === 'overViewSection') {
      for (const firm of this.firmList) {
        if (firm.firmProfileId === firmData.firmProfileId && firm.projectId === firmData.projectId && firm.proProfileId === firmData.proProfileId) {
          firm.isView = true;
        } else {
          firm.isView = false;
        }
      }
    } else if (argFrom === 'firmJobDetails') { // back action
      const index = this.firmNameList.findIndex(e => e.isView);
      if (index > -1) {
        const firmProfileId = this.firmNameList[index].firmProfileId;
        for (const firm of this.firmList) {
          if (firm.firmProfileId === firmProfileId) {
            firm.isView = true;
          } else {
            firm.isView = false;
          }
        }
      }
    }
  }

  openViewScheduleDetail(firmScheduleData, index) {
    const modalRef = this.ngbModal.open(ProjectDetailsWithScheduleComponent)
    if (firmScheduleData.projectReqStatus === this.appConstant.awaitingAdmin) {
      modalRef.componentInstance.meetingConfirmByAdmin = true;
    }
    modalRef.componentInstance.firmAndScheduleData = firmScheduleData;
    modalRef.componentInstance.scheduleDateTime1 = firmScheduleData.scheduleDateTime1;
    modalRef.componentInstance.scheduleDateTime2 = firmScheduleData.scheduleDateTime2;
    modalRef.componentInstance.scheduleDateTime3 = firmScheduleData.scheduleDateTime3;
    modalRef.result.then((result) => {
      if (result && result.projectReqStatus) {
        this.firmList[index].projectReqStatus = result.projectReqStatus;
        if (firmScheduleData.projectReqStatus === this.appConstant.completed) {
          this.firmList[index].meetingStatus = this.appConstant.awaitingMeeting;
        }
      }
    }, (reason) => {
      //
    });;
  }


  projectMeetDoneByAdmin(firmScheduleData, index) {
    const meetDoneSuccess = (result) => {
      if (result) {
        this.firmList[index].meetingStatus = this.appConstant.completed;
        this.setAndSaveNotificationAfterMeetingByAdmin(firmScheduleData);
      }
    }
    const json = {
      'projectScheduleByProId': firmScheduleData.projectScheduleByProId
    }
    this.projectService.projectMeetDoneByAdmin(json, meetDoneSuccess);
  }

  projectRequestedAction(firmScheduleData, index) {
    if (firmScheduleData.projectReqStatus === this.appConstant.awaitingAdmin || firmScheduleData.projectReqStatus === this.appConstant.awaitingPro) {
      this.openViewScheduleDetail(firmScheduleData, index);
    } else if (firmScheduleData.projectReqStatus === this.appConstant.completed) {

    } else if (firmScheduleData.projectReqStatus === this.appConstant.declined) {

    }
  }

  meetingAction(firmScheduleData, index) {
    if (firmScheduleData.meetingStatus === this.appConstant.awaitingMeeting) {
      this.projectMeetDoneByAdmin(firmScheduleData, index);
    } else if (firmScheduleData.meetingStatus === this.appConstant.completed) {

    }
  }

  projectFinalizedAction(projectProData, index) {
    if (projectProData.finalizedStatus === this.appConstant.awaitingAdmin) {
      this.finalizeProjectByAdmin(projectProData, index);
    } else if (projectProData.finalizedStatus === this.appConstant.completed) {

    }
  }

  finalizeProjectByAdmin(projectProData, index) {
    const modalRef = this.ngbModal.open(ProjectFinalizeByAdminComponent);
    modalRef.componentInstance.projectProData = projectProData;
    modalRef.result.then((result) => {
      if (result && result.projectAccptedSuccess) {
        this.firmList[index].finalizedStatus = this.appConstant.completed;
      }
    });
  }


  jobCompleteAction(projectData, index) {
    const modalRef = this.ngbModal.open(PaymentConfirmationComponent)
    modalRef.componentInstance.projectData = projectData;
    modalRef.componentInstance.argFrom = projectData.jobCompleteStatus;
    modalRef.result.then((result) => {
      if (result) {
        if (result.jobCompletedByAdmin) {
          this.firmList[index].jobCompleteStatus = this.appConstant.awaitingPayment;
        } else if (result.paymentConfirmedByAdmin) {
          this.firmList[index].jobCompleteStatus = this.appConstant.completed;
        }
      }
    });
  }

  getAvgAndCountOfFirmReview(firmDetail) {
    const avgReviewGetsuccess = (result) => {
      if (result) {
        const averageRating = result[0].averageRating;
        const reviewCount = result[0].reviewCount;
        const modalRef = this.ngbModal.open(ReviewComponent);
        modalRef.componentInstance.argFrom = this.appConstant.professional;
        modalRef.componentInstance.currentProjectRating = firmDetail.firmRating;
        modalRef.componentInstance.reviewCount = reviewCount;
        modalRef.componentInstance.averageRating = averageRating;
        modalRef.componentInstance.firmReadOnly = true;
        modalRef.componentInstance.projectData = firmDetail;
      }
    }
    const json = {
      'firmProfileId': firmDetail.firmProfileId,
    }
    this.elementService.getAverageReview(json, avgReviewGetsuccess)
  }

  getAvgAndCountOfProReview(firmDetail) {
    const avgReviewGetsuccess = (result) => {
      if (result) {
        const averageRating = result[0].averageRating;
        const reviewCount = result[0].reviewCount;
        const modalRef = this.ngbModal.open(ReviewComponent);
        modalRef.componentInstance.argFrom = this.appConstant.firm;
        modalRef.componentInstance.currentProjectRating = firmDetail.proRating;
        modalRef.componentInstance.reviewCount = reviewCount;
        modalRef.componentInstance.averageRating = averageRating;
        modalRef.componentInstance.proReadOnly = true;
        modalRef.componentInstance.projectData = firmDetail;
      }
    }
    const json = {
      'proProfileId': firmDetail.proProfileId,
    }
    this.elementService.getAverageReview(json, avgReviewGetsuccess)
  }

  setAndSaveNotificationAfterMeetingByAdmin(firmDetail) {
    const msgForPro = "Great! You've completed your call with " + firmDetail.businessName + ". Revisit Job Requests to accept or decline";
    const notForPro = new Notification();
    notForPro.notificationMessage = msgForPro;
    notForPro.toUserId = firmDetail.proProfileId; //fpr pro
    notForPro.fromUserId = null;

    const json = {
      'notificationList': [notForPro],
    };
    const successcallback = (result) => {
      // // alert("notification send!!!");
    };
    this.notificationService.notificationSave(json, successcallback);
  }

  setAndSendNotification() {
    const msg = 'Congrats! [Firm Name]\'s job has officially commenced. Find it in Accepted Jobs.';
    // Great! You've completed your call with [Firm Name]. Revisit Job Requests to accept or decline
    const toUserId = null;
    const fromUserId = null;

    const notification = new Notification();
    notification.notificationMessage = msg;
    notification.toUserId = toUserId;
    notification.fromUserId = fromUserId;

    const json2 = {
      notificationList: [notification],
    };

    const successcallback = (result) => {
      // // alert("notification send!!!");
    };
    this.notificationService.notificationSave(json2, successcallback);
  }

  /* Additional Time  */
  additionalTimeRequestAction(projectProData, index) {
    const modalRef = this.ngbModal.open(ProjectFinalizeByAdminComponent);
    modalRef.componentInstance.projectProData = {
      'projectAdditionalTimeId': projectProData.projectAdditionalTimeId,
      'proName': projectProData.proName,
      'picBase64': projectProData.picBase64,
      'projectName': projectProData.projectName,
      'hourlyFee': projectProData.hourlyFee,
      'workAvailability': projectProData.workAvailability,
      // 'avgProRating': projectProData.avgProRating,
      'requiredHours': projectProData.additionalTime,
      'workScope': projectProData.additionalWorkScope,
      'deadLine': projectProData.additionalDeadLine,
      'amendsByFirm': projectProData.additionalAmends,
    };
    modalRef.result.then((result) => {
      if (result && result.projectReqAcceptedByAdmin) {
        this.firmList[index].addtionalTimeStatus = this.appConstant.completed;
      }
    });
  }
  /* Additional Time  */


}
