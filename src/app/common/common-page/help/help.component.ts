import { Component, OnInit, ViewChild } from '@angular/core';
import { FormControl } from '../../../../../node_modules/@angular/forms';
import { Help } from './help';
import { ElementService } from '../../element/element.service';
import { Router } from '../../../../../node_modules/@angular/router';
import { allPath } from '../../../allPath';

@Component({
  selector: 'app-help',
  templateUrl: './help.component.html',
  styleUrls: ['./help.component.css']
})
export class HelpComponent implements OnInit {

  isMenuNeeded = false;
  isProLeftMenuNeeded = false;
  isFirmLeftMenuNeeded = false;
  submitted = false;
  help = new Help();
  pathList = allPath;
  @ViewChild('helpForm', { static: false }) helpForm: FormControl;
  constructor(
    private elementService: ElementService,
    private router: Router,
  ) { }

  ngOnInit() {
    if (this.router.url === this.pathList.CLIENT_URL.contact) {
      this.isMenuNeeded = true;
    } else if (this.router.url === this.pathList.CLIENT_URL.proHelp) {
      this.isProLeftMenuNeeded = true;
    } else if (this.router.url === this.pathList.CLIENT_URL.firmHelp) {
      this.isFirmLeftMenuNeeded = true;
    }
  }

  saveAndSendMail() {
    this.submitted = true;
    if (this.helpForm.valid) {
      const json = {
        'help': this.help
      }
      this.elementService.saveAndSendMail(json, this.mailSendSuccess);
    }
  }

  mailSendSuccess = (result) => {
    if (result) {
      console.log(result);
    }
  }

}
