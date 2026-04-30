import { Component, OnInit } from '@angular/core';
import { HotelService } from '../hotel.service';
import { ActivatedRoute, NavigationExtras, Router } from '@angular/router';
import { AlertService } from '../../../services/alert.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthenticationService } from '../../../services/authentication.service';
declare var bootstrap:any;
declare var window:any;
@Component({
  selector: 'app-booking-confirmation',
  templateUrl: './booking-confirmation.component.html',
  styleUrls: ['./booking-confirmation.component.css']
})
export class BookingConfirmationComponent implements OnInit {
  loading:boolean =true;
  downloadpdf:boolean =true;
  CancellationPolicyData  :any = [];
  CancellationPolicyModal  :any;
  isshowmarkup:boolean =false;
  Response:any=[];
  paramslist:any;
  FareDetail:any=[];
  Emailsubmitted:boolean=false;
  EmailForm : FormGroup;
  MobileForm : FormGroup;
  Mobilesubmitted:boolean=false;
  Mobileloading:boolean=false;
  Emailloading:boolean=false;
  markupvalue:any=0;
  SendSMSFormModal:any;
  EmailFormModal: any;
  TicketWithPrice:boolean=true;
  TicketWithAgency:boolean=true;
  constructor(private authenticationservice: AuthenticationService,private fb:FormBuilder,private hotelService:HotelService,private route:ActivatedRoute,private router:Router,private alertservice:AlertService) {
    this.route.queryParams.subscribe(params=>{
    if(params)
    {
      this.paramslist =params;
      this.GetDetail(params);
    }
    else{
      this.router.navigate(['/hotel'])
    }
    })
    this.EmailForm = this.fb.group({"EmailId":['', [Validators.required,Validators.email]]});
    this.MobileForm = this.fb.group({"MobileNumber":['', [Validators.required,Validators.pattern('[0-9]+'),Validators.minLength(10),Validators.maxLength(10)]]});
   
  }
  
