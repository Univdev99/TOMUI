import { Component, OnInit } from '@angular/core';
import { AdminService } from '../admin.service';
import { constants } from '../../app.constants';
import { Notification } from '../../notification/notification';
import { NotificationService } from '../../notification/notification.service';
import { LocalStorageService } from '../../common/local-storage.service';
import * as _ from 'lodash';

@Component({
  selector: 'app-firm-profile-list',
  templateUrl: './firm-profile-list.component.html',
  styleUrls: ['./firm-profile-list.component.css']
})
export class FirmProfileListComponent implements OnInit {

  firmProfileStatus = null;
  appConstant = constants;
  firmProfileList = [];
  firmNameList = [];
  constructor(
    private notificationService: NotificationService,
    private localStorageService: LocalStorageService,
    private adminService: AdminService
  ) { }

  ngOnInit() {
    this.getAllFirms();
  }

  getAllFirms() {
    this.adminService.getFirmProfileList('', this.firmProfileGetSuccess)
  }

  firmProfileGetSuccess = (result) => {
    if (result) {
      this.firmNameList = result.map(e => {
        return {
          'businessName': e.businessName,
          'firmProfileId': e.firmProfileId,
          'userStatus': e.userStatus,
          'userId': e.userId,
          'isView': false,
        }
      });
      this.firmProfileList = result;
      this.firmNameList[0].isView = true;
      this.chanegViewParams(this.firmNameList[0].firmProfileId, null)
    }
  }

  chanegViewParams(firmProfileId, i) {
    if (i !== null) {
      this.firmNameList.forEach(e => {
        e.isView = false;
      });
      this.firmNameList[i].isView = true;
      this.firmProfileList.forEach(p => {
        p.isView = false;
      });
    };
    const index = this.firmProfileList.findIndex(e => e.firmProfileId === firmProfileId);
    if (index > -1) {
      this.firmProfileList[index].isView = true;
      this.firmProfileStatus = this.firmProfileList[index].userStatus;
    }
  }

  approveFirmProfileByAdmin(userId, index, userStatus) {
    const firmApprovedSuccess = (result) => {
      if (result) {
        if (userStatus === this.appConstant.approve) {
          this.firmProfileList[index].userStatus = this.appConstant.accepted;
          const i = this.firmNameList.findIndex(e => e.userId === userId);
          if (i > -1) {
            this.firmNameList[i].userStatus = this.appConstant.accepted;
          }
          this.firmNameList[index].userStatus = this.appConstant.accepted;
        } else if (userStatus === this.appConstant.decline) {
          this.firmProfileList[index].userStatus = this.appConstant.declined;
          const i = this.firmNameList.findIndex(e => e.userId === userId);
          if (i > -1) {
            this.firmNameList[i].userStatus = this.appConstant.declined;
          }
        }
        this.firmProfileStatus = this.firmProfileList[index].userStatus;
      }
    }
    if (userId) {
      const json = {
        'userId': userId,
        'userStatus': userStatus
      }
      this.adminService.userActivationByAdmin(json, firmApprovedSuccess)
    }
  }

  setAndSaveNotification(proFirstNameForFirm, proProfileId, proNameForAdmin, firmNameForAdmin) {
    // notification code start
    const firmProfileId = this.localStorageService.getValue(this.appConstant.firmProfileId);
    const msgForFirm = ' You have declined the project with ' + proFirstNameForFirm + '.';
    const msgForAdmin = proNameForAdmin + " declined " + firmNameForAdmin + " 's job.";

    const notArray = new Array<Notification>();
    const notForFirm = new Notification();
    notForFirm.fromUserId = firmProfileId;
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
}
