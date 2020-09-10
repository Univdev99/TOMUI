import { Component, OnInit, Input } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { CreateProjectComponent } from '../../project/create-project/create-project.component';
import { ProService } from '../../professional/pro.service';
import { constants } from '../../app.constants';
import { LocalStorageService } from '../../common/local-storage.service';
import { ProjectService } from '../../project/project.service';

@Component({
  selector: 'app-connect-with-pro',
  templateUrl: './connect-with-pro.component.html',
  styleUrls: ['./connect-with-pro.component.css']
})
export class ConnectWithProComponent implements OnInit {
  userId;
  appConstant = constants;
  projectList = [];
  todayDate = new Date();
  constructor(
    private ngbModal: NgbModal,
    private localStorageService: LocalStorageService,
    private projectService: ProjectService,
    private proService: ProService
  ) { }

  ngOnInit() {
    this.userId = this.localStorageService.getValue(this.appConstant.user).userId;
    if (this.userId && this.proService.proProfileId) {
      const json = {
        'userId': this.userId,
        'proProfileId': this.proService.proProfileId
      }
      this.projectService.getLastSavedTopProject(json, this.projectGetsuccess)
    }
  }

  projectGetsuccess = (result) => {
    if (result) {
      this.projectList = result;
    }
  }

  openCreateProjectModal() {
    this.ngbModal.open(CreateProjectComponent);
  }

  openProjectInEditMode(project) {
    const modalRef = this.ngbModal.open(CreateProjectComponent);
    modalRef.componentInstance.editMode = true;
    modalRef.componentInstance.projectData = project;
  }

}
