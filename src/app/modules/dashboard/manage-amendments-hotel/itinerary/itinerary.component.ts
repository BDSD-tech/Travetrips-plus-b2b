import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute, Data } from '@angular/router';
import { AlertService } from '../../../../services/alert.service';
import { DashboardService } from '../../dashboard.service';

declare var bootstrap:any;

@Component({
  selector: 'app-itinerary',
  templateUrl: './itinerary.component.html',
  styleUrls: ['./../../manage-amendments/itinerary/itinerary.component.css']
})
export class ItineraryComponent implements OnInit {

  params:any;
  loading=true;
  BookingDetail:any=[];
  AmendmentList:any=[];
  Remark:any='';

  submitloading=false;

  activeroomkey:any;

  CancellationPolicyData  :any = [];
  CancellationPolicyModal  :any;

  atagtext='Show Room Description(+)';

  

  constructor(private router: Router,private route: ActivatedRoute,private alertservice:AlertService,private dashboardservice:DashboardService) { 


    this.route.queryParams.subscribe(params => {
      if(params['bookingid'] && params['amendment-type']) {
        this.params=params;
      } else {
          this.router.navigate(['dashboard/manage-cart-hotel']);
       }
    });


  }
  
  ngOnInit(): void {

    this.GetBookingDetail();
  }

  GetBookingDetail()
  {
      
      this.dashboardservice.HotelDetail(this.params['bookingid']).subscribe(data=>{
          let resp:any=data;
          this.loading=false;
          if(resp['Error']['ErrorCode']==0)
          {
            this.BookingDetail=resp['Result']['BookingDetail'];
            this.AmendmentList=resp['Result']['amendmentList'];
          } else {
            this.BookingDetail=[];
            this.AmendmentList=[];
            this.alertservice.error(resp['Error']['ErrorCode']);
          }
      });
  }

  

  SubmitRequest()
  {   
    if(this.BookingDetail['payment_status']=='Successful')
    {
      if(this.Remark!=='')
      {
        
        let request={
                      'BookingRefNo':this.params['bookingid'],
                      'AmendmentType':this.params['amendment-type'],
                      'Remark':this.Remark,
                    }
        this.submitloading=true;
        this.dashboardservice.RaiseAmendments(request,'hotel').subscribe(data=>{
          let resp:any=data;
          this.submitloading=false;
          if(resp['Error']['ErrorCode']==0)
          { 
            this.GetBookingDetail();
            this.router.navigate(['/dashboard/hotel-booking-details/',this.params['bookingid']])
            this.Remark='';
            this.alertservice.success(resp['Error']['ErrorMessage']);
          } else {
            this.alertservice.error(resp['Error']['ErrorMessage']);
          }
        });

      } else {
        this.alertservice.error('Please enter Remark');
      }
    }else if(this.BookingDetail['payment_status']!=='Successful'){
        this.alertservice.error('Payment Not done for this booking.');
    } else if(this.BookingDetail['booking_status']=='Cancelled')
    {
      this.alertservice.error('Booking already Cancelled');
    }
    
  }

  Jsonparse(item:any)
  {
    if(item)
    {
      return JSON.parse(item);
    }
  }


  showroomdetail(roomkey:any)
  {
    if(this.atagtext=='Show Room Description(+)')
    {  
      this.atagtext='Hide Room Description(-)';
      this.activeroomkey=roomkey;     
    } else {
      this.atagtext='Show Room Description(+)';
      this.activeroomkey=null;
    }
  }

  CancellationPolicy(item:any)
  {
    this.CancellationPolicyData=item;
    this.CancellationPolicyModal=new bootstrap.Modal(
      document.getElementById('CancellationPolicyModal')
    );
    this.CancellationPolicyModal.show();
  }
  
  roompaxInfo(roomData:any)
  {
    let finaltxt='';
    let Adulttext  =  "";
    let childtext  =  "";
    if(roomData['HotelPassenger'].length>0){
      roomData['HotelPassenger'].forEach(function(value:any , key: number) {
        if(roomData['AdultCount']>0 && value['PaxType']==1){
          Adulttext+=value['Title']+' '+value['FirstName']+' '+value['LastName']+", ";
        }
        if(roomData['ChildCount']>0 && value['PaxType']!=1){
          childtext+=value['Title']+' '+value['FirstName']+' '+value['LastName']+", ";
        }
    });
    finaltxt =   finaltxt.replace(",",'');
    finaltxt =finaltxt+ '<b> Adult  : </b> '+Adulttext;
    if(roomData['ChildCount']>0){ 
      finaltxt =finaltxt+ '<b> Child  : </b> '+childtext;
    }
   }
   else{
    finaltxt="-";
   }
    return finaltxt;
  }
}