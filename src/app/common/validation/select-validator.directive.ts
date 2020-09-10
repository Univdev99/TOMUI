import { Directive, Input } from '@angular/core';
import { AbstractControl, NG_VALIDATORS, Validator } from '@angular/forms';

@Directive({
  selector: '[appSelectValidator]',
  providers: [{
    provide: NG_VALIDATORS,
    useExisting: SelectValidatorDirective,
    multi: true
  }]
})
export class SelectValidatorDirective implements Validator {

  @Input() appSelectValidator: string;
  constructor() { }

  validate(control: AbstractControl): { [key: string]: any } | null {
    return control.value === this.appSelectValidator ? { 'selectRequired': true } : null;
  }
}
