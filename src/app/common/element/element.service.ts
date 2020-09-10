import { Injectable } from '@angular/core';
import { BackEndService } from '../back-end.service';
import { elementRest } from "./elementRest";

@Injectable({
  providedIn: 'root'
})
export class ElementService {

  elementRest = elementRest

  constructor(
    private backEndService: BackEndService
  ) { }

  getSoftSearchData(data, successCallBack) {
    this.backEndService.postMethod(data, elementRest.commonSoftsearchDataUrl, false, successCallBack);
  }

  public getElementData(data, successCallback) {
    return this.backEndService.postMethod(data, elementRest.commonElementDataUrl, false, successCallback);
  }


  public uploadDocument(data, successCallback, errorCallBack) {
    return this.backEndService.postMethod(data, elementRest.uploadDocument, false, successCallback, errorCallBack);
  }

  public getDocument(data, successCallback, errorCallBack) {
    return this.backEndService.postMethod(data, elementRest.getDocument, false, successCallback, errorCallBack);
  }

  public downloadDocument(data, successCallback, errorCallBack) {
    return this.backEndService.postMethod(data, elementRest.downloadDocument, false, successCallback, errorCallBack);
  }

  public deleteDocument(data, successCallback) {
    return this.backEndService.postMethod(data, elementRest.deleteDocument, false, successCallback);
  }

  public saveAndSendMail(data, successCallback) {
    return this.backEndService.postMethod(data, elementRest.saveAndSendMail, true, successCallback);
  }

  public saveReview(data, successCallback) {
    return this.backEndService.postMethod(data, elementRest.saveReview, true, successCallback);
  }


  public getAverageReview(data, successCallback) {
    return this.backEndService.postMethod(data, elementRest.getAverageReview, false, successCallback);
  }

  calenderSave(data, successCallback) {
    return this.backEndService.postMethod(data, elementRest.calenderSave, true, successCallback);
  }
  calenderGet(data, successCallback) {
    return this.backEndService.postMethod(data, elementRest.calenderGet, true, successCallback);
  }








}
