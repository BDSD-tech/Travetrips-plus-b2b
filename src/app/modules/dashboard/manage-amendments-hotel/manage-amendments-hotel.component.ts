import { LiveAnnouncer } from '@angular/cdk/a11y';
import { Component, OnInit, ViewChild } from '@angular/core';
import { FormGroup, FormBuilder } from '@angular/forms';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort, Sort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { Router } from '@angular/router';
import { AlertService } from '../../../services/alert.service';
import { DashboardService } from '../dashboard.service';

declare var $:any;

@Component({
  selector: 'app-manage-amendments-hotel',
  templateUrl: './manage-amendments-hotel.component.html',
  styleUrls: ['./manage-amendments-hotel.component.css']
})
export class ManageAmendmentsHotelComponent implements OnInit {

  SearchForm: FormGroup;
  Searchsubmitted = false;
  Searchloading = false;
  isshowdiv=false;
  List:any=[];

  displayedColumns: string[] =[];
  dataSource:any=[];

  @ViewChild(MatPaginator)
  paginator!: MatPaginator;
  @ViewChild(MatSort)
  sort: MatSort = new MatSort;
  pageSizeOptions:any=[100];

  constructor(private fb: FormBuilder,private alertservice: AlertService, private dashboardservice:DashboardService,private router: Router,private _liveAnnouncer: LiveAnnouncer) { 

    let from=this.dashboardservice.SubstractCurrentDate(0);
    let to=this.dashboardservice.AddDayDefaultDate(new Date(),0);
    this.SearchForm= this.fb.group({
                                      BookingId: [''],
                                      AmendmentId: [''],
                                      FromDate: [from],
                                      ToDate: [to],
                                      Type: [],
                                      Status: [''],
                                      JourneyType: [''],
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

  SearchSubmit()
  {
    this.Searchsubmitted = true;
    if (this.SearchForm.invalid) {
      return;
    }
    this.isshowdiv=false;
    this.Searchloading=true;
    this.dashboardservice.AmendmentsList(this.SearchForm.value,'hotel').subscribe(data=>{
      let resp:any=data;
      this.Searchloading=false;
      this.isshowdiv=true;
      if(resp['Error']['ErrorCode']==0)
      { 
         this.List=resp['Result'];
         this.displayedColumns=['created','AmendmentId','BookingRefNumber','AmendmentStatus','WebPartner','staff_name','AmendmentType','WebPartnerRemark','City','CheckInDate','CheckOutDate','NoOfNights','NoOfRooms','HotelName','RegionType'];
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

}

