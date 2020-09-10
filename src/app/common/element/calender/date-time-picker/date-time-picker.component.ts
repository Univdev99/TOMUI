import { Component, OnInit, Input, forwardRef, ViewChild, AfterViewInit, Injector } from '@angular/core';
import { NgbTimeStruct, NgbDateStruct, NgbPopoverConfig, NgbPopover, NgbDatepicker, NgbDateParserFormatter } from '@ng-bootstrap/ng-bootstrap';
import { NG_VALUE_ACCESSOR, ControlValueAccessor, NgControl } from '@angular/forms';
import { DatePipe } from '@angular/common';
import { DateTimeModel } from './date-time.model';
import { noop } from 'rxjs';
import * as moment from "moment";
@Component({
  selector: 'app-date-time-picker',
  templateUrl: './date-time-picker.component.html',
  styleUrls: ['./date-time-picker.component.css'],
  providers: [
    DatePipe,
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => DateTimePickerComponent),
      multi: true
    }
  ]
})
export class DateTimePickerComponent implements ControlValueAccessor, OnInit, AfterViewInit {

  @Input() dateString;
  @Input() placeholder = ''
  @Input() placement = 'bottom-left';
  @Input() required = false;
  @Input() inputDatetimeFormat = 'MMMM d, y H:mm a';
  @Input() hourStep = 1;
  @Input() minuteStep = 1;
  @Input() secondStep = 1;
  @Input() seconds = false;

  @Input() disabled = false;
  @Input() minDate;

  @Input() navigation = 'arrow';

  private datetime: DateTimeModel = new DateTimeModel();
  private firstTimeAssign = true;

  private onTouched: () => void = noop;
  private onChange: (_: any) => void = noop;

  constructor(private config: NgbPopoverConfig,
    private ngbDateParserFormatter: NgbDateParserFormatter,
    private inj: Injector) {
    config.autoClose = 'outside';
    config.placement = 'auto';
  }

  ngOnInit(): void {
    if (this.minDate) {
      const current = new Date(this.minDate);
      this.minDate = {
        year: current.getFullYear(),
        month: current.getMonth() + 1,
        day: current.getDate()
      };
    }
  }

  ngAfterViewInit(): void {
  }

  writeValue(newModel: string) {
    if (newModel) {
      this.datetime = Object.assign(this.datetime, DateTimeModel.fromLocalString(newModel));
      this.dateString = newModel;
      this.setDateStringModel();
    } else {
      this.datetime = new DateTimeModel();
    }
  }

  registerOnChange(fn: any): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: any): void {
    this.onTouched = fn;
  }

  onInputChange($event: any) {
    const value = $event.target.value;
    const dt = DateTimeModel.fromLocalString(value);
    if (dt) {
      this.datetime = dt;
      this.setDateStringModel();
    } else if (value.trim() === '') {
      this.datetime = new DateTimeModel();
      this.dateString = '';
      this.onChange(this.dateString);
    } else {
      this.onChange(value);
    }
  }

  onDateChange($event) {
    if ($event.year) {
      $event = `${$event.year}-${$event.month}-${$event.day}`
    }
    this.datetime = DateTimeModel.fromLocalString($event);
    this.setDateStringModel();
  }

  onTimeChange(event: NgbTimeStruct) {
    this.datetime.hour = event.hour;
    this.datetime.minute = event.minute;
    this.datetime.second = event.second;
    this.setDateStringModel();
  }

  setDateStringModel() {
    this.dateString = this.datetime.toString();
    if (!this.firstTimeAssign) {
      this.onChange(this.dateString);
    } else {
      // Skip very first assignment to null done by Angular
      if (this.dateString !== null) {
        this.firstTimeAssign = false;
      }
    }
  }

  inputBlur($event) {
    this.onTouched();
  }
  setParentNgModelDate(date): NgbDateStruct {
    var startDate = new Date(date);
    let startYear = startDate.getFullYear().toString();
    let startMonth = startDate.getMonth() + 1;
    let startDay = startDate.getDate();
    return this.ngbDateParserFormatter.parse(startYear + "-" + startMonth.toString() + "-" + startDay);
  }

  setDateForDB(date) {
    let x = new Date(date);
    x.setSeconds(0);
    x.setMilliseconds(0)
    if (Math.sign(x.getTimezoneOffset()) >= 0) {
      this.dateString = x.getTime() - (x.getTimezoneOffset() * 60 * 1000);
    } else {
      this.dateString = x.getTime() + Math.abs(x.getTimezoneOffset() * 60 * 1000);
    }
  }
}
