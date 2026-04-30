import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { PagesRoutingModule } from './pages-routing.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { ContactUsComponent } from './contact-us/contact-us.component';
import { TermsAndConditionsComponent } from './terms-and-conditions/terms-and-conditions.component';
import { PrivacyPolicyComponent } from './privacy-policy/privacy-policy.component';
import { PaymentSecurityComponent } from './payment-security/payment-security.component';
import { AboutUsComponent } from './about-us/about-us.component';
import { UserAgreementComponent } from './user-agreement/user-agreement.component';
import { FaqComponent } from './faq/faq.component';
import { ProductsComponent } from './products/products.component';
import { FlightComponent } from './flight/flight.component';
import { HotelComponent } from './hotel/hotel.component';
import { VisaComponent } from './visa/visa.component';


@NgModule({
  declarations: [ContactUsComponent, TermsAndConditionsComponent, PrivacyPolicyComponent, PaymentSecurityComponent, AboutUsComponent, UserAgreementComponent, FaqComponent, ProductsComponent, FlightComponent, HotelComponent, VisaComponent],
  imports: [
    CommonModule,
    PagesRoutingModule,
    FormsModule,
    ReactiveFormsModule
  ]
})
export class PagesModule { }
