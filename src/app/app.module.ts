import { HttpClientModule } from '@angular/common/http';
import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NgxSpinnerModule } from "ngx-spinner";
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { AppComponent } from './app.component';
import { AppRoutingModule } from './app.routing';
import { ChangePasswordComponent } from './change-password/change-password.component';
import { CommonPageModule } from './common/common-page/common-page.module';
import { ValidationModule } from './common/validation/validation.module';
import { GeneralLoginComponent } from './general-login/general-login.component';
import { HomeComponent } from './home/home.component';
import { LoginComponent } from './login/login.component';
import { NavBarComponent } from './nav-bar/nav-bar.component';
import { FullCalendarModule } from '@fullcalendar/angular'; // the main connector. must go first
import dayGridPlugin from '@fullcalendar/daygrid'; // a plugin
import interactionPlugin from '@fullcalendar/interaction';
import { AboutComponent } from './about/about.component';
import { ForgotPasswordComponent } from './forgot-password/forgot-password.component';
import { ChangeRecoverPasswordComponent } from './change-recover-password/change-recover-password.component';
import { ResetMailSuccessComponent } from './reset-mail-success/reset-mail-success.component';
import { HowItWorksComponent } from './how-it-works/how-it-works.component';
import { PrivacyPolicyComponent } from './privacy-policy/privacy-policy.component'; // a plugin

FullCalendarModule.registerPlugins([ // register FullCalendar plugins
  dayGridPlugin,
  interactionPlugin,
]);

@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    // NavBarComponent,
    LoginComponent,
    GeneralLoginComponent,
    ChangePasswordComponent,
    AboutComponent,
    ForgotPasswordComponent,
    ChangeRecoverPasswordComponent,
    ResetMailSuccessComponent,
    HowItWorksComponent,
    PrivacyPolicyComponent,
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    HttpClientModule,
    FormsModule,
    ValidationModule,
    AppRoutingModule,
    CommonPageModule,
    NgxSpinnerModule,
    FullCalendarModule 
  ],
  entryComponents: [
    ChangePasswordComponent
  ],
  providers: [NgbActiveModal],
  bootstrap: [AppComponent],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  // exports: [NavBarComponent]

})
export class AppModule { }
