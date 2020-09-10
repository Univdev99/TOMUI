import { Component, OnInit } from '@angular/core';
import { allPath } from "../../../allPath";

@Component({
  selector: 'app-menu-logo',
  templateUrl: './menu-logo.component.html',
  styleUrls: ['./menu-logo.component.css']
})
export class MenuLogoComponent implements OnInit {

  pathList = allPath;
  constructor() { }

  ngOnInit() {
  }

}
