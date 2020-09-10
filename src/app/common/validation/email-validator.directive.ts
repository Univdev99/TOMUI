
import { Directive, forwardRef } from '@angular/core';
import { NG_VALIDATORS, AbstractControl, Validators, Validator } from '@angular/forms';

const EMAIL_VALIDATOR: any = {
    provide: NG_VALIDATORS,
    useExisting: forwardRef(() => EmailValidatorDirective),
    multi: true
};

@Directive({
    selector: '[appEmailValidator][formControlName],[appEmailValidator][formControl],[appEmailValidator][ngModel]',
    providers: [EMAIL_VALIDATOR]
})
export class EmailValidatorDirective implements Validator {

    validate(c: AbstractControl): { [key: string]: any } {
        return this.email(c);
    }

    /**
     * Validator that requires controls to have a value of email.
     */
    email(control: AbstractControl): { [key: string]: boolean } {
        if (isPresent(Validators.required(control))) {
            return null;
        }

        const v: string = control.value;
        if (!isPresent(v) || v === '') {
            control.markAsUntouched();
            return null;
        }

        const emailValidation1 = /^[a-zA-Z0-9.@!#$%&'*+-/=?^_`{|}~]*$/.test(v) ? null : { 'email': true };
        if (emailValidation1 === null) {
            return /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@([a-zA-Z0-9])((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/.test(v) ? null : { 'email': true };
        } else {
            return emailValidation1;
        }
    }
}
export const isPresent = (obj) => {
    return obj !== undefined && obj !== null;
};
