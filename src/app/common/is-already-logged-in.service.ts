import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { LocalStorageService } from './local-storage.service';
import { constants } from '../app.constants';
import { allPath } from '../allPath';
import { NavigationService } from './navigation.service';

@Injectable({
  providedIn: 'root'
})
export class IsAlreadyLoggedinService implements CanActivate {

  pathList = allPath;
  appConstant = constants;

  constructor(
    private localStorageService: LocalStorageService,
    private navigationService: NavigationService,
  ) { }

  /**
   * @param  {ActivatedRouteSnapshot} route
   * @param  {RouterStateSnapshot} state
   */
  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
    let userType = null;
    if(this.localStorageService.getValue(this.appConstant.user)) {
      userType =  this.localStorageService.getValue(this.appConstant.user).roleId;
    };
    if (this.localStorageService.getValue(this.appConstant.accessToken) && userType ) {
      if(userType === this.appConstant.firmUserType) {
        this.navigationService.navigateToState(this.pathList.CLIENT_URL.firmDashBoard);
        return false;
      } else if(userType === this.appConstant.profUserType) {
        this.navigationService.navigateToState(this.pathList.CLIENT_URL.proDashBoard);
        return false;
      } else if(userType === this.appConstant.adminUserType) {
        // this.navigationService.navigateToState(this.pathList.CLIENT_URL.ad);
        return false;
      }
       // already logged in so redirect to home page with the return url
    }

    return true;
  }
}
