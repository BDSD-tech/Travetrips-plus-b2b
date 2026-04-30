import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { EmulateUserComponent } from './emulate-user.component';

const routes: Routes = [
                          {
                            path:'',
                            component:EmulateUserComponent
                          }
                        ];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class EmulateUserRoutingModule { }
