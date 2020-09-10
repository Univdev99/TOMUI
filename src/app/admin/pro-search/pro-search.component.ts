import { Component, OnInit } from '@angular/core';
import * as $ from "jquery";
import * as _ from "lodash";
import { AdminService } from '../admin.service';

@Component({
  selector: 'app-pro-search',
  templateUrl: './pro-search.component.html',
  styleUrls: ['./pro-search.component.css']
})
export class ProSearchComponent implements OnInit {

  proNameList = [];
  jobStatusList = []

  constructor(
    private adminService: AdminService
  ) { }

  ngOnInit() {
    this.adminService.searchAllproJobStatus('', this.jobStatusGetSuccess);
  }

  jobStatusGetSuccess = (result) => {
    this.proNameList = _.uniqBy(result.map(e => {
      return {
        'proName': e.proName,
        'proProfileId': e.proProfileId,
        'isView': false,
      }
    }), 'proProfileId');
    this.proNameList = _.orderBy(this.proNameList, ['proName'], ['asc']);
    this.proNameList[0].isView = true;
    this.jobStatusList = result;
    this.jobStatusList = _.orderBy(this.jobStatusList, ['createdDate'], ['desc']);
    this.changeViewParameter(this.proNameList[0].proProfileId, null);
  }

  changeViewParameter(proProfileId, index = null) {
    if (index !== null) {
      this.proNameList.forEach(element => { element.isView = false });
      this.proNameList[index].isView = true;
    }
    for (const professional of this.jobStatusList) {
      if (professional.proProfileId === proProfileId) {
        professional.isView = true;
      } else {
        professional.isView = false;
      }
    }
  }
}