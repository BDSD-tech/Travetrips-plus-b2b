import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { AlertService } from '../../../services/alert.service';
import { DashboardService } from '../dashboard.service';

declare var $:any;

@Component({
  selector: 'app-booking-calendar',
  templateUrl: './booking-calendar.component.html',
  styleUrls: ['./booking-calendar.component.css']
})
export class BookingCalendarComponent implements OnInit {

  SearchForm: FormGroup;
  submitted = false;
  loading = false;
  CalendorList:any=[];
  listkeys:any=[];
  isshowdiv=false;

  constructor(private fb: FormBuilder,private alertservice: AlertService, private dashboardservice:DashboardService) {

       let from=this.dashboardservice.SubstractCurrentDate(30);
       let to=this.dashboardservice.AddDayDefaultDate(new Date(),0);
       this.SearchForm= this.fb.group({
                                          FromDate: [from,[Validators.required]],
                                          ToDate: [to,[Validators.required]],
                                          Month: [''],
                                       });
   }

  ngOnInit(): void {

  }

  ngAfterViewInit() {
    this.FromDate();
    this.ToDate(); 
  }


  FromDate()
  {
    var _this = this;
    $("[from-date]").datepicker({
        dateFormat : "d M yy",
        changeMonth: false,
        changeYear: false,
        numberOfMonths: 1,
        beforeShow : function(input:any, inst:any) {
          setTimeout(function() {
            inst.dpDiv.css({'height':'auto'});
          }, 1);
         },
        onClose : function(selectedDate:any, inst:any ) {
          _this.SearchForm.patchValue({FromDate:selectedDate});
          $("[to-date]").datepicker("option", "minDate",selectedDate).focus().select();
        }
      });    
  }

  ToDate()
  {
    var _this = this;
    $("[to-date]").datepicker({
        dateFormat : "dd M yy",
        changeMonth: false,
        changeYear: false,
        numberOfMonths: 1,
        beforeShow : function(input:any, inst:any) {
          setTimeout(function() {
            inst.dpDiv.css({'height':'auto'});
          }, 1);
          var selectedDate = _this.SearchForm.value.FromDate;
          var newdate = new Date(selectedDate);
          $(this).datepicker("option", "minDate",newdate);
        },
        onClose : function(selectedDate:any, inst:any ) {
          _this.SearchForm.patchValue({ToDate:selectedDate});
        }
      });
  }

  clear(field:any)
  {
      this.SearchForm.patchValue({[field]:''});
  }

  get f() { return this.SearchForm.controls; }


  Submit()
  {
    this.submitted = true;
    if (this.SearchForm.invalid) {
      return;
    }
    this.isshowdiv=false;
    this.loading=true;
    this.dashboardservice.BookingCalendar(this.SearchForm.value).subscribe(data=>{
      this.loading=false;
      this.isshowdiv=true;
      let resp:any=data;
      if(resp['Error']['ErrorCode']==0)
      {
          this.CalendorList=resp['Result'];
          this.listkeys=Object.keys(this.CalendorList);
      } else {
          this.CalendorList=[];
          this.listkeys=Object.keys(this.CalendorList);
      }
    });
  
  }

}
