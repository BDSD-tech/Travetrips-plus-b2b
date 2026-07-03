import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ContactUsComponent } from './contact-us/contact-us.component';
import { PaymentSecurityComponent } from './payment-security/payment-security.component';
import { PrivacyPolicyComponent } from './privacy-policy/privacy-policy.component';
import { TermsAndConditionsComponent } from './terms-and-conditions/terms-and-conditions.component';
import { AboutUsComponent } from './about-us/about-us.component';
import { UserAgreementComponent } from './user-agreement/user-agreement.component';
import { FaqComponent } from './faq/faq.component';
import { ProductsComponent } from './products/products.component';
import { FlightComponent } from './flight/flight.component';
import { HotelComponent } from './hotel/hotel.component';
import { VisaComponent } from './visa/visa.component';
import { PageComponent } from './page/page.component';

const routes: Routes = [
                          {
                            path:'page/:slug',
                            component:PageComponent
                          },
                          {
                            path:'contact-us',
                            component:ContactUsComponent
                          },
                          {
                            path:'payment-security',
                            component:PaymentSecurityComponent
                          },
                          {
                            path:'privacy-policy',  
                            component:PrivacyPolicyComponent
                          },
                          {
                            path:'terms-and-conditions',
                            component:TermsAndConditionsComponent
                          },
                          {
                            path:'about-us',
                            component:AboutUsComponent
                          },
                          {
                            path:'user-agreement',
                            component:UserAgreementComponent
                          },
                          {
                            path:'faq',
                            component:FaqComponent
                          },
                          {
                            path:'products',
                            component:ProductsComponent
                          },
                          {
                            path:'flight',
                            component:FlightComponent
                          },
                          {
                            path:'hotel',
                            component:HotelComponent
                          },
                          {
                            path:'visa',
                            component:VisaComponent
                          }
                      ];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PagesRoutingModule { }
