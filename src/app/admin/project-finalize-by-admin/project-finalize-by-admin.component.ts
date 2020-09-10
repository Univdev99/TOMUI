import { Component, OnInit } from '@angular/core';
import { constants } from '../../app.constants';
import { ProjectService } from '../../project/project.service';
import { JsonpClientBackend } from '../../../../node_modules/@angular/common/http';
import { NgbActiveModal } from '../../../../node_modules/@ng-bootstrap/ng-bootstrap';
import { LocalStorageService } from '../../common/local-storage.service';
import { NotificationService } from '../../notification/notification.service';
import { Notification } from '../../notification/notification';

@Component({
  selector: 'app-project-finalize-by-admin',
  templateUrl: './project-finalize-by-admin.component.html',
  styleUrls: ['./project-finalize-by-admin.component.css']
})
export class ProjectFinalizeByAdminComponent implements OnInit {

  projectProData;
  appConstant = constants;
  constructor(
    private notificationService: NotificationService,
    private projectService: ProjectService,
    private localStorageService: LocalStorageService,

    private ngbActiveModal: NgbActiveModal

  ) { }

  ngOnInit() {
  }


  depositeReceivedAndAcceptProject(projectFinalizeId, projectId) {
    if (projectFinalizeId && projectId) {
      const moveAcceptedSuccess = (result) => {
        if (result) {
          const json = {
            'projectAccptedSuccess': true
          };
          this.ngbActiveModal.close(json);
          this.setAndSaveNotification();
        }

      }
      const json = {
        'projectFinalizeId': projectFinalizeId,
        'projectId': projectId
      }
      this.projectService.projectFinalizeByAdmin(json, moveAcceptedSuccess)
    }
  }

  
  approveAdditionalTime() {
    if (this.projectProData.projectAdditionalTimeId) {
      const addReqApproveByAdmin = (result) => {
        if (result) {
          const json = {
            'projectReqAcceptedByAdmin': true
          };
          this.ngbActiveModal.close(json);
          // this.setAndSaveNotification();
        }

      }
      const json = {
        'projectAdditionalTimeId': this.projectProData.projectAdditionalTimeId,
      }
      this.projectService.addtionalReqAcceptedByAdmin(json, addReqApproveByAdmin)
    }
  }

  setAndSaveNotification() {
    // notification code start
    const msgForFirm = "Congrats! " + this.projectProData.proName + " is officially onboarded! Your project is now in Accepted Projects.";
    const msgForPro = "Congrats! " + this.projectProData.businessName + "'s job has officially commenced. Find it in Accepted Jobs.";

    const notArray = new Array<Notification>();
    const notForFirm = new Notification();
    notForFirm.fromUserId = null;
    notForFirm.toUserId = this.projectProData.firmProfileId; // for Firm
    notForFirm.notificationMessage = msgForFirm;
    notForFirm.notificationFor = this.appConstant.firm;

    const notForPro = new Notification();
    notForPro.fromUserId = null;
    notForPro.notificationMessage = msgForPro;
    notForPro.toUserId = this.projectProData.proProfileId; // for Profesisonal
    notForPro.notificationFor = this.appConstant.professional;
    notArray.push(notForFirm);
    notArray.push(notForPro);
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
