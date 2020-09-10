import { Pipe, PipeTransform } from '@angular/core';
import * as _ from 'lodash';
import { TreeItem } from '../plugins/ng2-dropdown-treeview/src/treeview.component';

export const levels = {
    level1: 'level1',
    level2: 'level2',
    level3: 'level3',
    level4: 'level4',
    level5: 'level5',
};

export interface TreeeNodeProp {
    nameProp;
    isEditmode?;
    editmodeProp?;
    selectedKeys?;
};

// It converts input data into treeitem array
@Pipe({
    name: 'treeviewDataConvert'
})

export class TreeviewDataConvertPipe implements PipeTransform {
    // it loop through array given and call @createTree for each item.
    column;
    treeNodeProp: TreeeNodeProp;

    transform(value, treeNodeProp: TreeeNodeProp): any {
        this.treeNodeProp = treeNodeProp; const data: TreeItem[] = [];
        if (value && value.length && _.has(value[0], 'internalChecked')) {
            return value;
        }
        this.column = treeNodeProp.nameProp; 
        
        if (value !== null && value !== undefined && value.length) {
            value.forEach((item) => {
                data.push(this.createTree(_.get(item, treeNodeProp.nameProp), item, null, treeNodeProp.isEditmode, treeNodeProp.editmodeProp, null, 0));
            });
        }
        return data;
    }

    /**
     * It convert object into treeitm object
     * If object has children then call itself recursively
     * to convert that into treeitem and insert into passed treemitem object
     * Initially set checked false to all elements
     * @param {any} name name which is column name, that needed for treeitm object
     * @param {any} value value for field
     * @param {any} [nodeItem] optional field used while recusrsive call to pass treeItem
     * and add children of type treeitem
     * @returns converted object to treeitm that
     * also includeds convertion of children objbect to treeitm object
     * @memberOf TreeviewDataConvertPipe
     */
    createTree(name, value, nodeItem?, editMode?, editModeProperty?, isParentRequired?, level?) {
        if (isParentRequired) {
            value[levels['level' + level]] = { [this.column]: nodeItem.value[this.column], key: nodeItem.value.key };
            if (level > 0) {
                for (let index = 1; index < level; index++) {
                    value[levels['level' + index]] = nodeItem.value[levels['level' + index]];
                }
            }
        }
        const treeItem = new TreeItem(name, value);
        if (editMode) {
            treeItem.checked = this.getChecked(editModeProperty, value);
            if (nodeItem && treeItem.checked) {
                nodeItem.checked = nodeItem.checked || treeItem.checked;
            }
        } 
        if (nodeItem) {
            if (!nodeItem.children) {
                nodeItem.children = [];
            }
            nodeItem.children.push(treeItem);
        }
        if (value.children && value.children.length) {
            value.children.forEach((child) => {
                this.createTree(child[this.column], child, treeItem, editMode, editModeProperty, true, level + 1);
            });
        }
        if (editMode && nodeItem && treeItem.checked) {
            nodeItem.checked = nodeItem.checked || treeItem.checked;
        }
        if (value.disabled) { treeItem.disabled = true; } return treeItem;
    }

    /** @param editProp: comma seperated list of properties need to check for setting checkbox
     * @param item: item object
     * returns is item object checked or not checked*/
    getChecked(editProp, item) {
        let isChecked = false; const editPropArr = editProp.split(',');
        if (editPropArr.length === 1) {
            isChecked = item[editProp];
        } else {
            for (let index = 0; index < editPropArr.length; index++) {
                isChecked = isChecked || item[editPropArr[index]] || (this.treeNodeProp.selectedKeys ?
                    this.treeNodeProp.selectedKeys.indexOf(item.key) > -1 : false);
                if (isChecked) {
                    break;
                }
            }
        }
        return isChecked;
    }
}