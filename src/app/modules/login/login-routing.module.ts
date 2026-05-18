import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ForgotPasswordComponent } from './forgot-password/forgot-password.component';
import { LoginComponent } from './login.component';
import { LandingPageComponent } from '../landing-page/landing-page.component';

const routes: Routes = [
                            {
                              path:'',
                              component:LandingPageComponent
                            },
                            {
                              path:'login',
                              component:LoginComponent
                            },
                            {
                              path:'forgot-password',
                              component:ForgotPasswordComponent
                            }
                        ];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class LoginRoutingModule { }
