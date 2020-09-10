import { Component, OnInit } from '@angular/core';
import { constants } from 'src/app/app.constants';
import { LocalStorageService } from 'src/app/common/local-storage.service';
import { NotificationService } from '../../notification/notification.service';

@Component({
  selector: 'app-dashboard-header',
  templateUrl: './dashboard-header.component.html',
  styleUrls: ['./dashboard-header.component.css']
})
export class DashboardHeaderComponent implements OnInit {

  firmName = '';
  appConstant = constants;
  firmProfileId = null;
  notificationList = [];
  constructor(
    private localStorageService: LocalStorageService,
    private notificationService: NotificationService
  ) { }

  ngOnInit() {
    if (this.localStorageService.getValue(this.appConstant.firmProfileId)) {
      this.firmProfileId = this.localStorageService.getValue(this.appConstant.firmProfileId);
      let lastName = this.localStorageService.getValue(this.appConstant.user)['lastName'];
      let firstName = this.localStorageService.getValue(this.appConstant.user)['firstName'];
      this.firmName = lastName + ', ' + firstName;
    }
    this.getFirmNotification();
  }

  getFirmNotification() {
    if (this.firmProfileId) {
      const json = {
        'toUserId': this.firmProfileId,
        'notificationFor': this.appConstant.firm,
      }
      this.notificationService.getNotificationData(json, this.notificationGetSuccess);
    }
  }

  notificationGetSuccess = (result) => {
    if (result) {
      this.notificationList = result;
    }
  }

  saveMarkAsRead(notificationId, index, event: Event) {
    const markAsReadSucecss = (result) => {
      if (result) {
        this.notificationList.splice(index, 1);
      }
    }
    const json = {
      'notificationId': notificationId
    }
    this.notificationService.saveMarkAsRead(json, markAsReadSucecss);
    event.stopPropagation();
  }
}
