import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ManageMarkupHotelComponent } from './manage-markup-hotel.component';

const routes: Routes = [
        {
          path:'',
          component:ManageMarkupHotelComponent
        }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ManageMarkupHotelRoutingModule { }
