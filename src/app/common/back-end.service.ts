import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient, HttpHeaders, } from '@angular/common/http';
import { SystemParamService } from '../../environments/system-param.service';
import { constants } from "../app.constants";
import { LocalStorageService } from './local-storage.service';
import { NgxSpinnerService } from 'ngx-spinner';

@Injectable({
  providedIn: 'root'
})
export class BackEndService {

  private appConstant = constants;

  constructor(private http: HttpClient,
    private spinner: NgxSpinnerService,
    private localStorageService: LocalStorageService,
    private systemParamService: SystemParamService) { }

  postMethod(data, url: string, blockUI = false, successCallback, errorCallback?): Observable<any[]> {
    if (blockUI) {
      this.spinner.show()
    }
    const config = this.buildConfig(data, url, this.appConstant.post, successCallback, errorCallback);
    return this.httpGenericCall(config);
  }

  public buildConfig(data, url, method, successCallback, errorCallback?) {
    const config: any = {};
    let httpOptions = {
      headers: this.prepareHeader(data),
      body: null,
      status: null,
      statusText: null,
      type: null,
      url: null,
      withCredentials: null,
      responseType: null,
      method: null,
      observe: 'response',
      reportProgress: true
    };
    config.url = this.systemParamService.SERVER.host + url;
    config.options = httpOptions;
    config.data = data;
    config.successCallback = successCallback;
    config.errorCallback = errorCallback;
    return config;
  }

  public httpGenericCall<T>(config) {
    let observer;
    if (config.method === this.appConstant.get || config.method === this.appConstant.delete) {
      observer = this.http[config.method](config.url, config.options);
    } else {
      observer = this.http.post(config.url, config.data, config.options);
    }
    return this.handleRespone(observer, config);
  }

  private prepareHeader(data) {
    let headers = new HttpHeaders();

    if (data.username && data.password) {
      headers = headers.set('X-Username', data.username).set('X-Password', data.password).set('Content-Type', 'application/json; charset=UTF-8');
    } else {
      // get access token from session
      const accessToken = this.localStorageService.getValue(this.appConstant.accessToken);
      // const sessionTimeOutTime = Number(this.localStorageService.getValue('sessionTimeOutTime'));
      // if (sessionTimeOutTime) {
      //   const currentTime = new Date().getTime();
      //   this.userIdleTime = Number(this.localStorageService.getValue('userIdleTime'));
      //   if (this.userIdleTime < currentTime) {
      //     this.localStorageService.logout();
      //     this.userIdleTime = null;
      //     return;
      //   } else if (this.userIdleTime > currentTime) {
      //     this.userIdleTime = new Date().getTime() + (sessionTimeOutTime * 60 * 1000);
      //     this.localStorageService.setValue('userIdleTime', this.userIdleTime.toString());
      //   }
      // }
      if (data instanceof FormData) {
        headers = headers.set('X-Auth-Token', accessToken);
      } else if (accessToken) {
        headers = headers.set('X-Auth-Token', accessToken).set('Content-Type', 'application/json; charset=UTF-8');
      } else {
        headers = headers.set('Content-Type', 'application/json; charset=UTF-8');
      }
    }
    if (data.acceptType) {
      headers = headers.set('Accept', data.acceptType + ',application/json');
    }
    return headers;
  }

  private handleRespone(observer, config) {

    return observer.subscribe(
      (result: Response) => {
        this.spinner.hide();
        console.log(result);
        let resultJSON: any;
        if (result['body']) {
          resultJSON = result['body'];
          if (resultJSON['apiCode']) {
            const apiCode = resultJSON['apiCode'];
            switch (apiCode) { // if code is 200 then .data will pass to successCallBack
              case 200:
                config.successCallback(resultJSON.data, result.headers);
                break;
              case 201:
                config.successCallback(resultJSON.data, result.headers);
                break;
              case 409:
                config.errorCallback(resultJSON, result.headers);
                break;
            }
          }
        }
      },
      error => {
        this.spinner.hide();
        console.log(error);
      }
    )
  }

}
