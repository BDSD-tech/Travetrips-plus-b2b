import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { BillingInfoComponent } from './billing-info/billing-info.component';
import { BookingCalendarComponent } from './booking-calendar/booking-calendar.component';
import { DepositRequestComponent } from './deposit-request/deposit-request.component';
import { DownloadReportComponent } from './download-report/download-report.component';
import { ItineraryComponent } from './manage-amendments/itinerary/itinerary.component';
import { ManageAmendmentsComponent } from './manage-amendments/manage-amendments.component';
import { ManageCartsComponent } from './manage-carts/manage-carts.component';
import { CartDetailComponent } from './manage-carts/manage-carts/cart-detail/cart-detail.component';
import { ManageDepositRequestComponent } from './manage-deposit-request/manage-deposit-request.component';
import { ManageMarkupComponent } from './manage-markup/manage-markup.component';
import { PaymentPassbookComponent } from './payment-passbook/payment-passbook.component';
import { UserDetailComponent } from './user-detail/user-detail.component';
import { HotelComponent } from './manage-markup/hotel/hotel.component';
import { CreditRequestComponent } from './credit-request/credit-request.component';
import { CreditNotesComponent } from './credit-notes/credit-notes.component';
import { ViewCreditNotesComponent } from './view-credit-notes/view-credit-notes.component';
import { CreditNotesHotelComponent } from './credit-notes-hotel/credit-notes-hotel.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { BookingsComponent } from './bookings/bookings.component';
const routes: Routes = [
                            {
                              path:'',
                              component:DashboardComponent
                            },
                            {
                              path:'booking-calendar',
                              component:BookingCalendarComponent
                            },
                            {
                              path:'bookings',
                              component:BookingsComponent
                            },
                            {
                              path:'manage-carts/cart-detail/:refno',
                              component:CartDetailComponent
                            },
                            {
                              path:'manage-amendments',
                              component:ManageAmendmentsComponent
                            },
                            {
                              path:'amendments/itinerary',
                              component:ItineraryComponent
                            },
                            {
                              path:'payment-passbook',
                              component:PaymentPassbookComponent
                            },
                            {
                              path:'manage-deposit-request',
                              component:ManageDepositRequestComponent
                            },
                            {
                              path:'deposit-request',
                              component:DepositRequestComponent
                            },
                            {
                              path:'credit-request',
                              component:CreditRequestComponent
                            },
                            {
                              path:'flight-credit-notes',
                              component:CreditNotesComponent
                            },
                            {
                              path:'hotel-credit-notes',
                              component:CreditNotesHotelComponent
                            },
                            {
                              path:'billing-info',
                              component:BillingInfoComponent
                            },
                            {
                              path:'download-report',
                              component:DownloadReportComponent
                            },
                            {
                              path:'manage-markup',
                              component:ManageMarkupComponent
                            },
                            {
                              path:'manage-markup-hotel',
                              component:HotelComponent
                            },
                            {
                              path:'view-credit-notes',
                              component:ViewCreditNotesComponent
                            },
                            {
                              path:'user-detail/:userid',
                              component:UserDetailComponent
                            },
                            // {
                            //   path: 'manage-cart-hotel',
                            //   loadChildren: () => import('../dashboard/manage-cart-hotel/manage-cart-hotel.module')
                            //     .then(mod => mod.ManageCartHotelModule)
                            // },
                            {
                              path: 'users',
                              loadChildren: () => import('./users/users.module')
                                .then(mod => mod.UsersModule)
                            },
                            {
                              path: 'manage-amendments-hotel',
                              loadChildren: () => import('../dashboard/manage-amendments-hotel/manage-amendments-hotel.module')
                                .then(mod => mod.ManageAmendmentsHotelModule)
                            },

];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class DashboardRoutingModule { }
