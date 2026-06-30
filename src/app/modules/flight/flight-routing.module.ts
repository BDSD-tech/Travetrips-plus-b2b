import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { BookingConfirmationComponent } from './booking-confirmation/booking-confirmation.component';
import { DetailsReviewComponent } from './details-review/details-review.component';
import { DomesticRoundtripComponent } from './domestic-roundtrip/domestic-roundtrip.component';
import { FlightComponent } from './flight.component';
import { PrintInvoiceComponent } from './print-invoice/print-invoice.component';
import { PrintTicketComponent } from './print-ticket/print-ticket.component';

import { SearchComponent } from './search/search.component';
import { TravellerDetailComponent } from './traveller-detail/traveller-detail.component';

const routes: Routes = [
                          {
                            path:'',
                            component:FlightComponent
                          },
                          {
                            path:'search',
                            component:SearchComponent
                          },
                          {
                            path:'rtsearch',
                            component:DomesticRoundtripComponent
                          },
                          {
                            path:'itinerary',
                            component:DetailsReviewComponent
                          },
                          {
                            path:'traveller',
                            component:TravellerDetailComponent
                          },
                          // {
                          //   path:'review-detail',
                          //   component:ReviewComponent
                          // },
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
export class FlightRoutingModule { }
