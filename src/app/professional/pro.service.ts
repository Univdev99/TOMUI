import { Injectable } from '@angular/core';
import { allPath } from '../allPath';
import { BackEndService } from '../common/back-end.service';

@Injectable({
  providedIn: 'root'
})
export class ProService {

  pathList = allPath;
  proProfileId = null; 
  adminProfit = 0; 

  constructor(private backEndService: BackEndService) { }

  proSignUp(data, successCallBack, errorCallBack) {
    this.backEndService.postMethod(data, this.pathList.REST_URL.proRest.signup, true, successCallBack, errorCallBack);
  }

  createProPersonalProfile(data, successCallBack) {
    this.backEndService.postMethod(data, this.pathList.REST_URL.proRest.personalProfileSave, true, successCallBack);
  }

  proPersonalProfileGet(data, successCallBack) {
    this.backEndService.postMethod(data, this.pathList.REST_URL.proRest.personalProfileGet, true, successCallBack);
  }

  getProWorkAvailabilty(data, successCallBack) {
    this.backEndService.postMethod(data, this.pathList.REST_URL.proRest.workAvailProfileGet, true, successCallBack);
  }

  createProWorkAvailability(data, successCallBack) {
    this.backEndService.postMethod(data, this.pathList.REST_URL.proRest.workAvailabilitySave, true, successCallBack);
  }


  proWorkExpProfileGet(data, successCallBack) {
    this.backEndService.postMethod(data, this.pathList.REST_URL.proRest.workExpProfileGet, true, successCallBack);
  }

  proWorkExpProfileSave(data, successCallBack) {
    this.backEndService.postMethod(data, this.pathList.REST_URL.proRest.workExpProfileSave, true, successCallBack);
  }

  public getProSkillTreeData(data, successCallback) {
    return this.backEndService.postMethod(data, this.pathList.REST_URL.proRest.getProSkillData, false, successCallback);
  }

  public searchProfessional(data, successCallback) {
    return this.backEndService.postMethod(data, this.pathList.REST_URL.proRest.professionalSearch, false, successCallback);
  }

  public getWholeProfile(data, successCallback) {
    return this.backEndService.postMethod(data, this.pathList.REST_URL.proRest.getWholeProProfile, false, successCallback);
  }

  public getProJob(data, successCallback) {
    return this.backEndService.postMethod(data, this.pathList.REST_URL.proRest.getProJob, false, successCallback);
  }

  getAccpetedProProject(data, successCallBack) {
    this.backEndService.postMethod(data, this.pathList.REST_URL.proRest.getAccpetedProProject, true, successCallBack);
  }

  getProProjectHistory(data, successCallBack) {
    this.backEndService.postMethod(data, this.pathList.REST_URL.proRest.getProProjectHistory, true, successCallBack);
  }

  projectCompleted(data, successCallBack) {
    this.backEndService.postMethod(data, this.pathList.REST_URL.proRest.projectCompleted, true, successCallBack);
  }

  getProExpWithSkills(data, successCallBack) {
    this.backEndService.postMethod(data, this.pathList.REST_URL.proRest.proExpWithSkill, true, successCallBack);
  }
}
