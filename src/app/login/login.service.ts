import { Injectable } from '@angular/core';
import { allPath } from "../allPath";
import { BackEndService } from '../common/back-end.service';

@Injectable({
  providedIn: 'root'
})
export class LoginService {
  pathList = allPath;
  constructor(private backEndService: BackEndService) { }

  public authenticateUser(user, successCallback, errorCallback) {
    return this.backEndService.postMethod(user, this.pathList.REST_URL.loginRest.loginUrl, true, successCallback, errorCallback);
  }

  public checkEmailForForgotPassword(user, successCallback) {
    return this.backEndService.postMethod(user, this.pathList.REST_URL.loginRest.sendEmail, true, successCallback);
  }

  public getUserByToken(user, successCallback) {
    return this.backEndService.postMethod(user, this.pathList.REST_URL.loginRest.getUserByToken, true, successCallback);
  }
  public changePassword(user, successCallback) {
    return this.backEndService.postMethod(user, this.pathList.REST_URL.loginRest.changePassWord, true, successCallback);
  }


  
}
