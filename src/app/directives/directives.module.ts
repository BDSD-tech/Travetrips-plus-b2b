import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DatepickerDirective } from './datepicker.directive';


@NgModule({
  declarations: [
    DatepickerDirective
  ],
  imports: [
    CommonModule
  ],
  exports: [DatepickerDirective]
})
export class DirectivesModule { }
