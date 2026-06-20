import { LiveAnnouncer } from '@angular/cdk/a11y';
import { Component, ElementRef, ViewChild } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { MatAutocompleteSelectedEvent } from '@angular/material/autocomplete';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort, Sort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { Router, NavigationExtras } from '@angular/router';
import { AlertService } from '../../../../services/alert.service';
import { DashboardService } from '../../dashboard.service';


declare var $:any;
declare var window :any
@Component({
  selector: 'app-booking-list',
  templateUrl: './booking-list.component.html',
  styleUrl: './booking-list.component.css'
})
export class BookingListComponent {
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
  
    AddAmendmentModal:any;
    AddAmendmentForm:FormGroup;
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
  
  
      let from=this.dashboardservice.SubstractCurrentDate(0);
      let to=this.dashboardservice.AddDayDefaultDate(new Date(),0);
      this.SearchForm= this.fb.group({
                                         BookingId: [''],
                                         FromDate: [from],
                                         ToDate: [to],
                                         BookingStatus: [['All'],[Validators.required]],
                                         PaymentStatus:[['All'],[Validators.required]],
                                         Airline: [],
                                         JourneyType: [['All']],
                                         FirstName: [''],
                                         LastName: [''],
                                         FromTravelDate: [''],
                                         ToTravelDate: [''],
                                         ChannelType: [''],
                                         AirlinePNR: [''],
                                         GDSPNR: [''],
                                         TicketNumber: [''],
  
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
  
      this.dashboardservice.BusBookingList(this.SearchForm.value).subscribe(data=>{
        let resp:any=data;
        this.Searchloading=false;
        this.isshowdiv=true;
        if(resp['Error']['ErrorCode']==0)
        { 
           this.CartList=resp['Result'];

        //     {
        //     "paymentStatus": "Successful",
        //     "BookingRefNumber": "TIPLB33",
        //     "amount": "10.5",
        //     "ticketNo": "6B6F3J73",
        //     "bookingStatus": "Confirmed",
        //     "bookingChannel": "Desktop",
        //     "departure": "09 May 2026 8:02 PM",
        //     "summary": "Poppin Travles-Bharat benz Non A/C Seater Pushback (1+1) Bangalore-Hyderabad 09 May 2026 8:02 PM, x 1",
        //     "firstPaxName": "Mr Rahul Yadav",
        //     "loggedInUser": null,
        //     "timeToTravel": 0,
        //     "bookingTime": "08 May 2026 11:41 AM",
        //     "Token": "TIPLB33"
        // },


           this.displayedColumns=[ 'bookingTime','bookingStatus','paymentStatus','BookingRefNumber','amount','firstPaxName','RaiseAmendment','PrintTicket','summary','bookingChannel','departure','timeToTravel'];
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
  
    RaiseAmendment(item:any)
    {
        this.AddAmendmentModal.show();
        this.AddAmendmentForm.patchValue({'BookingID':item['BookingRefNumber']});
    }
  
    get fa() { return this.AddAmendmentForm.controls; }
  
    SubmitAmendment()
    {
      this.amendmentsubmitted = true;
      if (this.AddAmendmentForm.invalid) {
        return;
      }
  
      // this.AddAmendmentModal.hide();
      // const navigationExtras: NavigationExtras = {
      //   queryParams:{'bookingid':this.AddAmendmentForm.get('BookingID')?.value,'amendment-type':this.AddAmendmentForm.get('AmendmentType')?.value}
      // };
      
      // this.router.navigate(['dashboard/amendments/itinerary'],navigationExtras);
    }
  
    remove(item: any): void {
      delete this.airline[item.key];
    }
  
    selected(event: MatAutocompleteSelectedEvent): void {
      this.airline[event.option.value]=event.option.viewValue;
      this.airlineInput.nativeElement.value = '';
    }
  
    AirlineAutocomplete(event:any)
    {
        let val=event.target.value;
        this.dashboardservice.airlineautocomplete(val).subscribe(data=>{
          let resp:any=data;
          if(resp['Error']['ErrorCode']==0)
          {
              this.allairline=resp['Result'];
          } 
        });
    }
  
    More()
    {
      this.ShowMore = !this.ShowMore;
      this.visible = !this.visible;
  
      setTimeout(() => {
        this.ToTravelDate();
      }, 100);
    
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
  
    getTotalGross(){
      let grossamount=0;
      let netamount=0;
      if(this.dataSource.data?.length!=0)
      {
        this.dataSource.data.forEach((element:any) => {
          if(element['bookingStatus']=='Confirmed')
          {
            grossamount+=parseFloat(element['offer_price']);
            netamount+=parseFloat(element['amount']);
  
          }
         });
         this.totalgrossamount=grossamount;
         this.totalnetamount=netamount;
      }
      return this.totalgrossamount;
    }
  
    DownloadReport()
    {
      
      if (this.SearchForm.invalid) {
        return;
      }
      this.reportloading=true;
     
      this.dashboardservice.DownloadReportFlight(this.SearchForm.value).subscribe(data => {
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
      this.dashboardservice.DownloadReportFlightPDF(this.SearchForm.value).subscribe(data => {
        let resp:any=data;
         this.reportloading=false;
        let service='flight'
        let filename=service+".pdf";
        const link = document.createElement("a");
        link.href = URL.createObjectURL(data);
        link.download = filename;
        link.click();
      });
    }
  
  
}
