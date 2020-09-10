import { Component, OnInit } from '@angular/core';
import { Router } from '../../../node_modules/@angular/router';
import { allPath } from '../allPath';

@Component({
  selector: 'app-about',
  templateUrl: './about.component.html',
  styleUrls: ['./about.component.css']
})
export class AboutComponent implements OnInit {

  isMenuNeeded = false;
  pathList = allPath;
  constructor(
    private router: Router
  ) { }

  ngOnInit() {
    if (this.router.url === this.pathList.CLIENT_URL.about) {
      this.isMenuNeeded = true;
    }
  }

}
