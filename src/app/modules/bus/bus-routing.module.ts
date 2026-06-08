import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { BusComponent } from './bus.component';
import { SearchComponent } from './search/search.component';
import { ReviewDetailComponent } from './review-detail/review-detail.component';
import { FinalReviewComponent } from './final-review/final-review.component';
import { BookingConfirmationComponent } from './booking-confirmation/booking-confirmation.component';
import { PrintTicketComponent } from './print-ticket/print-ticket.component';
import { PrintInvoiceComponent } from './print-invoice/print-invoice.component';

const routes: Routes = [
                        {
                          path:'',
                          component:BusComponent
                        },
                        {
                          path:'search',
                          component:SearchComponent
                        },
                        {
                          path:'review-detail',
                          component:ReviewDetailComponent
                        },
                        {
                          path:'review',
                          component:FinalReviewComponent
                        },
                        {
                          path:'confirmation',
                          component:BookingConfirmationComponent
                        },
                        {
                          path:'ticket',
                          component:PrintTicketComponent
                        },
                        {
                          path:'invoice',
                          component:PrintInvoiceComponent
                        }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class BusRoutingModule { }
