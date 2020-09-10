
import { fromEvent as observableFromEvent } from 'rxjs';
import { Directive, ElementRef, HostListener, AfterViewInit, Input, Output, EventEmitter, ViewChild, OnDestroy } from '@angular/core';
import { Observable, Subscription } from 'rxjs';
import * as $ from "jquery";

@Directive({
  selector: '[appRestrictInput]'
})
export class RestrictInputDirective implements AfterViewInit, OnDestroy {
  countOfSpace = 1;
  private focusoutSubscription: Subscription;
  private keypressSubscription: Subscription;
  private regexMap = {
    restrictFirstSpace: '^[a-zA-Z][\sa-zA-Z]*',
    numeric: '^[0-9]*$',
    positiveNumber: '^[1-9][0-9]*$', // do not allow zero as a first digit
    decimal: '^[-+]?\\d+(\\.\\d+)?$',
    alpha: '^[a-zA-Z]*$',
    singleSpace: '',
    numericAlphaWithSpace: '[a-zA-Z0-9][a-zA-Z0-9\\s]*$',
    alphaWithSpace: '^[a-zA-Z][a-zA-Z\\s]*$', // To allow alphabetic characters with space but not space as first character
    alphaNumeric: '^[a-zA-Z0-9]*$',
    alphaNumericWithQuote: '^([a-zA-Z0-9\'])*$',
    alphaNumericWithSpace: '^[A-Za-z][A-Za-z0-9\\s]*$', // Alphanumeric with space and not allowing numeric at first place
    alphaNumericWithSpace1: '^[A-Za-z][A-Za-z0-9 ]*$',
    decimalWithpositiveNumber: '[1-9\.\ ][0-9\.\ ]', // do not allow zero as a first digit
    alphaWithoutLeadingSpace: '[a-zA-Z0-9][a-zA-Z0-9\s,\'\/&\#\-]*', // Do not allow leading spaces
    alphaWithoutLeadingSingleSpace: '[a-zA-Z0-9][a-zA-Z0-9\s,\'\/&\#\-]*', // Do not allow leading spaces
    alphaNumericSpacialCharacterWithSpace: '^[A-Za-z0-9][A-Za-z0-9!@#$%^&*¤¶§!#$%&()*+,-./:;<=>?@«»¦±„…†‡ˆ–—˜›×÷¿¬{|}~^`_\'-\/\\s]*$', // Alphanumeric with space and not allowing spacial char. or space at first place ^[A-Za-z0-9][A-Za-z0-9!@#$%^&*,.<>?:;{})(\'-\/\\s]*$
    alphaNumericWithSpaceOrSpecificSpacialCharacter: '^[A-Za-z0-9][A-Za-z0-9!@#$%^&*()*+,-./:;<=>?@^›|}~^_\'-\/\\s\r\n\\"]\[*$', // Alphanumeric with space and not allowing Specific spacial char. or space at first.
    positiveNumberWithDecimal: '^([0-9]\.\d+)|([1-9]\d*\.?\d*)$',
    alphaNumericWithSpaceDotCommaDash: '^[A-Za-z0-9][A-Za-z0-9,\.-\\s]*$',
    alphaNumericWithSpaceDotCommaDashRoundBracket: '^[A-Za-z0-9,()\.-\\s]*$', //[A-Za-z0-9]
    alphaNumericWithSpaceForwardAndBackwardAmpDash: '^[a-zA-Z][a-zA-Z0-9\-\&\/\s]*$',
    alphaNumericWithSingleSpaceBetweenWords: '^[a-zA-Z0-9][a-zA-Z\0-9\-\&\/\\\\\s\.\,]*$', // Single space between words and special charcters like -,/,\,&
    alphaWithSingleSpaceWithoutSpecialCharacter: '^[a-zA-Z][a-zA-Z\\s]*$',
    alphaNumericWithSingleSpaceWithSomeSpecialCharacter: '^[a-zA-Z][a-zA-Z0-9\@\_\\s\-]*$',
    alphaNumericWithSingleSpaceWithoutSpecialCharacter: '^[a-zA-Z0-9\\s]*$',
    alphaNumericWithSingleSpaceWithSpecialCharacter: '^[a-zA-Z0-9.,\'\/\&\-\\s]*$',
    alphaNumericWithSingleSpaceWithDeshDotColonUnderscoreAnd: '^[a-zA-Z0-9][a-zA-Z0-9&\\s\-\.\_\,]*$',
    alphaWithSingleSpaceWithDesh: '^[a-zA-Z][a-zA-Z\\s\-]*$',
    forName: '^[a-zA-Z][a-zA-Z0-9-.&,\'\/\\\\\\s]*$',
    forAddress: '^[a-zA-Z0-9][a-zA-Z0-9-&\/\\\\\\s]*$',
    alphaNumericSpacialCharacterWithoutSpace: '^[A-Za-z0-9][A-Za-z0-9!@#$%^&*¤¶§!#$%&()*+,-./:;<=>?@«»¦±„…†‡ˆ–—˜›×÷¿¬{|}~^`_\'-\/\]*$',
    alphaNumericWithoutSpaceAndSpacialCharacter: '^[a-zA-Z0-9]*$',
    wcbAuthorizationCode: '^[A-Za-z0-9][A-Za-z0-9!@#$%^&()+,-./;<=>?@^›{|}~^_\'-\/\\s\r\n\\"]*$',
    alphaNumericWithoutAstrikAndColon: '^[A-Za-z0-9\\]\\[][A-Za-z0-9!@#$%^&()+,-./;:<=>?@^›{|}\\]\\[~^_\/\\\s\r\n\\"]*$',
    alphaNumericWithAstrikAndColon: '^[A-Za-z0-9\\]\\[][A-Za-z0-9!@#$%^&()+,\'-./;:<=>?@^›|}\\]\\[~^_\/\\\s\r\n\\"]*$',
    freeTextRegex: '[A-Za-z0-9!@\#$%^&*()*+,-.\/:;\<=\>?@\^›{|}~^_\'-\/\ \r\n\\&quot;\[\]]*$',
    forURL: '^[a-zA-Z0-9][a-zA-Z0-9/\.\]*$',
    alphaNumericSpclChar: '^[A-Za-z][A-Za-z0-9\\s!@#$%^&*¤¶§!#$%&()*+,-./:;<=>?@«»¦±„…†‡ˆ–—˜›×÷¿¬{|}~^`_\'-\/\]*$', // Alphanumeric with space and special characters and not allowing numeric at first place
    alphaNumericWithCommaDash: '^[A-Za-z0-9][A-Za-z0-9,-]*$',
    decimalWithPostitiveNumber: '^[+]?([1-9]+(?:[\.][0-9]*)?|\.[0-9]+)$'
  };
  @Input('appRestrictInput') appRestrictInput: string;
  @Input('appRestrictParam') appRestrictParam: string;
  @Input('appRestrictDecimal') appRestrictDecimal = 'optional';
  @Input('appRestrictDecimalMin') appRestrictDecimalMin = 0;
  @Input('blockChars') blockChars: Array<any>;
  @Input() ngModel;
  @Output() ngModelChange = new EventEmitter();
  constructor(private elementRef: ElementRef) { }


