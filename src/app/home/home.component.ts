import { Component, OnInit } from '@angular/core';
import { constants } from '../app.constants';
import { allPath } from '../allPath';
import { LocalStorageService } from '../common/local-storage.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})

export class HomeComponent implements OnInit {

  appConstant = constants;
  pathList = allPath;

  constructor(
    private localStorageService: LocalStorageService,
  ) {
  }

  ngOnInit() {
    if (this.localStorageService.getValue(this.appConstant.redirectToHTW)) {
      setTimeout(() => {
        document.getElementById('howItWork').scrollIntoView();
        this.localStorageService.removeValue(this.appConstant.redirectToHTW);
      }, 500);
    }
  }

}
