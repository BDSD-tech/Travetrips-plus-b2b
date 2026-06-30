import { LiveAnnouncer } from '@angular/cdk/a11y';
import { Component, ViewChild } from '@angular/core';
import { FormGroup, FormBuilder } from '@angular/forms';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort, Sort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { Router } from '@angular/router';
import { AlertService } from '../../../services/alert.service';
import { CommonService } from '../../../services/common.service';
import { DashboardService } from '../dashboard.service';


declare var $:any
declare var window:any
@Component({
  selector: 'app-gst-details',
  templateUrl: './gst-details.component.html',
  styleUrl: './gst-details.component.css'
})
export class GstDetailsComponent {

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
 
 
  Usersubmited=false;
  Userloading=false;

  separatorKeysCodes: number[] = [];
  airline:any = [];
  allairline:any=[];
  Dialcode:any=[];
  isVisible=false
  ShowMore:boolean = true;
  visible:boolean = false;
  activebookingfilter='All';
  statusmodal :any
  totalgrossamount=0;

  Passmodal:any
  
  constructor(private fb: FormBuilder,private alertservice: AlertService, private dashboardservice:DashboardService,private router: Router,private _liveAnnouncer: LiveAnnouncer,private commonService:CommonService) {


    let from=this.dashboardservice.SubstractCurrentDate(0);
    let to=this.dashboardservice.AddDayDefaultDate(new Date(),0);
    this.SearchForm= this.fb.group({
                                  GstNumber: [''],
                                  CompanyName: [''],
                                  FromDate: [''],
                                  ToDate: [''],
                                });
    
   }

  ngOnInit(): void {
    this.SearchSubmit()
  }

  ngAfterViewInit() {
    this.ToTravelDate();
    this.FromTravelDate();
  }

  SpacePartialcanceled(data:any){
    return data.replace(/([a-z])([A-Z])/g, '$1 $2');
  }


  showPassword() {
    this.isVisible = !this.isVisible;
  }


  allowNumbersOnly(event: KeyboardEvent) {
    const input = event.target as HTMLInputElement;
    input.value = input.value.replace(/[^0-9]/g, ''); 
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
          _this.SearchForm.patchValue({FromDate:selectedDate});
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
    this.dashboardservice.GSTDetails(this.SearchForm.value).subscribe(data=>{
      let resp:any=data;
      this.Searchloading=false;
      this.isshowdiv=true;
      
      
      if(resp['Error']['ErrorCode']==0)
      { 
         this.CartList=resp['Result'];
         this.displayedColumns=[ 'company_name','gst_number','phone_number','email','address','created'];
         this.dataSource = new MatTableDataSource(resp['Result']);

         setTimeout(() => {
          this.dataSource.sort = this.sort;
          this.dataSource.paginator = this.paginator;
         }, 20);
         
      } else {
        this.CartList=[];
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
