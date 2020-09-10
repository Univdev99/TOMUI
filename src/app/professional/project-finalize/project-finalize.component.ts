import { Component, OnInit, Input, ViewChild } from '@angular/core';
import { ProjectFinalize } from '../pro-job-list/project-finalize';
import { ProjectService } from '../../project/project.service';
import { NgbActiveModal } from '../../../../node_modules/@ng-bootstrap/ng-bootstrap';
import { LocalStorageService } from '../../common/local-storage.service';
import { constants } from '../../app.constants';
import { FormControl } from '../../../../node_modules/@angular/forms';
import { Notification } from '../../notification/notification';
import { NotificationService } from '../../notification/notification.service';

@Component({
  selector: 'app-project-finalize',
  templateUrl: './project-finalize.component.html',
  styleUrls: ['./project-finalize.component.css']
})
export class ProjectFinalizeComponent implements OnInit {

  /* value from addtionan time */
  isForAdditionalTime = false;
  projectFinalizeId = null;
  /* value from addtionan time */

  submitted = false;
  appConstant = constants;
  @Input() projectId: number;
  @ViewChild('projectFinalizeForm', { static: false }) projectFinalizeForm: FormControl;
  minDate = new Date();

  dataForNotification;

  projectFinalize = new ProjectFinalize();
  constructor(
    private projectService: ProjectService,
    private localStorageService: LocalStorageService,
    private notificationService: NotificationService,
    private ngbActiveModal: NgbActiveModal
  ) { }

  ngOnInit() {
    const proProfileId = Number(this.localStorageService.getValue(this.appConstant.proProfileId))
    this.projectFinalize.projectId = this.projectId;
    this.projectFinalize.proProfileId = proProfileId;
    if(this.isForAdditionalTime) {
      this.projectFinalize.projectFinalizeId = this.projectFinalizeId;
    }
  }

  saveProjectFinalize() {
    this.submitted = true;
    if (this.projectFinalizeForm.valid) {
      if (this.isForAdditionalTime) {
        const json = {
          'projectAddtionalTime': this.projectFinalize
        }
        this.projectService.saveProjectAdditionTime(json, this.saveProjectAdditionTimeSuccess)
      } else {
        const json = {
          'projectFinalize': this.projectFinalize
        }
        this.projectService.projectFinalizeByPro(json, this.projectFinalizeSuccess)
      }
    }
  }

  saveProjectAdditionTimeSuccess = (result) => {
    if (result) {
      // this.setAndSaveNotification()
      const json = {
        'additonalTimeSaveSuccess': true,
        // 'projectFinalizeId': result.projectFinalizeId
      }
      this.ngbActiveModal.close(json);
    }
  }


  projectFinalizeSuccess = (result) => {
    if (result) {
      this.setAndSaveNotification()
      const json = {
        'projectFinalizedByPro': true,
        'projectFinalizeId': result.projectFinalizeId
      }
      this.ngbActiveModal.close(json);
    }
  }

  setAndSaveNotification() {
    // notification code start
    const proProfileId = this.localStorageService.getValue(this.appConstant.proProfileId);
    const msgForFirm = this.dataForNotification.proFirstName + " has accepted the project. Review the final details and accept or decline in Open Projects.";
    const msgForAdmin = this.dataForNotification.proName + " has finalized the details for " + this.dataForNotification.businessName + " 's job. Awaiting Firm's response";

    const notArray = new Array<Notification>();
    const notForFirm = new Notification();
    notForFirm.fromUserId = proProfileId;
    notForFirm.toUserId = this.dataForNotification.firmProfileId; // for Firm
    notForFirm.notificationMessage = msgForFirm;
    notForFirm.notificationFor = this.appConstant.firm;

    const notForAdmin = new Notification();
    notForAdmin.fromUserId = proProfileId;
    notForAdmin.notificationMessage = msgForAdmin;
    notForAdmin.toUserId = null; // for Admin
    notForAdmin.notificationFor = this.appConstant.admin;
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
