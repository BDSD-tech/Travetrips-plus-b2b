import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { HotelComponent } from './hotel.component';
import { SearchComponent } from './search/search.component';
import { HotelRoomDetailComponent } from './hotel-room-detail/hotel-room-detail.component';
import { ReviewComponent } from './review/review.component';
import { FinalReviewComponent } from './final-review/final-review.component';
import { BookingConfirmationComponent } from './booking-confirmation/booking-confirmation.component';
import { PrintTicketComponent } from './print-ticket/print-ticket.component';
import { PrintInvoiceComponent } from './print-invoice/print-invoice.component';


const routes: Routes = [
                            {
                            path:'',
                            component:HotelComponent,
                            },
                            {
                            path:'search',
                            component:SearchComponent,
                            },
                            {
                            path:'hotel-detail',
                            component:HotelRoomDetailComponent,
                            },
                            {
                            path:'itinerary',
                            component:ReviewComponent,
                            },
                            // {
                            // path:'review',
                            // component:FinalReviewComponent,
                            // },
                            {
                            path:'confirmation',
                            component:BookingConfirmationComponent,
                            },
                            {
                            path:'ticket',
                            component:PrintTicketComponent,
                            },
                            {
                            path:'invoice',
                            component:PrintInvoiceComponent,
                            }
                      ];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class HotelRoutingModule { }