  get fs()
  {
    return this.MobileForm.controls;
  }
  get fe()
  {
    return this.EmailForm.controls;
  }
  ngOnInit(): void {
    this.authenticationservice.currentUser.subscribe(data => {
      if(data && data['EmailId'] && data['MobileNo'])
      {
        this.EmailForm.patchValue({'EmailId':data['EmailId']});
        this.MobileForm.patchValue({'MobileNumber':data['MobileNo']});
      }
    });
    this.EmailFormModal = new window.bootstrap.Modal(
      document.getElementById('ticketformmodal-email')
    );
    this.SendSMSFormModal = new window.bootstrap.Modal(
      document.getElementById('ticketformmodal-mobile')
    );
  }
    GetDetail(params:any)
    {
      let type :any='';
      
      if(params['type'])
      {
      type  =  params['type'];
      }
      let request={'token':params['token']};
        this.hotelService.GetConfirmation(request,type).subscribe(response=>{
          this.loading=false;
          let data:any  =  response;
          if(data['Error']['ErrorCode']==0){
            this.Response=data['Result']['BookingDetail'];
            this.FareDetail=data['Result']['FareBreakUp'];
            this.markupvalue=this.FareDetail['TotalAmount']['TotalAmountBreakup']['Markup']['Value'];
          }
          else{
            this.alertservice.error(data['Error']['ErrorMessage']);
          }
        })
    }
    star_rating(star: number) {
      var starhtml = "";
      const count = 5 - star;
      for (let index = 0; index < star; index++) {
        starhtml += '<img src="assets/img/fill-star.svg">';
      }
      for (let index = 0; index < count; index++) {
        starhtml += '';
      }
      return starhtml;
    }
    getNoofNights(night:any){
      let NightText='';
      if(night>1){
        NightText= night+' Nights';
      }
      else{
        NightText= night+' Nights';
      }
      return NightText;
    }
    hoteltotalpaxcount(roomGuest:any,noOfRooms:any)
    {
      let room=noOfRooms-1;
      let paxcount=0;
      let finaltxt='';
      let roomtxt='';
      let paxtxt='';
      roomGuest.forEach(function(value: { Adult: number; Child: number; } , key: number) {
        if(key<=room) {
            paxcount+=value.Adult;
            paxcount+=value.Child;
        }
      });
  
      if(noOfRooms > 1)
      {
        roomtxt=noOfRooms + " Rooms ";
      } else {
        roomtxt=noOfRooms + " Room ";
      }
  
      if(paxcount > 1)
      {
        paxtxt=paxcount + " Guests";
      } else {
        paxtxt=paxcount + " Guest";
      }
  
      finaltxt=roomtxt + paxtxt;
      return finaltxt;
    }
    roomAmenities(Amenities:any)
    {
      
      let finaltxt='';
      if(Amenities.length>0){
      Amenities.forEach(function(value:any , key: number) {
        finaltxt+=value+',';
      });
      finaltxt =   finaltxt.replace(",",'');
      finaltxt ='<b> Incl :</b> '+finaltxt;
     }
     else{
      finaltxt="-";
     }
      return finaltxt;
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
    onSubmitEmail()
  {
    this.Emailsubmitted = true;
    if (this.EmailForm.invalid) {
      return;
    }

    this.Emailloading=true;
    let request={
                  'booking_ref_number':this.Response['booking_ref_number'],
                  'type':'Voucher',
                  'price':1,
                  'agency_detail':1,
                  'send_email':1,
                  'to_email':this.EmailForm.get('EmailId')?.value,
                  'pdf':''
              }

      this.hotelService.GetInvoiceTicket(request).subscribe(resp => {
        let data:any=resp;
        this.Emailloading=false;
        this.EmailFormModal.hide();
        if(data['Error']['ErrorCode']==0)
        {
          this.alertservice.success(data['Error']['ErrorMessage']);
  
        } else{
          this.alertservice.error(data['Error']['ErrorMessage']);
        } 
      });
  }


  DownloadPDF()
  {
    if(this.downloadpdf==true)
    {
          let request={
            'booking_ref_number':this.Response['booking_ref_number'],
            'type':'Voucher',
            'price':1,
            'agency_detail':1,
            'send_email':1,
            'to_email':'',
            'pdf':'download'
        }
        this.downloadpdf=false;
        this.hotelService.DownloadPDF(request).subscribe(resp => {
        this.downloadpdf=true;
        let data:any=resp;
        let filename=this.Response['booking_ref_number']+".pdf";
        const link = document.createElement("a");
        link.href = URL.createObjectURL(data);
        link.download = filename;
        link.click();
        });
    }
   
  }
    ViewTicketInvoice(ticketType:any)
    {
      let WithPrice;
      if(this.TicketWithPrice)
      {
        WithPrice=1;
      } else {
        WithPrice=0;
      }
      let WithAgencyDetail;
      if(this.TicketWithAgency)
      {
        WithAgencyDetail=1;
      } else {
        WithAgencyDetail=0;
      }
  
       let booking_ref_number=this.Response['booking_ref_number'];
  
       let data={
                    'BookingRefNumber':booking_ref_number,
                    'SearchTokenId':this.Response['SearchTokenId'],
                    'HtmlType':ticketType,
                    'UserType':'WebPartner',
                    'ViewService':'View',
                    'WithPrice':WithPrice,
                    'WithAgencyDetail':WithAgencyDetail,
                    'ViewSize':'',
                 }
                 
        const navigationExtras: NavigationExtras = {
          queryParams:data
        };
        if(ticketType=='Voucher')
        {
          this.router.navigate(['hotel/ticket'],navigationExtras);
        } else {
          this.router.navigate(['hotel/invoice'],navigationExtras);
        }
    }
    showmarkup()
    {

    this.isshowmarkup=!this.isshowmarkup;
    }
    onSubmitSMS()
    {
      
      this.Mobilesubmitted=true;
      if(this.MobileForm.invalid)
      {
      return;
      }
      this.Mobileloading=true;
      let request =  {
        'mobile': this.fs['MobileNumber'].value,
        'ref_no':this.Response['booking_ref_number'],
      }
      this.hotelService.SendSMS(request).subscribe(resp => {
        let data:any=resp;
        this.Mobileloading=false;
        this.SendSMSFormModal.hide();
        if(data['Error']['ErrorCode']==0)
        {
          this.alertservice.success(data['Error']['ErrorMessage']);
        } else{
          this.alertservice.error(data['Error']['ErrorMessage']);
        } 
      });
    }
    
    updatemarkup()
    {
      this.showmarkup();
      let data  =  {
        'Markup':this.markupvalue,
        'BookingRefNumber':this.Response['booking_ref_number'],
        'SearchTokenId':this.Response['SearchTokenId'], 
      }
      this.hotelService.UpdateMarkup(data).subscribe(data=>{
        let response:any = data;
        if(response['Error']['ErrorCode']==0)
        {
          this.GetDetail(this.paramslist);
        } else{
          this.alertservice.error(response['Error']['ErrorMessage']);
        } 
      });
      

    }
    CancellationPolicy(item:any)
{
  this.CancellationPolicyData  =  item;
  this.CancellationPolicyModal=new bootstrap.Modal(
    document.getElementById('CancellationPolicyModal')
  );
  this.CancellationPolicyModal.show();
}

   formatCustomDate(dateString: string): Date {
      // Convert "27-07-2025T00:00:00" to "2025-07-27T00:00:00"
      const [day, month, yearWithTime] = dateString.split('-');
      const [year, time] = yearWithTime.split('T');
      const isoDate = `${year}-${month}-${day}T${time}`;
      return new Date(isoDate);
    }
}
