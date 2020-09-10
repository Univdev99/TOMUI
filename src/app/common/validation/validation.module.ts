import { NgModule } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { ClassErrorDirective } from './class-error.directive';
import { EmailValidatorDirective } from './email-validator.directive';
import { RestrictInputDirective } from './restrict-input.directive';
import { SelectValidatorDirective } from './select-validator.directive';
import { ValidateElementDirective } from './validate-element.directive';
import { CustomDate } from "../pipe/custom-date.pipe";

@NgModule({
   imports: [
      CommonModule
   ],
   declarations: [
      ClassErrorDirective,
      EmailValidatorDirective,
      RestrictInputDirective,
      SelectValidatorDirective,
      ValidateElementDirective
   ],
   providers: [CustomDate, DatePipe],
   exports: [
      RestrictInputDirective, ValidateElementDirective, EmailValidatorDirective, SelectValidatorDirective, ClassErrorDirective
   ]
})
export class ValidationModule { }
