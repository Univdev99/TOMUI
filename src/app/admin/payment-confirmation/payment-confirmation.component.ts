import { Component, OnInit } from '@angular/core';
import { AdminService } from '../admin.service';
import { NgbActiveModal } from '../../../../node_modules/@ng-bootstrap/ng-bootstrap';
import { constants } from '../../app.constants';
import { Notification } from '../../notification/notification';
import { NotificationService } from '../../notification/notification.service';

@Component({
  selector: 'app-payment-confirmation',
  templateUrl: './payment-confirmation.component.html',
  styleUrls: ['./payment-confirmation.component.css']
})
export class PaymentConfirmationComponent implements OnInit {

  projectData;
  appConstant = constants;
  constructor(
    private notificationService: NotificationService,
    private adminService: AdminService,
    private ngbActiveModal: NgbActiveModal
  ) { }

  ngOnInit() {
  }

  jobCompleteByAdmin() {
    if (this.projectData.projectCompleteId) {
      const success = (result) => {
        if (result) {
          const json = {
            'jobCompletedByAdmin': true
          };
          this.ngbActiveModal.close(json);
        }
      }
      const json = {
        'projectCompleteId': this.projectData.projectCompleteId
      }
      this.adminService.projectCompletedByAdmin(json, success)
    }
  }

  paymentConfirmedByAdmin() {
    if (this.projectData.projectCompleteId) {
      const success = (result) => {
        if (result) {
          this.setAndSaveNotification();
          const json = {
            'paymentConfirmedByAdmin': true
          };
          this.ngbActiveModal.close(json);
        }
      }
      const json = {
        'projectCompleteId': this.projectData.projectCompleteId,
        'projectId': this.projectData.projectId
      }
      this.adminService.paymentConfirmedByAdmin(json, success)
    }
  }

  setAndSaveNotification() {
    // notification code start
    const msgForFirm = "Your project with " + this.projectData.proName + " is now officially done. Review your experience in Project History. Your review strengthens our community."
    const msgForPro = "Congrats on completing the job! Review your experience with " + this.projectData.businessName + " in Job History. Your review strengthens our community."
    const notArray = new Array<Notification>();
    const notForFirm = new Notification();
    notForFirm.fromUserId = null;
    notForFirm.toUserId = this.projectData.firmProfileId; // for Firm
    notForFirm.notificationMessage = msgForFirm;
    notForFirm.notificationFor = this.appConstant.firm;

    const notForAdmin = new Notification();
    notForAdmin.fromUserId = null;
    notForAdmin.notificationMessage = msgForPro;
    notForAdmin.toUserId = this.projectData.proProfileId; // for professional
    notForAdmin.notificationFor = this.appConstant.professional;
    notArray.push(notForFirm);
    notArray.push(notForAdmin);
    const json = {
      'notificationList': notArray,
    };
    const successcallback = (result) => {
      // alert("notification send!!!");
    };
    this.notificationService.notificationSave(json, successcallback);
    // notification code end
  }
}