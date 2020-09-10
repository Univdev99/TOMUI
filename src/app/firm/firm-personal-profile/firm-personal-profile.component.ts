import { Component, OnInit, ViewChild } from '@angular/core';
import { FormControl } from '@angular/forms';
import { FirmProfile } from '../firm-beans';
import { FirmService } from '../firm.service';
import { NavigationService } from '../../common/navigation.service';
import { LocalStorageService } from '../../common/local-storage.service';
import { constants } from '../../app.constants';
import { allPath } from '../../allPath';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { NotificationService } from 'src/app/notification/notification.service';
import { Notification } from '../../notification/notification';

@Component({
  selector: 'app-firm-personal-profile',
  templateUrl: './firm-personal-profile.component.html',
  styleUrls: ['./firm-personal-profile.component.css']
})
export class FirmPersonalProfileComponent implements OnInit {

  @ViewChild('firmPersonalProfileForm', { static: false }) firmPersonalProfileForm: FormControl;
  submitted = false;
  pathList = allPath;
  appConstant = constants;
  firmProfile = new FirmProfile();

  /* modal */
  componentsAsModal = false;
  /* modal */

  constructor(
    private firmService: FirmService,
    private navigationService: NavigationService,
    public ngbActiveModal: NgbActiveModal,
    private localStorageService: LocalStorageService,
    private notificationService: NotificationService) { }

  ngOnInit() {
    if (this.localStorageService.getValue(this.appConstant.firmProfileId)) { // set from firm-sign-up
      const json = {
        'firmProfileId': this.localStorageService.getValue(this.appConstant.firmProfileId)
      };
      this.firmService.getFirmProfile(json, this.firmProfileGetSuccess)
    }
  }

  firmProfileGetSuccess = (result) => {
    if (result) {
      this.firmProfile = result;
    }
  }

  saveFirmPersonalProfile() {
    this.submitted = true;
    const saveFirmPersionalProfileSuccess = (result) => {
      if (result) {
        if (this.componentsAsModal) {
          this.ngbActiveModal.close();
        } else {
          this.firmProfile.firmProfileId = null;
          if (!this.firmProfile.firmProfileId) {
            this.setAndSaveNotification();
          }
          // notification code end
          this.localStorageService.removeValue(this.appConstant.accessToken);
          this.navigationService.navigateToState(this.pathList.CLIENT_URL.firmProfileComplete);
        }
      }

    };
    if (this.firmPersonalProfileForm.valid) {
      const json = {
        'firmProfile': this.firmProfile
      }
      this.firmService.saveFirmProfile(json, saveFirmPersionalProfileSuccess)
    }
  }


  setAndSaveNotification() {
    // notification code start
    if (this.localStorageService.getValue(this.appConstant.user)) {
      const fromUserId = this.localStorageService.getValue(this.appConstant.user)['userId'];
      const msg = 'Action Required! ' + this.firmProfile.lastName + ', ' + this.firmProfile.firstName +
        ' has completed a new profile. Review today!';

      const notification = new Notification();
      notification.notificationMessage = msg;
      notification.toUserId = null; // for Admin
      notification.fromUserId = fromUserId;
      const json = {
        'notificationList': [notification],
      };
      const successcallback = (result) => {
        // alert("notification send!!!");
      };
      this.notificationService.notificationSave(json, successcallback);
    }
    // notification code end
  }
}


