import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { PaymentResponseComponent } from './payment-response.component';

const routes: Routes = [

                          {
                            path:'',
                            component:PaymentResponseComponent
                          }

                       ];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PaymentResponseRoutingModule { }
