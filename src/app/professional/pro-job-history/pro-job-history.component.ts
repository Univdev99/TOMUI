import { Component, OnInit } from '@angular/core';
import { constants } from '../../app.constants';
import { allPath } from '../../allPath';
import * as _ from "lodash";
import { ProService } from '../pro.service';
import { LocalStorageService } from '../../common/local-storage.service';
import { NgbModal } from '../../../../node_modules/@ng-bootstrap/ng-bootstrap';
import { ReviewComponent } from '../../common/common-page/review/review.component';
import { ElementService } from '../../common/element/element.service';

@Component({
  selector: 'app-pro-job-history',
  templateUrl: './pro-job-history.component.html',
  styleUrls: ['./pro-job-history.component.css']
})

export class ProJobHistoryComponent implements OnInit {

  appConstant = constants;
  pathList = allPath;
  projectNameList = []
  projectList = []
  constructor(
    private proService: ProService,
    private elementService: ElementService,
    private ngbModal: NgbModal,
    private localStorageService: LocalStorageService
  ) { }

  ngOnInit() {
    const proProfileId = this.localStorageService.getValue(this.appConstant.proProfileId);
    if (proProfileId) { // set from firm-sign-up
      const json = {
        'proProfileId': proProfileId
      };
      this.proService.getProProjectHistory(json, this.historyGetSuccess);
    }
  }

  historyGetSuccess = (result) => {
    if (result) {
      this.projectNameList = result.map(e => {
        return {
          'projectName': e.projectName,
          'businessName': e.businessName,
          'projectId': e.projectId,
          'isView': false,
        }
      });
      this.projectNameList = _.orderBy(this.projectNameList, ['createdDate'], ['desc']);
      this.projectList = result;
      this.changeViewParameter(this.projectNameList[0].projectId, null);
    }
  }

  changeViewParameter(projectId, nameIndex = null) {
    if (nameIndex != null) {
      this.projectNameList.forEach(nameProject => {
        nameProject.isView = false;
      });
      this.projectNameList[nameIndex].isView = true;
      this.projectList.forEach(mainProject => {
        mainProject.isView = false;
      });
    }
    const index = this.projectList.findIndex(e => Number(e.projectId) === projectId);
    if (index > -1) {
      this.projectList[index].isView = true;
    }
  }


  openReviewModal(projectData, index) {
    const modalRef = this.ngbModal.open(ReviewComponent);
    modalRef.componentInstance.argFrom = this.appConstant.professional;
    modalRef.componentInstance.projectId = projectData.projectId;
    modalRef.componentInstance.firmProfileId = projectData.firmProfileId;
    modalRef.componentInstance.projectData = projectData;
    if (projectData.currentProjectRating) {
      modalRef.componentInstance.currentProjectRating = projectData.currentProjectRating;
    }
    if (projectData.reviewCount) {
      modalRef.componentInstance.reviewCount = projectData.reviewCount;
    }
    if (projectData.averageRating) {
      modalRef.componentInstance.averageRating = projectData.averageRating;
    }
    if (projectData.reviewId) {
      modalRef.componentInstance.reviewId = projectData.reviewId;
    }
    modalRef.result.then((result) => {
      if (result && result.latestRating) {
        this.projectList[index].currentProjectRating = result.latestRating;
        this.projectList[index].reviewId = result.reviewId;
        this.getFirmReviewAndReflactToAllProject(this.appConstant.professional, null, projectData.firmProfileId);
      }
    });

  }

  getFirmReviewAndReflactToAllProject(argFrom, proProfileId, firmProfileId) {
    const avgReviewGetsuccess = (result) => {
      if (result) {
        const averageRating = result[0].averageRating;
        const reviewCount = result[0].reviewCount;
        this.projectList.forEach(element => {
          if (element.firmProfileId === firmProfileId) {
            element.averageRating = averageRating;
            element.reviewCount = reviewCount;
          }
        });
      }
    }
    const json = {
      'argFrom': argFrom,
      'proProfileId': proProfileId,
      'firmProfileId': firmProfileId,
    }
    this.elementService.getAverageReview(json, avgReviewGetsuccess)
  }
}
