import { Component, OnInit, Input } from '@angular/core';
import { NgbModal, NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { ConnectWithProComponent } from '../../../firm/connect-with-pro/connect-with-pro.component';
import { ProService } from '../../../professional/pro.service';
import { ProProfile, ProWorkAvailability } from '../../../professional/pro-beans';
import { ProWorkExperience } from '../../../professional/ProWorkExperience';
import { constants } from '../../../app.constants';

@Component({
  selector: 'app-pro-profile-view',
  templateUrl: './pro-profile-view.component.html',
  styleUrls: ['./pro-profile-view.component.css']
})

export class ProProfileViewComponent implements OnInit {
  @Input() isSampleProfile = true;
  @Input() argFrom = '';
  @Input() proProfileId = null; // if pro  need to see profile 
  appConstant = constants;
  proPersonal = new ProProfile();
  proWorkAvail = new ProWorkAvailability();
  @Input() proWorkExp = new ProWorkExperience();
  @Input() skillArray = [];

  constructor(private ngbActiveModal: NgbActiveModal,
    private ngbModal: NgbModal,
    private proService: ProService
  ) { }

  ngOnInit() {
    if (!this.isSampleProfile && (this.proService.proProfileId || this.proProfileId)) {
      const professionalId = this.proService.proProfileId ? this.proService.proProfileId : this.proProfileId;
      const json = {
        'proProfileId': professionalId
      }
      this.proService.getWholeProfile(json, this.getWholeProfileSuccess);
    }
  }

  getWholeProfileSuccess = (result) => {
    if (result) {
      console.log(result);
      if (result.proPersonalProfile) {
        this.proPersonal = result.proPersonalProfile
      }
      if (result.proWorkAvailability) {
        this.proWorkAvail = result.proWorkAvailability
      }
      if (this.argFrom === this.appConstant.fromFirm) {
        if (result.proWorkExperience) {
          this.proWorkExp = result.proWorkExperience
        }
        if (result.proSkills) {
          this.skillArray = result.proSkills;
        }
      }
    }
  }

  closeProViewModel() {
    this.ngbActiveModal.close();
  }

  openProjectModal() {
    const modalRef = this.ngbModal.open(ConnectWithProComponent);
  }
}