import { NgModule } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { HotelRoutingModule } from './hotel-routing.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MaterialModuleModule } from '../../shared/material-module.module';
import { SafeHtmlModule } from '../../shared/safe-html.module';
import { HotelComponent } from './hotel.component';
import { SearchComponent } from './search/search.component';
import { ModifySearchComponent } from './modify-search/modify-search.component';
import { DirectivesModule } from '../../directives/directives.module';
import { FilterComponent } from './filter/filter.component';
import { LoadingComponent } from './loading/loading.component';
import { LoadingFilterComponent } from './loading/loading-filter.component';
import { HotelRoomDetailComponent } from './hotel-room-detail/hotel-room-detail.component';
import { ReviewComponent } from './review/review.component';
import { DialogModalModule } from '../modal/dialog-modal/dialog-modal.module';
import { FinalReviewComponent } from './final-review/final-review.component';
import { BookingConfirmationComponent } from './booking-confirmation/booking-confirmation.component';
import { PrintTicketComponent } from './print-ticket/print-ticket.component';
import { PrintInvoiceComponent } from './print-invoice/print-invoice.component';
import { CountDownModule } from '../modal/count-down/count-down.module';
import { RouterModule } from '@angular/router';
import { routes } from '../../app.routes';


@NgModule({
  declarations: [
    HotelComponent,
    SearchComponent,
    ModifySearchComponent,
    FilterComponent,
    LoadingComponent,
    LoadingFilterComponent,
    HotelRoomDetailComponent,
    ReviewComponent,
    FinalReviewComponent,
    BookingConfirmationComponent,
    PrintTicketComponent,
    PrintInvoiceComponent
  ],
  imports: [
    CommonModule,
    HotelRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    MaterialModuleModule,
    CountDownModule,
    SafeHtmlModule,
    DirectivesModule,
    DialogModalModule,
    DatePipe
  ]
})
export class HotelModule { }
