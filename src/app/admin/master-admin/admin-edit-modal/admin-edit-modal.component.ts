import { Component, OnInit, ViewChild, Input } from '@angular/core';
import { AdminSignUp } from '../admin-signup';
import { NgbActiveModal } from '../../../../../node_modules/@ng-bootstrap/ng-bootstrap';
import { AdminService } from '../../admin.service';
import { FormControl } from '../../../../../node_modules/@angular/forms';

@Component({
  selector: 'app-admin-edit-modal',
  templateUrl: './admin-edit-modal.component.html',
  styleUrls: ['./admin-edit-modal.component.css']
})
export class AdminEditModalComponent implements OnInit {

  submitted = false;
  @ViewChild('adminSignupEditForm', { static: false }) adminSignupEditForm: FormControl;
  @Input() adminSignup = new AdminSignUp();

  constructor(
    private ngbActiveModal: NgbActiveModal,
    private adminService: AdminService
  ) { }

  ngOnInit() {
  }


  saveAdmin() {
    this.submitted = true;
    if (this.adminSignupEditForm.valid) {
      const json = {
        'adminSignup': this.adminSignup
      }
      this.adminService.addAdmin(json, this.adminSaveSuccess)
    }
  }

  adminSaveSuccess = (result) => {
    if (result) {
      this.ngbActiveModal.close();
    }
  }

}
