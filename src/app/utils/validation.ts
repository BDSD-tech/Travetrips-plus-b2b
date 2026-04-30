import { AbstractControl, ValidatorFn } from '@angular/forms';
export default class Validation {
  static match(controlName: string, checkControlName: string): ValidatorFn {
    return (controls: AbstractControl) => {
      const control = controls.get(controlName);
      const checkControl = controls.get(checkControlName);
      if (checkControl?.errors && !checkControl.errors['matching']) {
        return null;
      }
      if (control?.value !== checkControl?.value) {
        controls.get(checkControlName)?.setErrors({ matching: true });
        return { matching: true };
      } else {
        return null;
      }
    };
  }
static  NoofNight(controlName: string, checkControlName: string):ValidatorFn {
    return (controls: AbstractControl) => {
      const control = controls.get(controlName);
      const checkControl = controls.get(checkControlName);
      if (checkControl?.errors && !checkControl.errors['mustMatch']) {
        return null;
      }
      let night=this.Calculatedatediff(checkControlName,checkControlName)
      if (night > 14) {
        controls.get(checkControlName)?.setErrors({ notmatching: true });
        return { notmatching: true };
      } else {
        return null;
      }
    }
  }
  static Calculatedatediff(date1: string | number | Date,date2: string | number | Date)
  {
    let diffc;
    let days;
    let ndate1=new Date(date1);
    let ndate2=new Date(date2);
    diffc = ndate1.getTime() - ndate2.getTime();
    days = Math.round(Math.abs(diffc/(1000*60*60*24)));
    return days;
  }
  static NotMatch(controlName: string, checkControlName: string): ValidatorFn {
    return (controls: AbstractControl) => {
      const control = controls.get(controlName);
      const checkControl = controls.get(checkControlName);
      if (checkControl?.errors && !checkControl.errors['notmatching']) {
        return null;
      }
      if (control?.value=='' && checkControl?.value=='') {
        return null;
      }
      if (control?.value == checkControl?.value) {
        controls.get(checkControlName)?.setErrors({ notmatching: true });
        return { notmatching: true };
      } else {
        return null;
      }
    };
  }
}