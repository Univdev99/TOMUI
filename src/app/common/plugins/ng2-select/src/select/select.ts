
import { Component, Input, Output, EventEmitter, ElementRef, OnInit, forwardRef, ViewChild, AfterViewInit, OnDestroy } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { SelectItem } from './select-item';
import { stripTags } from './select-pipes';
import { OptionsBehavior } from './select-interfaces';
import { escapeRegexp } from './common';
import * as $ from "jquery";

@Component({
  /* tslint:disable */
  selector: 'ng-select',
  /* tslint:enable */
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      /* tslint:disable */
      useExisting: forwardRef(() => SelectComponent),
      /* tslint:enable */
      multi: true
    }
  ],
  templateUrl: './select.html'
})
export class SelectComponent implements OnInit, ControlValueAccessor {
  @Input() public allowClear = false;
  @Input() public placeholder = '';
  @Input() public idField = 'value';
  @Input() public required = false;
  @Input() public class = '';
  @Input() public textField = 'label';
  @Input() public childrenField = 'children';
  @Input() public multiple = false;
  @Input() public minLength = 3;
  @Input() public dataUi = '';
  @Input()
  public set items(value: Array<any>) {
    if (!value) {
      this._items = this.itemObjects = [];
    } else {
      this._items = value.filter((item: any) => {
        if ((typeof item === 'string') || (typeof item === 'object' && item && item[this.textField] && item[this.idField])) {
          return item;
        }
      });
      this.itemObjects = this._items.map((item: any) => (typeof item === 'string' ? new SelectItem(item) :
        new SelectItem({ value: item[this.idField], label: item[this.textField], children: item[this.childrenField] })));
    }
  }

  @Input()
  public set disabled(value: boolean) {
    this._disabled = value;
    if (this._disabled === true) {
      this.hideOptions();
    }
  }

  public get disabled(): boolean {
    return this._disabled;
  }

  @Input()
  public set active(selectedItems: Array<any>) {
    if (!selectedItems || selectedItems.length === 0) {
      this._active = [];
    } else {
      const areItemsStrings = typeof selectedItems[0] === 'string';
      if (selectedItems instanceof Array) {
        this._active = selectedItems.map((item: any) => {
          const data = areItemsStrings
            ? item
            : { value: item[this.idField], label: item[this.textField] };
          return new SelectItem(data);
        });
      }
    }
  }

  @Output() public data: EventEmitter<any> = new EventEmitter();
  @Output() public selected: EventEmitter<any> = new EventEmitter();
  @Output() public removed: EventEmitter<any> = new EventEmitter();
  @Output() public typed: EventEmitter<any> = new EventEmitter();
  @Output() public opened: EventEmitter<any> = new EventEmitter();
  @Output() public focus: EventEmitter<any> = new EventEmitter();
  @Output() public enterKeyPressedSaalEvent: EventEmitter<any> = new EventEmitter();

  public options: Array<SelectItem> = [];
  public itemObjects: Array<SelectItem> = [];
  public activeOption: SelectItem;
  public element: ElementRef;

  public get active(): Array<any> {
    return this._active;
  }

  public set optionsOpened(value: boolean) {
    this._optionsOpened = value;
    this.opened.emit(value);
  }

  public get optionsOpened(): boolean {
    return this._optionsOpened;
  }

  public onChange: any = Function.prototype;
  public onTouched: any = Function.prototype;

  public inputMode = false;
  public _optionsOpened = false;
  public behavior: OptionsBehavior;
  public inputValue = '';
  public _items: Array<any> = [];
  public _disabled = false;
  public _active: Array<SelectItem> = [];
  hideOptionsMultiselectSaal = true;
  doNotEmitSaalEvent = false;

  public constructor(element: ElementRef, public sanitizer: DomSanitizer) {
    this.element = element;
    this.clickedOutside = this.clickedOutside.bind(this);
  }

