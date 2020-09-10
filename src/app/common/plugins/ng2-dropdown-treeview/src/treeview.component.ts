import { Component, EventEmitter, Input, Output } from '@angular/core';
import * as _ from 'lodash';

export class TreeItem {
    private internalDisabled = false;
    private internalChecked = false;
    text: string;
    value: any;
    collapsed = false;
    children?: TreeItem[];

    constructor(text: string, value: any = undefined) {
        this.text = text;
        this.value = value;
    }

    get checked(): boolean {
        return this.internalChecked;
    }

    set checked(checked: boolean) {
        if (!this.disabled) {
            this.internalChecked = checked;
        }
    }

    get disabled(): boolean {
        return this.internalDisabled;
    }

    set disabled(disabled: boolean) {
        this.internalDisabled = disabled;
        if (!_.isNil(this.children)) {
            this.children.forEach(child => child.disabled = disabled);
        }
    }

    updateCollapsedRecursive(collapsed: boolean) {
        this.collapsed = collapsed;
        if (!_.isNil(this.children)) {
            this.children.forEach(child => {
                child.updateCollapsedRecursive(collapsed);
            });
        }
    }

    updateCheckedRecursive(checked: boolean) {
        if (this.disabled) {
            return;
        }

        this.checked = checked;
        if (!_.isNil(this.children)) {
            this.children.forEach(child => {
                child.updateCheckedRecursive(checked);
            });
        }
    }

    getCheckedItems(): TreeItem[] {
        let checkedItems: TreeItem[] = [];
        let isAnyChildChecked = false;
        if (!_.isNil(this.children)) {
            for (let i = 0; i < this.children.length; i++) {
                if (this.children[i].checked) {
                    isAnyChildChecked = true;
                    break;
                }
            }
        }


        if (_.isNil(this.children) || !isAnyChildChecked) {
            if (this.checked) {
                checkedItems.push(this);
            }
        } else {
            for (let i = 0; i < this.children.length; i++) {
                checkedItems = _.concat(checkedItems, this.children[i].getCheckedItems());
            }
        }

        return checkedItems;
    }
}
// tslint:disable
@Component({
    selector: 'leo-treeview',
    // tslint: enable
    template: `
<div class="treeview-item" [class.treeview-parent]="item.children">
    <i *ngIf="item.children && showCollapseView" (click)="toggleCollapseExpand()" aria-hidden="true"
    class="fa" [class.fa-caret-right]="item.collapsed" [class.fa-caret-down]="!item.collapsed"></i>
    <label class="form-check-label breakWord">
        <p-checkbox [(ngModel)]="item.checked" (ngModelChange)="onCheckedChange($event)" [disabled]="item.disabled || isAllDisabled"
         binary="true"></p-checkbox>
        {{item.text}}
    </label>
    
    <div [hidden]="item.collapsed" *ngFor="let child of item.children">
        <leo-treeview [isAllDisabled]="isAllDisabled" [item]="child" [checkedProperty]="checkedProperty" (checkedChange)="onChildCheckedChange($event)" [childCheckOnParent] = "childCheckOnParent"></leo-treeview>
    </div>
</div>
    `,
    styles: [`
.treeview-item {
    padding-left: 20px;
    white-space: nowrap;
}

.treeview-item .form-check-label {
    padding-top: 2px;
    padding-bottom: 2px;
}

.treeview-item .fa {
    margin-left: -1.0rem;
    width: 10px;
    cursor: pointer;
}
    `]
})
export class TreeviewComponent {
    @Input() item: TreeItem;
    @Input() isAllDisabled;
    @Output() checkedChange = new EventEmitter<boolean>();
    @Input() showCollapseView = true;
    @Input() checkedProperty;
    @Input() childCheckOnParent;

    toggleCollapseExpand() {
        this.item.collapsed = !this.item.collapsed;
    }

    onCheckedChange(checked: boolean) {
        if(typeof this.item.value === 'object') {
            this.item.value[this.checkedProperty] = checked;
        }
        if (this.childCheckOnParent) {
            if (!_.isNil(this.item.children)) {
                this.item.children.forEach(child => {
                    child.updateCheckedRecursive(checked);
                });
            }
        } else {
            if (!_.isNil(this.item.children) && !checked) {
                this.item.children.forEach(child => {
                    child.updateCheckedRecursive(checked);
                });
            }
        }

        this.checkedChange.emit(checked);
    }

    onChildCheckedChange(checked: boolean) {
        let tempChecked = false;
        for (let i = 0; i < this.item.children.length; i++) {
          tempChecked = this.item.children[i].checked || tempChecked;
        }
        if (this.item.checked !== tempChecked) {
            this.item.checked = tempChecked;
        }

        this.checkedChange.emit(checked);
    }
} //src\app\plugins\ng2-dropdown-treeview\src\treeview.component.ts