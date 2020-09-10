import {
    Component, EventEmitter, ViewChild, ElementRef,
    Input, Output, OnChanges, SimpleChange, HostListener
} from '@angular/core';
import * as _ from 'lodash';
import { TreeItem } from './treeview.component';

class FilterTreeItem extends TreeItem {
    refItem: TreeItem;
    constructor(item: TreeItem) {
        super(item.text, item.value);
        this.disabled = item.disabled;
        this.checked = item.checked;
        this.collapsed = item.collapsed;
        this.children = item.children;
        this.refItem = item;
    }

    updateRefChecked() {
        if (!_.isNil(this.children)) {
            this.children.forEach(child => {
                if (child instanceof FilterTreeItem) {
                    child.updateRefChecked();
                }
            });
        }

        let refChecked = this.checked;
        if (!_.isNil(this.refItem.children)) {
            for (let i = 0; i < this.refItem.children.length; i++) {
                const refChild = this.refItem.children[i];
                if (refChild instanceof FilterTreeItem) {
                    refChild.updateRefChecked();
                }
                if (!refChild.checked) {
                    refChecked = false;
                    break;
                }
            }
        }
        this.refItem.checked = refChecked;
    }
}

export interface DropdownTreeviewConfig {
    isShowFilter?: boolean;
    isShowAllCheckBox?: boolean;
    isShowCollapseExpand?: boolean;
    headerText?: string;
    allText?: string;
    noSelectText?: string;
    moreSelectText?: string;
    isEmbedView?: boolean;
    editModeProperty?: string;
}

export let DefaultConfig: DropdownTreeviewConfig = {
    isShowAllCheckBox: false,
    isShowFilter: false,
    isShowCollapseExpand: false,
    headerText: 'All',
    allText: 'All',
    noSelectText: 'Select options',
    moreSelectText: ' selected',
    isEmbedView: true,
    editModeProperty: 'status'
};
// tslint:disable
@Component({
    selector: 'leo-dropdown-treeview',
    // tslint:enable
    template: `
<div class="dropdown" [class.open]="isOpen">
    <button *ngIf="!config.isEmbedView" class="btn btn-secondary dropdown-toggle" #dropdownButton type="button" (click)="toggleOpen()"
    aria-haspopup="true" aria-expanded="false">
        {{text}}
    </button>
    <div [class.dropdown-menu]="!config.isEmbedView" class="dropdown-menu"
    aria-labelledby="dropdownMenuButton" (click)="$event.stopPropagation()" [ngSwitch]="hasItems">
        <div *ngSwitchCase="true">
            <div *ngIf="config.isShowFilter" class="row">
                <div class="col-xs-12">
                    <input class="form-control" type="text" placeholder="Filter"
                    [ngModel]="filterText" (ngModelChange)="onFilterTextChange($event)" />
                </div>
            </div>
            <div *ngIf="hasFilterItems">
                <div *ngIf="config.isShowAllCheckBox || config.isShowCollapseExpand" class="row">
                    <div class="col-xs-12">
                        <label *ngIf="config.isShowAllCheckBox" class="form-check-label dropdown-item-all">
                            <p-checkbox [(ngModel)]="allItem.checked" 
                            (ngModelChange)="onAllCheckedChange($event)" binary="true" [disabled]="isAllDisabled"></p-checkbox>
                            {{allItem.text}}
                        </label>
                        <label *ngIf="config.isShowCollapseExpand" class="form-check-label pull-right dropdown-item-collapse-expand">
                            <i (click)="toggleCollapseExpand()" [title]="allItem.collapsed ? 'Expand' : 'Collapse'" aria-hidden="true"
                                class="fa" [class.fa-expand]="allItem.collapsed" [class.fa-compress]="!allItem.collapsed"></i>
                        </label>
                    </div>
                </div>
                <div *ngIf="config.isShowFilter || config.isShowAllCheckBox || config.isShowCollapseExpand" class="dropdown-divider"></div>
                <div class="treeview-container">
                    <div *ngFor="let item of filterItems">
                        <leo-treeview [item]="item" [isAllDisabled]="isAllDisabled"
                        [checkedProperty]="checkedProperty" (checkedChange)="onItemCheckedChange(item, $event)" [childCheckOnParent] = "childCheckOnParent">
                        </leo-treeview>
                    </div>
                </div>
            </div>
            <div *ngIf="!hasFilterItems" class="dropdown-item">
                No Record found
            </div>
        </div>
        <div *ngSwitchCase="false" class="dropdown-item">
            <!--No items-->
        </div>
    </div>
</div>
    `,
    styles: [`
.dropdown {
    width: 100%;
    display: inline-block;
}

.dropdown button {
    width: 100%;
    text-align: left;
}

.dropdown button::after {
    position: absolute;
    right: 0.6rem;
    margin-top: 0.6rem;
}

.dropdown .dropdown-menu .row {
    padding: 2px 10px;
}

.dropdown .dropdown-menu .dropdown-item-collapse-expand {
    padding: 0;
}

.dropdown .dropdown-menu .treeview-container {
    padding-left: 5px;
    padding-right: 5px;
    max-height: 500px;
    overflow-y: auto;
}
    `]
})

