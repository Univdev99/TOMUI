import { Component, OnInit, ViewChild } from '@angular/core';
import { constants } from '../../app.constants';
import { ProjectService } from '../../project/project.service';
import { CalendarOptions, EventApi } from '@fullcalendar/angular'; // useful for typechecking
import * as moment from "moment";
import * as $ from "jquery";
import { allPath } from '../../allPath';
import { CalenderSchedule } from '../../common/element/calender-schedule';
import { FormControl } from '../../../../node_modules/@angular/forms';
import { ElementService } from '../../common/element/element.service';
import Tooltip from 'tooltip.js';
import { NgbModal } from '../../../../node_modules/@ng-bootstrap/ng-bootstrap';
import { ChangePasswordComponent } from '../../change-password/change-password.component';

@Component({
  selector: 'app-admin-dashboard',
  templateUrl: './admin-dashboard.component.html',
  styleUrls: ['./admin-dashboard.component.css']
})
export class AdminDashboardComponent implements OnInit {

  isShow = true;
  currentEvents: EventApi[] = [];
  calendarOptions: CalendarOptions = {
    initialView: 'dayGridMonth',
    eventClick: this.handleEventClick.bind(this),
    events: [],
    headerToolbar: {
      left: "prev",
      center: "title",
      right: "next"
    },

    eventColor: '#50babc',
    eventMouseEnter: this.mouseEnter.bind(this),
    eventMouseLeave: this.mouseeLeave.bind(this),

    eventsSet: this.handleEvents.bind(this)


  };

  appConstant = constants;
  nameList = [];
  proList = [];
  firmList = [];
  pathList = allPath;
  calenderSchedule = new CalenderSchedule();
  submitted = false;

  @ViewChild('calenderScheduleForm', { static: false }) calenderScheduleForm: FormControl;


  eventTitle = '';
  eventDate = '';
  eventTime = '';
  eventDescription = '';

  constructor(
    private projectService: ProjectService,
    private elementService: ElementService,
    private ngbModal: NgbModal,
  ) {

  }

  ngOnInit() {
    this.getDashBoardProject();
    this.getCalenderSchedule();
  }


  public getDashBoardProject() {
    const json = {
      'argFrom': this.appConstant.admin
    }
    this.projectService.getDashboardProjecct(json, this.dashboardGetSuccess)
  }


  dashboardGetSuccess = (result) => {
    if (result) {
      this.nameList = result;
      this.proList = this.nameList.filter(e => e.category === this.appConstant.professional);
      this.firmList = this.nameList.filter(e => e.category === this.appConstant.firm);
    }
  }

  handleDateClick(arg) {
    //  // alert('date click! ' + arg.dateStr)
  }

  handleEventClick(arg) {
    // $(".popupAmit").css({ left: arg.jsEvent.pageX });
    // $(".popupAmit").css({ top: arg.jsEvent.pageY });
    // $(".popupAmit").show();

  }

  mouseEnter(arg) {
    $(".popupAmit").css({ left: arg.jsEvent.pageX });
    $(".popupAmit").css({ top: arg.jsEvent.pageY });
    $(".popupAmit").show();
    this.eventTitle = arg.event._def.extendedProps.modalTitle;
    this.eventDate = arg.event._def.extendedProps.modalDate;
    this.eventTime = arg.event._def.extendedProps.modalTime;
    this.eventDescription = arg.event._def.extendedProps.modalDescription;
  }
  mouseeLeave(arg) {
    this.eventTitle = '';
    this.eventDate = '';
    this.eventTime = '';
    this.eventDescription = '';
    $(".popupAmit").hide();
  }

  saveCalenderSchedule() {
    this.submitted = true;
    if (this.calenderScheduleForm.valid) {
      this.calenderSchedule.argFrom = this.appConstant.admin;
      const json = {
        'calender': this.calenderSchedule
      }
      this.elementService.calenderSave(json, this.calenderSaveSuccess)
    }
  }

  calenderSaveSuccess = (result) => {
    if (result) {
      this.submitted = false;
      let tempArray;
      tempArray = this.calendarOptions.events;
      tempArray.push(
        {
          'title': this.calenderSchedule.eventTitle,
          'date': moment(this.calenderSchedule.eventDateTime).format('YYYY-MM-DD'),
          'modalTitle': this.calenderSchedule.eventTitle,
          'modalDate': moment(this.calenderSchedule.eventDateTime).format('ddd MMM DD, YYYY'),
          'modalTime': moment(this.calenderSchedule.eventDateTime).format('hh:mm A'),
          'modalDescription': this.calenderSchedule.description
        }
      )
      this.calendarOptions.events = [];
      this.isShow = !this.isShow;
      this.calendarOptions.events = tempArray;

      this.calenderSchedule.eventDateTime = null;
      this.calenderScheduleForm.reset();
      this.calenderSchedule = new CalenderSchedule();
    }
  }

  getCalenderSchedule() {
    const json = {
      'argFrom': this.appConstant.admin,
      'userId': null
    }
    this.elementService.calenderGet(json, this.calenderGetSuccess)
  }

  calenderGetSuccess = (result) => {
    if (result) {
      this.calendarOptions.events = result;
      // this.handleEvents();
    }
  }


  handleEvents(events: EventApi[]) {
    this.currentEvents = events;
  }

}
