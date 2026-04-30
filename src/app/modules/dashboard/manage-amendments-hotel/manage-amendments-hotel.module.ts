import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ManageAmendmentsHotelRoutingModule } from './manage-amendments-hotel-routing.module';
import { ManageAmendmentsHotelComponent } from './manage-amendments-hotel.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MaterialModuleModule } from '../../../shared/material-module.module';
import { ItineraryComponent } from './itinerary/itinerary.component';
import { SafeHtmlModule } from '../../../shared/safe-html.module';


@NgModule({
  declarations: [
    ManageAmendmentsHotelComponent,
    ItineraryComponent
  ],
  imports: [
    CommonModule,
    ManageAmendmentsHotelRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    MaterialModuleModule,
    SafeHtmlModule
  ]
})
export class ManageAmendmentsHotelModule { }