  ngAfterViewInit() {
    const nativeElement = this.elementRef.nativeElement;
    this.focusoutSubscription = observableFromEvent(nativeElement, 'focusout').subscribe((event: EventTarget) => {

      if (this.ngModel) {
        if (this.appRestrictInput === 'decimal') {
          if (!(/^\d+(\.\d{1,2})?$/.test(this.ngModel))) {
            if (this.appRestrictParam === 'softSearch') {
              this.ngModelChange.emit([]);
            } else {
              this.ngModelChange.emit('');
            }

          }
        }
      }
    });

    this.keypressSubscription = observableFromEvent(nativeElement, 'keypress').subscribe((event: any) => {
      const currentPostion = this.elementRef.nativeElement.selectionStart;
      const regEx = new RegExp(this.regexMap[this.appRestrictInput]);
      const inputChar = String.fromCharCode(event.keyCode);
      if (this.appRestrictDecimal === 'mandatory' && event.target.value.length.toString() === this.appRestrictDecimalMin) {
        event.target.value = event.target.value + '.';
      }
      let val = event.target.value + inputChar;
      // this is becasue if in keypress . will not allow for decimal so i added .0 as value for test
      if (inputChar === '.' && this.appRestrictInput === 'decimal') {
        val = val + '0';
      }
      if (this.appRestrictInput === 'restrictFirstSpace' || this.appRestrictInput === 'alphaNumericWithSingleSpaceBetweenWords' || this.appRestrictInput === 'alphaNumericWithSingleSpaceWithSomeSpecialCharacter' || this.appRestrictInput === 'alphaNumericWithSpaceOrSpecificSpacialCharacter'
        || this.appRestrictInput === 'alphaWithSingleSpaceWithoutSpecialCharacter' || this.appRestrictInput === 'forName'
        || this.appRestrictInput === 'forAddress' || this.appRestrictInput === 'alphaNumericWithSingleSpaceWithoutSpecialCharacter'
        || this.appRestrictInput === 'alphaNumericWithSingleSpaceWithSpecialCharacter'
        || this.appRestrictInput === 'alphaWithoutLeadingSingleSpace' || this.appRestrictInput === 'alphaNumericSpacialCharacterWithSpace'
        || this.appRestrictInput === 'numeric' || this.appRestrictInput === 'forURL' || this.appRestrictInput === 'alphaNumericWithCommaDash' || this.appRestrictInput === 'Days365') {
        let value = $(event.currentTarget).val().toString();

        if (event.keyCode === 32) {
          if (value && currentPostion && value.charAt(currentPostion) !== " " && value.charAt(currentPostion) !== " " && value.charAt(currentPostion - 1) !== " " && value.charAt(currentPostion + 1) !== " ") {
            return;
          } else {
            event.preventDefault();
          }
        }
        if (event.keyCode === 13 && currentPostion === 0) {
          event.preventDefault();
        }
      }
      if (this.appRestrictInput === 'alphaWithoutLeadingSpace' && inputChar === ' ' && event.target.selectionStart === 0) {
        event.preventDefault();
      }
      if (this.appRestrictInput === 'policyFormat') {
        if (!(event.keyCode === 35 || event.keyCode === 94 || event.keyCode === 42 || event.keyCode === 124)) {
          event.preventDefault();
        }
      }
      if (this.appRestrictInput === 'wcbAuthorizationCode' && (event.keyCode === 42 || event.keyCode === 58)) {
        event.preventDefault();
      }
      if (this.blockChars && this.blockChars.length > 0) {
        if (this.blockChars.indexOf(inputChar) > -1) {
          event.preventDefault();
        }
      }
      if (this.appRestrictInput === 'positiveNumber') {
        if (event.keyCode === 48 && currentPostion === 0) {
          event.preventDefault();
        }
      }
      if (regEx.test(val)) {
        return;
      } else {
        event.preventDefault();
      }
      if (event.keyCode !== 8 && !regEx.test(val)) {
        event.preventDefault();
      }



    });

    this.keypressSubscription = observableFromEvent(nativeElement, 'keyup').subscribe((event: any) => {
      if (event.ctrlKey && event.keyCode === 86) {
        if (this.appRestrictInput === 'freeTextRegex') {
          event.currentTarget.value = event.currentTarget.value ? event.currentTarget.value.replace(/[^A-Za-z0-9!@\#$%^&*()*+,-.\/:;\<=\>?@^›{|}~^_\'-\/\ \r\n\\&quot;\[\]]/g, '') : '';
        }
      }
    });
  }
  ngOnDestroy() {
    if (this.focusoutSubscription) {
      this.focusoutSubscription.unsubscribe();
    }
    if (this.keypressSubscription) {
      this.keypressSubscription.unsubscribe();
    }
  }
}
