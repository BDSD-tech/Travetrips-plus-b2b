import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { AlertService } from '../../../services/alert.service';
import { DashboardService } from '../dashboard.service';

declare var $:any;

@Component({
  selector: 'app-download-report',
  templateUrl: './download-report.component.html',
  styleUrls: ['./download-report.component.css']
})
export class DownloadReportComponent implements OnInit {

  SearchForm: FormGroup;
  submitted = false;
  loading = false;

  constructor(private fb: FormBuilder,private alertservice: AlertService, private dashboardservice:DashboardService) {

    let from=this.dashboardservice.SubstractCurrentDate(0);
    let to=this.dashboardservice.AddDayDefaultDate(new Date(),0);
    
    this.SearchForm= this.fb.group({
                                      FromDate: [from,[Validators.required]],
                                      ToDate: [to,[Validators.required]],
                                      ReportType: ['',[Validators.required]],
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
        maxDate: 0,
        changeMonth: true,
        changeYear: true,
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
        maxDate: 0,
        changeMonth: true,
        changeYear: true,
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

  Submit()
  {
    this.submitted = true;
    if (this.SearchForm.invalid) {
      return;
    }
    this.loading=true;
  
    this.dashboardservice.DownloadReport(this.SearchForm.value).subscribe(data => {
      let resp:any=data;
      if(resp['Error']['ErrorCode']==0)
      {
        this.loading=false;
        var $a = $("<a>");
        $a.attr("href", resp.Result);
        $("body").append($a);
        $a.attr("download", resp.Name);
        $a[0].click();
        $a.remove();

      } else {
          this.alertservice.error(resp['Error']['ErrorMessage']);
      }
    });

  }


  get f() { return this.SearchForm.controls; }

  clear(field:any)
  {
      this.SearchForm.patchValue({[field]:''});
  }


}
