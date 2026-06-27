import { LiveAnnouncer } from '@angular/cdk/a11y';
import { Component, OnInit, ViewChild } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort, Sort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { AlertService } from '../../../services/alert.service';
import { DashboardService } from '../dashboard.service';

declare var $:any;

@Component({
  selector: 'app-payment-passbook',
  templateUrl: './payment-passbook.component.html',
  styleUrls: ['./payment-passbook.component.css']
})
export class PaymentPassbookComponent implements OnInit {

  SearchForm: FormGroup;
  submitted = false;
  loading = false;
  List:any=[];
  isshow = false;
  isshowdiv=false;

  displayedColumns: string[] =[];
  dataSource:any=[];

  @ViewChild(MatPaginator)
  paginator!: MatPaginator;
  @ViewChild(MatSort)
  sort: MatSort = new MatSort;
  pageSizeOptions:any=[100];
  downloadreport=false
  constructor(private fb: FormBuilder,private alertservice: AlertService, private dashboardservice:DashboardService,private _liveAnnouncer: LiveAnnouncer) {

       let from=this.dashboardservice.SubstractCurrentDate(0);
       let to=this.dashboardservice.AddDayDefaultDate(new Date(),0);
       this.SearchForm= this.fb.group({
                                          FromDate: [from,[Validators.required]],
                                          ToDate: [to,[Validators.required]],
                                          PaymentMode: [''],
                                          BookingRefNumber: ['']
                                       });
   }

  ngOnInit(): void {
    this.Submit()
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
        maxDate: 0,
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
    this.dashboardservice.AccountLog(this.SearchForm.value).subscribe(data=>{
      this.loading=false;
      this.isshowdiv=true;
      let resp:any=data;
      if(resp['Error']['ErrorCode']==0)
      {
          this.List=resp['Result'];
          this.displayedColumns=[ 'created','payment_mode','bookingRefNo','actionType','credit','debit','balance','serviceLog','ConvenienceFee','MarkUp','TDS','Commission'];
          this.dataSource = new MatTableDataSource(resp['Result']);
          setTimeout(() => {
            this.dataSource.sort = this.sort;
            this.dataSource.paginator = this.paginator;
           }, 20);
          
      } else {
          this.List=[];
          this.dataSource = new MatTableDataSource(resp['Result']);
          this.dataSource.sort = this.sort;
          this.dataSource.paginator = this.paginator;
      }
    });
  
  }

  applyFilter(event:any) {
    let filterValue=event.target.value;
    filterValue = filterValue.trim();
    filterValue = filterValue.toLowerCase();
    this.dataSource.filter = filterValue;
  }
 
  sortData(sortState: Sort) {
    if (sortState.direction) {
      this._liveAnnouncer.announce(`Sorted ${sortState.direction}ending`);
    } else {
      this._liveAnnouncer.announce('Sorting cleared');
    }
  }

  getTotalCredit() {
    if(this.dataSource.data?.length!=0)
    {
      return this.dataSource.data.map((t:any) => parseFloat(t.credit)).reduce((acc:any , value:any) => acc + value, 0);
    }
  }
  getTotalDebit() {
    if(this.dataSource.data?.length!=0)
    {
      return this.dataSource.data.map((t:any) => parseFloat(t.debit)).reduce((acc:any , value:any) => acc + value, 0);
    }
  }


  DownLoad(type:any){
    this.downloadreport=true;
    if(type=='Excel'){
      
      this.dashboardservice.Downloadpayment(this.SearchForm.value).subscribe((resp:any)=>{
        this.downloadreport=false;
        if(resp['Error']['ErrorCode']==0)
        {
          var $a = $("<a>");
          $a.attr("href", resp.Result.file);
          $("body").append($a);
          $a.attr("download", resp.Result.filename);
          $a[0].click();
          $a.remove();
        } else {
            this.alertservice.error(resp['Error']['ErrorMessage']);
        }
      })
    }else{

    }
  }


}

