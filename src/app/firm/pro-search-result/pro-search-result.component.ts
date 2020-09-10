import { Component, OnInit, Input } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ConnectWithProComponent } from '../connect-with-pro/connect-with-pro.component';
import { ProProfileViewComponent } from '../../common/common-page/pro-profile-view/pro-profile-view.component';
import { ProService } from '../../professional/pro.service';
import * as $ from "jquery";
import * as _ from "lodash";
import { TruncatePipe } from '../../common/pipe/truncate-pipe';
import { constants } from '../../app.constants';
import { LocalStorageService } from 'src/app/common/local-storage.service';

@Component({
  selector: 'app-pro-search-result',
  templateUrl: './pro-search-result.component.html',
  styleUrls: ['./pro-search-result.component.css']
})
export class ProSearchResultComponent implements OnInit {

  appConstant = constants;
  proViewList = [];
  @Input() profList = [];
  profAllList = [];
  profAllFilterList = [];
  proArrayLength = null;
  dropdownOpenClose = false;
  seletedDropDownValue = {};

  @Input() jsonParameters = ''

  /* FILTER */
  fullTimeArray = [{ 'label': 'Y', 'value': 1, 'status': false }, { 'label': 'N', 'value': 0, 'status': false }];
  workAvailArray = [{ 'label': '< 10 hrs', 'value': '< 10 hrs', 'status': false, 'orderValue': '10 hrs' },
  { 'label': '10-25   hrs', 'value': '10-25 hrs', 'status': false, 'orderValue': '10-25 hrs' },
  { 'label': '25-40 hrs', 'value': '25-40 hrs', 'status': false, 'orderValue': '25-40 hrs' },
  { 'label': '> 40 hrs', 'value': '> 40 hrs', 'status': false, 'orderValue': '40 hrs' }];

  locaionAvailArray = [{ 'label': 'On Site', 'value': 'On Site', 'status': false },
  { 'label': 'Off Site', 'value': 'Off Site', 'status': false }, { 'label': 'Both', 'value': 'Both', 'status': false }];

  hourArray = [{ 'label': '25', 'value': '0-25', 'startValue': 0, 'endValue': 25, 'status': false },
  { 'label': '25-50', 'value': '25-50', 'startValue': 25, 'endValue': 50, 'status': false },
  { 'label': '50-75', 'value': '50-75', 'startValue': 50, 'endValue': 75, 'status': false },
  { 'label': '75-100', 'value': '75-100', 'startValue': 75, 'endValue': 100, 'status': false },
  { 'label': '100+', 'value': '100-99999999', 'startValue': 100, 'endValue': 99999999, 'status': false }];
  selectedFilters = {};

  filterArray = [];
  /* FILTER */


  constructor(private ngbModal: NgbModal,
    private proService: ProService,
    private localStorageService: LocalStorageService
  ) { }

  ngOnInit() {
    if (this.profList.length) {
      this.profAllList = _.cloneDeep(this.profList);
      this.loadMore();
    }
  }

  loadMore() {
    if (this.profList.length >= 3) {
      for (let i = 0; i < 3; i++) {
        this.proViewList.push(this.profList[i]);
      }
      this.profList.splice(0, 3);
    } else {
      for (let i = 0; i < this.profList.length; i++) {
        this.proViewList.push(this.profList[i]);
      }
      this.profList = [];
    }
    setTimeout(() => {
      $('.fullView').hide();
    }, 100);
  }

  ngAfterViewInit(): void {
    //Called after ngAfterContentInit when the component's view has been initialized. Applies to components only.
    //Add 'implements AfterViewInit' to the class.
    setTimeout(() => {
      $('.fullView').hide();
    }, 100);
  }

  openProProfileView(proDetails) {
    this.proService.proProfileId = proDetails.professionalProfileId;
    this.proService.adminProfit = proDetails.adminProfit;
    this.localStorageService.setValue(this.appConstant.toUserForNotification, proDetails.userId);
    this.localStorageService.setValue(this.appConstant.proNameForNotification, proDetails.proName);
    const modalRef = this.ngbModal.open(ProProfileViewComponent);
    modalRef.componentInstance.isSampleProfile = false;
    modalRef.componentInstance.argFrom = this.appConstant.fromFirm;
  }

  toggleEllipseView(event) {
    $(event.target).parent().closest('.search-results-left-tp-part').find('.fullView').show();
  }

  setView(event, showClassName, hideClassName) {
    $(event.target).parent().closest('.search-results-left-tp-part').find('.' + showClassName).show();
    $(event.target).parent().closest('.search-results-left-tp-part').find('.' + hideClassName).hide();
  }

