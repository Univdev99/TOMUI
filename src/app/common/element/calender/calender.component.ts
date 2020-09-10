import { Component, OnInit, forwardRef, EventEmitter, Output, Input } from '@angular/core';
import { NG_VALUE_ACCESSOR, ControlValueAccessor } from '@angular/forms';
import * as moment from "moment";
import { constants } from "../../../app.constants";
import { NgbDateParserFormatter, NgbDateStruct } from '@ng-bootstrap/ng-bootstrap';
/**
 * Callback function which is provided to placeholders of Control Value Accesssor
 */
const noop = () => { };
/**
 * Common Element Component-Control Value Accessor Object which is provided as provider in the component
 */
export const COMMON_CALENDER_CONTROL_VALUE_ACCESSOR: any = {
  provide: NG_VALUE_ACCESSOR,
  useExisting: forwardRef(() => CalenderComponent),
  multi: true
};


@Component({
  selector: 'app-calender',
  templateUrl: './calender.component.html',
  styles: [`
    select.custom-select {
      margin: 0.5rem 0.5rem 0 0;
      width: auto;
    }
  `],
  styleUrls: ['./calender.component.css'],
  providers: [COMMON_CALENDER_CONTROL_VALUE_ACCESSOR]
})

export class CalenderComponent implements OnInit, ControlValueAccessor {

  appConstant = constants;
  // dateNgModel;
  dateNgModel: NgbDateStruct;
  selectedValueDate: Date;
  @Input() dateFormate = 'mm/dd/yy';
  @Input() selectionMode = 'date';
  @Input() inLine = false;
  @Input() disabled = false;
  @Input() placeholder = ''
  @Input() minDate;
  @Output() selectedEvent = new EventEmitter();

  innerValue = '';
  private onChangeCallback: (_: any) => void = noop;
  private onTouchedCallback: () => void = noop;
  constructor(
    private ngbDateParserFormatter: NgbDateParserFormatter,
  ) { }

  // get accessor
  get value(): any {
    return this.innerValue;
  };

  // set accessor including call the onchange callback
  set value(v: any) {
    if (v !== this.innerValue) {
      this.innerValue = v;
      this.onChangeCallback(v);
    }
  }

  writeValue(value: any): void {
    if (value) {
      //AA this.dateNgModel = new Date(value); // set value from native control to parent control 
      this.dateNgModel = this.setParentNgModelDate(value);
      this.value = moment(value).format(this.appConstant.sqlFormate);
    }
  }

  registerOnChange(fn: any): void {
    this.onChangeCallback = fn;
  }

  registerOnTouched(fn: any): void {
    this.onTouchedCallback = fn;
  }

  ngOnInit() {
    if (this.minDate) {
      const current = new Date(this.minDate);
      this.minDate = {
        year: current.getFullYear(),
        month: current.getMonth() + 1,
        day: current.getDate()
      };
    }
  }


  selectDate(event) {
    if (event) {
      // this.selectedValueDate = new Date(event).getTime();
      this.selectedValueDate = event;
      this.selectedEvent.emit(this.selectedValueDate);
      this.value = moment(event).format(this.appConstant.sqlFormate);
    }
  }

  selectBootstrapDate(evt) {
    if (evt) {
      this.selectedValueDate = new Date(evt.year, evt.month - 1, evt.day);
      this.selectedEvent.emit(this.selectedValueDate);
      this.value = moment(this.selectedValueDate).format(this.appConstant.sqlFormate);
    }
  }

  setParentNgModelDate(date): NgbDateStruct {
    var startDate = new Date(date);
    let startYear = startDate.getFullYear().toString();
    let startMonth = startDate.getMonth() + 1;
    let startDay = startDate.getDate();
    return this.ngbDateParserFormatter.parse(startYear + "-" + startMonth.toString() + "-" + startDay);
  }
}
