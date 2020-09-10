import { Injectable } from '@angular/core';
import { BackEndService } from '../common/back-end.service';
import { allPath } from '../allPath';

@Injectable({
  providedIn: 'root'
})

export class AdminService {

  pathList = allPath;
  constructor(private backEndService: BackEndService) { }

  addAdmin(data, successCallBack) {
    this.backEndService.postMethod(data, this.pathList.REST_URL.adminRest.addAdmin, true, successCallBack);
  }

  getAdminList(data, successCallBack) {
    this.backEndService.postMethod(data, this.pathList.REST_URL.adminRest.getAdminList, true, successCallBack);
  }

  searchAllFirms(data, successCallBack) {
    this.backEndService.postMethod(data, this.pathList.REST_URL.adminRest.firmSearch, true, successCallBack);
  }

  searchAllPro(data, successCallBack) {
    this.backEndService.postMethod(data, this.pathList.REST_URL.adminRest.proSearch, true, successCallBack);
  }

  userActivationByAdmin(data, successCallBack) {
    this.backEndService.postMethod(data, this.pathList.REST_URL.adminRest.userActive, true, successCallBack);
  }

  getFirmProfileList(data, successCallBack) {
    this.backEndService.postMethod(data, this.pathList.REST_URL.adminRest.getFirmProfileList, true, successCallBack);
  }

  getProProfileList(data, successCallBack) {
    this.backEndService.postMethod(data, this.pathList.REST_URL.adminRest.getProProfileList, true, successCallBack);
  }

  projectCompletedByAdmin(data, successCallBack) {
    this.backEndService.postMethod(data, this.pathList.REST_URL.adminRest.prjCompletedByAdmin, true, successCallBack);
  }

  paymentConfirmedByAdmin(data, successCallBack) {
    this.backEndService.postMethod(data, this.pathList.REST_URL.adminRest.pmentConfirmedByAdmin, true, successCallBack);
  }

  searchAllproJobStatus(data, successCallBack) {
    this.backEndService.postMethod(data, this.pathList.REST_URL.adminRest.allProJobStatus, true, successCallBack);
  }

  saveAdminProfit(data, successCallBack) {
    this.backEndService.postMethod(data, this.pathList.REST_URL.adminRest.saveAdminProfit, true, successCallBack);
  }

  getAdminProfit(data, successCallBack) {
    this.backEndService.postMethod(data, this.pathList.REST_URL.adminRest.getAdminProfit, false, successCallBack);
  }
}
