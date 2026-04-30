import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ManageAmendmentsHotelComponent } from './manage-amendments-hotel.component';
import { ItineraryComponent } from './itinerary/itinerary.component';

const routes: Routes = [
              {
                path:'',
                component:ManageAmendmentsHotelComponent
              },
              {
                path:'itinerary',
                component:ItineraryComponent
              }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ManageAmendmentsHotelRoutingModule { }
