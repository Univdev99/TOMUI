import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SimpleSoftSearchComponent } from './simple-soft-search/simple-soft-search.component';
import { AutoCompleteModule } from 'primeng/autocomplete';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CalenderComponent } from './calender/calender.component';
import { CalendarModule } from 'primeng/calendar';
import { CommonDropdownComponent } from './common-dropdown/common-dropdown.component';
import { DropdownModule } from 'primeng/dropdown';
import { DateRangePickerComponent } from './date-range-picker/date-range-picker.component';
import { SelectModule } from '../plugins/ng2-select/src';
import { FileUploadComponent } from './file-upload/file-upload.component';
import { DropdownTreeviewModule } from '../plugins/ng2-dropdown-treeview/src/dropdown-treeview.module';
import { TreeviewDataConvertPipe } from '../pipe/treeview-data-convert.pipe';
import { CustomDate } from '../pipe/custom-date.pipe';
import { GroupByPipe } from '../pipe/group-by.pipe';
import { CommonCheckboxComponent } from './common-checkbox/common-checkbox.component';
import { CheckboxModule } from 'primeng/checkbox';
import { NgbModule, NgbDateParserFormatter } from '@ng-bootstrap/ng-bootstrap';
import { CustomNgbDateParserFormatter } from './calender/CustomNgbDateParserFormatter';
import { DateTimePickerComponent } from './calender/date-time-picker/date-time-picker.component';
import { TruncatePipe } from '../pipe/truncate-pipe';
import { RemoveSelect } from '../pipe/remove-select.pipe';
import { CloseModalDirective } from '../directives/close-modal.directive';

@NgModule({
  imports: [
    CommonModule,
    AutoCompleteModule,
    CalendarModule,
    DropdownModule,
    FormsModule,
    SelectModule,
    CheckboxModule,
    ReactiveFormsModule,
    NgbModule, // temp
  ],
  declarations: [TruncatePipe, GroupByPipe, CustomDate, SimpleSoftSearchComponent, CalenderComponent, CommonDropdownComponent,
    DateRangePickerComponent, FileUploadComponent, TreeviewDataConvertPipe, CommonCheckboxComponent,
    DateTimePickerComponent, RemoveSelect, CloseModalDirective ],
  exports: [TruncatePipe, GroupByPipe, CustomDate, SimpleSoftSearchComponent, CalenderComponent,
    CommonDropdownComponent, DateRangePickerComponent, FileUploadComponent,
    RemoveSelect,CloseModalDirective,
    TreeviewDataConvertPipe, CommonCheckboxComponent, DateTimePickerComponent
  ],
  providers: [GroupByPipe // for other module
    ,{ provide: NgbDateParserFormatter, useFactory: () => new CustomNgbDateParserFormatter('longDate') }]
})
export class ElementModule { }
