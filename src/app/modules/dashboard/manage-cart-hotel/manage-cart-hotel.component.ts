import { LiveAnnouncer } from '@angular/cdk/a11y';
import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort, Sort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { Router, NavigationExtras } from '@angular/router';
import { AlertService } from '../../../services/alert.service';
import { DashboardService } from '../dashboard.service';

declare var window: any;

declare var $:any;

@Component({
  selector: 'app-manage-cart-hotel',
  templateUrl: './manage-cart-hotel.component.html',
  styleUrls: ['./manage-cart-hotel.component.css']
})
export class ManageCartHotelComponent implements OnInit {
  opensearchForm=false;
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
  AddAmendmentForm:FormGroup;
  amendmentsubmitted=false;
  amendmentloading=false;


  ShowMore:boolean = true;
  visible:boolean = false;

  pendingbookingcount:any=0;
  activebookingfilter='All';

  totalgrossamount=0;

  reportloading=false

  constructor(private fb: FormBuilder,private alertservice: AlertService, private dashboardservice:DashboardService,private router: Router,private _liveAnnouncer: LiveAnnouncer) {


    let from=this.dashboardservice.SubstractCurrentDate(0);
    let to=this.dashboardservice.AddDayDefaultDate(new Date(),0);
    this.SearchForm= this.fb.group({
                                       BookingId: [''],
                                       FromDate: [from],
                                       ToDate: [to],
                                       BookingStatus: [['All'],[Validators.required]],
                                       PaymentStatus:[['All'],[Validators.required]],
                                       HotelName: [],
                                       FirstName: [''],
                                       LastName: [''],
                                       FromCheckInDate: [''],
                                       ToCheckOutDate: [''],
                                       ChannelType: [''],
                                       ConfirmationNumber: ['']

                                    });

    this.AddAmendmentForm=this.fb.group({
                                            BookingID: ['',[Validators.required]],
                                            AmendmentType: ['',[Validators.required]]
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
    this.FromTravelDate();
    this.ToTravelDate();
    this.SearchSubmit()
  }

  OpenSearchForm(){
    if(!this.opensearchForm){
      setTimeout(() => {
          this.FromDate()
        this.ToDate()
      }, 100);
    }
    this.opensearchForm=!this.opensearchForm;
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
          _this.SearchForm.patchValue({FromCheckInDate:selectedDate});
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
          var selectedDate = _this.SearchForm.value.FromCheckInDate;
          var newdate = new Date(selectedDate);
          $(this).datepicker("option", "minDate",newdate);
        },
        onClose : function(selectedDate:any, inst:any ) {
          _this.SearchForm.patchValue({ToCheckOutDate:selectedDate});
        }
      });
  }

  clear(field:any)
  {
      this.SearchForm.patchValue({[field]:''});
  }

  get f() { return this.SearchForm.controls; }
  SetStatus(status:any){
    this.SearchForm.get('BookingStatus')?.setValue([status]);
    this.SearchSubmit()
  }
  SearchSubmit()
  {
    this.Searchsubmitted = true;
    if (this.SearchForm.invalid) {
      return;
    }
    this.isshowdiv=false;
    this.Searchloading=true;
  
    this.dashboardservice.HotelList(this.SearchForm.value).subscribe(data=>{
      let resp:any=data;
      this.Searchloading=false;
      this.isshowdiv=true;
      if(resp['Error']['ErrorCode']==0)
      { 
         this.CartList=resp['Result'];
         this.displayedColumns=[ 'bookingTime','bookingStatus','paymentStatus','BookingRefNumber','ConfirmationNo','amount','firstPaxName','RaiseAmendment','PrintTicket','CheckIn','CheckOut','bookingChannel','timeToTravel','loggedInUser'];
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
        

         this.getTotalGross();
       
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

  RaiseAmendment(item:any)
  {
      this.AddAmendmentModal.show();
      console.log(item);
      
      this.AddAmendmentForm.patchValue({'BookingID':item['BookingRefNumber']});
  }

  get fa() { return this.AddAmendmentForm.controls; }

  SubmitAmendment()
  {
    this.amendmentsubmitted = true;
    if (this.AddAmendmentForm.invalid) {
      return;
    }

    this.AddAmendmentModal.hide();
    const navigationExtras: NavigationExtras = {
      queryParams:{'bookingid':this.AddAmendmentForm.get('BookingID')?.value,'amendment-type':this.AddAmendmentForm.get('AmendmentType')?.value}
    };
    
    this.router.navigate(['dashboard/manage-amendments-hotel/itinerary'],navigationExtras);
  }


  More()
  {
    this.ShowMore = !this.ShowMore;
    this.visible = !this.visible;  
  }

  BookingFilter(event:any,type:any)
  {
    if(type=='All')
    {
      this.dataSource = new MatTableDataSource(this.CartList);
    }
    if(type=='Pending')
    {
      let pendingbooking:any=[];
      this.CartList.forEach((element:any) => {
        if(element['bookingStatus']=='Pending')
        {
          pendingbooking.push(element);
        }
       });

      this.dataSource = new MatTableDataSource(pendingbooking);
    }
    this.activebookingfilter=type;
    setTimeout(() => {
      this.dataSource.sort = this.sort;
      this.dataSource.paginator = this.paginator;
     }, 20);

  }

  getTotalGross() {
    let grossamount=0;
    if(this.dataSource.data?.length!=0)
    {
      this.dataSource.data.forEach((element:any) => {
        if(element['bookingStatus']=='Confirmed')
        {
          grossamount+=parseFloat(element['amount']);
        }
       });
       this.totalgrossamount=grossamount;
    }
    return this.totalgrossamount;
  }
  DownloadReport()
  {
    
    if (this.SearchForm.invalid) {
      return;
    }
    this.reportloading=true;
  
    this.dashboardservice.DownloadReportHotel(this.SearchForm.value).subscribe(data => {
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

   DownloadPDF(){
      if (this.SearchForm.invalid) {
      return;
    }
    this.reportloading=true;
    this.dashboardservice.DownloadReportHotelPDF(this.SearchForm.value).subscribe(data => {
      let resp:any=data;
      this.reportloading=false;
      let service='hotel'
      let filename=service+".pdf";
      const link = document.createElement("a");
      link.href = URL.createObjectURL(data);
      link.download = filename;
      link.click();
    });
  }

}
