import { Component, OnInit, ViewChild } from '@angular/core';
import { FormControl } from '@angular/forms';
import { FirmProfile, City, Province } from '../firm-beans';
import { FirmService } from '../firm.service';
import { NavigationService } from '../../common/navigation.service';
import { LocalStorageService } from '../../common/local-storage.service';
import { constants } from '../../app.constants';
import { allPath } from '../../allPath';
import { elementRest } from "../../common/element/elementRest";
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { ElementService } from '../../common/element/element.service';

@Component({
  selector: 'app-firm-business-profile',
  templateUrl: './firm-business-profile.component.html',
  styleUrls: ['./firm-business-profile.component.css']
})

export class FirmBusinessProfileComponent implements OnInit {

  @ViewChild('firmBusinessProfileForm', { static: false }) firmBusinessProfileForm: FormControl;
  submitted = false;
  pathList = allPath;
  appConstant = constants;
  elementRest = elementRest;
  firmProfile = new FirmProfile();
  cityWhereClause = '1=2';
  billCityWhereClause = '1=2';
  /* for modal */
  componentsAsModal = false;
  /* for modal */

  provinceMasterData = [{ 'label': 'Enter Province', 'value': 'select' }];

  constructor(
    private elementService: ElementService,
    private firmService: FirmService,
    private navigationService: NavigationService,
    private activeModal: NgbActiveModal,
    private localStorageService: LocalStorageService,
  ) { }

  ngOnInit() {
    this.firmProfile.provinceId = "select";
    this.firmProfile.isAccountingFirm = true;
    this.firmProfile.isRegisteredFirm = true;
    this.getCommonData(this.elementRest.allProvince, this.appConstant.whereClause1_1);
    if (this.localStorageService.getValue(this.appConstant.firmProfileId)) { // set from firm-sign-up
      const json = {
        'firmProfileId': this.localStorageService.getValue(this.appConstant.firmProfileId)
      };
      this.firmService.getFirmProfile(json, this.firmProfileGetSuccess)
    }
  }

  setCityWhereClause(provinceId) {
    if (provinceId && provinceId !== "select") {
      this.firmProfile.city = null;
      this.cityWhereClause = ' provinceId = ' + provinceId;
      if (this.firmProfile.isBothAddressSame) {
        this.firmProfile.billCity = null;
        this.billCityWhereClause = ' provinceId = ' + provinceId;
      }
    }
  }

  citySeleceted(city) {
    if (city) {
      this.firmProfile.cityId = city.value;
      this.firmProfile.cityName = city.label;
    }
  }

  setBillCityWhereClause(billProvinceId) {
    if (billProvinceId && billProvinceId !== "select") {
      this.firmProfile.billCity = null;
      this.billCityWhereClause = ' provinceId = ' + billProvinceId;
    }
  }

  billCitySeleceted(billCity) {
    if (billCity) {
      this.firmProfile.billCityId = billCity.value;
      this.firmProfile.billCityName = billCity.label;
    }
  }

  firmProfileGetSuccess = (result) => {
    if (result) {
      this.firmProfile = result;
      if (this.firmProfile.cityId) {
        this.firmProfile.city = { 'label': this.firmProfile.cityName, 'value': this.firmProfile.cityId };
      }
      if (this.firmProfile.billCityId) {
        this.firmProfile.billCity = { 'label': this.firmProfile.billCityName, 'value': this.firmProfile.billCityId };
      }
      this.cityWhereClause = 'provinceId = ' + this.firmProfile.cityId;
      this.billCityWhereClause = ' provinceId = ' + this.firmProfile.billCityId;
    }
  }


  saveBusinessProfile() {
    this.submitted = true;
    const saveBusinessProfileSuccess = (result) => {
      if (result) {
        if (this.componentsAsModal) {
          this.activeModal.close();
        } else {
          this.navigationService.navigateToState(this.pathList.CLIENT_URL.firmPersonalProfile)
        }
      }
    }
    if (this.firmBusinessProfileForm.valid) {
      const json = {
        'firmProfile': this.firmProfile
      }
      this.firmService.saveFirmProfile(json, saveBusinessProfileSuccess)
    }
  }

  setBillAddress() {
    if (this.firmProfile.isBothAddressSame) {
      this.firmProfile.billStreetAddress = this.firmProfile.streetAddress;
      this.firmProfile.billProvinceId = this.firmProfile.provinceId;
      this.firmProfile.billZipcode = this.firmProfile.zipCode;
      this.firmProfile.billCity = this.firmProfile.city;
      this.firmProfile.billCityId = this.firmProfile.city.value;
      this.firmProfile.billCityName = this.firmProfile.city.label;
      this.billCityWhereClause = ' provinceId = ' + this.firmProfile.billProvinceId;
    }
  }

  clearBillAddress() {
    this.firmProfile.billStreetAddress = null;
    this.firmProfile.billProvinceId = "select";
    this.firmProfile.billZipcode = null;
    this.firmProfile.billCity = null;
  }

  getCommonData(componentName, whereClause) {
    const getElementDataSuccess = (result) => {
      if (result && result.length) {
        this.provinceMasterData = result;
        this.provinceMasterData.unshift({ 'label': 'Enter Province', 'value': 'select' });
      }
    }
    const staticElementObj = {
      'componentName': componentName,
      'staticWhereClause': whereClause
    };
    this.elementService.getElementData(staticElementObj, getElementDataSuccess);
  }
}


