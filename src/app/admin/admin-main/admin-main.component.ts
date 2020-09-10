import { Component, OnInit } from '@angular/core';
import { LocalStorageService } from 'src/app/common/local-storage.service';
import { constants } from 'src/app/app.constants';
import { NotificationService } from '../../notification/notification.service';

@Component({
  selector: 'app-admin-main',
  templateUrl: './admin-main.component.html',
  styleUrls: ['./admin-main.component.css']
})
export class AdminMainComponent implements OnInit {

  adminName = '';
  appConstant = constants;
  notificationList = [];
  isNotification = false;
  constructor(
    private localStorageService: LocalStorageService,
    private notificationService: NotificationService
  ) { }

  ngOnInit() {
    if (this.localStorageService.getValue(this.appConstant.proProfileId)) {
      let lastName = this.localStorageService.getValue(this.appConstant.user)['lastName'];
      let firstName = this.localStorageService.getValue(this.appConstant.user)['firstName'];
      this.adminName = lastName + ', ' + firstName;
    }
    this.getAdminNotification();
  }

  getAdminNotification() {
    this.isNotification = !this.isNotification
    const json = {
      'toUserId': null,
      'notificationFor': this.appConstant.admin,
    }
    this.notificationService.getNotificationData(json, this.adminNoteDataSuccess)
  }

  adminNoteDataSuccess = (result) => {
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
