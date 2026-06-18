import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

const routes: Routes = [
                            
                            {
                              path:'booking-calendar',
                              loadComponent: () => import('../dashboard/booking-calendar/booking-calendar.component')
                                .then(mod => mod.BookingCalendarComponent)
                            },
                            {
                              path:'bookings',
                              loadComponent: () => import('../dashboard/bookings/bookings.component')
                                .then(mod => mod.BookingsComponent)
                            },
                            {
                              path:'amendments',
                              loadComponent: () => import('../dashboard/amendments/amendments.component')
                                .then(mod => mod.AmendmentsComponent)
                            },
                            {
                              path:'manage-carts/cart-detail/:refno',
                              loadComponent: () => import('../dashboard/manage-carts/manage-carts/cart-detail/cart-detail.component')
                                .then(mod => mod.CartDetailComponent)
                            },
                            {
                              path:'manage-amendments',
                              loadComponent: () => import('../dashboard/manage-amendments/manage-amendments.component')
                                .then(mod => mod.ManageAmendmentsComponent)
                            },
                            {
                              path:'amendments/itinerary',
                              loadComponent: () => import('../dashboard/manage-amendments/itinerary/itinerary.component')
                                .then(mod => mod.ItineraryComponent)
                            },
                            {
                              path:'payment-passbook',
                              loadComponent: () => import('../dashboard/payment-passbook/payment-passbook.component')
                                .then(mod => mod.PaymentPassbookComponent)
                            },
                            {
                              path:'manage-deposit-request',
                              loadComponent: () => import('../dashboard/manage-deposit-request/manage-deposit-request.component')
                                .then(mod => mod.ManageDepositRequestComponent)
                              
                            },
                            {
                              path:'deposit-request',
                              loadComponent: () => import('../dashboard/deposit-request/deposit-request.component')
                                .then(mod => mod.DepositRequestComponent)
                            },
                            {
                              path:'credit-request',
                              loadComponent: () => import('../dashboard/credit-request/credit-request.component')
                                .then(mod => mod.CreditRequestComponent)
                            },
                            {
                              path:'flight-credit-notes',
                              loadComponent: () => import('../dashboard/credit-notes/credit-notes.component')
                                .then(mod => mod.CreditNotesComponent)
                            },
                            {
                              path:'hotel-credit-notes',
                              loadComponent: () => import('../dashboard/credit-notes-hotel/credit-notes-hotel.component')
                                .then(mod => mod.CreditNotesHotelComponent)
                            },
                            {
                              path:'billing-info',
                              loadComponent: () => import('../dashboard/billing-info/billing-info.component')
                                .then(mod => mod.BillingInfoComponent)
                            },
                            {
                              path:'download-report',
                              loadComponent: () => import('../dashboard/download-report/download-report.component')
                                .then(mod => mod.DownloadReportComponent)
                             
                            },
                            {
                              path:'markup',
                              loadComponent: () => import('../dashboard/markup/markup.component')
                                .then(mod => mod.MarkupComponent)
                              
                            },
                            {
                              path:'view-credit-notes',
                               loadComponent: () => import('../dashboard/view-credit-notes/view-credit-notes.component')
                                .then(mod => mod.ViewCreditNotesComponent)
                            },
                            {
                              path:'user-detail/:userid',
                               loadComponent: () => import('../dashboard/user-detail/user-detail.component')
                                .then(mod => mod.UserDetailComponent)
                            },
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
                            {
                              path: 'hotel-booking-details/:refno',
                              loadComponent: () => import('../dashboard/manage-cart-hotel/cart-detail/cart-detail.component')
                                .then(mod => mod.CartDetailHotelComponent)
                            },
                            {
                              path: 'bus-booking-detail/:id',
                              loadComponent: () => import('../dashboard/bus/booking-detail/booking-detail.component')
                                .then(mod => mod.BookingDetailComponent)
                            },
                            

];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class DashboardRoutingModule { }
