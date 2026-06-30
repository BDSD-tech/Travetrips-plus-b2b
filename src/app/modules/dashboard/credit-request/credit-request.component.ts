import { LiveAnnouncer } from '@angular/cdk/a11y';
import { Component, ElementRef, ViewChild } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { MatAutocompleteSelectedEvent } from '@angular/material/autocomplete';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort, Sort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { Router, NavigationExtras } from '@angular/router';
import { AlertService } from '../../../services/alert.service';
import { DashboardService } from '../dashboard.service';
declare var window:any
declare var $:any
@Component({
  selector: 'app-credit-request',
  templateUrl: './credit-request.component.html',
  styleUrl: './credit-request.component.css'
})
export class CreditRequestComponent {

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

  AddAmendmentModal:any;
  AddCreditRequest:FormGroup;
  amendmentsubmitted=false;
  amendmentloading=false;

  separatorKeysCodes: number[] = [];
  airline:any = [];
  allairline:any=[];

  ShowMore:boolean = true;
  visible:boolean = false;

  pendingbookingcount:any=0;
  activebookingfilter='All';

  totalgrossamount=0;
  totalnetamount=0;
  reportloading=false
  @ViewChild('airlineInput') airlineInput!: ElementRef<HTMLInputElement>;

  constructor(private fb: FormBuilder,private alertservice: AlertService, private dashboardservice:DashboardService,private router: Router,private _liveAnnouncer: LiveAnnouncer) {


    let from=this.dashboardservice.SubstractCurrentDate(10);
    let to=this.dashboardservice.AddDayDefaultDate(new Date(),0);
    this.SearchForm= this.fb.group({ 
                                       FromDate: [from],
                                       ToDate: [to],
                                    });

    this.AddCreditRequest=this.fb.group({
                                            Amount: ['',[Validators.required]],
                                            Remark: ['',[Validators.required]]
                                        });  

   }

  ngOnInit(): void {

    this.AddAmendmentModal = new window.bootstrap.Modal(
      document.getElementById('addamendmentmodal')
    );
  }

  ngAfterViewInit() {
    this.FromDate();
    this.ToDate(); 
    this.SearchSubmit();
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
  
    this.dashboardservice.CreditList(this.SearchForm.value).subscribe(data=>{
      let resp:any=data;
      this.Searchloading=false;
      this.isshowdiv=true;
      if(resp['Error']['ErrorCode']==0)
      { 
         this.CartList=resp['Result'];
         this.displayedColumns=[ 'created','Amount','Status','Remark'];
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

  RaiseAmendment()
  {
      this.AddAmendmentModal.show();
      
  }

  get fa() { return this.AddCreditRequest.controls; }

  SubmitCreditRequest()
  {
    this.amendmentsubmitted = true;
    if (this.AddCreditRequest.invalid) {
      return;
    }

    this.amendmentloading=true;
    this.dashboardservice.AddCreditRequest(this.AddCreditRequest.value).subscribe((resp:any)=>{
       this.amendmentloading=false;
       this.amendmentsubmitted = false;
      if(resp['Error']['ErrorCode']==0){
         this.AddAmendmentModal.hide();
        this.alertservice.success(resp['Error']['ErrorMessage'])
      }else{
        this.alertservice.error(resp['Error']['ErrorMessage']);
      }
    })


  }




  
 numberOnly(event:any) {
    const charCode = (event.which) ? event.which : event.keyCode;
    if (charCode > 31 && (charCode < 48 || charCode > 57)) {
      return false;
    }
    return true;
  }

  DownloadReport()
  {
    
    if (this.SearchForm.invalid) {
     
      return;
    }
    this.reportloading=true;
    this.dashboardservice.DownloadReportCreditRequest(this.SearchForm.value).subscribe(data => {
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
