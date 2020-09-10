import { Component, OnInit, ViewChild, Input } from '@angular/core';
import { FormControl } from '@angular/forms';
import { constants } from '../../app.constants';
import { allPath } from '../../allPath';
import { Project } from './project';
import { ProjectService } from '../project.service';
import { NgbActiveModal, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { DocumentUpload } from '../../common/element/file-upload/documentupload';
import { ProjectScheduleComponent } from '../project-schedule/project-schedule.component';
import { City } from '../../firm/firm-beans';

@Component({
  selector: 'app-create-project',
  templateUrl: './create-project.component.html',
  styleUrls: ['./create-project.component.css']
})
export class CreateProjectComponent implements OnInit {

  @Input() editMode = false;
  @Input() projectData = null;
  @ViewChild('projectForm', { static: false }) projectForm: FormControl;
  submitted = false;
  pathList = allPath;
  appConstant = constants;
  project = new Project();
  todayDate = new Date();
  workLocationArray = [{ label: 'Select', value: 'select' }, { 'label': 'On-Site Mandatory', 'value': 'On-Site Mandatory' },
  { 'label': 'Flexible', 'value': 'Flexible' },
  { 'label': 'Remote', 'value': 'Remote' }
  ];
  minDate = new Date();

  constructor(private projectService: ProjectService,
    private ngbmodal: NgbModal,
    private activeModal: NgbActiveModal) { }

  ngOnInit() {
    if (this.editMode) {
      this.project = this.projectData;
      this.project.city = new City();
      this.project.cityId = { 'label': this.projectData.cityName, 'value': this.projectData.cityId }
    }

  }

  getProjectSuccess = (result) => {
  }

  createProject() {
    this.submitted = true;
    if (this.projectForm.valid) {
      this.project.city.cityId = this.project.cityId.value;
      const json = {
        'project': this.project
      }
      this.projectService.createProject(json, this.projSaveSuccess);
    }
  }

  projSaveSuccess = (result) => {
    if (result) {
      this.activeModal.close();
      this.openProjectSchedule(result.projectId);
    }
  }

  openProjectSchedule(projectId) {
    if (projectId) {
      const modalRef = this.ngbmodal.open(ProjectScheduleComponent);
      modalRef.componentInstance.projectId = projectId;
    }
  }

}
