import { Component, OnInit, ViewChild } from '@angular/core';
import { AdminSignUp } from './admin-signup';
import { FormControl } from '../../../../node_modules/@angular/forms';
import { AdminService } from '../admin.service';
import { NgbModal } from '../../../../node_modules/@ng-bootstrap/ng-bootstrap';
import { AdminEditModalComponent } from './admin-edit-modal/admin-edit-modal.component';
import { AdminProfit } from './admin-profit';
import { ChangePasswordComponent } from 'src/app/change-password/change-password.component';

@Component({
  selector: 'app-master-admin',
  templateUrl: './master-admin.component.html',
  styleUrls: ['./master-admin.component.css']
})
export class MasterAdminComponent implements OnInit {

  adminSignup = new AdminSignUp();
  submitted = false;
  @ViewChild('adminSignupForm', { static: false }) adminSignupForm: FormControl;
  adminList = [];

  adminProfitSubmitted = false;
  adminProfit = new AdminProfit();
  constructor(
    private adminService: AdminService,
    private ngbModal: NgbModal
  ) { }

  ngOnInit() {
    this.getAdminProfit();
    this.getAdminList();
  }

  saveAdmin() {
    this.submitted = true;
    if (this.adminSignupForm.valid) {
      const json = {
        'adminSignup': this.adminSignup
      }
      this.adminService.addAdmin(json, this.adminSaveSuccess)
    }
  }

  adminSaveSuccess = (result) => {
    if (result) {
      this.submitted = false;
      this.adminList.push({
        'firstName': this.adminSignup.firstName,
        'workEmail': this.adminSignup.workEmail
      });
      this.adminSignupForm.reset();
      this.adminSignup = new AdminSignUp();
    }
  }

  getAdminList() {
    this.adminService.getAdminList('', this.adminGetSuccess)
  }

  getAdminProfit() {
    this.adminService.getAdminProfit('', this.getAdminProfitSuccess)
  }

  getAdminProfitSuccess = (result) => {
    if (result) {
      this.adminProfit.profit = result.profit;
    }
  }

  adminGetSuccess = (result) => {
    if (result) {
      this.adminList = result;
    }
  }

  openModalAndEditModal(adminData) {
    const modalRef = this.ngbModal.open(ChangePasswordComponent);
    modalRef.componentInstance.userId = adminData.userId;
  }


  saveAdminProfit(form) {
    this.adminProfitSubmitted = true;
    if (form.valid) {
      const json = {
        'adminProfit': this.adminProfit
      }
      this.adminService.saveAdminProfit(json, this.adminProfitSuccess)
    }
  }

  adminProfitSuccess = (result) => {
    if (result) {
      this.adminProfitSubmitted = false;
      this.adminProfit.profit = result.profit;
    }
  }
}
