
import { fromEvent as observableFromEvent } from 'rxjs';
import { Directive, ElementRef, Input, AfterViewInit, OnDestroy, OnChanges, SimpleChange, SimpleChanges } from '@angular/core';
import { DatePipe } from '@angular/common';
import { NgControl } from '@angular/forms';
import { CustomDate } from '../pipe/custom-date.pipe';
import { ProviderAst } from '@angular/compiler';
/**
 * Validate control on valuechange and on blue event
 * Also append validation message to control
 * @export
 * @class ValidateElementDirective
 * @implements {AfterViewInit}
 */
@Directive({
  selector: '[appValidateElement]'
})
export class ValidateElementDirective implements AfterViewInit, OnDestroy, OnChanges {
  fromUTC = 'fromUTC';
  toUTC = 'toUTC';
  blurEvent;
  submitEvent;
  @Input() set appValidateElement(value) {
    if (value) {
      this.validate(true);
    }
  }
  /**
   * error message which will appended to control
   * @memberOf ValidateElementDirective
   */
  formErrors = '';
  /**
   * input property for minlength validation,
   * default value taken 4
   * @memberOf ValidateElementDirective
   */
  @Input('minlength') minlength = 4;
  /**
   * input property for minlength validation,
   * default value taken 4
   * @memberOf ValidateElementDirective
   */
  @Input('maxlength') maxlength = 100;
  /**
   * input property for range validationo
   * @memberOf ValidateElementDirective
   */
  @Input('range') range = [];
  /**
   * for number, digit valdation added functionality
   * to allow pass fieldname for showing in validation message
   * @memberOf ValidateElementDirective
   */
  @Input('fieldName') fieldName;
  /**
 * pattern eror message, because for pattern must pass the validation mesage as [pattenErrror]
 * @memberOf ValidateElementDirective
 */
  @Input('validationMessage') validationMessage;
  // contain list of validation messages
  @Input() cminDate;
  @Input() cmaxDate;
  @Input() minDate;
  @Input() maxDate;
  @Input() minMonth;
  @Input() maxMonth;
  validationMessages;
  @Input() dynamicMes;
  constructor(private elementRef: ElementRef,
    private datePipe: DatePipe, private ngControl: NgControl, private customDate: CustomDate) {
    /**
     * Initially add one div hidden
     */
    elementRef.nativeElement.insertAdjacentHTML('afterend', '<p class="hidden mandateerror"></p>');
  }

  ngOnChanges(changes: SimpleChanges) {
    for (const key in changes) {
      if ((changes['minDate'] && typeof this.minDate !== 'string') || (changes['maxDate'] && typeof this.maxDate !== 'string') || (changes['minMonth'] && typeof this.minMonth !== 'string') || (changes['maxMonth'] && typeof this.maxMonth !== 'string')) {
        this[key] = changes[key].currentValue;
        this.validate();
      }
    }
  }

  /**
   * (submitted and invalid) then lookout
   * for erros object in control.
   * ->For each error get validation message and add to @formErrors.
   * -> Then check if any validation message then insert message to validation div
   * -> If no validation message then empty it, make validation div hidden.
   * @memberOf ValidateElementDirective
   */
  validate(submitted?) {
    this.formErrors = '';
    const control = this.ngControl;
    if (!this.validationMessages) {
      this.setValidationMessages();
    }
    const messages = this.validationMessages;
    if (control && (((control.dirty || control.touched) && !control.valid) || (!control.valid && submitted))) {
      for (const key in control.errors) {
        if (control.errors.hasOwnProperty(key)) {
          this.formErrors += messages[key]() + ' ';
        }
      }
    }
    if (this.formErrors) {
      this.elementRef.nativeElement.nextSibling.textContent = this.formErrors;
      if (this.elementRef.nativeElement.nextSibling.className.indexOf('hidden') > -1) {
        this.elementRef.nativeElement.nextSibling.classList.toggle('hidden');
      }
    } else {
      if (this.elementRef.nativeElement.nextSibling.className.indexOf('hidden') === -1) {
        this.elementRef.nativeElement.nextSibling.classList.toggle('hidden');
      }
      this.elementRef.nativeElement.nextSibling.textContent = '';
    }
  }