export class DropdownTreeviewComponent implements OnChanges {
    @ViewChild('dropdownButton',{static:false}) dropdownButton: ElementRef;
    @Input() items: TreeItem[];
    @Input() config = DefaultConfig;
    @Input() checkedProperty = 'select';
    @Input() showCollapseView = true;
    @Input() retrieveAll = false;
    @Input() isAllDisabled = false;
    @Input() childCheckOnParent = false;
    @Output() hide = new EventEmitter();
    @Output() selectedChange = new EventEmitter<any>();
    @Output() treeItemChange = new EventEmitter();
    allItem = new TreeItem(this.config.headerText);
    isOpen = false;
    text = this.config.allText;
    filterText: string;
    filterItems: TreeItem[];
    _setAllChecked;
    @Input()
    set setAllChecked(value) {
        if (this.filterItems) {
            this._setAllChecked = value;
            switch (this._setAllChecked) {
                case 'Full Control':
                    this.allItem.checked = true;
                    this.onAllCheckedChange(true);
                    break;
                case 'Read Only':
                    this.allItem.checked = false;
                    this.readOnlyModeTree(this.items);
                    break;
                case 'Custom':
                    this.allItem.checked = false;
                    this.onAllCheckedChange(false);
                    break;
            }
        }
    }

    readOnlyModeTree(items) {
        items.forEach((item) => {
            this.setReadOnlyActions(item);
        });
        this.onAfterSelectedChange();


    }

    setReadOnlyActions(treeItem, parent?) {
        treeItem.checked = treeItem.value[this.config.editModeProperty];
        if (treeItem.checked) {
            treeItem.collapsed = false;
        }
        if (treeItem.children && treeItem.children.length) {
            treeItem.children.forEach((child) => {
                this.setReadOnlyActions(child, treeItem);
            });
        }
        if (parent && treeItem.checked) {
            parent.checked = parent.checked || treeItem.checked;
        }
        return treeItem;
    }

    get setAllChecked() {
        return this._setAllChecked;
    }

    @HostListener('keyup.esc') keyupEsc() {
        this.isOpen = false;
    }
    @HostListener('document:click', ['$event']) onDocumentClick(event: MouseEvent) {
        if (!this.config.isEmbedView && this.dropdownButton && event.target !== this.dropdownButton.nativeElement) {
            this.isOpen = false;
        }
    }

    get hasItems(): boolean {
        return !_.isNil(this.items) && this.items.length > 0;
    }

    get hasFilterItems(): boolean {
        return !_.isNil(this.filterItems) && this.filterItems.length > 0;
    }

    ngOnChanges(changes: { [propertyName: string]: SimpleChange }) {
        let change = changes['config'];
        if (!_.isNil(change)) {
            if (!_.isNil(this.config)) {
                this.config = _.defaults(this.config, DefaultConfig);
            } else {
                this.config = _.defaults({}, DefaultConfig);
            }
            this.allItem.text = this.config.headerText;
            if (this.allItem.checked) {
                this.text = this.config.allText;
            }
        }

        change = changes['items'];
        if (!_.isNil(change) && !_.isNil(this.items)) {
            this.updateFilterItems();
            this.onAfterSelectedChange();
        }
    }

    toggleOpen() {
        this.isOpen = !this.isOpen;
        if (!this.isOpen) {
            this.hide.emit();
        }
    }

    documentClick(event: MouseEvent) {
        if (event.target !== this.dropdownButton.nativeElement) {
            this.isOpen = false;
        }
    }

    toggleCollapseExpand() {
        this.allItem.collapsed = !this.allItem.collapsed;
        this.filterItems.forEach(item => {
            item.collapsed = this.allItem.collapsed;
        });
    }

