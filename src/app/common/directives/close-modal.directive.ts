import { Directive, HostListener } from '@angular/core';
import { NgbActiveModal } from '../../../../node_modules/@ng-bootstrap/ng-bootstrap';

@Directive({
  selector: '[appCloseModal]'
})
export class CloseModalDirective {

  constructor(
    private ngbActiveModal:NgbActiveModal
  ) { }

  @HostListener('click', ['$event.target']) onClick() {
    this.ngbActiveModal.close();
  }

}
