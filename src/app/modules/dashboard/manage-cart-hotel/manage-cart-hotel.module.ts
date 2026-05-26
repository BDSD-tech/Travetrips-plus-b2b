import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ManageCartHotelRoutingModule } from './manage-cart-hotel-routing.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MaterialModuleModule } from '../../../shared/material-module.module';
import { CartDetailComponent } from './cart-detail/cart-detail.component';
import { SafeHtmlModule } from '../../../shared/safe-html.module';


@NgModule({
  declarations: [
    CartDetailComponent
  ],
  imports: [
    CommonModule,
    ManageCartHotelRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    MaterialModuleModule,
    SafeHtmlModule
  ]
})
export class ManageCartHotelModule { }
