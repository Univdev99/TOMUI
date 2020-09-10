import { Component, OnInit, ViewChild, Input } from '@angular/core';
import { FormControl } from '@angular/forms';
import { constants } from '../../app.constants';
import { allPath } from '../../allPath';
import { ProWorkAvailability } from '../pro-beans';
import { elementRest } from '../../common/element/elementRest';
import { ProService } from '../pro.service';
import { LocalStorageService } from '../../common/local-storage.service';
import { NavigationService } from '../../common/navigation.service';
import { NgbModal, NgbActiveModal } from '../../../../node_modules/@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-pro-profile-work-availability',
  templateUrl: './pro-profile-work-availability.component.html',
  styleUrls: ['./pro-profile-work-availability.component.css']
})

export class ProProfileWorkAvailabilityComponent implements OnInit {

  @Input() componentsAsModal = false;
  submitted = false;
  @ViewChild('workAvailProfileForm', { static: false }) workAvailProfileForm: FormControl;
  appConstant = constants;
  pathList = allPath;
  elementRest = elementRest;
  proWorkAvailability = new ProWorkAvailability();
  todayDate: Date = new Date();
  disableTomorrowDate = new Date();

  selectedDateRange = [];
  minLastDate;


  workAvailArray = [{ 'label': 'Select', 'value': 'select' }, { 'label': '< 10 hrs', 'value': '< 10 hrs' },
  { 'label': '10-25  hrs', 'value': '10-25 hrs' }, { 'label': '25-40  hrs', 'value': '25-40 hrs' }, { 'label': '> 40 hrs', 'value': '> 40 hrs' }];
  locaionAvailArray = [{ 'label': 'Select', 'value': 'select' }, { 'label': 'On Site', 'value': 'On Site' },
  { 'label': 'Off Site', 'value': 'Off Site' }, { 'label': 'Both', 'value': 'Both' }];

  constructor(private proService: ProService,
    private navigationService: NavigationService,
    private ngbActiveModal: NgbActiveModal,
    private localStorageService: LocalStorageService) { }

  ngOnInit() {
    this.minLastDate = new Date();
    const proProfileId = this.localStorageService.getValue(this.appConstant.proProfileId);
    if (proProfileId) { // set from firm-sign-up
      this.proWorkAvailability.professionalProfileId = proProfileId;
      const json = {
        'proProfileId': proProfileId
      };
      this.proService.getProWorkAvailabilty(json, this.proWorkAvailGetSuccess)
      this.disableTomorrowDate.setDate(this.disableTomorrowDate.getDate() + 1);
    }
  }

  proWorkAvailGetSuccess = (result) => {
    if (result) {
      this.proWorkAvailability = result;
    } else {
      console.log("aaaaaaaaaaaaaaaaaaaaaa");
    }
  }

  saveWorkAvailProfile() {
    this.submitted = true;
    if (this.workAvailProfileForm.valid) {
      const json = {
        'proWorkAvailability': this.proWorkAvailability
      }
      this.proService.createProWorkAvailability(json, this.proWorkAvailSaveSuccess);
    }
  }

  proWorkAvailSaveSuccess = (result) => {
    if (result) {
      if (this.componentsAsModal) {
        this.ngbActiveModal.close();
      } else {
        this.navigationService.navigateToState(this.pathList.CLIENT_URL.proPersonalProfile)
      }
    }
  }

  startDateRangeSet(startDate) {
    if (startDate) {
      this.selectedDateRange = [];
      this.selectedDateRange.push(new Date(startDate));
    }
  }

  lastDateRangeSet(endDate) {
    if (endDate) {
      if (!this.selectedDateRange.length) {
        // nothing
      } if (this.selectedDateRange.length === 1) {
        this.selectedDateRange.push(new Date(endDate));
      } if (this.selectedDateRange.length === 2) {
        this.selectedDateRange[1] = new Date(endDate);
      } else {

      }
    }
  }


  setLastMinDate(event) {
    if (event) {
      this.minLastDate = this.getMinDate(event);
      this.startDateRangeSet(event);
    }
  }

  getMinDate(date) {
    const current = new Date(date);
    return {
      year: current.getFullYear(),
      month: current.getMonth() + 1,
      day: current.getDate()
    };
  }
}
