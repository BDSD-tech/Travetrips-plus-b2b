import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DashboardComponent } from './layouts/dashboard/dashboard.component';
import { DefaultComponent } from './layouts/default/default.component';
import { LoginComponent } from './layouts/login/login.component';
import { AuthGuard } from './_helpers';

const routes: Routes = [
                            {
                              path:'',
                              component:LoginComponent,
                              children:[
                                          
                                          {
                                            path: '',
                                            loadChildren: () => import('./modules/login/login.module')
                                              .then(mod => mod.LoginModule)
                                          },
                                          {
                                            path: 'register',
                                            loadChildren: () => import('./modules/signup/signup.module')
                                              .then(mod => mod.SignupModule)
                                          },
                                          {
                                            path: 'pages',
                                            loadChildren: () => import('./modules/pages/pages.module')
                                              .then(mod => mod.PagesModule)
                                          }
                                      ]
                            },
                            {
                              path:'',
                              component:DefaultComponent,
                              children:[
                                {
                                  path: 'flight',
                                  loadChildren: () => import('./modules/flight/flight.module')
                                    .then(mod => mod.FlightModule)
                                },
                                {
                                  path: 'hotel',
                                  loadChildren: () => import('./modules/hotel/hotel.module')
                                    .then(mod => mod.HotelModule)
                                },
                                {
                                  path: 'bus',
                                  loadChildren: () => import('./modules/bus/bus.module').then(m => m.BusModule)
                                },
                                {
                                  path: 'visa',
                                  loadComponent: () => import('./modules/visa/visa.component').then(m => m.VisaComponent)
                                },
                                {
                                  path: 'payment',
                                  loadChildren: () => import('./modules/payment/payment.module')
                                    .then(mod => mod.PaymentModule)
                                },
                                {
                                  path: 'payment-response',
                                  loadChildren: () => import('./modules/payment-response/payment-response.module')
                                    .then(mod => mod.PaymentResponseModule)
                                },
                                {
                                  path: 'error-response',
                                  loadChildren: () => import('./modules/error-page/error-page.module')
                                    .then(mod => mod.ErrorPageModule)
                                }
                               ],
                               canActivate: [AuthGuard]
                            },
                            {
                              path:'',
                              component:DashboardComponent,
                              children:[
                                {
                                  path: 'dashboard',
                                  loadChildren: () => import('./modules/dashboard/dashboard.module')
                                    .then(mod => mod.DashboardModule)
                                },
                                
                                {
                                  path: 'dashboard/online-recharge',
                                  loadChildren: () => import('./modules/online-recharge/online-recharge.module')
                                    .then(mod => mod.OnlineRechargeModule)
                                }
                               ],
                               canActivate: [AuthGuard]
                            },
                            {
                              path: 'emulate-user',
                              pathMatch: 'full',
                              loadChildren: () => import('./modules/emulate-user/emulate-user.module').then( m => m.EmulateUserModule)
                            },
                            {
                              path: '**',
                              pathMatch: 'full',
                              loadChildren: () => import('./modules/page-not-found/page-not-found.module').then( m => m.PageNotFoundPageModule)
                            }
];

@NgModule({
  imports: [RouterModule.forRoot(routes,{scrollPositionRestoration: 'enabled'})],
  exports: [RouterModule]
})
export class AppRoutingModule { }
