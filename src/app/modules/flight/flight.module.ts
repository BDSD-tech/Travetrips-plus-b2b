import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { FlightRoutingModule } from './flight-routing.module';
import { FlightComponent } from './flight.component';
import { FilterComponent } from './filter/filter.component';
import { ModifySearchComponent } from './modify-search/modify-search.component';
import { SearchComponent } from './search/search.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MaterialModuleModule } from '../../shared/material-module.module';
import { LoadingComponent } from './loading/loading.component';
import { DetailsReviewComponent } from './details-review/details-review.component';
import { SafeHtmlModule } from '../../shared/safe-html.module';
import { TravellerDetailComponent } from './traveller-detail/traveller-detail.component';
import { ReviewComponent } from './review/review.component';
import { BookingConfirmationComponent } from './booking-confirmation/booking-confirmation.component';
import { DomesticRoundtripComponent } from './domestic-roundtrip/domestic-roundtrip.component';
import { PrintTicketComponent } from './print-ticket/print-ticket.component';
import { PrintInvoiceComponent } from './print-invoice/print-invoice.component';
import { LoadingFilterComponent } from './loading/loading-filter.component';
import { CountDownModule } from '../modal/count-down/count-down.module';
import { ImportantNotificationComponent } from '../modal/important-notification/important-notification.component';
import { DirectivesModule } from '../../directives/directives.module';
import { SortByOfferedPricePipe } from './sortpipe';

@NgModule({
  declarations: [
    FlightComponent,SortByOfferedPricePipe,SearchComponent,DomesticRoundtripComponent, ModifySearchComponent, FilterComponent,LoadingComponent,DetailsReviewComponent, TravellerDetailComponent, ReviewComponent,BookingConfirmationComponent, PrintTicketComponent, PrintInvoiceComponent, LoadingFilterComponent,ImportantNotificationComponent
    
  ],
  imports: [
    CommonModule,
    FlightRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    MaterialModuleModule,
    SafeHtmlModule,
    CountDownModule,
    DirectivesModule,
   
  ]
})
export class FlightModule { }
