
import { Directive, HostListener, Input, OnInit, OnDestroy, Output, EventEmitter } from '@angular/core';

/* tslint:disable */
@Directive({
  selector: '[offClick]'
})
/* tslint:enable */

export class OffClickDirective implements OnInit, OnDestroy {
  /* tslint:disable */
  @Input('offClick') public offClickHandler: any;
  @Output('openSelectBox') openSelectBox = new EventEmitter();
  /* tslint:enable */
  @HostListener('click', ['$event']) public onClick($event: MouseEvent): void {
    // $event.stopPropagation();
    setTimeout(() => {
      this.openSelectBox.emit($event);
    });
  }

  public ngOnInit(): any {
    setTimeout(() => { if (typeof document !== 'undefined') { document.addEventListener('click', this.offClickHandler); } }, 0);
  }

  public ngOnDestroy(): any {
    if (typeof document !== 'undefined') { document.removeEventListener('click', this.offClickHandler); }
  }
}
