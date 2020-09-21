import { Component, OnInit } from '@angular/core';
import { Router } from '../../../node_modules/@angular/router';
import { allPath } from '../allPath';

@Component({
  selector: 'app-privacy-policy',
  templateUrl: './privacy-policy.component.html',
  styleUrls: ['./privacy-policy.component.css']
})
export class PrivacyPolicyComponent implements OnInit {

  isMenuNeeded = false;
  pathList = allPath;
  constructor(
    private router: Router
  ) { }

  ngOnInit() {
    if (this.router.url === this.pathList.CLIENT_URL.privacyPolicy) {
      this.isMenuNeeded = true;
    }
  }

}
