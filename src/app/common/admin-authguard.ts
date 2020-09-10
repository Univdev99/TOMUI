import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree, Router, CanActivate, NavigationStart } from '@angular/router';
import { constants } from '../app.constants';
import { allPath } from '../allPath';
import { LocalStorageService } from './local-storage.service';
import { NavigationService } from './navigation.service';

@Injectable({
    providedIn: 'root'
})
export class AdminAuthGuard implements CanActivate {

    appConstant = constants;
    pathList = allPath;

    constructor(
        private router: Router,
        private localStorageService: LocalStorageService,
        private navigationService: NavigationService) { }

    /**
     * This method checks if user is authenticated or not and based on that return boolean
     *
     * @param  {ActivatedRouteSnapshot} route
     * @param  {RouterStateSnapshot} state
     */
    canActivate() {
        let userType = null;
        if (this.localStorageService.getValue(this.appConstant.user)) {
            userType = this.localStorageService.getValue(this.appConstant.user).roleId;
        }
        if (this.localStorageService.getValue(this.appConstant.accessToken) && userType === this.appConstant.adminUserType) {
            return true;
        } else {
            this.navigationService.navigateToState(this.pathList.CLIENT_URL.home);
            return false;
        }
    }
}
