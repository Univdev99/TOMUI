import { Component, OnInit } from '@angular/core';
import { ElementService } from '../../element/element.service';
import { NgbActiveModal } from '../../../../../node_modules/@ng-bootstrap/ng-bootstrap';
import { Review } from './review';
import { constants } from '../../../app.constants';
import { LocalStorageService } from '../../local-storage.service';
import { Notification } from '../../../notification/notification';
import { NotificationService } from '../../../notification/notification.service';

@Component({
  selector: 'app-review',
  templateUrl: './review.component.html',
  styleUrls: ['./review.component.css']
})
export class ReviewComponent implements OnInit {

  reviewId = null;
  review = new Review();
  appConstant = constants;
  argFrom = this.appConstant.firm;
  projectId = null;
  firmProfileId = null;
  proProfileId = null;
  projectData;

  currentProjectRating = 0;
  reviewCount = 0;
  averageRating = 0;

  /* Admin can view only */
  firmReadOnly = false;
  proReadOnly = false;
  /* Admin can view only */


  constructor(
    private elementService: ElementService,
    private notificationService: NotificationService,
    private ngbActiveModal: NgbActiveModal,
    private localStorageService: LocalStorageService,
  ) { }

  ngOnInit() {
    if (this.argFrom === this.appConstant.firm) {
      this.review.reviewFor = this.appConstant.professional;
      this.review.firmProfileId = this.localStorageService.getValue(this.appConstant.firmProfileId);
      this.review.proProfileId = this.proProfileId;
      this.review.projectId = this.projectId;
    } else {
      if (this.argFrom === this.appConstant.professional) {
        this.review.reviewFor = this.appConstant.firm;
        this.review.proProfileId = this.localStorageService.getValue(this.appConstant.proProfileId);
        this.review.firmProfileId = this.firmProfileId;
        this.review.projectId = this.projectId;
      }
    }
  }

  setRating(rating) {
    if (rating) {
      this.review.rating = rating;
    }
  }

  saveReview() {
    if (this.currentProjectRating) {
      this.review.reviewId = this.reviewId;
      const json = {
        'review': this.review
      }
      this.elementService.saveReview(json, this.reviewSaveSuccess);
    }
  }

  reviewSaveSuccess = (result) => {
    if (result) {
      this.setAndSaveNotification();
      const json = {
        'latestRating': this.review.rating,
        'reviewId': result.reviewId
      }
      this.ngbActiveModal.close(json)
    }
  }

  hello(json) {
    // alert(JSON.stringify(json))
  }


  setAndSaveNotification() {
    // notification code start
    let firmOrProProfileId = null;
    let notMsg = "";
    if(this.review.reviewFor === this.appConstant.firm) {
      firmOrProProfileId = this.review.proProfileId; 
      notMsg = this.projectData.businessName;
    } else if(this.review.reviewFor === this.appConstant.professional) {
      firmOrProProfileId = this.review.firmProfileId; 
      notMsg = this.projectData.proName;
    }

    const msgForAdmin = "A review for "+notMsg+"  has been added. Relationships are Top of Mind. Review today!";
    const notForAdmin = new Notification();
    notForAdmin.fromUserId = firmOrProProfileId;
    notForAdmin.notificationMessage = msgForAdmin;
    notForAdmin.toUserId = null; // for Admin
    notForAdmin.notificationFor = this.appConstant.admin; // for Admin
    const json = {
      'notificationList': [notForAdmin],
    };
    const successcallback = (result) => {
      // alert("notification send!!!");
    };
    this.notificationService.notificationSave(json, successcallback);
    // notification code end
  }
}
