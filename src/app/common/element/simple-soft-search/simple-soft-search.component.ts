import { Component, OnInit, Input, forwardRef, Output, EventEmitter } from '@angular/core';
import { constants } from "../../../app.constants";
import { allPath } from "../../../allPath";
import { NG_VALUE_ACCESSOR, ControlValueAccessor } from '@angular/forms';
import { ElementService } from '../element.service';


/**
 * Callback function which is provided to placeholders of Control Value Accesssor
 */
const noop = () => { };

/**
 * Common Element Component-Control Value Accessor Object which is provided as provider in the component
 */
export const COMMON_ELEMENT_CONTROL_VALUE_ACCESSOR: any = {
  provide: NG_VALUE_ACCESSOR,
  useExisting: forwardRef(() => SimpleSoftSearchComponent),
  multi: true
};

@Component({
  selector: 'app-simple-soft-search',
  templateUrl: './simple-soft-search.component.html',
  providers: [COMMON_ELEMENT_CONTROL_VALUE_ACCESSOR]
})

export class SimpleSoftSearchComponent implements OnInit, ControlValueAccessor {

  appConstant = constants;
  items = [];

  @Input() required = false;
  @Input() disabled = false
  @Input() minLength = this.appConstant.minLengthCount;
  @Input() placeholder = '';

  // Input variable for defining which attibute of common element component is updating dynamically, pass the name of attribute as string in this input parameter
  @Input() reloadable;

  // Getter setter for input variable 'options'
  _options;
  get options() {
    return this._options;
  }
  /**
   * Input variable for options which are used statically or locally, not coming from REST call
   */
  @Input('options')
  set options(value) {
    this._options = value;
    /**
     * If reloadable parameter is set with 'options'(as string, not with value of 'options'),
     * then this block will get executed
     */
    if (this.reloadable === this.appConstant.options) {
      this.callOnRequest(this.dataUrl, this.subType, this.whereClause, this.options);
    }
  }

  _subType;
  get subType() {
    return this._subType;
  }
  /**
   * Input variable for subtype of data if anyone don't want all values coming in REST service response
   */
  @Input('subType')
  set subType(value) {
    this._subType = value;
    /**
     * If reloadable parameter is set with 'subType'(as string, not with value of 'subType'),
     * then this block will get executed
     */
    if (this.reloadable === this.appConstant.subType) {
      this.callOnRequest(this.dataUrl, this.subType, this.whereClause, this.options);
    }
  }

  // Getter setter for input variable 'whereClause'
  _whereClause;
  get whereClause() {
    return this._whereClause;
  }
  /**
   * Input variable for whereClause that is used in REST call of static of softsearch element
   */
  @Input('whereClause')
  set whereClause(value) {
    this._whereClause = value;
    /**
     * If reloadable parameter is set with 'whereClause'(as string, not with value of 'whereClause'),
     * then this block will get executed
     */
    if (this.reloadable === this.appConstant.whereClause) {
      this.callOnRequest(this.dataUrl, this.subType, this.whereClause, this.options);

    }
  }

  // Input Variable declarations
  // Getter setter for input variable 'dataUrl'
  _dataUrl;
  get dataUrl() {
    return this._dataUrl;
  }
  /**
   * Input variable for REST service url from which data will be fetched
   */
  @Input('dataUrl')
  set dataUrl(value) {
    this._dataUrl = value;
    /**
     * If reloadable parameter is set with 'dataUrl'(as string, not with value of 'dataUrl'),
     * then this block will get executed
     */
    if (this.reloadable === 'dataUrl') {
      this.callOnRequest(this.dataUrl, this.subType, this.whereClause, this.options);
    }
  }

  simpleSoftsearchValue;
  selectedValue = [];
  @Input() returnType = null; // if it is null the value will pass to native controll as label,value
  // Input variable for tags type of functionality, implemented in or binded with softsearch controls within this common element component
  @Input() chips;
  @Output() selectedEvent = new EventEmitter();
  @Output() removedEvent = new EventEmitter();


  private onChangeCallback: (_: any) => void = noop;
  private onTouchedCallback: () => void = noop;
  // The internal data model
  private innerValue: any = '';

  constructor(
    private elementService: ElementService
  ) { }

  registerOnChange(fn: any): void {
    this.onChangeCallback = fn;
  }

  registerOnTouched(fn: any): void {
    this.onTouchedCallback = fn;
  }

  ngOnInit() {
    this.callOnRequest(this.dataUrl, this.subType, this.whereClause, this.options);
  }

