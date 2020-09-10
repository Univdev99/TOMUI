import { Injectable } from '@angular/core';
import { CanActivate, NavigationStart, Router, RouterStateSnapshot } from '@angular/router';
import { allPath } from '../../allPath';
import { constants } from '../../app.constants';
import { LocalStorageService } from '../local-storage.service';
import { NavigationService } from '../navigation.service';

@Injectable({
    providedIn: 'root'
})
export class FirmActiveUserAuthGuard implements CanActivate {

    appConstant = constants;
    pathList = allPath;

    constructor(
        private router: Router,
        private localStorageService: LocalStorageService,
        private navigationService: NavigationService) { }

    canActivate() {
        this.router.events
            .subscribe((event) => {
                if (event instanceof NavigationStart) {
                    this.localStorageService.setValue('previousURL', this.router.url);
                }
            });
        let userType = null;
        let userStatus = null;
        if (this.localStorageService.getValue(this.appConstant.user)) {
            userType = this.localStorageService.getValue(this.appConstant.user).roleId;
            userStatus = this.localStorageService.getValue(this.appConstant.user).userStatus;
        }
        if (this.localStorageService.getValue(this.appConstant.accessToken)
            && userType === this.appConstant.firmUserType
            && (userStatus === this.appConstant.decline || userStatus === null)) {
            console.log('A', userStatus);
            this.navigationService.navigateToState(this.pathList.CLIENT_URL.firmBusinessProfile);
            return false;
        } else if (this.localStorageService.getValue(this.appConstant.accessToken)
            && userType === this.appConstant.firmUserType
            && userStatus === this.appConstant.approve) {
            console.log('B', userStatus);
            return true;
        } else {
            this.navigationService.navigateToState(this.pathList.CLIENT_URL.home);
            console.log('C', userStatus);
            return false;
        }
    }
}
