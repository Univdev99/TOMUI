import { Component, OnInit } from '@angular/core';
import { LocalStorageService } from '../../common/local-storage.service';
import { FirmService } from '../firm.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { FirmBusinessProfileComponent } from '../firm-business-profile/firm-business-profile.component';
import { CreateProjectComponent } from '../../project/create-project/create-project.component';
import { constants } from '../../app.constants';
import { ProjectService } from '../../project/project.service';
import { ProSearchResultComponent } from '../pro-search-result/pro-search-result.component';
import { ConnectWithProComponent } from '../connect-with-pro/connect-with-pro.component';
import { NavigationService } from '../../common/navigation.service';
import { allPath } from '../../allPath';
import { ProService } from '../../professional/pro.service';
import { ProSearchParams } from './ProSearchParams';
import { ElementService } from '../../common/element/element.service';
import { elementRest } from '../../common/element/elementRest';
import { NotificationService } from '../../notification/notification.service';

@Component({
  selector: 'app-firm-dashboard',
  templateUrl: './firm-dashboard.component.html',
  styleUrls: ['./firm-dashboard.component.css']
})
export class FirmDashboardComponent implements OnInit {

  elementRest = elementRest;
  abc = [{ 'label': 'On-Site Mandatory', 'value': 'On-Site Mandatory' },
  { 'label': 'Flexible', 'value': 'Flexible' },
  { 'label': 'Remote', 'value': 'Remote' }]
  tempDate;
  appConstant = constants; pathList = allPath;
  userId;
  projectList = [];
  profList = [];

  proSearchParams = new ProSearchParams();
  masterSkillArray = [{ 'label': 'Select Category', 'value': 'select' }];
  categorySkillArray = [{ 'label': 'Select Category', 'value': 'select' }];

  constructor(private localStorageService: LocalStorageService,
    private elementService: ElementService,
    private firmService: FirmService,
    private proService: ProService,
    private ngbModal: NgbModal,
    private navigationService: NavigationService,
    private projectService: ProjectService,
    private notificationService: NotificationService,
  ) { }

  ngOnInit() {
    this.getCommonData(this.elementRest.allMasterSkill, this.appConstant.whereClause1_1);
    this.getCommonData(this.elementRest.allCategorySkill, this.appConstant.whereClause1_1);
    this.userId = this.localStorageService.getValue(this.appConstant.user).userId;
    if (this.userId) {
      const json = {
        'userId': this.userId,
        'argFrom': this.appConstant.firm
      }
      this.projectService.getDashboardProjecct(json, this.projectGetsuccess)
    }
  }

  projectGetsuccess = (result) => {
    if (result) {
      this.projectList = result;
    }
  }

  logOut() {
    this.localStorageService.logout();
  }

  getProfile() {
    const json = {
      'firmProfileId': 21
    }
    this.firmService.getFirmProfile(json, this.getProfileSuccess);
  }

  getProfileSuccess = (result) => {
    // alert()
  }

  openBusinessProfile() {
    const modalRef = this.ngbModal.open(FirmBusinessProfileComponent);
    modalRef.componentInstance.componentsAsModal = true;
  }

  openProjectModal() {
    this.notificationService.sendNotification({ 'toUser': 149, 'message': 'Hello Amit' })
  }

  openConnectWithPrModal() {
    this.ngbModal.open(ConnectWithProComponent);
  }

  navigateToProjectList(projectStatus) {
    if (projectStatus === this.appConstant.open) {
      this.navigationService.navigateToState(this.pathList.CLIENT_URL.openProject)
    } else if (projectStatus === this.appConstant.accepted) {
      this.navigationService.navigateToState(this.pathList.CLIENT_URL.acceptedProject)
    } else if (projectStatus === this.appConstant.completed) {
      this.navigationService.navigateToState(this.pathList.CLIENT_URL.historyProject)
    }
  }

  searchProfessional() {
    let json = {}
    const arrayLength = Object.keys(this.proSearchParams).length;
    this.proSearchParams.searchBoxValue = null;
    for (let i = 0; i < arrayLength; i++) {
      if (this.proSearchParams[Object.keys(this.proSearchParams)[i]] && this.proSearchParams[Object.keys(this.proSearchParams)[i]] !== 'select') {
        json[Object.keys(this.proSearchParams)[i]] = this.proSearchParams[Object.keys(this.proSearchParams)[i]];
      }
      console.log(json);
    }
    this.callSearchAPI(json);
  }

  searchProfFromTxtBox() {
    if (this.proSearchParams.searchBoxValue) {
      const json = {
        'searchBoxValue': this.proSearchParams.searchBoxValue
      }
      this.callSearchAPI(json);
    }

  }

  callSearchAPI(jsonForWhereClause) {
    const searchProfessionalSuccess = (result) => {
      if (result) {
        this.profList = result;
        const modalRef = this.ngbModal.open(ProSearchResultComponent);
        modalRef.componentInstance.profList = this.profList;
        modalRef.componentInstance.jsonParameters = jsonForWhereClause
      }
    }
    const json = {
      'proSearchParams': JSON.stringify(jsonForWhereClause)
    }
    this.proService.searchProfessional(json, searchProfessionalSuccess)
  }

  getCommonData(componentName, whereClause) {
    const getElementDataSuccess = (result) => {
      if (result && result.length) {
        if (componentName === elementRest.allMasterSkill) {
          result.forEach(e => { this.masterSkillArray.push(e); });
        } else if (componentName === elementRest.allCategorySkill) {
          result.forEach(e => { this.categorySkillArray.push(e); });
        }
      }
    }
    const staticElementObj = {
      'componentName': componentName,
      'staticWhereClause': '1=1'
    };
    this.elementService.getElementData(staticElementObj, getElementDataSuccess);
  }
}



