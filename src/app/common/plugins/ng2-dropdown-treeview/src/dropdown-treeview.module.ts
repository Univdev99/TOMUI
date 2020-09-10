import { NgModule, ModuleWithProviders } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { DropdownTreeviewComponent } from './dropdown-treeview.component';
import { TreeviewComponent } from './treeview.component';
import { TreeviewPipe } from './treeview.pipe';
import {CheckboxModule} from 'primeng/primeng';

@NgModule({
    imports: [
        FormsModule,
        CommonModule,
        CheckboxModule
    ],
    declarations: [
        DropdownTreeviewComponent,
        TreeviewComponent,
        TreeviewPipe
    ], exports: [
        DropdownTreeviewComponent,
        TreeviewComponent,
        TreeviewPipe
    ]
})
export class DropdownTreeviewModule {
    static forRoot(): ModuleWithProviders {
        return {
            ngModule: DropdownTreeviewModule
        };
    }
} // src\app\plugins\ng2-dropdown-treeview\src\dropdown-treeview.module.ts