  onSimpleSoftsearchNgModelChange(event) {
    // if (this.simpleSoftsearchValue && this.simpleSoftsearchValue.length <= this.minLength) {
    if (!this.simpleSoftsearchValue) {
      this.value = null;
    } else {
      if (this.chips && typeof this.simpleSoftsearchValue == 'string') {
        const obj = { label: this.simpleSoftsearchValue, value: this.simpleSoftsearchValue };
        this.writeValue(obj);
        // Emitting select event of simpleSoftsearch control
        this.selectedEvent.emit(obj);
      } else {

        this.value = this.simpleSoftsearchValue;
      }
    }
    // }c
  }

  callOnRequest(dataUrl, subType, whereClause, options) {
    if (this.dataUrl) {
      // static element object passed in the payload of REST call
      const staticElementObj = {
        'componentName': this.dataUrl,
      };
      // REST call for commonElementDataUrl: 'component/select/static' with the desired parameters
      this.elementService.getSoftSearchData(staticElementObj, this.getElementDataSuccess);
    }
  }

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

  // Set touched on blur
  onBlur() {
    this.onTouchedCallback();
  }

  // From ControlValueAccessor interface
  writeValue(value: any) {
    if (value) {
      this.simpleSoftsearchValue = value;
      if (this.returnType === this.appConstant.string) {
        this.value = value.value; // set only valu in child component
      } else if (this.returnType === this.appConstant.object) {
        this.value = value; // set only valu in child component
      }
    } else {
      this.simpleSoftsearchValue = null;
      this.value = null;
    }

  }

  /**
   * Function for unselect event of primeng p-autoComplete (simpleSoftsearch)
   * @param event
   */
  onUnselect(event) {
    // Emitting unselect event of simpleSoftsearch control
    this.removedEvent.emit(event);
  }

  /**
    * Success Callback function for commonElementDataUrl: 'component/select/static'
    */
  getElementDataSuccess = (result, headers) => {
    // Assigned result to the items, as items will be holding the options generated for common element controls
    if (result && result.length) {
      this.items = result;
      this.writeValue(this.value);
    } else {
      this.simpleSoftsearchValue = null;
    }
    // Get Result Data
  }

  /**
  * Function for soft search to get data using REST service based on text written in input box
  * @param event
  */
  filterData(event: any): void {
    this.value = event.query;
    this.getSoftsearchData(event.query);
  }

  getSoftsearchData(text) {
    /**
     * Success Callback function for commonSoftsearchDataUrl: 'component/select/soft_search'
     */
    const getSoftsearchDataSuccess = (result, headers) => {
      // Set result to items after getting data from REST service
      if (result && result.length) {
        this.items = result;
      } else if (this.chips) {
        this.items = [{ label: text, value: text }];
        this.onBlurEvent('');
      } else {
        this.simpleSoftsearchValue = null;
        this.value = null;
      }
    };

    // Softsearch object passed in the payload of REST call
    const softSearchObj = {
      'componentName': this.dataUrl,
      'subType': this.subType,
      'staticWhereClause': this.whereClause,
      'searchParam': text
    };
    /*AA if (text) {
      text = CommonFuntions.trimStr(text);
    } */
    if (text) {
      this.elementService.getSoftSearchData(softSearchObj, getSoftsearchDataSuccess);
    }
    // REST call for commonSoftsearchDataUrl: 'component/select/soft_search' with the desired parameters

  }


  onSelect(event) {
    if (this.returnType === this.appConstant.string) { // only value will pass to native control
      this.value = event.value;
    } else {
      this.value = event;
    }
    // Emitting select event of simpleSoftsearch control
    this.selectedEvent.emit(event);
  }

  /**
   * Function for blur event of primeng p-autoComplete (simpleSoftsearch)
   * @param event
   */
  onBlurEvent(event) {
    console.log(this.simpleSoftsearchValue);

    // Emitting blur event of simpleSoftsearch control
    if (this.chips && typeof this.simpleSoftsearchValue == 'object') {
      const obj = { label: this.simpleSoftsearchValue.label, value: this.simpleSoftsearchValue.value };
      this.writeValue(obj);
      // Emitting select event of simpleSoftsearch control
      this.selectedEvent.emit(obj);
    } else if ((typeof this.simpleSoftsearchValue !== 'object' || this.simpleSoftsearchValue === null)) {
      this.simpleSoftsearchValue = null;
      this.value = null;
    }
  }

}

