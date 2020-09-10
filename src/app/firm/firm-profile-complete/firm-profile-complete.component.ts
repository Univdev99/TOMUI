import { Component, OnInit } from '@angular/core';
import { constants } from '../../app.constants';
import { LocalStorageService } from '../../common/local-storage.service';

@Component({
  selector: 'app-firm-profile-complete',
  templateUrl: './firm-profile-complete.component.html',
  styleUrls: ['./firm-profile-complete.component.css']
})
export class FirmProfileCompleteComponent implements OnInit {
  
  appConstant = constants;
  message = null;

  constructor(
    private localStorageService: LocalStorageService,
  ) { }

  ngOnInit() {
    if (this.localStorageService.getValue(this.appConstant.message)) {
       /* message will come from login component */
      this.message = this.localStorageService.getValue(this.appConstant.message);
      this.localStorageService.removeValue(this.appConstant.message);
    }
  }

}
