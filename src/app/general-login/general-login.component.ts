import { Component, OnInit } from '@angular/core';
import { constants } from '../app.constants';
import { allPath } from '../allPath';

@Component({
  selector: 'app-general-login',
  templateUrl: './general-login.component.html',
  styleUrls: ['./general-login.component.css']
})
export class GeneralLoginComponent implements OnInit {

  appConstant = constants;
  pathList = allPath;
  
  constructor() { }

  ngOnInit() {
  }

}