    onFilterTextChange(filterText: string) {
        this.filterText = filterText;
        this.updateFilterItems();
    }

    onAllCheckedChange(checked: boolean) {
        this.filterItems.forEach(item => {
            item.updateCheckedRecursive(checked);
            if (item instanceof FilterTreeItem) {
                item.updateRefChecked();
            }
        });

        this.treeItemChange.emit({ isAllChecked: this.allItem.checked });
        this.onAfterSelectedChange();
    }

    onItemCheckedChange(item: TreeItem, checked: boolean) {
        if (this.allItem.checked !== checked) {
            if (!checked) {
                this.allItem.checked = checked;
            } else {
                const isAllChecked = this.checkChildrenUnchecked(this.filterItems);
                this.allItem.checked = isAllChecked;
            }
        }

        if (item instanceof FilterTreeItem) {
            item.updateRefChecked();
        }
        this.treeItemChange.emit({ isAllChecked: this.allItem.checked });
        this.onAfterSelectedChange();
    }

    checkChildrenUnchecked(treeItemArray) {
        let isAllChildChecked = true;
        for (let i = 0; (i < treeItemArray.length) && isAllChildChecked; i++) {
            checkIsUnChecked(treeItemArray[i]);
        }
        function checkIsUnChecked(treeItem) {
            isAllChildChecked = treeItem.checked && isAllChildChecked;
            if (!isAllChildChecked) {
                return;
            }
            if (treeItem.children && treeItem.children.length) {
                for (let j = 0; (j < treeItem.children.length) && isAllChildChecked; j++) {
                    checkIsUnChecked(treeItem.children[j]);
                }
            }
        }
        return isAllChildChecked;
    }

    getCheckedItems(): TreeItem[] {
        let checkedItems: TreeItem[] = [];
        for (let i = 0; i < this.items.length; i++) {
            checkedItems = _.concat(checkedItems, this.items[i].getCheckedItems());
        }

        return checkedItems;
    }


    private onAfterSelectedChange() {
        let isAllChecked = true;
        for (let i = 0; i < this.items.length; i++) {
            if (!this.items[i].checked) {
                isAllChecked = false;
                break;
            }
        }
        const checkedItems = this.getCheckedItems();
        if (isAllChecked) {
            this.text = this.config.allText;
        } else {
            if (checkedItems.length === 0) {
                this.text = this.config.noSelectText;
            } else if (checkedItems.length === 1) {
                this.text = checkedItems[0].text;
            } else {
                this.text = `${checkedItems.length} ${this.config.moreSelectText}`;
            }
        }

        const values = checkedItems.map(item => item.value);
        if (this.retrieveAll) {
            this.selectedChange.emit({ values: values, allData: this.items });
            return;
        }
        this.selectedChange.emit(values);
    }

    private updateFilterItems() {
        if (!_.isNil(this.filterText) && this.filterText !== '') {
            const filterItems: TreeItem[] = [];
            this.items.forEach(item => {
                const newItem = this.filterItem(item, this.filterText);
                if (!_.isNil(newItem)) {
                    filterItems.push(newItem);
                }
            });
            this.filterItems = filterItems;
        } else {
            this.filterItems = this.items;
        }

        this.updateCheckBoxAll();
    }

    private filterItem(item: TreeItem, filterText: string): TreeItem {
        const isMatch = _.includes(item.text.toLowerCase(), filterText.toLowerCase());
        if (isMatch) {
            return item;
        } else {
            if (!_.isNil(item.children)) {
                const children: TreeItem[] = [];
                let checkedCount = 0;
                item.children.forEach(child => {
                    const newChild = this.filterItem(child, filterText);
                    if (!_.isNil(newChild)) {
                        children.push(newChild);
                        if (newChild.checked) {
                            checkedCount++;
                        }
                    }
                });
                if (children.length > 0) {
                    const newItem = new FilterTreeItem(item);
                    newItem.children = children;
                    newItem.checked = children.length === checkedCount;
                    return newItem;
                }
            }
        }

        return undefined;
    }

    private updateCheckBoxAll() {
        // let checked = true;
        // for (let i = 0; i < this.filterItems.length; i++) {
        //     if (!this.filterItems[i].checked) {
        //         checked = false;
        //         break;
        //     }
        // }
        // this.allItem.checked = checked;
        const isAllChecked = this.checkChildrenUnchecked(this.filterItems);
        this.allItem.checked = isAllChecked;
    }
} //src\app\plugins\ng2-dropdown-treeview\src\dropdown-treeview.component.ts
