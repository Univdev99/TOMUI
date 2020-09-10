import { Component, OnInit } from '@angular/core';
import { LoginService } from '../login/login.service';
import { allPath } from '../allPath';
import { NavigationService } from '../common/navigation.service';

@Component({
  selector: 'app-forgot-password',
  templateUrl: './forgot-password.component.html',
  styleUrls: ['./forgot-password.component.css']
})
export class ForgotPasswordComponent implements OnInit {

  email: string;
  submitted = false;
  pathList = allPath;
  errorMessage: string = null;
  constructor(
    private loginService: LoginService,
    private navigationService: NavigationService
  ) { }

  ngOnInit() {
  }

  checkAndSendEmail(form) {
    this.submitted = true;
    if (form && form.valid) {
      // this.email = this.email.trim();
      const json = {
        'email': this.email,
      }
      this.loginService.checkEmailForForgotPassword(json, this.checkAndSendEmailSuccess);
    }
  }

  checkAndSendEmailSuccess = (result) => {
    if (result && result === "Reset password link sent to  given Mail") {
      this.navigationService.navigateToState(this.pathList.CLIENT_URL.resetMailSendSuccess);
    } else  {
      this.submitted = false;
      this.errorMessage = 'Account not exist with given Mail';
    }
  }

}
