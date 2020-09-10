import { EventEmitter, Component, OnInit, forwardRef, Input, Output } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import { ElementService } from '../element.service';
import { elementRest } from '../elementRest';
import { constants } from '../../../app.constants';

/**
 * Callback function which is provided to placeholders of Control Value Accesssor
 */
const noop = () => { };

/**
 * Common Element Component-Control Value Accessor Object which is provided as provider in the component
 */
export const COMMON_DROPDOWN_CONTROL_VALUE_ACCESSOR: any = {
  provide: NG_VALUE_ACCESSOR,
  useExisting: forwardRef(() => CommonDropdownComponent),
  multi: true
};

@Component({
  selector: 'app-common-dropdown',
  templateUrl: './common-dropdown.component.html',
  styleUrls: ['./common-dropdown.component.css'],
  providers: [COMMON_DROPDOWN_CONTROL_VALUE_ACCESSOR]
})

export class CommonDropdownComponent implements OnInit, ControlValueAccessor {
  elementRest = elementRest;
  appConstant = constants;
  items = [];
  @Input() idField = 'value';
  @Input() textField = 'label';
  // NOTE: 'active' attribute is used to preload values in ng2-select controls
  // (For more details refer: 'http://valor-software.com/ng2-select/')
  // Variable used in active attribute of ng2-select for select and multiSelect control in case of select & multiSelect
  selectedValue;
  // Flag for ng2-select controls if returnType parameter is passed as 'string'
  selectboxValueIsString = false;
  @Input() returnType;
  @Output() selectedEvent = new EventEmitter();

  @Input() placeholder = '';

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
  }

  _options;
  get options() {
    return this._options;
  }

  @Input('options')
  set options(value) {
    this._options = value;
  }

  @Input('yearDropDown') yearDropDown = false;

  private onChangeCallback: (_: any) => void = noop;
  private onTouchedCallback: () => void = noop;
  private innerValue: any = '';

  constructor(private elementService: ElementService) { }


  registerOnChange(fn: any): void {
    this.onChangeCallback = fn;
  }

  registerOnTouched(fn: any): void {
    this.onTouchedCallback = fn;
  }

  ngOnInit() {
    if (this.returnType === this.appConstant.string) {
      // For select and multi select control
      this.selectboxValueIsString = true;
    }
    this.callOnRequest(this.dataUrl, '', '', this.options);
  }


  /**
   * Function to set / generate / intialise / create the common element with the respective passed parameters
   * @param dataUrl
   * @param subType
   * @param whereClause
   * @param options
   */
  callOnRequest(dataUrl, subType, whereClause, options) {
    /**
     * Element will be created with either dataUrl parameter or with options parameter with respective options
     * If dataUrl is passed as parameter then it will store its option in local storage with proper key,
     * else options parameter is passed with the common element tag to create the options for common element
     */
    if (!this.options && this.dataUrl) {
      /**
       * If 'elementdata' property or the expected key in 'elementdata' object is not found
       * then REST call will fire to get the data from rest service
       */
      if (this.dataUrl.key) {
        // static element object passed in the payload of REST call
        const staticElementObj = {
          'componentName': this.dataUrl.key,
          'subType': '',
          'staticWhereClause': '1=1'
        };
        // REST call for commonElementDataUrl: 'component/select/static' with the desired parameters
        this.elementService.getElementData(staticElementObj, this.getElementDataSuccess);
      }
    } else if (this.yearDropDown) {
      const currentYear = new Date().getFullYear();
      let yearArray = [];
      for (let year = 1950; year <= currentYear; year++) {
        yearArray.push({ 'label': year.toString(), 'value': year });
      }
      this.items = yearArray;
    } else {
      /**
       * If dataUrl is not passed as parameter and options parameter is set with options data of element,
       * then options are directly passed to items which will create the options of element and this options will not be
       * stored in local storage
       */
      this.items = this.options;
      /**
       * Function call to set or write value in 'value' variable of control value accessor,
       * which is bind with ngModel variable of app-common-element tag used in some other component
       */
      this.writeValue(this.value);
    }
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
      this.selectedValue = null;
    }
    // Get Result Data
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

  // From ControlValueAccessor interface
  writeValue(value: any) {
    if (value !== this.innerValue) {
      this.innerValue = value;
      this.selectedValue = value;
    }
    if (this.items) {
      this.selectedValue = [];
      if (value) {
        for (let i = 0; i < this.items.length; i++) {
          if ((typeof value === this.appConstant.number || typeof value === this.appConstant.string) &&
            ((this.items[i][this.idField] === value) || (this.items[i][this.idField] + '') === value)) {
            if (!(this.returnType) || (this.returnType && this.returnType === this.appConstant.string)) {
              this.selectboxValueIsString = true;
            }
            this.selectedValue.push(this.items[i]);
          } else if (typeof value === this.appConstant.object) {
            this.selectedValue = value;
          }
        }
      } else {
        if (this.items.length === 1) {
          this.selectedValue.push(this.items[0]);
          this.value = this.selectedValue;
        }
      }
    }
  }

  refreshValue(value: any): void {
  }

  typed(value: any): void {
  }


  /**
   * Function for selected event of ng2-select controls (select, multiSelect, singleSelectSoftsearch, multiSelectSoftsearch)
   * @param value
   */
  selected(value: any): void {
    // Initialise blank array in 'value', if found null or undefined
    if (!this.value) {
      this.value = [];
    }
    // If common element is select element
    // If returnType parameter is passed as 'string'
    if (this.selectboxValueIsString) {
      this.value = value.value;
    } else {
      this.value = value;
      // for (const item of this.items) {
      //   if (item[this.idField] === value[this.idField]) {
      //     value = item;
      //     break;
      //   }
      // }
    }
    // If common element is multiSelectSoftsearch element
    // Emitting select event of ng2-select controls (select, multiSelect, singleSelectSoftsearch, multiSelectSoftsearch)
    this.selectedEvent.emit(value);
  }

  /**
  * Function for removed event of ng2-select controls (select, multiSelect, singleSelectSoftsearch, multiSelectSoftsearch)
  * @param value
  */
  removed(value: any): void {
  }

  onSelect(event) {
    this.value = event;
    // Emitting select event of simpleSoftsearch control
    this.selectedEvent.emit(event);
  }


}
