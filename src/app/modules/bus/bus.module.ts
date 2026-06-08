import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BusRoutingModule } from './bus-routing.module';
import { BusComponent } from './bus.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { SearchComponent } from './search/search.component';
import { ModifySearchComponent } from './modify-search/modify-search.component';
import { LoadingFilterComponent } from './loading/loading-filter.component';
import { LoadingComponent } from './loading/loading.component';
import { ReviewDetailComponent } from './review-detail/review-detail.component';
import { FilterComponent } from './filter/filter.component';
import { SeatLayoutComponent } from './seat-layout/seat-layout.component';
import { FinalReviewComponent } from './final-review/final-review.component';
import { PrintInvoiceComponent } from './print-invoice/print-invoice.component';
import { PrintTicketComponent } from './print-ticket/print-ticket.component';
import { BookingConfirmationComponent } from './booking-confirmation/booking-confirmation.component';
import { MaterialModuleModule } from '../../shared/material-module.module';
import { SafeHtmlModule } from '../../shared/safe-html.module';
import { DirectivesModule } from '../../directives/directives.module';
import { CountDownModule } from '../modal/count-down/count-down.module';

@NgModule({
  declarations: [
    BusComponent,
    SearchComponent,
    ModifySearchComponent,
    LoadingFilterComponent,
    LoadingComponent,
    FilterComponent,
    ReviewDetailComponent,
    SeatLayoutComponent,
    FinalReviewComponent,
    PrintInvoiceComponent,
    BookingConfirmationComponent,
    PrintTicketComponent,
  ],
  imports: [
    CommonModule,
    BusRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    MaterialModuleModule,
    SafeHtmlModule,
    DirectivesModule,
    CountDownModule
  ]
})
export class BusModule { }
