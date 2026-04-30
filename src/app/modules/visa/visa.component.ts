import { Component } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { CommonService } from '../../services/common.service';
import { CommonModule } from '@angular/common';
import { MaterialModuleModule } from '../../shared/material-module.module';
import { SafeHtmlModule } from '../../shared/safe-html.module';
import { CountDownModule } from '../modal/count-down/count-down.module';
import { DirectivesModule } from '../../directives/directives.module';
import { DialogModalModule } from '../modal/dialog-modal/dialog-modal.module';
import { VisaService } from './visa.service';
import { AlertService } from '../../services/alert.service';
declare var $: any;

@Component({
  selector: 'app-visa',
  standalone:true,
  imports:[CommonModule,FormsModule,ReactiveFormsModule,MaterialModuleModule,SafeHtmlModule,CountDownModule,DirectivesModule,DialogModalModule],
  templateUrl: './visa.component.html',
  styleUrl: './visa.component.css'
})
export class VisaComponent {

  VisaQueryForm: FormGroup;
  visasubmitted = false;
  Carloading=false;
  Offer:any=[];
  offerloading=true;
  travellerCount: number = 1;

visaTypes: string[] = [
  'Tourist Visa',
  'Business Visa',
  'Student Visa',
  'Transit Visa',
  'Work Visa',
  'Medical Visa',
  'Spouse/Partner Visa',
  'Immigration Visa',
  'Conference Visa',
  'Diplomatic Visa'
];



  constructor(public fb: FormBuilder,private commonservice:CommonService,private visaservice:VisaService,private alertservice:AlertService) {
    this.VisaQueryForm = this.fb.group({
      Name: ['', Validators.required],
      Email: ['', [Validators.required, Validators.email]],
      Mobile: ['', [Validators.required, Validators.pattern(/^[0-9]{10}$/)]],
      Origin: ['',Validators.required],
      type: ['',Validators.required],
      traveller: [''],
      DepartDate: [''],
      SendMessage: ['']
    });
  }

  ngOnInit(): void {
    this.commonservice.GetHomeOffer().subscribe(data => {
      this.Offer=data;
      this.offerloading=false; 
    });
    this. visadepartcalendar();

  }

  get fh() { return this.VisaQueryForm.controls; }


  openautocomplete(event:any,type:any)
  {
    $(event.target).autocomplete( "search", "" );
  }

  
 VisaQuery() {
  this.visasubmitted = true;

  if (this.VisaQueryForm.invalid) {
    this.Carloading = false;
    return;
  }

  this.Carloading = true;

  const formData = this.VisaQueryForm.value;

  this.visaservice.SearchQueryList(formData).subscribe(
    (res: any) => {
      this.Carloading = false;

      if (res?.Error?.ErrorCode === 0) {
        this.alertservice.success(res.Error.ErrorMessage || "Form submitted successfully!");
          this.VisaQueryForm.reset();
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


  incrementTraveller() {
  let current = this.fh['traveller'].value || 0;
  this.fh['traveller'].setValue(current + 1);
}

decrementTraveller() {
  let current = this.fh['traveller'].value || 0;
  if (current > 1) {
    this.fh['traveller'].setValue(current - 1);
  }
}

updateTraveller(event: any) {
  const value = parseInt(event.target.value, 10);
  this.fh['traveller'].setValue(isNaN(value) ? 1 : value);
}

 visadepartcalendar() {
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
          _this.VisaQueryForm.patchValue({DepartDate:selectedDate});
          $("[data-depart-date]").datepicker("option", selectedDate);
        }
      });
}




  Cleardata(field:any,key:any=null)
    {
      if(field=='Destination')
      {
        this.VisaQueryForm.patchValue({ Destination:'',CityID:''});
      }
    }
}
