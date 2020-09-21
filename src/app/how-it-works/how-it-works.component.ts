import { Component, OnInit } from '@angular/core';
import { Router } from '../../../node_modules/@angular/router';
import { allPath } from '../allPath';

@Component({
  selector: 'app-how-it-works',
  templateUrl: './how-it-works.component.html',
  styleUrls: ['./how-it-works.component.css']
})
export class HowItWorksComponent implements OnInit {

  isMenuNeeded = false;
  pathList = allPath;
  constructor(
    private router: Router
  ) { }

  ngOnInit() {
    if (this.router.url === this.pathList.CLIENT_URL.howItWorks) {
      this.isMenuNeeded = true;
    }
  }

}
