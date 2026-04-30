import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { OnlineRechargeComponent } from './online-recharge.component';

const routes: Routes = [

              {
                path:'',
                component:OnlineRechargeComponent
              }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class OnlineRechargeRoutingModule { }