  public sanitize(html: string): SafeHtml {
    return this.sanitizer.bypassSecurityTrustHtml(html);
  }

  public inputEvent(e: any, isUpMode = false): void {

    if (e.keyCode === 13 && !isUpMode) {
      this.clickedForSelection();
    }
    if (this.multiple && e.keyCode === 27 && !isUpMode) {
      e.preventDefault();
    }
    if (this.multiple && e.keyCode === 27 && isUpMode) {
      this.hideOptionsMultiselectSaal = !this.hideOptionsMultiselectSaal;
      return;
    }
    if (!this.multiple && e.keyCode === 27 && isUpMode) {
      this.element.nativeElement.querySelector('.ui-select-container').focus();
      e.preventDetault();
      return;
    }

    if (this.multiple && this.hideOptionsMultiselectSaal && e.keyCode === 13) {
      this.enterKeyPressedSaalEvent.next();
      return;
    }

    if (this.multiple && this.hideOptionsMultiselectSaal && isUpMode && e.keyCode > 64 && e.keyCode < 91) {
      this.hideOptionsMultiselectSaal = false;
    }

    // tab
    if (e.keyCode === 9) {
      return;
    }
    if (isUpMode && (e.keyCode === 37 || e.keyCode === 39 || e.keyCode === 38 ||
      e.keyCode === 40 || e.keyCode === 13)) {
      e.preventDefault();
      return;
    }
    // backspace
    if (!isUpMode && e.keyCode === 8) {
      const el: any = this.element.nativeElement
        .querySelector('div.ui-select-container > input');
      if (!el.value || el.value.length <= 0) {
        if (this.active.length > 0) {
          this.remove(this.active[this.active.length - 1]);
        }
        e.preventDefault();
      }
    }
    // esc
    if (!isUpMode && e.keyCode === 27) {
      this.hideOptions();
      this.element.nativeElement.children[0].focus();
      e.preventDefault();
      return;
    }
    // del
    if (!isUpMode && e.keyCode === 46) {
      if (this.active.length > 0) {
        this.remove(this.active[this.active.length - 1]);
      }
      e.preventDefault();
    }
    // left
    if (!isUpMode && e.keyCode === 37 && this._items.length > 0) {
      this.behavior.first();
      e.preventDefault();
      return;
    }
    // right
    if (!isUpMode && e.keyCode === 39 && this._items.length > 0) {
      this.behavior.last();
      e.preventDefault();
      return;
    }
    // up
    if (!isUpMode && e.keyCode === 38) {
      this.behavior.prev();
      e.preventDefault();
      return;
    }
    // down
    if (!isUpMode && e.keyCode === 40) {

      this.behavior.next();
      e.preventDefault();
      return;
    }
    // enter
    if (!isUpMode && e.keyCode === 13) {
      if (!this.multiple) {
        if (this.active.indexOf(this.activeOption) === -1) {
          this.selectActiveMatch();
          this.behavior.next();
        }
        e.preventDefault();
        return;
      } else {
        if (!this.hideOptionsMultiselectSaal) {
          if (this.active.indexOf(this.activeOption) === -1) {
            this.selectActiveMatch();
            this.behavior.next();
          }
          e.preventDefault();
          return;
        }
      }
    }
    const target = e.target || e.srcElement;
    if (target && target.value) {
      this.inputValue = target.value;
      this.behavior.filter(new RegExp(escapeRegexp(this.inputValue), 'ig'));
      this.doEvent('typed', this.inputValue);
    } else {
      this.open();
    }
  }

  public ngOnInit(): any {
    this.behavior = (this.firstItemHasChildren) ?
      new ChildrenBehavior(this) : new GenericBehavior(this);
  }

