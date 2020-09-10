import { Component, OnInit } from '@angular/core';
import { LocalStorageService } from '../common/local-storage.service';
import { constants } from '../app.constants';
import { FirmService } from '../firm/firm.service';
import * as $ from "jquery";
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-change-password',
  templateUrl: './change-password.component.html',
  styleUrls: ['./change-password.component.css']
})
export class ChangePasswordComponent implements OnInit {

  newPassword = '';
  confirmPassword = '';
  existingPassword = '';
  userId;
  appConstant = constants;
  constructor(private localStorageService: LocalStorageService,
    private firmService: FirmService,
    private ngbActiveModal:NgbActiveModal) { }

  ngOnInit() {
    setTimeout(() => {
      console.log(this.userId);
    }, 100);
  }

  updatePassword(): void {
    if (this.newPassword.trim() === this.confirmPassword.trim() &&
      (this.newPassword.trim().length > 0 && this.confirmPassword.trim().length > 0)) {
      if (this.existingPassword.trim().length > 0) {
        if (!this.userId) {
          const user = this.localStorageService.getValue(this.appConstant.user);
          this.userId = user.userId;
        }
        const json = {
          userId: this.userId,
          userNewPassword: this.confirmPassword.trim(),
          userPassword: this.existingPassword,
        };
        const changePasswordSuccess = (result) => {
          if (result && result[0] === 'passwordMatch') {
            // $('#password-change-pop').parents('.modal-content').css('display','none');
            this.ngbActiveModal.close();
          } else {
            // alert('existing password incorrect');
          }
        };

        this.firmService.changePassword(json, changePasswordSuccess);

      } else {
        // alert('existing password can\'t be empty');
      }

    } else {
      // alert('new password and confirm password must be same');
    }

  }

}
