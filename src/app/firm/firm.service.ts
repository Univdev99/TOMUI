import { Injectable } from '@angular/core';
import { allPath } from '../allPath';
import { BackEndService } from '../common/back-end.service';

@Injectable({
  providedIn: 'root'
})
export class FirmService {

  pathList = allPath;
  constructor(private backEndService: BackEndService) { }

  firmSignup(data, successCallBack, errorCallBack) {
    this.backEndService.postMethod(data, this.pathList.REST_URL.firmRest.signup, true, successCallBack, errorCallBack);
  }
  saveFirmProfile(data, successCallBack) {
    this.backEndService.postMethod(data, this.pathList.REST_URL.firmRest.save, true, successCallBack);
  }
  getFirmProfile(data, successCallBack) {
    this.backEndService.postMethod(data, this.pathList.REST_URL.firmRest.get, true, successCallBack);
  }

  getAccpetedFirmProject(data, successCallBack) {
    this.backEndService.postMethod(data, this.pathList.REST_URL.firmRest.getAccpetedFirmProject, true, successCallBack);
  }

  getFirmProjectHistory(data, successCallBack) {
    this.backEndService.postMethod(data, this.pathList.REST_URL.firmRest.getFirmProjectHistory, true, successCallBack);
  }

  projectCompleted(data, successCallBack) {
    this.backEndService.postMethod(data, this.pathList.REST_URL.firmRest.projectCompletedByFirm, true, successCallBack);
  }

  changePassword(data, successCallBack) {
    this.backEndService.postMethod(data, this.pathList.REST_URL.firmRest.changePassword, true, successCallBack);
  }

}
