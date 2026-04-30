import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ManageCartHotelComponent } from './manage-cart-hotel.component';
import { CartDetailComponent } from './cart-detail/cart-detail.component';

const routes: Routes = [
                      {
                        path:'',
                        component:ManageCartHotelComponent
                      },
                      {
                        path:'cart-detail/:refno',
                        component:CartDetailComponent
                      }
                      
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ManageCartHotelRoutingModule { }
