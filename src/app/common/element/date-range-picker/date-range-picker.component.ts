import { Component, OnInit, forwardRef, EventEmitter, Output, Input } from '@angular/core';
import { NG_VALUE_ACCESSOR, ControlValueAccessor } from '@angular/forms';
import * as moment from "moment";
import { constants } from "../../../app.constants";

const noop = () => { };

export const COMMON_DateRange_CONTROL_VALUE_ACCESSOR: any = {
  provide: NG_VALUE_ACCESSOR,
  useExisting: forwardRef(() => DateRangePickerComponent),
  multi: true
};

@Component({
  selector: 'app-date-range-picker',
  templateUrl: './date-range-picker.component.html',
  styleUrls: ['./date-range-picker.component.css'],
  providers: [COMMON_DateRange_CONTROL_VALUE_ACCESSOR]
})
export class DateRangePickerComponent implements OnInit, ControlValueAccessor {

  appConstant = constants;
  dateRangeNgModel;
  selectedValueDate: Date;
  @Input() inLine = false;

  @Output() selectedEvent = new EventEmitter();

  innerValue = '';
  private onChangeCallback: (_: any) => void = noop;
  private onTouchedCallback: () => void = noop;
  constructor() { }

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
    if (value && typeof value === this.appConstant.string) {
      this.dateRangeNgModel = this.setParentNgModel(value); // set value from native control to parent control 
      //  this.dateRangeNgModel = new Date(value).toISOString(); // set value from native control to parent control 
    }
  }

  registerOnChange(fn: any): void {
    this.onChangeCallback = fn;
  }

  registerOnTouched(fn: any): void {
    this.onTouchedCallback = fn;
  }

  ngOnInit() {
  }


  selectDateRange(event) {
    if (event) {
      this.selectedValueDate = event;
      this.selectedEvent.emit(this.selectedValueDate);
      if (this.dateRangeNgModel.length && this.dateRangeNgModel.length === 2 && this.dateRangeNgModel[0] && this.dateRangeNgModel[1]) {
        this.value = this.setNgModelForChildComponent();
      } else {
        this.value = null;
      }
    }
  }

  setNgModelForChildComponent(): string {
    let convertedStringArray = [];
    this.dateRangeNgModel.forEach(selectedDate => {
      convertedStringArray.push(moment(selectedDate).format(this.appConstant.sqlFormate));
    });
    return convertedStringArray.join('^^^');
  }

  setParentNgModel(string: string): any[] {
    if (string) {
      let convertedArray = [];
      let splitedArray = string.split(this.appConstant.dateSeprator);
      splitedArray.forEach(stringDate => {
        convertedArray.push(new Date(stringDate));
      });
      return convertedArray;
    } else {
      return null;
    }

  }
}
