import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, NavigationStart, Router, RouterStateSnapshot } from '@angular/router';
import { allPath } from '../../allPath';
import { constants } from '../../app.constants';
import { LocalStorageService } from '../local-storage.service';
import { NavigationService } from '../navigation.service';

@Injectable({
    providedIn: 'root'
})
export class ProAuthGuard implements CanActivate {

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
        this.router.events
            .subscribe((event) => {
                if (event instanceof NavigationStart) {
                    this.localStorageService.setValue('previousURL', this.router.url);
                }
            });
        let userType = null;
        if (this.localStorageService.getValue(this.appConstant.user)) {
            userType = this.localStorageService.getValue(this.appConstant.user).roleId;
        }
        if (this.localStorageService.getValue(this.appConstant.accessToken) && userType && userType === this.appConstant.profUserType) {
            console.log("ssssssssssssssss")
            return true;
        } else {
            console.log("ffffffffffffffffffff")
            return false;
        }
    }
}
