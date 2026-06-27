import { LiveAnnouncer } from '@angular/cdk/a11y';
import { Component, ElementRef, ViewChild } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { MatAutocompleteSelectedEvent } from '@angular/material/autocomplete';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort, Sort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { Router } from '@angular/router';
import { AlertService } from '../../../../services/alert.service';
import { DashboardService } from '../../dashboard.service';

declare var window:any;
declare var $:any;
@Component({
  selector: 'app-amendment-list',
  templateUrl: './amendment-list.component.html',
  styleUrl: './amendment-list.component.css'
})
export class AmendmentListComponent {
opensearchForm=true;
    SearchForm: FormGroup;
    Searchsubmitted = false;
    Searchloading = false;
    isshowdiv=false;
    CartList:any=[];
  
  
    displayedColumns: string[] =[];
    dataSource:any=[];
  
    @ViewChild(MatPaginator)
    paginator!: MatPaginator;
    @ViewChild(MatSort)
    sort: MatSort = new MatSort;
    pageSizeOptions:any=[100];
  
  
  
    separatorKeysCodes: number[] = [];
    airline:any = [];
    allairline:any=[];
  
    pendingbookingcount:any=0;
    activebookingfilter='All';
  
    totalgrossamount=0;
    totalnetamount=0;
    reportloading=false
    @ViewChild('airlineInput') airlineInput!: ElementRef<HTMLInputElement>;
  
    constructor(private fb: FormBuilder,private alertservice: AlertService, private dashboardservice:DashboardService,private router: Router,private _liveAnnouncer: LiveAnnouncer) {
  
  
      let from=this.dashboardservice.SubstractCurrentDate(0);
      let to=this.dashboardservice.AddDayDefaultDate(new Date(),0);
      this.SearchForm= this.fb.group({
                                        BookingId: [''],
                                        FromDate: [from],
                                        ToDate: [to],
                                        AmendmentId: [''],
                                        Status: [''],
                                        Type:[''],
  
                                      });
  
  
      
  
     }
  
    ngOnInit(): void {
  
    }
  
    ngAfterViewInit() {
      this.FromDate();
      this.ToDate(); 
      this.FromTravelDate();
      this.SearchSubmit();
    }
  
    SpacePartialcanceled(data:any){
      return data.replace(/([a-z])([A-Z])/g, '$1 $2');
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
  
    FromTravelDate()
    {
      var _this = this;
      $("[from-travel-date]").datepicker({
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
            _this.SearchForm.patchValue({FromTravelDate:selectedDate});
            $("[to-travel-date]").datepicker("option", "minDate",selectedDate).focus().select();
          }
        });    
    }
  
    ToTravelDate()
    {
      var _this = this;
      $("[to-travel-date]").datepicker({
          dateFormat : "dd M yy",
          changeMonth: false,
          changeYear: false,
          numberOfMonths: 1,
          beforeShow : function(input:any, inst:any) {
            setTimeout(function() {
              inst.dpDiv.css({'height':'auto'});
            }, 1);
            var selectedDate = _this.SearchForm.value.FromTravelDate;
            var newdate = new Date(selectedDate);
            $(this).datepicker("option", "minDate",newdate);
          },
          onClose : function(selectedDate:any, inst:any ) {
            _this.SearchForm.patchValue({ToTravelDate:selectedDate});
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
      var airlinecode = Object.keys(this.airline);
      this.SearchForm.patchValue({'Airline':airlinecode});
  
      this.dashboardservice.AmendmentsList(this.SearchForm.value,'bus').subscribe(data=>{
        let resp:any=data;
        this.Searchloading=false;
        this.isshowdiv=true;
        if(resp['Error']['ErrorCode']==0)
        { 
           this.CartList=resp['Result'];
        

           this.displayedColumns=[ 'BookingRefNumber','AmendmentId','AmendmentType','AmendmentStatus','OriginCity','DestinationCity','NoOfSeats','BusName','Summary','created'];
           this.dataSource = new MatTableDataSource(resp['Result']);
           setTimeout(() => {
            this.dataSource.sort = this.sort;
            this.dataSource.paginator = this.paginator;
           }, 20);
  
           this.pendingbookingcount=0;
           this.CartList.forEach((element:any) => {
            if(element['bookingStatus']=='Pending')
            {
              this.pendingbookingcount++;
            }
           });
          
        } else {
          this.CartList=[];
          this.dataSource = new MatTableDataSource(resp['Result']);
          this.dataSource.sort = this.sort;
          this.dataSource.paginator = this.paginator;
        }
      });
    }
    SetStatus(status:any){
      this.SearchForm.get('BookingStatus')?.setValue([status]);
      this.SearchSubmit()
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

  
    selected(event: MatAutocompleteSelectedEvent): void {
      this.airline[event.option.value]=event.option.viewValue;
      this.airlineInput.nativeElement.value = '';
    }
  
  
  
}
