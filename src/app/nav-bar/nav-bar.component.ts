import { Component, OnInit, AfterViewInit } from '@angular/core';
import { allPath } from '../allPath';
import * as $ from "jquery";
import { NavigationService } from '../common/navigation.service';
import { constants } from '../app.constants';
import { SessionStorageService } from '../common/session-storage.service';
import { LocalStorageService } from '../common/local-storage.service';
import { Router } from '../../../node_modules/@angular/router';

@Component({
  selector: 'app-nav-bar',
  templateUrl: './nav-bar.component.html',
  styleUrls: ['./nav-bar.component.css']
})
export class NavBarComponent implements OnInit, AfterViewInit {

  pathList = allPath;
  appConstant = constants;
  constructor(private navigationService: NavigationService,
    private sessionStorageService: SessionStorageService,
    private router: Router,
    private localStorageService: LocalStorageService
  ) { }

  ngOnInit() {
  }

  ngAfterViewInit() {
    $('.menubar li a').click(function () {
      $('.menubar li a').removeClass("active");
      $(this).addClass("active");
    });
    $('.get-started a').click(function () {
      $(this).toggleClass("active");
    });
    $('#menu-icon').click(function () {
      $('.res-menubar-top').toggleClass('res-menu-open');
      $('#menu-icon').toggleClass('menu-open');
    });
  }

  reDirectLogin(argFrom) {
    this.sessionStorageService.setObjectValue(this.appConstant.argFrom, argFrom);
    this.navigationService.navigateToState(this.pathList.CLIENT_URL.login);
  }

  navigatoTOHowItWorks(event) {
    if (this.router.url === this.pathList.CLIENT_URL.home) {
      setTimeout(() => {
        document.getElementById('howItWork').scrollIntoView();
      }, 100);
    } else {
      this.localStorageService.setValue(this.appConstant.redirectToHTW, true);
      this.navigationService.navigateToState(this.pathList.CLIENT_URL.home);
    }
  }

}
