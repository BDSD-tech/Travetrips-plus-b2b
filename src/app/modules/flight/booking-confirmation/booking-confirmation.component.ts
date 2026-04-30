import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute, NavigationExtras, Router } from '@angular/router';
import { AlertService } from '../../../services/alert.service';
import { AuthenticationService } from '../../../services/authentication.service';
import { tts_config } from '../../../../environments/tts_config';
import { FlightService } from '../flight.service';

declare var $: any;
declare var window: any;

@Component({
  selector: 'app-booking-confirmation',
  templateUrl: './booking-confirmation.component.html',
  styleUrls: ['./booking-confirmation.component.scss'],
})
export class BookingConfirmationComponent implements OnInit {

  GetWebSiteData:any=[];
  Response:any=[];
  loading:any=true;

  isshowmarkup:any=false;
  markupvalue=0;


  EmailForm: FormGroup;
  Emailsubmitted = false;
  Emailloading = false;
  EmailFormModal: any;

  MobileForm: FormGroup;
  Mobilesubmitted = false;
  Mobileloading = false;
  SendSMSFormModal:any;

  TicketWithPrice:any=true;
  TicketWithAgency:any=true;
  TicketInvoiceJourney:any='Onward';

  downloadpdf=true;

  FareDetail:any=[];

  paramslist:any=[];

  AirlineLogoURL:any=tts_config['BASEURL']+'uploads/airline-images/';
  
  constructor(private router: Router,private flightService:FlightService,private route: ActivatedRoute,private alertservice:AlertService,public fb: FormBuilder,private authenticationservice: AuthenticationService) {


    this.route.queryParams.subscribe(params => {
      if(params) {
          this.paramslist=params;
          this.GetDetails(params)
      } else {
          this.router.navigate(['/flight']);
       }
    });

    this.EmailForm = this.fb.group({EmailId: ['', [Validators.required,Validators.email]]});
    this.MobileForm = this.fb.group({MobileNumber:['', [Validators.required,Validators.pattern('[0-9]+'),Validators.minLength(10),Validators.maxLength(10)]]});

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

  ArrayTostring(pnrarray:any){
    return pnrarray.join(',')
  }
  GetDetails(params:any)
  {
    let type:any='';
    if(params['type'])
    {
      type=params['type'];
    }
    let request={'token':params['token']};
    this.flightService.GetConfimationData(request,type).subscribe(resp => {
      let data:any=resp;
      this.loading=false;
      if(data['Error']['ErrorCode']==0)
      {
          this.Response=data['Result'];
          this.FareDetail=this.Response['FareBreakUp'];
          this.markupvalue=this.FareDetail['TotalAmount']['TotalAmountBreakup']['Markup']['Value'];
      } else{
        this.alertservice.error(data['Error']['ErrorMessage']);
      } 
    });
  }

  FTduration(n : number)
  {
    var num = n;
    var hours = (num / 60);
    var rhours = Math.floor(hours);
    var minutes = (hours - rhours) * 60;
    var rminutes = Math.round(minutes);
    return  rhours + "h  "+ rminutes + "m";
  }

  faretogglebutton(event:any,tripkey:any)
  {
    $("#fare-rule-"+tripkey).toggle('d-none');
    let isexpanded=event.target.getAttribute('data-expanded');
    if(isexpanded=='false')
    {
      $(".ttsfare"+tripkey).removeClass('fa-minus');
      $(".ttsfare"+tripkey).addClass('fa-plus');
      event.target.setAttribute('data-expanded','true');
      
    } else {
      $(".ttsfare"+tripkey).addClass('fa-minus');
      $(".ttsfare"+tripkey).removeClass('fa-plus');
      event.target.setAttribute('data-expanded','false');
    }
  }
  
  SpacePartialcanceled(data:any){
    return data.replace(/([a-z])([A-Z])/g, '$1 $2');
  }

  showmarkup()
  {
    this.isshowmarkup=!this.isshowmarkup;
  }

  updatemarkup()
  {
    this.showmarkup();

    let request={
                  'Markup':this.markupvalue,
                  'BookingRefNumber':this.Response['bookingRefNumber'],  
                  'SearchTokenId':this.Response['SearchTokenId'],  
                }

    this.flightService.UpdateMarkup(request).subscribe(resp => {
      let data:any=resp;
      if(data['Error']['ErrorCode']==0)
      {
        this.GetDetails(this.paramslist);
      } else{
        this.alertservice.error(data['Error']['ErrorMessage']);
      } 
    });

  }
  
  JsonParse(val:any){
    return JSON.parse(val)
    
  }
  ViewTicketInvoice(type:any)
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

    let BookingId:any;
    if(this.TicketInvoiceJourney=='Onward')
    {
      BookingId=this.Response['ConfirmationBookingData'][0]['BookingId'];
    }
    if(this.TicketInvoiceJourney=='Return')
    {
      BookingId=this.Response['ConfirmationBookingData'][1]['BookingId'];
    }
    if(this.TicketInvoiceJourney=='Both')
    {
      BookingId=this.Response['ConfirmationBookingData'][0]['BookingId']+','+this.Response['ConfirmationBookingData'][1]['BookingId'];
    }

     let data={
                  'BookingId':BookingId,
                  'SearchTokenId':this.Response['SearchTokenId'],
                  'HtmlType':type,
                  'UserType':'WebPartner',
                  'ViewService':'View',
                  'WithPrice':WithPrice,
                  'WithAgencyDetail':WithAgencyDetail,
                  'TicketInvoiceJourney':this.TicketInvoiceJourney,
                  'ViewSize':'',
               }
               
      const navigationExtras: NavigationExtras = {
        queryParams:data
      };
      if(type=='Ticket')
      {
        this.router.navigate(['flight/ticket'],navigationExtras);
      } else {
        this.router.navigate(['flight/invoice'],navigationExtras);
      }
  }

  get fs() { return this.MobileForm.controls; }

  onSubmitSMS()
  {
    this.Mobilesubmitted = true;
    if (this.MobileForm.invalid) {
      return;
    }

    this.Mobileloading=true;
    let request={
                   'ref_no':this.Response['bookingRefNumberString'],
                   'mobile':this.MobileForm.get('MobileNumber')?.value,
                }

    this.flightService.SendSMS(request).subscribe(resp => {
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

  get fe() { return this.EmailForm.controls; }

  onSubmitEmail()
  {
    this.Emailsubmitted = true;
    if (this.EmailForm.invalid) {
      return;
    }

    this.Emailloading=true;
    let request={
                  'booking_ref_number':this.Response['bookingRefNumberString'],
                  'type':'Ticket',
                  'price':1,
                  'agency_detail':1,
                  'send_email':1,
                  'to_email':this.EmailForm.get('EmailId')?.value,
                  'pdf':''
              }

      this.flightService.GetInvoiceTicket(request).subscribe(resp => {
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
            'booking_ref_number':this.Response['bookingRefNumberString'],
            'type':'Ticket',
            'price':1,
            'agency_detail':1,
            'send_email':1,
            'to_email':'',
            'pdf':'download'
        }
        this.downloadpdf=false;
        this.flightService.DownloadPDF(request).subscribe(resp => {
        this.downloadpdf=true;
        let data:any=resp;
        let filename=this.Response['bookingRefNumberString']+".pdf";
        const link = document.createElement("a");
        link.href = URL.createObjectURL(data);
        link.download = filename;
        link.click();
        });
    }
   
  }
}

