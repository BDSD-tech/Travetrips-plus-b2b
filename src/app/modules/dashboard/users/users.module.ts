import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { UsersComponent } from './users.component';
import { CarComponent } from '../../car/car.component';
import { MaterialModuleModule } from '../../../shared/material-module.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

const routes:Routes=[
  {
    path:'',
    component:UsersComponent
  }
]

@NgModule({
  declarations: [UsersComponent],
  imports: [
    CommonModule,
    MaterialModuleModule,
    FormsModule,
    ReactiveFormsModule,
    RouterModule.forChild(routes)
  ]
  
})
export class UsersModule { }
