import { Component, OnInit } from '@angular/core';
import * as $ from "jquery";
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { FirmBusinessProfileComponent } from '../firm-business-profile/firm-business-profile.component';
import { FirmPersonalProfileComponent } from '../firm-personal-profile/firm-personal-profile.component';
import { ChangePasswordComponent } from '../../change-password/change-password.component';
import { allPath } from '../../allPath';
import { constants } from '../../app.constants';
import { NavigationService } from '../../common/navigation.service';
import { SessionStorageService } from '../../common/session-storage.service';
import { LocalStorageService } from '../../common/local-storage.service';

@Component({
  selector: 'app-dashboard-menu',
  templateUrl: './dashboard-menu.component.html',
  styleUrls: ['./dashboard-menu.component.css']
})
export class DashboardMenuComponent implements OnInit {

  pathList = allPath;
  appConstant = constants;
  constructor(private modalService: NgbModal,
    private navigationService: NavigationService,
    private localStorageService: LocalStorageService,
  ) { }

  ngOnInit() {
  }

  ngAfterViewInit() {
    $('.top-logo-main').click(function () {
      $(".sidebar-main").toggleClass('sidemenu-effect');
    });
    $('li.child-menu').click(function () {
      $(this).find("ul.sub-menu").slideToggle(150);
      $(this).find(".menu-arrow").toggleClass('before');
    });

    $('#menu-icon').click(function () {
      $('.sidebar-main.mobile-view').addClass('open-menu');
    });
  }

  openBusinessProfile() {
    const modalRef = this.modalService.open(FirmBusinessProfileComponent);
    modalRef.componentInstance.componentsAsModal = true;
  }
 
  openPersonalProfile() {
    const modalRef = this.modalService.open(FirmPersonalProfileComponent);
    modalRef.componentInstance.componentsAsModal = true;
  }

  openChangePassword() {
    this.modalService.open(ChangePasswordComponent);
  } 

  redirectToProject(argFrom) {
    if (argFrom === this.appConstant.open) {
      this.navigationService.navigateToState(this.pathList.CLIENT_URL.openProject)
    } else if (argFrom === this.appConstant.accepted) {
      this.navigationService.navigateToState(this.pathList.CLIENT_URL.acceptedProject)
    } else if (argFrom === this.appConstant.history) {
      this.navigationService.navigateToState(this.pathList.CLIENT_URL.historyProject)
    } 
  }

  logoutUser() {
    this.localStorageService.logout();
  }

  redirecToHowItWorks() {
    this.localStorageService.setValue(this.appConstant.redirectToHTW, true);
    this.navigationService.navigateToState(this.pathList.CLIENT_URL.home);
  }
}
