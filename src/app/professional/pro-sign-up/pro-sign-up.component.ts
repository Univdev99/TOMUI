import { Component, OnInit, ViewChild } from '@angular/core';
import { ProSignUp } from '../pro-beans';
import { FormControl } from '@angular/forms';
import { ProService } from '../pro.service';
import { LocalStorageService } from '../../common/local-storage.service';
import { allPath } from '../../allPath';
import { constants } from '../../app.constants';
import { NavigationService } from '../../common/navigation.service';

@Component({
  selector: 'app-pro-sign-up',
  templateUrl: './pro-sign-up.component.html',
  styleUrls: ['./pro-sign-up.component.css']
})
export class ProSignUpComponent implements OnInit {

  @ViewChild('proSignUpForm', { static: false }) proSignUpForm: FormControl;
  submitted = false;
  appConstant = constants;
  pathList = allPath;
  proSignUp = new ProSignUp();
  userAlreadyExist: string;
  constructor(private proService: ProService,
    private localStorageService: LocalStorageService,
    private navigationService: NavigationService
  ) { }

  ngOnInit() {
  }

  createProAccount() {
    this.submitted = true;
    if (this.proSignUpForm.valid) {
      const json = {
        'user': this.proSignUp
      }
      this.proService.proSignUp(json, this.proSignupSuccess, this.proSignupFailed)
    }
  }

  proSignupFailed = (result) => {
    this.submitted = false;
    if (result) {
      if (result.apiCode === 409) {
        this.userAlreadyExist = result.message;
      }
    }
  }
 
  proSignupSuccess = (result, headers) => {
    this.submitted = false;
    if (result) {
      const auth = headers.get(this.appConstant.xAuthToken);
      const proProfileId = result.proProfileId;
      this.localStorageService.setValue(this.appConstant.accessToken, auth); // it will remove after profile complete
      this.localStorageService.setValue(this.appConstant.proProfileId, proProfileId);
      this.localStorageService.setValue(this.appConstant.user, result.user);
      this.navigationService.navigateToState(this.pathList.CLIENT_URL.proWrkAvailability);
    }
  }

}