  public remove(item: SelectItem): void {
    if (this._disabled === true) {
      return;
    }
    if (this.multiple === true && this.active) {
      const index = this.active.indexOf(item);
      this.active.splice(index, 1);
      this.data.next(this.active);
      this.doEvent('removed', item);
    }
    if (this.multiple === false) {
      this.active = [];
      this.data.next(this.active);
      this.doEvent('removed', item);
    }
  }

  public doEvent(type: string, value: any): void {
    if ((this as any)[type] && value) {
      (this as any)[type].next(value);
    }

    this.onTouched();
    if (type === 'selected' || type === 'removed') {
      this.onChange(this.active);
    }
  }

  public clickedOutside(): void {
    this.inputMode = false;
    this.optionsOpened = false;
  }

  public get firstItemHasChildren(): boolean {
    return this.itemObjects[0] && this.itemObjects[0].hasChildren();
  }

  public writeValue(val: any): void {
    this.active = val;
    this.data.emit(this.active);
  }

  public registerOnChange(fn: (_: any) => {}): void { this.onChange = fn; }
  public registerOnTouched(fn: () => {}): void { this.onTouched = fn; }

  public matchClick(e: any): void {
    if (this._disabled === true) {
      return;
    }
    if (this.multiple && this.hideOptionsMultiselectSaal) {
      this.hideOptionsMultiselectSaal = false;
    }
    this.inputMode = !this.inputMode;
    if (this.inputMode === true && ((this.multiple === true && e) || this.multiple === false)) {
      this.focusToInput();
      if (this.minLength === 0) {
        this.open();
      }
    }
    
  }

  sendEventToSaal() {
    if (!this.doNotEmitSaalEvent) {
      this.enterKeyPressedSaalEvent.next();
    }
  }

  public mainClick(event: any): void {
    if (this.inputMode === true || this._disabled === true) {
      return;
    }
    if (event.keyCode === 46) {
      event.preventDefault();
      this.inputEvent(event);
      return;
    }
    if (event.keyCode === 8) {
      event.preventDefault();
      this.inputEvent(event, true);
      return;
    }

    if (event.keyCode === 9 || event.keyCode === 13 ||
      event.keyCode === 27 || (event.keyCode >= 37 && event.keyCode <= 40)) {
      event.preventDefault();
      return;
    }

    

    this.inputMode = true;
    const value = String
      .fromCharCode(96 <= event.keyCode && event.keyCode <= 105 ? event.keyCode - 48 : event.keyCode)
      .toLowerCase();
    this.focusToInput(value);
    this.open();
    const target = event.target || event.srcElement;
    target.value = value;
    this.inputEvent(event);
  }

  public selectActive(value: SelectItem): void {
    this.activeOption = value;
  }

  public isActive(value: SelectItem): boolean {
    return this.activeOption.value === value.value;
  }

  public removeClick(value: SelectItem, event: any): void {
    event.stopPropagation();
    this.remove(value);
    if (this.multiple === true) {
      this.open();
    }
  }

  public focusToInput(value = ''): void {
    setTimeout(() => {
      const el = this.element.nativeElement.querySelector('div.ui-select-container > input');
      if (el) {
        el.focus();
        el.value = value;
      }
    }, 0);
    if (this.multiple === true) {
      this.focus.emit(event);
      this.open();
    }
  }

  public open(isSource?): void {
    if (isSource) {
      // As we are opening static list from multiselect softsearch no need to check condition for minLength
      this.options = this.itemObjects
        .filter((option: SelectItem) => (this.multiple === false ||
          this.multiple === true && !this.active.find((o: SelectItem) => option.label === o.label)));

      if (this.options.length > 0) {
        this.behavior.first();
      }
      this.optionsOpened = true;

      if (this.multiple === false && this.active && this.active.length > 0) { // added by anuja
        this.activeOption = this.active[0];
        this.inputValue = this.active[0].label;
      }
    } else {
      if (this.minLength === 0 || this.inputValue.length >= this.minLength) {
        this.options = this.itemObjects
          .filter((option: SelectItem) => (this.multiple === false ||
            this.multiple === true && !this.active.find((o: SelectItem) => option.label === o.label)));

        if (this.options.length > 0) {
          this.behavior.first();
        }
        this.optionsOpened = true;

        if (this.multiple === false && this.active && this.active.length > 0) { // added by anuja
          this.activeOption = this.active[0];
          this.inputValue = this.active[0].label;
        }
      }
    }

  }

