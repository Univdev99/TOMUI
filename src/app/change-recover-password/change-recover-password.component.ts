import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '../../../node_modules/@angular/router';
import { LoginService } from '../login/login.service';
import { FirmService } from '../firm/firm.service';
import { format } from 'util';
import { NavigationService } from '../common/navigation.service';
import { constants } from '../app.constants';
import { allPath } from '../allPath';
import { LocalStorageService } from '../common/local-storage.service';

@Component({
  selector: 'app-change-recover-password',
  templateUrl: './change-recover-password.component.html',
  styleUrls: ['./change-recover-password.component.css']
})
export class ChangeRecoverPasswordComponent implements OnInit {

  errorMessage: string;
  appCons = constants;
  pathList = allPath;
  userId;
  userForgotToken;
  confirmPassword;
  newPassword;
  submitted = false;
  isUserNotExistWithToken = false;
  constructor(
    private activatedRoute: ActivatedRoute,
    private loginService: LoginService,
    private navigationService: NavigationService,
    private localStorageService: LocalStorageService
  ) { }

  ngOnInit() {
    this.activatedRoute.queryParams.subscribe(params => {
      const userForgotToken = params['authToken'];
      if (userForgotToken) {
        console.log(userForgotToken);
        this.userForgotToken = userForgotToken
      } else {
        // redirect to login
      }
    });

    const json = {
      'token': this.userForgotToken,
    }
    this.loginService.getUserByToken(json, this.userGetSuccessByToken)
  }


  userGetSuccessByToken = (result) => {
    console.log(result);
    if (result && result.user && result.user.userId) {
      this.userId = result.user.userId;
    } else {
      this.isUserNotExistWithToken = true;

    }

  }

  updatePassword(resetForm): void {
    this.errorMessage = null;
    this.submitted = true;
    if (resetForm.valid) {
      const newPassword = this.newPassword.trim();
      const confirmPassword = this.confirmPassword.trim()
      if (newPassword !== confirmPassword) {
        this.errorMessage = 'both password should be same';
        return;
      }
      if (newPassword === confirmPassword && this.userId) {
        const json = {
          'userId': this.userId,
          'changedpassword': confirmPassword,
        };
        const changePasswordSuccess = (result) => {
          if (result) {
            this.localStorageService.clearLocalStorageObjects();
            this.navigationService.navigateToState(this.pathList.CLIENT_URL.login);
          }
        };
        this.loginService.changePassword(json, changePasswordSuccess);
      }
    }
  }

}
