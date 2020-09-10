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
import { ElementService } from '../../common/element/element.service';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { DocumentUpload } from '../../common/element/file-upload/documentupload';
import { ProWorkExperienceDetail } from '../ProWorkExperienceDetail';
import { ProWorkExperience } from '../ProWorkExperience';
import { CommonFunctions } from '../../common/CommonFuctions';

@Component({
  selector: 'app-pro-profile-work-experience',
  templateUrl: './pro-profile-work-experience.component.html',
  styleUrls: ['./pro-profile-work-experience.component.css']
})
export class ProProfileWorkExperienceComponent implements OnInit {

  @ViewChild('proWorkExpForm', { static: false }) proWorkExpForm: FormControl;
  elementRest = elementRest;
  submitted = false;
  appConstant = constants;
  pathList = allPath;
  @Input() componentsAsModal = false;
  proWorkExp = new ProWorkExperience();

  yearArray = CommonFunctions.getYear();
  posArray = [{ 'label': 'Select', 'value': 'select' }, { 'label': 'Juniour Accountant', 'value': 'JuniourAccountant' },
  { 'label': 'Intermediate Accountant', 'value': 'IntermediateAccountant' },
  { 'label': 'Senior Accountant', 'value': 'SeniorAccountant' }
  ];

  firmTypeArray = [{ 'label': 'Select Category', 'value': 'select' }, { 'label': 'International Accounting Firm', 'value': 'InternationalAccountingFirm' },
  { 'label': 'National Accounting Firm', 'value': 'NationalAccountingFirm' },
  { 'label': 'Other', 'value': 'Other' }
  ];

  companyArray = [{ 'label': 'Select Company', 'value': 'select' }, { 'label': 'Deloitte', 'value': 'Deloitte' },
  { 'label': 'PWC', 'value': 'PWC' },
  { 'label': 'EY', 'value': 'EY' }
  ];

  abc = [{ 'label': 'On-Site Mandatory', 'value': 'On-Site Mandatory' },
  { 'label': 'Flexible', 'value': 'Flexible' },
  { 'label': 'Remote', 'value': 'Remote' }]

  treeViewData;
  skillArray = [];
  proSkillDetailIds = []
  documentUpload = new DocumentUpload('Professional', 'ProWorkExperience', null);
  documentList = [];
  knowledgeArray = [];

  constructor(private proService: ProService,
    private navigationService: NavigationService,
    private ngbActiveModal: NgbActiveModal,
    private localStorageService: LocalStorageService,
  ) { }

  ngOnInit() {
    const proProfileId = this.localStorageService.getValue(this.appConstant.proProfileId);
    if (proProfileId) {
      this.gettreeViewData(proProfileId);
      this.proWorkExp.professionalProfileId = proProfileId;
      const json = {
        'proProfileId': proProfileId
      };
      this.proService.proWorkExpProfileGet(json, this.proWorkExpGetSuccess)
    }
  }

  proWorkExpGetSuccess = (result) => {
    if (result) { 
      this.proWorkExp = result;
      if (!this.proWorkExp.workExperienceDetail.length) {
        this.proWorkExp.workExperienceDetail = [new ProWorkExperienceDetail()];
      }
      if (!this.proWorkExp.proEducation.length) {
        this.proWorkExp.proEducation = [new ProEducation()];
      }
      if (!this.proWorkExp.proStrength.length) {
        this.proWorkExp.proStrength = [new ProSkill()];
      }
      this.proWorkExp.workExperienceDetail.forEach(function (e) {
        delete e.proWorkExperienceDetailId;
      })
      this.proWorkExp.proEducation.forEach(function (e) {
        delete e.proEducationId;
      })
      this.proWorkExp.proStrength.forEach(function (e) {
        delete e.professionalStrengthId;
      })
      if (this.proWorkExp.proKnowledge && this.proWorkExp.proKnowledge.length) {
        this.knowledgeArray = this.proWorkExp.proKnowledge.map(e => e.knowledge);
      }
    }
  }

  saveWorkExpProfile() {
    this.submitted = true;
    if (this.proWorkExpForm.valid) {
      if (this.knowledgeArray.length) {
        this.proWorkExp.proKnowledge = [];
        for (const knowledge of this.knowledgeArray) {
          const x = new ProSoftwareKnowledge();
          x.knowledge = knowledge;
          this.proWorkExp.proKnowledge.push(x);
        }
      }
      const json = {
        'proWorkExperience': this.proWorkExp,
        'proSkillJSON': this.proSkillDetailIds
      }
      this.proService.proWorkExpProfileSave(json, this.proWorkExpSaveSuccess)
    }
  }

  proWorkExpSaveSuccess = (result) => {
    if (result) {
      if (this.componentsAsModal) {
        this.ngbActiveModal.close();
      } else {
        this.navigationService.navigateToState(this.pathList.CLIENT_URL.proProfileComplete);
      }
    }
  }

  addWorkExpDetail() {
    this.proWorkExp.workExperienceDetail.push(new ProWorkExperienceDetail());
  }

  addEducation() {
    this.proWorkExp.proEducation.push(new ProEducation());
  }

  treeItemsUpdated(data) {
    if (data.values.length) {
      this.proSkillDetailIds = data.values.map(function (e) { return e.key; });
    }
  }

  onTreeItemChange(event) {
  }

  gettreeViewData(proProfileId) {
    const getTreeDataSuccess = (result, headers) => {
      if (result) {
        this.skillArray = [];
        this.treeViewData = result;
        for (let i = 0; i < this.treeViewData.length; i++) {
          this.skillArray.push({
            'masterSkillName': this.treeViewData[i].masterSkillName,
            'categorySkillArray': [],
          });
        }
        this.skillArray = _.uniqBy(this.skillArray, 'masterSkillName');
        for (let i = 0; i < this.skillArray.length; i++) {
          const masterSkillName = this.skillArray[i].masterSkillName;
          console.log(masterSkillName, '')
          this.skillArray[i].categorySkillArray = _.uniqBy(
            _.filter(this.treeViewData, function (e) { return e.categorySkillName && e.masterSkillName === masterSkillName })
              .map((e) => {
                return {
                  'masterSkillName': e.masterSkillName,
                  'proSkillMasterId': e.proSkillMasterId,
                  'categorySkillName': e.categorySkillName,
                  'proSkillCategoryId': e.proSkillCategoryId,
                  'detailSkillArray': []
                }
              }), 'proSkillCategoryId');
          // this.skillArray[i].categorySkill = _.filter(this.treeViewData, function (e) { return e.categorySkillName && e.masterSkillName === masterSkillName });
          // this.skillArray[i].detailSkill = _.filter(this.treeViewData, function (e) { return e.detailSkillName && e.masterSkillName && e.categorySkillName });
        }
        for (let i = 0; i < this.skillArray.length; i++) {
          for (let j = 0; j < this.skillArray[i].categorySkillArray.length; j++) {
            const categorySkillName = this.skillArray[i].categorySkillArray[j].categorySkillName;
            this.skillArray[i].categorySkillArray[j].detailSkillArray = _.uniqBy(
              _.filter(this.treeViewData, function (e) { return e.detailSkillName && e.masterSkillName && e.categorySkillName === categorySkillName})
              .map((e) => {
              return {
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
        console.log(this.skillArray);

      }
    }
    const json = {
      'proProfileId': proProfileId
    }
    this.proService.getProSkillTreeData(json, getTreeDataSuccess);
  }


  uploadedDocumentList(documentList) {
    this.documentList = documentList
  }

  proKnowledgeSelected(event) {
    console.log(event);
  }
}