  public hideOptions(): void {
    this.inputMode = false;
    this.optionsOpened = false;
  }

  public selectActiveMatch(): void {
    this.selectMatch(this.activeOption);
  }

  clickedForSelection() {
    this.doNotEmitSaalEvent = true;
    setTimeout(() => {
      this.doNotEmitSaalEvent = false;
    }, 200);
  }

  public selectMatch(value: SelectItem, e: Event = void 0): void {
    if (e) {
      e.stopPropagation();
      e.preventDefault();
    }
    if (this.options.length <= 0) {
      return;
    }
    if (this.multiple === true) {
      this.active.push(value);
      this.data.next(this.active);
    }
    if (this.multiple === false) {
      this.active[0] = value;
      this.data.next(this.active[0]);
      // this.clickedForSelection();
    }
    this.doEvent('selected', value);
    this.inputValue = value.label;
    this.hideOptions();
    if (this.multiple === true) {
      this.focusToInput('');
    } else {
      this.focusToInput(stripTags(value.label));
      this.element.nativeElement.querySelector('.ui-select-container').focus();
    }
    if (this.multiple === true) {
      this.open();
    }
  }
}


export class Behavior {
  public optionsMap: Map<string, number> = new Map<string, number>();

  public actor: SelectComponent;

  public constructor(actor: SelectComponent) {
    this.actor = actor;
  }

  public fillOptionsMap(): void {
    this.optionsMap.clear();
    let startPos = 0;
    this.actor.itemObjects
      .map((item: SelectItem) => {
        startPos = item.fillChildrenHash(this.optionsMap, startPos);
      });
  }

  public ensureHighlightVisible(optionsMap: Map<string, number> = void 0): void {
    const container = this.actor.element.nativeElement.querySelector('.ui-select-choices');

    if (!container) {
      return;
    }

    const choices = container.querySelectorAll('.ui-select-choices-row');
    if (choices.length < 1) {
      return;
    }
    const activeIndex = this.getActiveIndex(optionsMap);
    if (activeIndex < 0) {
      return;
    }
    const highlighted: any = choices[activeIndex];
    if (!highlighted) {
      return;
    }
    const posY: number = highlighted.offsetTop + highlighted.clientHeight - container.scrollTop;
    const height: number = container.offsetHeight;
    if (posY > height) {
      container.scrollTop += posY - height;
    } else if (posY < highlighted.clientHeight) {
      container.scrollTop -= highlighted.clientHeight - posY;
    }
  }

  public getActiveIndex(optionsMap: Map<string, number> = void 0): number {
    let ai = this.actor.options.indexOf(this.actor.activeOption);
    if (ai < 0 && optionsMap !== void 0) {
      ai = optionsMap.get(this.actor.activeOption.value);
    }
    return ai;
  }
}

export class GenericBehavior extends Behavior implements OptionsBehavior {
  public constructor(actor: SelectComponent) {
    super(actor);
  }

  public first(): void {
    this.actor.activeOption = this.actor.options[0];
    super.ensureHighlightVisible();
  }

  public last(): void {
    this.actor.activeOption = this.actor.options[this.actor.options.length - 1];
    super.ensureHighlightVisible();
  }

  public prev(): void {
    const index = this.actor.options.indexOf(this.actor.activeOption);
    this.actor.activeOption = this.actor
      .options[index - 1 < 0 ? this.actor.options.length - 1 : index - 1];
    super.ensureHighlightVisible();
  }

