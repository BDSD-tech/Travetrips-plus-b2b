import { Component } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { CommonService } from '../../services/common.service';
import { CommonModule } from '@angular/common';
import { MaterialModuleModule } from '../../shared/material-module.module';
import { SafeHtmlModule } from '../../shared/safe-html.module';
import { CountDownModule } from '../modal/count-down/count-down.module';
import { DirectivesModule } from '../../directives/directives.module';
import { DialogModalModule } from '../modal/dialog-modal/dialog-modal.module';
import { CarService } from './car.service';
import { AlertService } from '../../services/alert.service';
declare var $: any;

@Component({
  selector: 'app-car',
  standalone:true,
  imports:[CommonModule,FormsModule,ReactiveFormsModule,MaterialModuleModule,SafeHtmlModule,CountDownModule,DirectivesModule,DialogModalModule],
  templateUrl: './car.component.html',
  styleUrl: './car.component.css'
})
export class CarComponent {
  CarQueryForm: FormGroup;
  carsubmitted = false;
  Carloading=false;
  Offer:any=[];
  offerloading=true;

  timeSlots: string[] = [
  '06:00 AM', '06:30 AM', '07:00 AM', '07:30 AM',
  '08:00 AM', '08:30 AM', '09:00 AM', '09:30 AM',
  '10:00 AM', '10:30 AM', '11:00 AM', '11:30 AM',
  '12:00 PM', '12:30 PM', '01:00 PM', '01:30 PM',
  '02:00 PM', '02:30 PM', '03:00 PM', '03:30 PM',
  '04:00 PM', '04:30 PM', '05:00 PM', '05:30 PM',
  '06:00 PM', '06:30 PM', '07:00 PM', '07:30 PM',
  '08:00 PM', '08:30 PM', '09:00 PM'
];

tripTypes: string[] = [
  'Outstation One Way',
  'Outstation Roundtrip',
  'Airport Transport',
  'City Tour'
];


  constructor(public fb: FormBuilder,private commonservice:CommonService,private carservice:CarService,private alertservice:AlertService) {
    this.CarQueryForm = this.fb.group({
      Name: ['', Validators.required],
      Email: ['', [Validators.required, Validators.email]],
      Mobile: ['', [Validators.required, Validators.pattern(/^[0-9]{10}$/)]],
      Origin: [''],
      Destination: ['',],
      DepartDate: [''],
      Pickup: [''],
      Trip: [''],
      SendMessage: ['']
    });
  }

  ngOnInit(): void {
    this.commonservice.GetHomeOffer().subscribe(data => {
      this.Offer=data;
      this.offerloading=false; 
    });
    this.cardepartcalendar()

  }

  get fh() { return this.CarQueryForm.controls; }


  openautocomplete(event:any,type:any)
  {
    $(event.target).autocomplete( "search", "" );
  }

 
  

  CarQuery() {
  this.carsubmitted = true;

  if (this.CarQueryForm.invalid) {
    this.Carloading = false;
    return;
  }

  this.Carloading = true;

  const formData = this.CarQueryForm.value;

  this.carservice.SearchQueryList(formData).subscribe(
    (res: any) => {
      this.Carloading = false;

      if (res?.Error?.ErrorCode === 0) {
        this.alertservice.success(res.Error.ErrorMessage || "Form submitted successfully!");
        this.CarQueryForm.reset();
      } else {
        this.alertservice.error(res.Error?.ErrorMessage || "Something went wrong!");
      }
    },
    (err) => {
      this.Carloading = false;
      this.alertservice.error("Something went wrong while submitting the form.");
    }
  );
}


  cardepartcalendar() {
  var _this = this;
    $("[data-depart-date]").datepicker({
        defaultDate : "",
        dateFormat : "dd M yy",
        minDate : 0,
        maxDate: '+1Y',
        changeMonth : false,
        numberOfMonths: [1,13],
        beforeShow : function(input:any, inst:any) {
          /*---Start Open in bottom--*/
          var $this = $(this);
          var cal = inst.dpDiv;
          var top = $this.offset().top + $this.outerHeight();
          var left = $this.offset().left;
          setTimeout(function() {
              cal.css({
                  'top': top-1,
                  'left': left,
                  'width':'24.1em',
                  'overflow-x':'scroll',
                  'height':'30em',
                  'z-index':'9999'
              });
              $(".ui-datepicker-next").hide();
              $(".ui-datepicker-prev").hide();
              inst.dpDiv.find('.ui-state-active').css({'background':'var(--second-color)','color':'#fff'});
          }, 1);
          /*---End Open in bottom--*/
          
          // var selectedDate = _this.VisaQueryForm.get('DepartDate')?.value;
          // var nextdate:any= _this.visaservice.AddDayDefaultDate(selectedDate,1);
          // var newdate = new Date(nextdate);
          // $(this).datepicker("option", "minDate",newdate);

        },
        onUpdateDatepicker: function (input:any, inst:any) {
          $(".ui-datepicker-multi").css({'width':'24.1em'});
          $(".ui-datepicker-next").hide();
          $(".ui-datepicker-prev").hide();
        },
        onClose : function(selectedDate:any) {
          _this.CarQueryForm.patchValue({DepartDate:selectedDate});
          $("[data-depart-date]").datepicker("option", selectedDate);
        }
      });
}


  Cleardata(field:any,key:any=null)
    {
      if(field=='Destination')
      {
        this.CarQueryForm.patchValue({ Destination:'',CityID:''});
      }
    }
}