  dropdownClicked() {
    this.dropdownOpenClose = !this.dropdownOpenClose;
  }

  applyFilter() {
    let resultArray = _.cloneDeep(this.profAllList);
    let selectedWorkAvailArray = this.workAvailArray.filter(e => { return e.status }).map(e => e.value);
    let selectedLocationArray = this.locaionAvailArray.filter(e => { return e.status }).map(e => e.value);
    let selectedHourArray = this.hourArray.filter(e => { return e.status }).map(e => e.value);
    let selectedfullTimeArray = this.fullTimeArray.filter(e => { return e.status }).map(e => e.value);


    let temo1Json = _.cloneDeep(this.jsonParameters);
    temo1Json['workAvailability'] = selectedWorkAvailArray.join();
    temo1Json['locationAvailability'] = selectedLocationArray.join();
    temo1Json['hourRange'] = selectedHourArray.join();
    temo1Json['isFullTime'] = selectedfullTimeArray.join();
    this.filter(temo1Json)

    // if (selectedWorkAvailArray.length) {
    //   resultArray = _.sortBy(resultArray, function (item) {
    //     if (selectedWorkAvailArray.indexOf(item.orderValue) > -1) {
    //       item['sorted'] = true;
    //       return 1
    //     } else {
    //       item['sorted'] = false;
    //       return resultArray.length
    //     }
    //   });
    // }
    // if (selectedLocationArray.length) {
    //   resultArray = _.sortBy(resultArray, function (item) {
    //     if (item.sorted) {
    //       return 1
    //     } else if (selectedLocationArray.indexOf(item.locationAvailability) > -1) {
    //       item['sorted'] = true;
    //       return 1
    //     } else {
    //       item['sorted'] = false;
    //       return resultArray.length;
    //     }
    //   });
    // }
    // if (selectedHourArray.length) {
    //   let tempArray = [];
    //   for (const hour of selectedHourArray) {
    //     for (const result of resultArray) {
    //       if (result.hourlyFee >= hour.startValue && result.hourlyFee <= hour.endValue) {
    //         tempArray.push(result.professionalProfileId);
    //       }
    //     }
    //   }

    //   if (tempArray.length) {
    //     resultArray = _.sortBy(resultArray, function (item) {
    //       if (item.sorted) {
    //         return 1
    //       } else if (tempArray.indexOf(item.professionalProfileId) > -1) {
    //         item['sorted'] = true;
    //         return 1
    //       } else {
    //         item['sorted'] = false;
    //         return resultArray.length;
    //       }
    //     });
    //   }
    //   console.log(resultArray);

    // resultArray = _.sortBy(resultArray, function (item) {
    //   selectedHourArray.forEach(selectedHour => {
    //     if (item.sorted) {
    //       return 1
    //     } else if (item.hourlyFee >= selectedHour.startValue && item.hourlyFee <= selectedHour.endValue) {
    //       item['sorted'] = true;
    //       return 1
    //     } else {
    //       item['sorted'] = false;
    //       return resultArray.length;
    //     }
    //   });
    // });

  }

  processLocationAvailArray(checkBoxValue) {
    if (!_.some(this.filterArray, { 'locationAvail': checkBoxValue })) {
      this.filterArray.push({ 'locationAvail': checkBoxValue })
    } else {
      const index = this.filterArray.findIndex(e => e.locationAvail === checkBoxValue);
      if (index > -1) {
        this.filterArray.splice(index, 1);
      }
    }
    console.log(this.filterArray);
  }

  processHourArray(checkBoxValue) {
    if (!_.some(this.filterArray, { 'hour': checkBoxValue })) {
      this.filterArray.push({ 'hour': checkBoxValue })
    } else {
      const index = this.filterArray.findIndex(e => e.hour === checkBoxValue);
      if (index > -1) {
        this.filterArray.splice(index, 1);
      }
    }
    console.log(this.filterArray);
  }

  applyDB() {



  }

  filter(jsonForWhereClause) {
    const searchProfessionalSuccess = (result) => {
      this.dropdownOpenClose = false;
      if (result) {
        this.proViewList = [];
        this.profList = result;
        this.loadMore();
      }
    }
    const json = {
      'proSearchParams': JSON.stringify(jsonForWhereClause)
    }
    this.proService.searchProfessional(json, searchProfessionalSuccess)
  }



  clearAllFilter() {
    this.workAvailArray.forEach(e => { e.status = false; });
    this.locaionAvailArray.forEach(e => { e.status = false; });
    this.hourArray.forEach(e => { e.status = false; });
    this.fullTimeArray.forEach(e => { e.status = false; });
    this.filter(this.jsonParameters);
  }
}









