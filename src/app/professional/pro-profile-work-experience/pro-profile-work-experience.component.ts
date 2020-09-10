import * as _ from "lodash";
import { Component, OnInit, ViewChild, Input } from '@angular/core';
import { FormControl } from '@angular/forms';
import { elementRest } from '../../common/element/elementRest';
import { allPath } from '../../allPath';
import { ProService } from '../pro.service';
import { NavigationService } from '../../common/navigation.service';
import { LocalStorageService } from '../../common/local-storage.service';
import { constants } from '../../app.constants';
import { ProEducation, ProSoftwareKnowledge, ProSkill } from '../pro-beans';
import { NgbActiveModal, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { DocumentUpload } from '../../common/element/file-upload/documentupload';
import { ProWorkExperienceDetail } from '../ProWorkExperienceDetail';
import { ProWorkExperience } from '../ProWorkExperience';
import { CommonFunctions } from '../../common/CommonFuctions';
import { ProProfileViewComponent } from '../../common/common-page/pro-profile-view/pro-profile-view.component';
import { NotificationService } from 'src/app/notification/notification.service';
import { Notification } from '../../notification/notification';

@Component({
  selector: 'app-pro-profile-work-experience',
  templateUrl: './pro-profile-work-experience.component.html',
  styleUrls: ['./pro-profile-work-experience.component.css']
})
export class ProProfileWorkExperienceComponent implements OnInit {

  @ViewChild('proWorkExpForm', { static: false }) proWorkExpForm: FormControl;
  proProfileId = null;
  elementRest = elementRest;
  submitted = false;
  appConstant = constants;
  pathList = allPath;
  @Input() componentsAsModal = false;
  proWorkExp = new ProWorkExperience();
  editMode = false;

  yearArray = CommonFunctions.getYear();
  posArray = [{ 'label': 'Select', 'value': 'select' }, { 'label': 'Juniour Accountant', 'value': 'Juniour Accountant' },
  { 'label': 'Intermediate Accountant', 'value': 'Intermediate Accountant' },
  { 'label': 'Senior Accountant', 'value': 'Senior Accountant' }
  ];

  firmTypeArray = [{ 'label': 'Select Category', 'value': 'select' }, { 'label': 'International Accounting Firm', 'value': 'InternationalAccountingFirm' },
  { 'label': 'National Accounting Firm', 'value': 'National Accounting Firm' },
  { 'label': 'Other', 'value': 'Other' }
  ];

  companyArray = [{ 'label': 'Select Company', 'value': 'select' }, { 'label': 'Deloitte', 'value': 'Deloitte' },
  { 'label': 'PWC', 'value': 'PWC' },
  { 'label': 'EY', 'value': 'EY' }
  ];

  knowledgeMaster = new Array<ProSoftwareKnowledge>();
  knowledgeMasterArray = [
    { 'status': false, 'otherArray': [], 'label': 'Caseware', 'value': 'Caseware' },
    { 'status': false, 'otherArray': [], 'label': 'QuickBooks Online', 'value': 'QuickBooks Online' },
    { 'status': false, 'otherArray': [], 'label': 'Caseview', 'value': 'Caseview' },
    { 'status': false, 'otherArray': [], 'label': 'Simply', 'value': 'Simply' },
    { 'status': false, 'otherArray': [], 'label': 'Taxprep', 'value': 'Taxprep' },
    { 'status': false, 'otherArray': [], 'label': 'Xero', 'value': 'Xero' },
    { 'status': false, 'otherArray': [], 'label': 'Profile', 'value': 'Profile' },
    { 'status': false, 'otherArray': [], 'label': 'QuickBooks', 'value': 'QuickBooks' },
    { 'status': false, 'otherArray': [], 'label': 'Other', 'value': 'Other' },
  ];

  abc = [{ 'label': 'On-Site Mandatory', 'value': 'On-Site Mandatory' },
  { 'label': 'Flexible', 'value': 'Flexible' },
  { 'label': 'Remote', 'value': 'Remote' }]

  treeViewData;
  skillArray = [];
  selectedProSkill = []
  documentUpload = new DocumentUpload('Professional', 'ProWorkExperience', null);
  documentIdsArray = [];

  constructor(private proService: ProService,
    private navigationService: NavigationService,
    private ngbModal: NgbModal,
    private ngbActiveModal: NgbActiveModal,
    private localStorageService: LocalStorageService,
    private notificationService: NotificationService) { }

  ngOnInit() {
    this.proProfileId = this.localStorageService.getValue(this.appConstant.proProfileId);
    if (this.proProfileId) {
      this.gettreeViewData(this.proProfileId);
      this.proWorkExp.professionalProfileId = this.proProfileId;
      const json = {
        'proProfileId': this.proProfileId
      };
      this.proService.proWorkExpProfileGet(json, this.proWorkExpGetSuccess)
    }
  }

  proWorkExpGetSuccess = (result) => {
    if (result) {
      this.editMode = true;
      this.proWorkExp = result;
      this.documentUpload = new DocumentUpload('Professional', 'ProWorkExperience', this.proWorkExp.proWorkExperienceId);
      if (!this.proWorkExp.workExperienceDetail.length) {
        this.proWorkExp.workExperienceDetail = [new ProWorkExperienceDetail()];
      }
      if (!this.proWorkExp.proEducation.length) {
        this.proWorkExp.proEducation = [new ProEducation()];
      }
      if (this.proWorkExp.proKnowledge && this.proWorkExp.proKnowledge.length) {
        this.setProKnowledgeInEditMode();
      }
      if (this.proWorkExp.proSkill.length) {
        for (const savedSkill of this.proWorkExp.proSkill) {
          for (const masterSkill of this.skillArray) {
            if (savedSkill.proSkillMasterId === masterSkill.key) {
              masterSkill.selected = true;
              for (const categoryMasterSkill of masterSkill.children) {
                if (savedSkill.proSkillCategoryId === categoryMasterSkill.key) {
                  categoryMasterSkill.selected = true;
                  for (const detailMasterSkill of categoryMasterSkill.children) {
                    if (savedSkill.proSkillDetailId === detailMasterSkill.key) {
                      detailMasterSkill.selected = true;
                    }
                  }
                }
              }
            }
          }
        }
      }
    }
  }

  saveWorkExpProfile() {
    this.submitted = true;
    if (this.proWorkExpForm.valid) {
      if (this.selectedProSkill.length) {
        this.proWorkExp.proSkill = [];
        for (let i = 0; i < this.selectedProSkill.length; i++) {
          const x = new ProSkill();
          x.proSkillMasterId = this.selectedProSkill[i].proSkillMasterId;
          x.proSkillCategoryId = this.selectedProSkill[i].proSkillCategoryId;
          x.proSkillDetailId = this.selectedProSkill[i].proSkillDetailId;
          this.proWorkExp.proSkill.push(x);
        }
      } else {
        this.proWorkExp.proSkill = [];
      }

      this.proWorkExp.proKnowledge = [];
      this.proWorkExp.proKnowledge = this.setProExpKnowledgeData();
      const json = {
        'proWorkExperience': this.proWorkExp,
        'documentIdsArray': this.documentIdsArray
      }
      this.proService.proWorkExpProfileSave(json, this.proWorkExpSaveSuccess)
    }
  }

  setProExpKnowledgeData() {
    let tempArray = [];
    for (let kmi = 0; kmi < this.knowledgeMasterArray.length; kmi++) {
      if (this.knowledgeMasterArray[kmi].status) {
        const x = new ProSoftwareKnowledge();
        x.knowledge = this.knowledgeMasterArray[kmi].value;
        if (this.knowledgeMasterArray[kmi].value === 'Other') {
          for (let i = 0; i < this.knowledgeMasterArray[kmi].otherArray.length; i++) {
            x['otherValue' + (i + 1)] = this.knowledgeMasterArray[kmi].otherArray[i]['otherValue'];
          }
        }
        tempArray.push(x);
      }
    }
    return tempArray;
  }

  setProSkillDataForViewForProfile() {

  }

  proWorkExpSaveSuccess = (result) => {
    if (result) {
      if (this.componentsAsModal) {
        this.ngbActiveModal.close();
      } else {
        this.proWorkExp.proWorkExperienceId = null;
        if (!this.proWorkExp.proWorkExperienceId) {
          this.setAndSetNotification()
        }
        this.localStorageService.clearLocalStorageObjects()
        this.navigationService.navigateToState(this.pathList.CLIENT_URL.proProfileComplete);
      }
    }
  }

  setAndSetNotification() {
    // notification code start
    if (this.localStorageService.getValue(this.appConstant.user)) {
      const fromUserId = this.localStorageService.getValue(this.appConstant.user)['userId'];
      const lastName = this.localStorageService.getValue(this.appConstant.user)['lastName'];
      const firstName = this.localStorageService.getValue(this.appConstant.user)['firstName'];
      const msg = 'Action Required! ' + lastName + ', ' + firstName +
        ' has completed a new profile. Review today!';

      const notification = new Notification();
      notification.notificationMessage = msg;
      notification.toUserId = null; // for Admin
      notification.fromUserId = fromUserId;

      const json = {
        'notificationList': [notification],
      };
      const successcallback = (result) => {
        // alert("notification send!!!");
      };
      this.notificationService.notificationSave(json, successcallback);
    }
    // notification code end
  }
  addWorkExpDetail() {
    this.proWorkExp.workExperienceDetail.push(new ProWorkExperienceDetail());
  }

  deleteWorkExpDetail(wexpIndex) {
    this.proWorkExp.workExperienceDetail.splice(wexpIndex, 1);
  }

  addEducation() {
    this.proWorkExp.proEducation.push(new ProEducation());
  }

  deleteEducation(educationIndex) {
    this.proWorkExp.proEducation.splice(educationIndex, 1);
  }

  treeItemsUpdated(data) {
    this.selectedProSkill = data.values;
    console.log(this.selectedProSkill);
  }


  onTreeItemChange(event) {
  }

  gettreeViewData(proProfileId) {
    const getTreeDataSuccess = (result, headers) => {
      if (result) {
        // this.editMode = true;
        this.skillArray = [];
        this.treeViewData = result;
        for (let i = 0; i < this.treeViewData.length; i++) {
          this.skillArray.push({
            'title': this.treeViewData[i].masterSkillName,
            'key': this.treeViewData[i].proSkillMasterId,
            'selected': false,
            'proSkillMasterId': this.treeViewData[i].proSkillMasterId,
            'masterSkillName': this.treeViewData[i].masterSkillName,
            'children': [],
          });
        }
        this.skillArray = _.uniqBy(this.skillArray, 'masterSkillName');
        for (let i = 0; i < this.skillArray.length; i++) {
          const masterSkillName = this.skillArray[i].masterSkillName;
          console.log(masterSkillName, '')
          this.skillArray[i].children = _.uniqBy(
            _.filter(this.treeViewData, function (e) { return e.categorySkillName && e.masterSkillName === masterSkillName })
              .map((e) => {
                return {
                  'title': e.categorySkillName,
                  'key': e.proSkillCategoryId,
                  'selected': false,
                  'children': [],
                  'masterSkillName': e.masterSkillName,
                  'proSkillMasterId': e.proSkillMasterId,
                  'categorySkillName': e.categorySkillName,
                  'proSkillCategoryId': e.proSkillCategoryId,
                  'detailSkillArray': []
                }
              }), 'proSkillCategoryId');
        }
        for (let i = 0; i < this.skillArray.length; i++) {
          for (let j = 0; j < this.skillArray[i].children.length; j++) {
            if (this.skillArray[i].children.length) {
              const categorySkillName = this.skillArray[i].children[j].categorySkillName;
              this.skillArray[i].children[j].children = _.uniqBy(
                _.filter(this.treeViewData, function (e) { return e.detailSkillName && e.masterSkillName && e.categorySkillName === categorySkillName })
                  .map((e) => {
                    return {
                      'title': e.detailSkillName,
                      'key': e.proSkillDetailId,
                      'selected': false,
                      'masterSkillName': e.masterSkillName,
                      'proSkillMasterId': e.proSkillMasterId,
                      'categorySkillName': e.categorySkillName,
                      'proSkillCategoryId': e.proSkillCategoryId,
                      'detailSkillName': e.detailSkillName,
                      'proSkillDetailId': e.proSkillDetailId,
                    }
                  }), 'proSkillDetailId');
            }
          }
        }
      }
    }
    const json = {
      'proProfileId': proProfileId
    }
    this.proService.getProSkillTreeData(json, getTreeDataSuccess);
  }


  uploadedDocumentList(documentList) {
    this.documentIdsArray = documentList.map(e => e.documentId);
  }

  proKnowledgeSelected(event) {
    console.log(event);
  }

  changeProKnowledge(ngModal, value, i) {
    if (value === 'Other') {
      this.knowledgeMasterArray[i].otherArray = [{ 'otherValue': null }];
    }
  }

  setProKnowledgeInEditMode() {
    this.proWorkExp.proKnowledge.forEach(k => {
      const index = this.knowledgeMasterArray.findIndex(e => e.value === k.knowledge);
      if (index > -1) {
        this.knowledgeMasterArray[index].status = true;
        if (k.knowledge === 'Other') {
          this.knowledgeMasterArray[index].otherArray = [];
          if (k.otherValue1) {
            this.knowledgeMasterArray[index].otherArray.push({ 'otherValue': k.otherValue1 })
          }
          if (k.otherValue2) {
            this.knowledgeMasterArray[index].otherArray.push({ 'otherValue': k.otherValue2 })
          }
          if (k.otherValue3) {
            this.knowledgeMasterArray[index].otherArray.push({ 'otherValue': k.otherValue3 })
          }
          if (k.otherValue4) {
            this.knowledgeMasterArray[index].otherArray.push({ 'otherValue': k.otherValue4 })
          }
          if (k.otherValue5) {
            this.knowledgeMasterArray[index].otherArray.push({ 'otherValue': k.otherValue5 })
          }
        }
      }
    });
  }

  openFullProfile(argFrom) {
    let proWorkExperience = this.proWorkExp;
    proWorkExperience.proKnowledge = this.setProExpKnowledgeData();
    const modalRef = this.ngbModal.open(ProProfileViewComponent);
    if (argFrom === this.appConstant.preview) {
      modalRef.componentInstance.isSampleProfile = false;
    }
    modalRef.componentInstance.skillArray = this.selectedProSkill;
    modalRef.componentInstance.proProfileId = this.proProfileId
    modalRef.componentInstance.argFrom = this.appConstant.fromProfessional;
    modalRef.componentInstance.proWorkExp = proWorkExperience;
  }

  setSkillArrayForProView() {
    // if()
  }
}
