import { Component, OnInit } from '@angular/core';
import { LocalStorageService } from '../../common/local-storage.service';
import { constants } from '../../app.constants';
import { NotificationService } from '../../notification/notification.service';
import { $ } from '../../../../node_modules/protractor';

@Component({
  selector: 'app-pro-dashboard-header',
  templateUrl: './pro-dashboard-header.component.html',
  styleUrls: ['./pro-dashboard-header.component.css']
})
export class ProDashboardHeaderComponent implements OnInit {

  proName = '';
  appConstant = constants;
  
  notificationList = [];
  proProfileId = null;
  constructor(
    private localStorageService: LocalStorageService,
    private notificationService: NotificationService
  ) { }

  ngOnInit() {
    if (this.localStorageService.getValue(this.appConstant.proProfileId)) {
      this.proProfileId = this.localStorageService.getValue(this.appConstant.proProfileId);
      let lastName = this.localStorageService.getValue(this.appConstant.user)['lastName'];
      let firstName = this.localStorageService.getValue(this.appConstant.user)['firstName'];
      this.proName = lastName + ', ' + firstName;
    }
    this.getProNotification();

  }

  getProNotification() {
    if (this.proProfileId) {
      const json = {
        'toUserId': this.proProfileId,
        'notificationFor': this.appConstant.professional,
      }
      this.notificationService.getNotificationData(json, this.proNoteDataSuccess)
    }
  }

  proNoteDataSuccess = (result) => {
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
