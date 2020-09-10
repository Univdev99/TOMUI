import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FooterComponent } from './footer/footer.component';
import { MenuLogoComponent } from './menu-logo/menu-logo.component';
import { RouterModule } from '@angular/router';
import { ProProfileViewComponent } from './pro-profile-view/pro-profile-view.component';
import { ElementModule } from '../element/element.module';
import { HelpComponent } from './help/help.component';
import { FormsModule } from '../../../../node_modules/@angular/forms';
import { ReviewComponent } from './review/review.component';
import { RatingModule } from 'ng-starrating';
import { ValidationModule } from '../validation/validation.module';
import { NgbRatingModule } from '../../../../node_modules/@ng-bootstrap/ng-bootstrap';
import { NavBarComponent } from '../../nav-bar/nav-bar.component';
import { ProfessionalModule } from '../../professional/pro.module';
import { ProMainComponent } from '../../professional/pro-main/pro-main.component';
import { FirmMainComponent } from '../../firm/firm-main/firm-main.component';
import { DashboardMenuComponent } from '../../firm/dashboard-menu/dashboard-menu.component';
import { ProMenuComponent } from '../../professional/pro-menu/pro-menu.component';

@NgModule({
  declarations: [FooterComponent, NavBarComponent, MenuLogoComponent, ProProfileViewComponent, HelpComponent, ReviewComponent,
    ProMenuComponent,
    DashboardMenuComponent
  ],
  imports: [
    CommonModule,
    RouterModule,
    ElementModule,
    FormsModule,

    NgbRatingModule,
    RatingModule,
    ValidationModule,

  ],
  exports: [FooterComponent, MenuLogoComponent, HelpComponent, ReviewComponent,
     NavBarComponent,
     ProMenuComponent,
     DashboardMenuComponent
    
    ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  entryComponents: [
    ProProfileViewComponent, // model is not opened
    ReviewComponent
  ]
})
export class CommonPageModule { }