  public next(): void {
    const index = this.actor.options.indexOf(this.actor.activeOption);
    this.actor.activeOption = this.actor
      .options[index + 1 > this.actor.options.length - 1 ? 0 : index + 1];
    super.ensureHighlightVisible();
  }

  public filter(query: RegExp): void {
    const options = this.actor.itemObjects
      .filter((option: SelectItem) => {
        if (option.value === 'IAmParent') {
          return stripTags(option.label);
        } else {
          return stripTags(option.label).match(query) &&
            (this.actor.multiple === false ||
              (this.actor.multiple === true && this.actor.active.map((item: SelectItem) => item.value).indexOf(option.value) < 0));
        }
      });
    this.actor.options = options;
    if (this.actor.options.length > 0) {
      this.actor.activeOption = this.actor.options[0];
      super.ensureHighlightVisible();
    } else {
      if (this.actor.dataUi == 'multiSelect') {
        $('.ui-select-search').val('');
      }

    }
  }
}

export class ChildrenBehavior extends Behavior implements OptionsBehavior {
  public constructor(actor: SelectComponent) {
    super(actor);
  }

  public first(): void {
    this.actor.activeOption = this.actor.options[0].children[0];
    this.fillOptionsMap();
    this.ensureHighlightVisible(this.optionsMap);
  }

  public last(): void {
    this.actor.activeOption =
      this.actor
        .options[this.actor.options.length - 1]
        .children[this.actor.options[this.actor.options.length - 1].children.length - 1];
    this.fillOptionsMap();
    this.ensureHighlightVisible(this.optionsMap);
  }

  public prev(): void {
    const indexParent = this.actor.options
      .findIndex((option: SelectItem) => this.actor.activeOption.parent && this.actor.activeOption.parent.value === option.value);
    const index = this.actor.options[indexParent].children
      .findIndex((option: SelectItem) => this.actor.activeOption && this.actor.activeOption.value === option.value);
    this.actor.activeOption = this.actor.options[indexParent].children[index - 1];
    if (!this.actor.activeOption) {
      if (this.actor.options[indexParent - 1]) {
        this.actor.activeOption = this.actor
          .options[indexParent - 1]
          .children[this.actor.options[indexParent - 1].children.length - 1];
      }
    }
    if (!this.actor.activeOption) {
      this.last();
    }
    this.fillOptionsMap();
    this.ensureHighlightVisible(this.optionsMap);
  }

  public next(): void {
    const indexParent = this.actor.options
      .findIndex((option: SelectItem) => this.actor.activeOption.parent && this.actor.activeOption.parent.value === option.value);
    const index = this.actor.options[indexParent].children
      .findIndex((option: SelectItem) => this.actor.activeOption && this.actor.activeOption.value === option.value);
    this.actor.activeOption = this.actor.options[indexParent].children[index + 1];
    if (!this.actor.activeOption) {
      if (this.actor.options[indexParent + 1]) {
        this.actor.activeOption = this.actor.options[indexParent + 1].children[0];
      }
    }
    if (!this.actor.activeOption) {
      this.first();
    }
    this.fillOptionsMap();
    this.ensureHighlightVisible(this.optionsMap);
  }

  public filter(query: RegExp): void {
    const options: Array<SelectItem> = [];
    const optionsMap: Map<string, number> = new Map<string, number>();
    let startPos = 0;
    for (const si of this.actor.itemObjects) {
      const children: Array<SelectItem> = si.children.filter((option: SelectItem) => query.test(option.label));
      startPos = si.fillChildrenHash(optionsMap, startPos);
      if (children.length > 0) {
        const newSi = si.getSimilar();
        newSi.children = children;
        options.push(newSi);
      }
    }
    this.actor.options = options;
    if (this.actor.options.length > 0) {
      this.actor.activeOption = this.actor.options[0].children[0];
      super.ensureHighlightVisible(optionsMap);
    }
  }
}
