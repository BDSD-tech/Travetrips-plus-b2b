import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatSort, Sort } from '@angular/material/sort';
import { AlertService } from '../../../services/alert.service';
import { DashboardService } from '../dashboard.service';
import {LiveAnnouncer} from '@angular/cdk/a11y';
import {MatTableDataSource} from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';

declare var $: any;

@Component({
  selector: 'app-manage-deposit-request',
  templateUrl: './manage-deposit-request.component.html',
  styleUrls: ['./manage-deposit-request.component.css']
})

export class ManageDepositRequestComponent implements OnInit {

  SearchForm: FormGroup;
  submitted = false;
  loading = false;
  DepositList:any=[];
  isshowdiv=false;

  displayedColumns: string[] =[];
  dataSource:any=[];

  @ViewChild(MatPaginator)
  paginator!: MatPaginator;
  @ViewChild(MatSort)
  sort: MatSort = new MatSort;
  pageSizeOptions:any=[100];
  reportloading=false

  constructor(private fb: FormBuilder,private alertservice: AlertService, private dashboardservice:DashboardService,private _liveAnnouncer: LiveAnnouncer) {

       let from=this.dashboardservice.SubstractCurrentDate(7);
       let to=this.dashboardservice.AddDayDefaultDate(new Date(),0);
       this.SearchForm= this.fb.group({
                                          FromDate: [from],
                                          ToDate: [to]
                                       });
   }

  ngOnInit(): void {this.Submit()} 

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
    this.dashboardservice.DepositList(this.SearchForm.value).subscribe(data=>{
      this.loading=false;
      this.isshowdiv=true;
      let resp:any=data;
      if(resp['Error']['ErrorCode']==0)
      {
          this.DepositList=resp['Result'];

          this.displayedColumns=[ 'created',  'id', 'WebPartner','Status','PaymentMode','RequestedAmount','ProcessedAmount','Summary','PaymentReceivedDate','FileUrl'];
          this.dataSource = new MatTableDataSource(resp['Result']);
       
          setTimeout(() => {
            this.dataSource.sort = this.sort;
            this.dataSource.paginator = this.paginator;
           }, 20);
      } else {
          this.DepositList=[];
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


   DownloadReport()
  {
    
    if (this.SearchForm.invalid) {
     
      return;
    }
    this.reportloading=true;
    this.dashboardservice.DownloadReportDepositRequest(this.SearchForm.value).subscribe(data => {
      let resp:any=data;
      this.reportloading=false;
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
    });

  }

}
