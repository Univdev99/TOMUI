import { Component, OnInit } from '@angular/core';
import { NavigationService } from '../../common/navigation.service';
import { constants } from '../../app.constants';
import { allPath } from '../../allPath';
import { NgbActiveModal, NgbModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-project-sent-completed',
  templateUrl: './project-sent-completed.component.html',
  styleUrls: ['./project-sent-completed.component.css']
})
export class ProjectSentCompletedComponent implements OnInit {

  appCOnstant = constants;
  pathList = allPath;
  constructor(
    private navigationService: NavigationService,
    private ngbModal: NgbModal
  ) { }

  ngOnInit() {
  }

  naviateToOpenProject() {
    this.ngbModal.dismissAll();
    this.navigationService.navigateToState(this.pathList.CLIENT_URL.openProject);
  }

}
