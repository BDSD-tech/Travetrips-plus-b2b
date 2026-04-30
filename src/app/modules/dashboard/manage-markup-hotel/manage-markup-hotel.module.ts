import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ManageMarkupHotelRoutingModule } from './manage-markup-hotel-routing.module';
import { ManageMarkupHotelComponent } from './manage-markup-hotel.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MaterialModuleModule } from 'src/app/shared/material-module.module';


@NgModule({
  declarations: [
    ManageMarkupHotelComponent
  ],
  imports: [
    CommonModule,
    ManageMarkupHotelRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    MaterialModuleModule
  ]
})
export class ManageMarkupHotelModule { }
