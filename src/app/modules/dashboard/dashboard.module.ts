import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { DashboardRoutingModule } from './dashboard-routing.module';
import { BookingCalendarComponent } from './booking-calendar/booking-calendar.component';
import { ManageAmendmentsComponent } from './manage-amendments/manage-amendments.component';
import { PaymentPassbookComponent } from './payment-passbook/payment-passbook.component';
import { ManageDepositRequestComponent } from './manage-deposit-request/manage-deposit-request.component';
import { DepositRequestComponent } from './deposit-request/deposit-request.component';
import { BillingInfoComponent } from './billing-info/billing-info.component';
import { DownloadReportComponent } from './download-report/download-report.component';
import { ManageMarkupComponent } from './manage-markup/manage-markup.component';
import { UserDetailComponent } from './user-detail/user-detail.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NumberToWordsPipe } from '../../utils/number-to-words.pipe';
import { MaterialModuleModule } from '../../shared/material-module.module';
import { CartDetailComponent } from './manage-carts/manage-carts/cart-detail/cart-detail.component';
import { ItineraryComponent } from './manage-amendments/itinerary/itinerary.component'; 
import { ManageCartsComponent } from './manage-carts/manage-carts.component';
import { HotelComponent } from './manage-markup/hotel/hotel.component';
import { CreditRequestComponent } from './credit-request/credit-request.component';
import { CdkTableModule } from "@angular/cdk/table";
import { CreditNotesComponent } from './credit-notes/credit-notes.component';
import { ViewCreditNotesComponent } from './view-credit-notes/view-credit-notes.component';
import { SafeHtmlModule } from "../../shared/safe-html.module";
import { CreditNotesHotelComponent } from './credit-notes-hotel/credit-notes-hotel.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { BookingsComponent } from './bookings/bookings.component';
import { ManageCartHotelComponent } from './manage-cart-hotel/manage-cart-hotel.component';
import { MarkupComponent } from './markup/markup.component';
import { AmendmentsComponent } from './amendments/amendments.component';
import { ManageAmendmentsHotelComponent } from './manage-amendments-hotel/manage-amendments-hotel.component';
import { BookingListComponent } from './bus/booking-list/booking-list.component';
import { BookingDetailComponent } from './bus/booking-detail/booking-detail.component';
import { CartDetailHotelComponent} from '../dashboard/manage-cart-hotel/cart-detail/cart-detail.component';
import { MatTooltip } from "@angular/material/tooltip";
import { BankDetailsComponent } from './bank-details/bank-details.component';

@NgModule({
  declarations: [ 
     BookingsComponent,BankDetailsComponent,ManageCartHotelComponent,BookingCalendarComponent,ManageCartsComponent,CartDetailComponent, ManageAmendmentsComponent, PaymentPassbookComponent, ManageDepositRequestComponent, DepositRequestComponent, BillingInfoComponent, DownloadReportComponent, ManageMarkupComponent, UserDetailComponent,NumberToWordsPipe, ItineraryComponent
  ,HotelComponent,CartDetailHotelComponent,BookingDetailComponent,BookingListComponent,DashboardComponent,ManageAmendmentsHotelComponent,CreditRequestComponent,CreditNotesComponent,MarkupComponent,ViewCreditNotesComponent,CreditNotesHotelComponent,AmendmentsComponent],
  imports: [
    CommonModule,
    DashboardRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    MaterialModuleModule,
    CdkTableModule,
    SafeHtmlModule,
    MatTooltip
],
  schemas:[CUSTOM_ELEMENTS_SCHEMA]

})
export class DashboardModule { }
