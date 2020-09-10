import { Component, OnInit } from '@angular/core';
import { LocalStorageService } from '../../common/local-storage.service';
import { constants } from '../../app.constants';
import { ProjectService } from '../project.service';
import { Project } from '../create-project/project';
import * as _ from "lodash";
import { SessionStorageService } from '../../common/session-storage.service';
import { Router } from '@angular/router';
import { allPath } from '../../allPath';
import { GroupByPipe } from '../../common/pipe/group-by.pipe';
import { NgbModal } from '../../../../node_modules/@ng-bootstrap/ng-bootstrap';
import { ProjectFinalizeByFirmComponent } from '../../firm/project-finalize-by-firm/project-finalize-by-firm.component';
import { NotificationService } from '../../notification/notification.service';
import { Notification } from '../../notification/notification';

@Component({
  selector: 'app-project-list',
  templateUrl: './project-list.component.html',
  styleUrls: ['./project-list.component.css']
})
export class ProjectListComponent implements OnInit {

  userId;
  appConstant = constants;
  pathList = allPath;
  projectList = [];
  projectNameList = [];
  constructor(
    private localStorageService: LocalStorageService,
    private notificationService: NotificationService,
    private router: Router,
    private ngbModal: NgbModal,
    private groupByPipe: GroupByPipe,
    private sessionStorageService: SessionStorageService,
    private projectService: ProjectService
  ) { }

  ngOnInit() {
    let projectStatus = null;
    if (this.router.url === this.pathList.CLIENT_URL.openProject) {
      projectStatus = this.appConstant.open;
    } else if (this.router.url === this.pathList.CLIENT_URL.acceptedProject) {
      projectStatus = this.appConstant.accepted;
    } else if (this.router.url === this.pathList.CLIENT_URL.historyProject) {
      projectStatus = this.appConstant.history;
    }
    this.userId = this.localStorageService.getValue(this.appConstant.user).userId;
    this.sessionStorageService.removeItem(this.appConstant.projectStatus);
    if (this.userId) {
      const json = {
        'userId': this.userId,
        'projectStatus': projectStatus
      }
      this.projectService.getProjectsByUserId(json, this.projectGetsuccess)
    }
  }

  projectGetsuccess = (result) => {
    if (result) {
      console.log('Hello');
      this.projectNameList = _.uniqBy(result.map(e => {
        return {
          'projectName': e.projectName,
          'projectId': e.projectId,
          'createdDate': e.createdDate,
          'isView': false,
        }
      }), 'projectId');
      this.projectList = result;
      this.projectList = this.groupByPipe.transform(this.projectList, 'projectId');
      this.changeViewParameter(this.projectNameList[0].projectId, 0);
    }
  }

  changeViewParameter(projectId, nameIndex) {
    this.projectNameList.forEach(nameProject => {
      nameProject.isView = false;
    });
    this.projectNameList[nameIndex].isView = true;
    this.projectList.forEach(mainProject => {
      mainProject.value.forEach(subProject => {
        subProject.isView = false;
      });
    });
    const index = this.projectList.findIndex(e => Number(e.key) === projectId);
    if (index > -1) {
      this.projectList[index].value.forEach(subProject => {
        subProject.isView = true;
      });
    }
  }

  declineProjectByFirm(projectData, pIndex, cIndex) {
    if (projectData.projectStatus === this.appConstant.requested || projectData.projectStatus === this.appConstant.pendingMeeting) {
      this.declineByFirmBeforeMeeting(projectData, pIndex, cIndex);
    } else if (projectData.projectStatus === this.appConstant.pendingApproval) {
      this.declineByFirmAfterMeeting(projectData, pIndex, cIndex);
    }
  }

  declineByFirmBeforeMeeting(projectData, pIndex, cIndex) {
    const projectDeclineBeforeMeeting = (result) => {
      if (result) {
        console.log(projectData);
        this.projectList[pIndex].value[cIndex].projectStatus = this.appConstant.declined;
        const proFirstName = projectData.proFirstName;
        const businessName = projectData.businessName;
        const proName = projectData.proName;
        const proProfileId = projectData.proProfileId;
        this.setAndSaveNotification(proFirstName, businessName, proName, proProfileId);
      }
    }
    const json = {
      'projectId': projectData.projectId,
      'proProfileId': projectData.proProfileId,
    }
    this.projectService.projectDeclineByFirm(json, projectDeclineBeforeMeeting)
  }


  declineByFirmAfterMeeting(projectData, pIndex, cIndex) {
    const projectDeclineAfterMeeting = (result) => {
      if (result) {
        this.projectList[pIndex].value[cIndex].projectStatus = this.appConstant.declined;
      }
    }
    const json = {
      'projectId': projectData.projectId,
      'proProfileId': projectData.proProfileId,
    }
    this.projectService.projectDeclineByFirmAfterMeeting(json, projectDeclineAfterMeeting)
  }

  viewAndFinalieProject(projectProData, pIndex, cIndex) {
    const modalRef = this.ngbModal.open(ProjectFinalizeByFirmComponent);
    modalRef.componentInstance.projectProData = projectProData,
      modalRef.result.then((result) => {
        if (result) {
          if (result.declinedSuccess) {
            this.projectList[pIndex].value[cIndex].projectStatus = this.appConstant.declined;
          } else if (result.acceptSuccess) {
            this.projectList[pIndex].value[cIndex].projectStatus = this.appConstant.accepted;
          } else if (result.amendsByFirm) {
            this.projectList[pIndex].value[cIndex].amendsByFirm = result.amendsByFirm;
          }
        }
      });
  }

  setAndSaveNotification(proFirstNameForFirm, businessNameForAdmin, proNameForAdmin, proProfileId) {
    // notification code start
    const firmProfileId = this.localStorageService.getValue(this.appConstant.firmProfileId);
    const msgForFirm = "You have declined the project with " + proFirstNameForFirm + ".";
    const msgForPro = businessNameForAdmin + " has declined the job. Stay tuned for future opportunities!";
    const msgForAdmin = businessNameForAdmin + " declined the job with " + proNameForAdmin + "."

    const notArray = new Array<Notification>();
    const notForFirm = new Notification();
    notForFirm.fromUserId = firmProfileId;
    notForFirm.toUserId = firmProfileId; // for Firm
    notForFirm.notificationMessage = msgForFirm;
    notForFirm.notificationFor = this.appConstant.firm;

    const notForAdmin = new Notification();
    notForAdmin.fromUserId = firmProfileId;
    notForAdmin.notificationMessage = msgForAdmin;
    notForAdmin.toUserId = null; // for Admin
    notForAdmin.notificationFor = this.appConstant.admin;

    const notForPro = new Notification();
    notForPro.fromUserId = firmProfileId;
    notForPro.notificationMessage = msgForPro;
    notForPro.toUserId = proProfileId; // for professional
    notForPro.notificationFor = this.appConstant.professional;

    notArray.push(notForFirm);
    notArray.push(notForAdmin);
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

