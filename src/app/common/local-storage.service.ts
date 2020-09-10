import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Router } from '@angular/router';
import { constants } from "../app.constants";
import { NavigationService } from './navigation.service';
import { allPath } from '../allPath';

@Injectable({ providedIn: 'root'})
export class LocalStorageService {
 
  private appConstant = constants;
  private pathList = allPath;

  constructor(private navigationService: NavigationService,
    private http: HttpClient) { }

  public setValue(key: string, value: any) {
    localStorage.setItem(key, JSON.stringify(value));
  }

  public getValue(key: string): any {
      return JSON.parse(localStorage.getItem(key));
  }

  public removeValue(key: string): any {
      return localStorage.removeItem(key);
  }

  get isLoggedIn() {
    return window.localStorage.getItem(this.appConstant.accessToken);
  }

  // logout(forUser?) {
  //   if (forUser) {
  //     this.removeTokenFromLocal();
  //     return;
  //   } else {
  //     const successCallback = (result) => {
  //       this.removeTokenFromLocal();
  //     }
  //     const errorCallback = (result) => {
  //       this.removeTokenFromLocal();
  //     }
  //     const jsonObj = Object.assign({});
  //     this.logoutFromServer(jsonObj, successCallback, errorCallback);
  //   }
  // }

  removeTokenFromLocal() {
    this.clearLocalStorageObjects();
    sessionStorage.clear();
    this.navigationService.navigateToState(this.appConstant);
    localStorage.setItem('logout', 'true');
  }

  public logoutFromServer(data, successCallback, errorCallback) {
    const headers = new HttpHeaders({
      'X-Auth-Token': this.getValue(this.appConstant.accessToken)
    });
    let httpOptions = {
      headers: headers
    };
    let options = httpOptions;
    // return this.http
    // .post(this._configuration.SERVER.host + this._configuration.SERVER.apiUrl + 'logout', data, options)
    // .toPromise()
    // .then(successCallback)
    // .catch(errorCallback);
  }

  clearLocalStorageObjects() {
    localStorage.clear();
  }

  logout() {
    this.clearLocalStorageObjects();
    this.navigationService.navigateToState(this.pathList.CLIENT_URL.home);
  }
}
  