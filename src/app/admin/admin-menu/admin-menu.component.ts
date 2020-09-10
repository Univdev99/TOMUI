import { Component, OnInit } from '@angular/core';
import { allPath } from '../../allPath';
import * as $ from "jquery";
import { LocalStorageService } from '../../common/local-storage.service';

@Component({
  selector: 'app-admin-menu',
  templateUrl: './admin-menu.component.html',
  styleUrls: ['./admin-menu.component.css']
})
export class AdminMenuComponent implements OnInit {

  pathList = allPath;
  constructor(
    private localStorageService: LocalStorageService
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

  logoutUser() {
    this.localStorageService.logout();
  }
}

