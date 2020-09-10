import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { LoginComponent } from './login/login.component';
import { GeneralLoginComponent } from './general-login/general-login.component';
import { IsAlreadyLoggedinService } from './common/is-already-logged-in.service';
import { AboutComponent } from './about/about.component';
import { ForgotPasswordComponent } from './forgot-password/forgot-password.component';
import { ChangeRecoverPasswordComponent } from './change-recover-password/change-recover-password.component';
import { ResetMailSuccessComponent } from './reset-mail-success/reset-mail-success.component';
import { HelpComponent } from './common/common-page/help/help.component';


const routes: Routes = [
  { path: 'home', component: HomeComponent },
  { path: 'login-page', component: GeneralLoginComponent },
  { path: 'reset-mail-success', component: ResetMailSuccessComponent },

  { path: 'forgot-password', component: ForgotPasswordComponent },
  { path: 'recover-password', component: ChangeRecoverPasswordComponent },
  { path: 'contact', component: HelpComponent },
  { path: 'about', component: AboutComponent },
  { path: 'login', component: LoginComponent, canActivate: [IsAlreadyLoggedinService] },
  {
    path: 'firm', loadChildren: () => import('./firm/firm.module').then(m => m.FirmModule)
  },
  {
    path: 'professional', loadChildren: () => import('./professional/pro.module').then(m => m.ProfessionalModule)
  },
  {
    path: 'admin', loadChildren: () => import('./admin/admin.module').then(m => m.AdminModule)
  },
  {
    path: '', component: HomeComponent,
  },
  { path: '**', redirectTo: '' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes, { useHash: true, onSameUrlNavigation: 'reload' })],
  exports: [RouterModule]
})
export class AppRoutingModule { }
