import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CountDownComponent } from './count-down.component';
import { MatDialogModule } from '@angular/material/dialog';

@NgModule({
  declarations: [CountDownComponent],
  imports: [
    CommonModule,
    MatDialogModule
  ],
  exports: [
    CountDownComponent
  ]
})
export class CountDownModule { }
