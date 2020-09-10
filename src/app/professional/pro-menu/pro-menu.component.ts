import { Component, OnInit } from '@angular/core';
import * as $ from "jquery";
import { NgbModal, NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { ProProfilePersonalComponent } from '../pro-profile-personal/pro-profile-personal.component';
import { ProProfileWorkExperienceComponent } from '../pro-profile-work-experience/pro-profile-work-experience.component';
import { allPath } from '../../allPath';
import { ProProfileWorkAvailabilityComponent } from '../pro-profile-work-availability/pro-profile-work-availability.component';
import { LocalStorageService } from '../../common/local-storage.service';
import { ChangePasswordComponent } from 'src/app/change-password/change-password.component';
import { constants } from '../../app.constants';
import { NotificationService } from '../../notification/notification.service';
import { NavigationService } from '../../common/navigation.service';

@Component({
  selector: 'app-pro-menu',
  templateUrl: './pro-menu.component.html',
  styleUrls: ['./pro-menu.component.css']
})
export class ProMenuComponent implements OnInit {

  pathList = allPath;
  notificationCount = 0;
  proProfileId = null;
  appConstant = constants;
  constructor(
    private localStorageService: LocalStorageService,
    private notificationService: NotificationService,
    private ngbModal: NgbModal,
    private navigationService: NavigationService,
  ) { }

  ngOnInit() {
    this.proProfileId = this.localStorageService.getValue(this.appConstant.proProfileId);;
    this.getProNotificationCount();
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

  openProWorkExperienceProfile() {
    const modalRef = this.ngbModal.open(ProProfileWorkExperienceComponent);
    modalRef.componentInstance.componentsAsModal = true;
  }

  openPersonalProfile() {
    const modalRef = this.ngbModal.open(ProProfilePersonalComponent);
    modalRef.componentInstance.componentsAsModal = true;
  }

  openWorkAvalabilityModal() {
    const modalRef = this.ngbModal.open(ProProfileWorkAvailabilityComponent);
    modalRef.componentInstance.componentsAsModal = true;
  }

  logoutUser() {
    this.localStorageService.logout();
  }

  openChangePassword() {
    this.ngbModal.open(ChangePasswordComponent);
  }


  getProNotificationCount() {
    if (this.proProfileId) {
      const json = {
        'userId': this.proProfileId,
        'argFrom': this.appConstant.professional
      }
      this.notificationService.notificationGetCount(json, this.getCountSuccess);
    }
  }

  getCountSuccess = (result) => {
    if (result.notificationCount !== this.notificationCount) {
      this.notificationCount = result.notificationCount;
    }
    setTimeout(() => {
      // this.getProNotificationCount();
    }, 5000);
  }

  redirecToHowItWorks() {
    this.localStorageService.setValue(this.appConstant.redirectToHTW, true);
    this.navigationService.navigateToState(this.pathList.CLIENT_URL.home);
  }
}
