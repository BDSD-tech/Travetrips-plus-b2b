import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { PaymentResponseRoutingModule } from './payment-response-routing.module';
import { PaymentResponseComponent } from './payment-response.component';


@NgModule({
  declarations: [
    PaymentResponseComponent
  ],
  imports: [
    CommonModule,
    PaymentResponseRoutingModule
  ]
})
export class PaymentResponseModule { }
