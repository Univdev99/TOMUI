import { Component, OnInit, ViewChild } from '@angular/core';
import { LoginService } from './login.service';
import { Login } from './login';
import { constants } from "../app.constants";
import { allPath } from "../allPath";
import { LocalStorageService } from '../common/local-storage.service';
import { NavigationService } from '../common/navigation.service';
import { FormControl } from '@angular/forms';
import { SessionStorageService } from '../common/session-storage.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  @ViewChild('loginForm', { static: false }) loginForm: FormControl;
  login = new Login();
  appConstant = constants;
  pathList = allPath;
  roleType: number;

  constructor(
    private navigationService: NavigationService,
    private localStorageService: LocalStorageService,
    private sessionStorageService: SessionStorageService,
    private loginService: LoginService
  ) { }

  ngOnInit() {
    if (this.sessionStorageService.getObjectValue(this.appConstant.argFrom)) {
      if (this.appConstant.argFrom === this.appConstant.fromProfessional) {
        this.roleType = this.appConstant.profUserType;
      } else if (this.appConstant.argFrom === this.appConstant.fromFirm) {
        this.roleType = this.appConstant.firmUserType;
      }
    }
  }

  authenticateUser() {
    if (this.loginForm.valid) {
      this.loginService.authenticateUser(this.login, this.loginSuccess, this.loginFailed);
    }
  }

  loginSuccess = (result, headers) => {
    if (result && result.user) {
      if ((result.user.userStatus === null || result.user.userStatus === this.appConstant.decline) && result.user.roleId !== this.appConstant.adminUserType) {
        if (result.user.userStatus === null) {
          this.navigationService.navigateToState(this.pathList.CLIENT_URL.firmProfileComplete);
        } else if (result.user.userStatus === this.appConstant.decline) {
          const message = "We are sorry to inform you that your application has been rejected. Kindly contact us for mor details at 1888.888.8888";
          this.localStorageService.setValue(this.appConstant.message, message);
          this.navigationService.navigateToState(this.pathList.CLIENT_URL.firmProfileComplete);
        }
      }
        else {
        const auth = headers.get(this.appConstant.xAuthToken);
        this.localStorageService.setValue(this.appConstant.accessToken, auth);
        this.localStorageService.setValue(this.appConstant.user, result.user);
        if (result.user.roleId === this.appConstant.firmUserType) {
          this.localStorageService.setValue(this.appConstant.firmProfileId, result.firmProfile.firmProfileId);
          this.navigationService.navigateToState(this.pathList.CLIENT_URL.firmDashBoard);
        } else if (result.user.roleId === this.appConstant.profUserType) {
          this.localStorageService.setValue(this.appConstant.proProfileId, result.proPersonalProfile.professionalProfileId);
          this.navigationService.navigateToState(this.pathList.CLIENT_URL.proDashBoard);
        } else if (result.user.roleId === this.appConstant.adminUserType) {
          this.navigationService.navigateToState(this.pathList.CLIENT_URL.adminDashBoard);
        }
      }
    }
  }

  loginFailed = (result) => {
    if (result) {
      alert("UserName or Password is invalid.")
    }
  }

}
