import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { OnlineRechargeRoutingModule } from './online-recharge-routing.module';
import { OnlineRechargeComponent } from './online-recharge.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';


@NgModule({
  declarations: [
    OnlineRechargeComponent
  ],
  imports: [
    CommonModule,
    OnlineRechargeRoutingModule,
    FormsModule,
    ReactiveFormsModule
  ]
})
export class OnlineRechargeModule { }
