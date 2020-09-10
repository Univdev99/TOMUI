import { Component, OnInit } from '@angular/core';
import { LocalStorageService } from '../../common/local-storage.service';
import { allPath } from '../../allPath';
import { constants } from '../../app.constants';
import { FirmService } from '../firm.service';
import * as _ from "lodash";
import { NgbModal } from '../../../../node_modules/@ng-bootstrap/ng-bootstrap';
import { ReviewComponent } from '../../common/common-page/review/review.component';
import { ElementService } from '../../common/element/element.service';

@Component({
  selector: 'app-firm-project-history',
  templateUrl: './firm-project-history.component.html',
  styleUrls: ['./firm-project-history.component.css']
})
export class FirmProjectHistoryComponent implements OnInit {

  appConstant = constants;
  pathList = allPath;
  userId = null;
  projectNameList = [];
  projectList = [];
  constructor(
    private ngbModal: NgbModal,
    private elementService: ElementService,
    private localStorageService: LocalStorageService,
    private firmService: FirmService
  ) { }


  ngOnInit() {
    this.userId = this.localStorageService.getValue(this.appConstant.user).userId;
    if (this.userId) {
      const json = {
        'userId': this.userId
      };
      this.firmService.getFirmProjectHistory(json, this.firmPrjHxGetSuccess)
    }
  }

  firmPrjHxGetSuccess = (result) => {
    if (result) {
      this.projectNameList = result.map(e => {
        return {
          'projectName': e.projectName,
          'createdDate': e.createdDate,
          'projectId': e.projectId,
          'isView': false,
        }
      });
      this.projectNameList = _.orderBy(this.projectNameList, ['createdDate'], ['desc']);
      this.projectList = result;
      this.projectNameList[0].isView = true;
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
    modalRef.componentInstance.argFrom = this.appConstant.firm;
    modalRef.componentInstance.projectId = projectData.projectId;
    modalRef.componentInstance.proProfileId = projectData.proProfileId;
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
        this.getReviewAndReflactToAllProject(this.appConstant.firm, projectData.proProfileId, null);
      }
    });

  }

  getReviewAndReflactToAllProject(argFrom, proProfileId, firmProfileId) {
    const avgReviewGetsuccess = (result) => {
      if (result) {
        const averageRating = result[0].averageRating;
        const reviewCount = result[0].reviewCount;
        this.projectList.forEach(element => {
          if (element.proProfileId === proProfileId) {
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
