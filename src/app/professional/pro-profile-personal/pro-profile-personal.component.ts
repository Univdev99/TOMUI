import { Component, OnInit, ViewChild, Input } from '@angular/core';
import { elementRest } from '../../common/element/elementRest';
import { constants } from '../../app.constants';
import { allPath } from '../../allPath';
import { FormControl } from '@angular/forms';
import { ProProfile } from '../pro-beans';
import { ProService } from '../pro.service';
import { NavigationService } from '../../common/navigation.service';
import { LocalStorageService } from '../../common/local-storage.service';
import { DocumentUpload } from '../../common/element/file-upload/documentupload';
import { City, Province } from '../../firm/firm-beans';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-pro-profile-personal',
  templateUrl: './pro-profile-personal.component.html',
  styleUrls: ['./pro-profile-personal.component.css']
})
export class ProProfilePersonalComponent implements OnInit {

  @ViewChild('proPersonalForm', { static: false }) proPersonalForm: FormControl;
  elementRest = elementRest;
  submitted = false;
  appConstant = constants;
  pathList = allPath;
  proProfile = new ProProfile();

  documentUpload: DocumentUpload;
  profileDocId;
  @Input() componentsAsModal = false;

  constructor(private proService: ProService,
    private navigationService: NavigationService,
    private localStorageService: LocalStorageService,
    private ngbActiveModal: NgbActiveModal

  ) { }

  documentUploadEvent(event) {
    this.profileDocId = event;
  }

  ngOnInit() {
    this.documentUpload = new DocumentUpload('Professional', 'ProfilePic', null);
    const proProfileId = this.localStorageService.getValue(this.appConstant.proProfileId);
    if (proProfileId) { // set from firm-sign-up
      const json = {
        'proProfileId': proProfileId
      };
      this.proService.proPersonalProfileGet(json, this.proPersonalProfileGetSuccess)
    }
  }

  proPersonalProfileGetSuccess = (result) => {
    if (result) {
      this.proProfile = result;
      if (this.proProfile.city) {
        this.proProfile.cityNgModel = { 'label': this.proProfile.city.cityName, 'value': this.proProfile.city.cityId };
      } else {
        this.proProfile.city = new City();
      }
      if (this.proProfile.province) {
        this.proProfile.provinceNgModel = { 'label': this.proProfile.province.provinceName, 'value': this.proProfile.province.provinceId };
      } else {
        this.proProfile.province = new Province();
      }
    }
  }

  savePrpPesonalProfille() {
    this.submitted = true;
    if (this.proPersonalForm.valid) {

      this.proProfile.city.cityId = this.proProfile.cityNgModel;
      this.proProfile.province.provinceId = this.proProfile.provinceNgModel;
      const json = {
        'proPersonalProfile': this.proProfile,
        'documentId': this.profileDocId
      }
      this.proService.createProPersonalProfile(json, this.personalProfileSaveSuccess)
    }
  }

  personalProfileSaveSuccess = (result) => {
    if (result) {
      if (this.componentsAsModal) {
        this.ngbActiveModal.close();
      } else {
        this.navigationService.navigateToState(this.pathList.CLIENT_URL.proWorkExperience);
      }
    }
  }

  onSelectFile(data) {
    if (data) {
      let reader = new FileReader();
      reader.readAsDataURL(data.target.files[0]); // read file as data url
      reader.onload = (e) => { // called once readAsDataURL is completed
        this.proProfile.picBase64 = reader.result;
      }
    }
  }

  public delete() {
    this.proProfile.picBase64 = null;
  }
}

