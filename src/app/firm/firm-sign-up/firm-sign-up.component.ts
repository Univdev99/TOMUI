import { Component, OnInit, ViewChild } from '@angular/core';
import { FirmService } from '../firm.service';
import { FirmSignUp } from '../firm-beans';
import { FormControl } from '@angular/forms';
import { NavigationService } from '../../common/navigation.service';
import { allPath } from '../../allPath';
import { constants } from '../../app.constants';
import { SessionStorageService } from '../../common/session-storage.service';
import { LocalStorageService } from '../../common/local-storage.service';

@Component({
  selector: 'app-firm-sign-up',
  templateUrl: './firm-sign-up.component.html',
  styleUrls: ['./firm-sign-up.component.css']
})
export class FirmSignUpComponent implements OnInit {

  @ViewChild('firmSignUpForm', { static: false }) firmSignUpForm: FormControl;
  submitted = false;
  pathList = allPath;
  appConstant = constants;
  businessCategory = [{ label: 'Select Category', value: 'select' },
  { label: 'Accounting Category', value: 'accounCategory' },
  { label: 'Business', value: 'business' }, { label: 'Other', value: 'other' }];

  firm = new FirmSignUp();
  userAlreadyExist: string;
  constructor(
    private firmService: FirmService,
    private sessionStorageService: SessionStorageService,
    private localStorageService: LocalStorageService,
    private navigationService: NavigationService) { }

  ngOnInit() {
  }

  firmSignUp() {
    this.submitted = true;
    if (this.firmSignUpForm.valid) {
      if (this.firm.password && this.firm.password.length < 8) {
        return;
      }
      const json = {
        'user': this.firm
      }
      this.firmService.firmSignup(json, this.firmSignUpSuccess, this.firmSignUpFailed);
    } else {

    }

  }

  firmSignUpFailed = (result) => {
    this.submitted = false;
    if (result) {
      if (result.apiCode === 409) {
        this.userAlreadyExist = result.message;
      }
    }
  }

  firmSignUpSuccess = (result, headers) => {
    this.submitted = false;
    if (result) {
      const auth = headers.get(this.appConstant.xAuthToken);
      const firmProfileId = result.firmProfileId;
      this.localStorageService.setValue(this.appConstant.accessToken, auth); // it will remove after profile complete
      this.localStorageService.setValue(this.appConstant.firmProfileId, firmProfileId);
      this.localStorageService.setValue(this.appConstant.user, result.user);
      this.navigationService.navigateToState(this.pathList.CLIENT_URL.firmBusinessProfile);
    }
  }


}
