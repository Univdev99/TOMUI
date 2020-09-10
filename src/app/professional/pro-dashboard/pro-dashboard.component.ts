import { Component, OnInit } from '@angular/core';
import { constants } from '../../app.constants';
import { allPath } from '../../allPath';
import { LocalStorageService } from '../../common/local-storage.service';
import { ProService } from '../pro.service';
import { ProjectService } from '../../project/project.service';
import { NotificationService } from '../../notification/notification.service';
import { NavigationService } from 'src/app/common/navigation.service';

@Component({
  selector: 'app-pro-dashboard',
  templateUrl: './pro-dashboard.component.html',
  styleUrls: ['./pro-dashboard.component.css']
})
export class ProDashboardComponent implements OnInit {

  jobList = [];
  proProfileId;
  appConstant = constants;
  pathList = allPath;

  constructor(
    private projectService: ProjectService,
    private localStorageService: LocalStorageService,
    private proService: ProService,
    private not: NotificationService,
    private navigationService: NavigationService,
  ) { }

  ngOnInit() {
    this.proProfileId = this.localStorageService.getValue(this.appConstant.proProfileId);
    if (this.proProfileId) {
      const json = {
        'proProfileId': this.proProfileId,
        'argFrom': this.appConstant.professional
      }
      this.projectService.getDashboardProjecct(json, this.proJobGetSuccess)
    }
  }

  proJobGetSuccess = (result) => {
    if (result) {
      this.jobList = result;

    }
  }

  navigateToProjectList(projectStatus) {
    if (projectStatus === this.appConstant.open) {
      this.navigationService.navigateToState(this.pathList.CLIENT_URL.requestedJob)
    } else if (projectStatus === this.appConstant.accepted) {
      this.navigationService.navigateToState(this.pathList.CLIENT_URL.acceptedJob)
    } else if (projectStatus === this.appConstant.completed) {
      this.navigationService.navigateToState(this.pathList.CLIENT_URL.historyJob)
    }
  }

}
