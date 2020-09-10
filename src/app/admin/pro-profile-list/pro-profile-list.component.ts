import { Component, OnInit } from '@angular/core';
import { constants } from 'src/app/app.constants';
import { AdminService } from '../admin.service';
import { ProProfile, ProWorkAvailability } from '../../professional/pro-beans';
import { ProWorkExperience } from '../../professional/ProWorkExperience';
import { ProService } from '../../professional/pro.service';

@Component({
  selector: 'app-pro-profile-list',
  templateUrl: './pro-profile-list.component.html',
  styleUrls: ['./pro-profile-list.component.css']
})
export class ProProfileListComponent implements OnInit {

  proProfileStatus = null;
  proProfileList = [];
  proNameList = [];
  appConstant = constants;

  proPersonal = new ProProfile();
  proWorkExp = new ProWorkExperience();
  skillArray = [];

  constructor(
    private adminService: AdminService,
    private proService: ProService
  ) { }

  ngOnInit() {
    this.getAllProProfileList();
  }

  updateUserStatus(userId, userStatus) {
    const index = this.proNameList.findIndex(e => e.userId === userId);
    if (index > -1) {
      this.proNameList[index].userStatus = userStatus;
      this.proProfileStatus = userStatus; 
    }
  }

  approveProProfileByAdmin(userId, userStatus) {
    const userActivatedSuccess = (result) => {
      if (result) {
        if (userStatus === this.appConstant.approve) {
          this.updateUserStatus(userId, this.appConstant.accepted);
        } else if (userStatus === this.appConstant.decline) {
          this.updateUserStatus(userId, this.appConstant.declined);
        }
      }
    }
    if (userId) {
      const json = {
        'userId': userId,
        'userStatus': userStatus
      }
      this.adminService.userActivationByAdmin(json, userActivatedSuccess)
    }
  }


  getAllProProfileList() {
    this.adminService.getProProfileList('', this.proProfileGetSuccess)
  }

  proProfileGetSuccess = (result) => {
    if (result) {
      this.proNameList = result.map(e => {
        return {
          'proName': e.proName,
          'proProfileId': e.proProfileId,
          'userStatus': e.userStatus,
          'userId': e.userId,
          'isView': false,
        }
      });
      this.proProfileList = result;
      this.proNameList[0].isView = true;
      // this.chanegViewParams(this.proProfileList[0].proProfileId, null)
      this.setProfData(this.proProfileList[0].proProfileId, this.proNameList[0].userStatus);
    }
  }

  setProfData(proProfileId, userStatus) {
    this.proProfileStatus = userStatus;
    if (proProfileId) {
      this.getProExpWithSkills(proProfileId);
      const index = this.proProfileList.findIndex(e => e.proProfileId === proProfileId);
      if (index > -1) {
        this.proPersonal = this.proProfileList[index];
      }
    }
  }

  getProExpWithSkills(proProfileId) {
    const json = {
      'proProfileId': proProfileId
    }
    this.proService.getProExpWithSkills(json, this.expWithSkillsSuccess);
  }

  expWithSkillsSuccess = (result) => {
    if (result) {
      this.proWorkExp = result.proWorkExperience;
      this.skillArray = result.proSkills;
      console.log(result)
    }
  }


  chanegViewParams(i) {
    if (i !== null) {
      this.proNameList.forEach(e => {
        e.isView = false;
      });
      this.proNameList[i].isView = true;
      //   this.proProfileList.forEach(p => {
      //     p.isView = false;
      //   });
      // };
      // const index = this.proProfileList.findIndex(e => e.proProfileId === proProfileId);
      // if (index > -1) {
      //   this.proProfileList[index].isView = true;
    }
  }
}
