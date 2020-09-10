import { Injectable } from '@angular/core';
import { BackEndService } from '../common/back-end.service';
import { allPath } from "../allPath";

@Injectable({
  providedIn: 'root'
})
export class ProjectService {

  pathList = allPath;
  constructor(private backEndService: BackEndService) { }

  getDashboardProjecct(data, successCallBack) {
    this.backEndService.postMethod(data, this.pathList.REST_URL.projectRest.getDashboardProject,true, successCallBack);
  }

  createProject(data, successCallBack) {
    this.backEndService.postMethod(data, this.pathList.REST_URL.projectRest.save,true, successCallBack);
  }

  getProjectsByUserId(data, successCallBack) {
    this.backEndService.postMethod(data, this.pathList.REST_URL.projectRest.getByUserId,true, successCallBack);
  }

  peojectSchedule(data, successCallBack) {
    this.backEndService.postMethod(data, this.pathList.REST_URL.projectRest.projectSchedule,true, successCallBack);
  }

  public projectDeclineByFirm(data, successCallback) {
    return this.backEndService.postMethod(data, this.pathList.REST_URL.projectRest.projectDeclineByFirm, true, successCallback);
  }

  public projectDeclineByFirmAfterMeeting(data, successCallback) {
    return this.backEndService.postMethod(data, this.pathList.REST_URL.projectRest.prjDeclineByFirmAfterMeeting, true, successCallback);
  }

  getProjectByProjectId(data, successCallBack) {
    this.backEndService.postMethod(data, this.pathList.REST_URL.projectRest.getProjectByProjectId,true, successCallBack);
  }

  public getScheduledOfFirm(data, successCallback) {
    return this.backEndService.postMethod(data, this.pathList.REST_URL.projectRest.getScheduledOfFirm, true, successCallback);
  }

  
  public sendScheduleByPro(data, successCallback) {
    return this.backEndService.postMethod(data, this.pathList.REST_URL.projectRest.scheduleSendByPro, true, successCallback);
  }

  public getScheduledOfPro(data, successCallback) {
    return this.backEndService.postMethod(data, this.pathList.REST_URL.projectRest.getScheduledOfPro, true, successCallback);
  }
  
  public projectMeetDoneByAdmin(data, successCallback) {
    return this.backEndService.postMethod(data, this.pathList.REST_URL.projectRest.projectMeetDoneByAdmin, true, successCallback);
  }

  public projectDeclineByPro(data, successCallback) {
    return this.backEndService.postMethod(data, this.pathList.REST_URL.projectRest.projectDeclineByPro, true, successCallback);
  }

  public projectDeclineByProAfterMeeting(data, successCallback) {
    return this.backEndService.postMethod(data, this.pathList.REST_URL.projectRest.prjDeclineByProAfterMeeting, true, successCallback);
  }
  
  public projectFinalizeByPro(data, successCallback) {
    return this.backEndService.postMethod(data, this.pathList.REST_URL.projectRest.projectFinalize, true, successCallback);
  }


  public saveProjectAdditionTime(data, successCallback) {
    return this.backEndService.postMethod(data, this.pathList.REST_URL.projectRest.saveProjectAdditionTime, true, successCallback);
  }
  

  public projectFinalizeByFirm(data, successCallback) {
    return this.backEndService.postMethod(data, this.pathList.REST_URL.projectRest.projectFinalizeByFirm, true, successCallback);
  }

  
  public projectFinalizeByAdmin(data, successCallback) {
    return this.backEndService.postMethod(data, this.pathList.REST_URL.projectRest.projectFinalizeByAdmin, true, successCallback);
  }

  public getLastSavedTopProject(data, successCallback) {
    return this.backEndService.postMethod(data, this.pathList.REST_URL.projectRest.getLast2ProjectOfFirm, true, successCallback);
  }

  public saveAmends(data, successCallback) {
    return this.backEndService.postMethod(data, this.pathList.REST_URL.projectRest.saveAmends, true, successCallback);
  }

  public saveAmendOfAddtitionalReq(data, successCallback) {
    return this.backEndService.postMethod(data, this.pathList.REST_URL.projectRest.saveAmendOfAddReq, true, successCallback);
  }

  public addtionalReqFinalizeByFirm(data, successCallback) {
    return this.backEndService.postMethod(data, this.pathList.REST_URL.projectRest.addtionalReqFinalize, true, successCallback);
  }

  public declineAddionalRequestByFirm(data, successCallback) {
    return this.backEndService.postMethod(data, this.pathList.REST_URL.projectRest.projectDeclineByFirm, true, successCallback);
  }
  public addtionalReqAcceptedByAdmin(data, successCallback) {
    return this.backEndService.postMethod(data, this.pathList.REST_URL.projectRest.additionalReqAcceptedByFirm, true, successCallback);
  }
}