  /**
   * Subscribe to value change event and blur event and on event check for validations
   * @memberOf ValidateElementDirective
   */
  ngAfterViewInit() {
    if (!this.dynamicMes) {
      this.dynamicMes = 'Must be minimum ' + this.minlength + ' characters long.';
    }
    this.ngControl.valueChanges.subscribe((event) => {
      this.validate();
    });
    this.setValidationMessages();

    const nativeElement = this.elementRef.nativeElement.querySelector('input') || this.elementRef.nativeElement.querySelector('select') ||
      this.elementRef.nativeElement.querySelector('textarea') || this.elementRef.nativeElement;
    this.blurEvent = observableFromEvent(nativeElement, 'blur').subscribe(() => {
      this.validate(true);
    });
  }
  setValidationMessages() {
    this.validationMessages = {
      'required': () => (this.validationMessage && this.validationMessage.required) || 'Required',
      //'minlength': () => (this.validationMessage && this.validationMessage.minlength) || `Must be minimum ${this.minlength} characters long.`,
      'minlength': () => (this.validationMessage && this.validationMessage.minlength) || this.dynamicMes,
      'maxlength': () => (this.validationMessage && this.validationMessage.maxlength) || `Maximum ${this.maxlength} characters are allowed.`,
      'email': () => (this.validationMessage && this.validationMessage.email) || 'Invalid email address',
      'pattern': () => (this.validationMessage && this.validationMessage.pattern) || 'Invalid pattern',
      'range': () => (this.validationMessage && this.validationMessage.range) ||
        `Input must be between number ${this.range[0]} to ${this.range[1]}`,
      'number': () => (this.validationMessage && this.validationMessage.number) || `Invalid ${this.fieldName || 'numbers'},
                only numberic or decimal allowed`,
      'digits': () => (this.validationMessage && this.validationMessage.digits) || `Invalid ${this.fieldName || 'digits'}, only numeric allowed`,
      'equalTo': () => (this.validationMessage && this.validationMessage.equalTo) || `${this.fieldName} doesn't match`,
      'minDate': () => (this.validationMessage && this.validationMessage.minormDate) ||
        `Must be > or = ${this.fieldName || this.datePipe.transform(this.cminDate || this.minDate, 'MM/dd/yyyy')} `,
      'maxDate': () => (this.validationMessage && this.validationMessage.maxDate) ||
        `Must be < or = ${this.fieldName || this.datePipe.transform(this.cmaxDate || this.maxDate, 'MM/dd/yyyy')} `,
      'minMonth': () => (this.validationMessage && this.validationMessage.minMonth) ||
        `Input month must be greater than ${this.fieldName || this.datePipe.transform(new Date(this.customDate.transform(this.minMonth, this.fromUTC)), 'MM-yyyy')} `,
      'maxMonth': () => (this.validationMessage && this.validationMessage.maxMonth) ||
        `Must be < or = ${this.fieldName || this.datePipe.transform(
          new Date(this.customDate.transform(this.maxMonth, this.fromUTC)), 'MM-yyyy')} `,
      'selectRequired': () => (this.validationMessage && this.validationMessage.selectRequired) || 'Required',
      'dateRange': () => (this.validationMessage && this.validationMessage.dateRange) || 'Must be less than end date',
      'invalidDate': () => (this.validationMessage && this.validationMessage.invalidDate) || 'Invalid date',
      'date': () => (this.validationMessage && this.validationMessage.date) || 'Invalid date',
      'invalid': () => (this.validationMessage && this.validationMessage.invalid) || 'Invalid',
      'npi': () => 'Invalid npi'
    };
  }
  ngOnDestroy() {
    if (this.blurEvent) {
      this.blurEvent.unsubscribe();
    }
  }
}
