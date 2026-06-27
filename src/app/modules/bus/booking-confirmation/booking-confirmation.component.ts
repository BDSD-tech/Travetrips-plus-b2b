import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { BusService } from '../bus.service';
import { Router, ActivatedRoute, NavigationExtras } from '@angular/router';
import { AlertService } from '../../../services/alert.service';
import { AuthenticationService } from '../../../services/authentication.service';


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
  loading:boolean=true;

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

  downloadpdf=true;
  FareDetail:any=[];
  paramslist:any=[];
  
  constructor(private router: Router,private busService:BusService,private route: ActivatedRoute,private alertservice:AlertService,public fb: FormBuilder,private authenticationservice: AuthenticationService) {


    this.route.queryParams.subscribe(params => {
      if(params) {
          this.paramslist=params;
          this.GetDetails(params)
      } else {
          this.router.navigate(['/bus']);
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


  GetDetails(params:any)
  {
    let type:any='';
    if(params['type'])
    {
      type=params['type'];
    }
    let request={'token':params['token']};
    this.busService.GetConfimationData(request,type).subscribe(resp => {
      let data:any=resp;
      this.loading=false;
      if(data['Error']['ErrorCode']==0)
      {
          this.Response=data['Result']['BookingDetail'];
          console.log(this.Response);
          
          this.FareDetail=data['Result']['FareBreakUp'];
          this.markupvalue=this.FareDetail['TotalAmount']['TotalAmountBreakup']['Markup']['Value'];
      } else{
        this.alertservice.error(data['Error']['ErrorMessage']);
      } 
    });
  }

  Jsonparse(item:any)
  {
    return JSON.parse(item);
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
                  'BookingRefNumber':this.Response['booking_ref_number'],  
                  'SearchTokenId':this.Response['SearchTokenId'],  
                }

    this.busService.UpdateMarkup(request).subscribe(resp => {
      let data:any=resp;
      if(data['Error']['ErrorCode']==0)
      {
        this.GetDetails(this.paramslist);
      } else{
        this.alertservice.error(data['Error']['ErrorMessage']);
      } 
    });

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

     let booking_ref_number=this.Response['booking_ref_number'];

     let data={
                  'BookingRefNumber':booking_ref_number,
                  'SearchTokenId':this.Response['tts_search_token'],
                  'HtmlType':type,
                  'UserType':'WebPartner',
                  'ViewService':'View',
                  'WithPrice':WithPrice,
                  'WithAgencyDetail':WithAgencyDetail,
                  'ViewSize':'',
               }
               
      const navigationExtras: NavigationExtras = {
        queryParams:data
      };
      if(type=='Voucher')
      {
        this.router.navigate(['bus/ticket'],navigationExtras);
      } else {
        this.router.navigate(['bus/invoice'],navigationExtras);
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

    this.busService.SendSMS(request).subscribe(resp => {
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
                  'booking_ref_number':this.Response['booking_ref_number'],
                  'type':'Voucher',
                  'price':1,
                  'agency_detail':1,
                  'send_email':1,
                  'to_email':this.EmailForm.get('EmailId')?.value,
                  'pdf':''
              }

      this.busService.GetInvoiceTicket(request).subscribe(resp => {
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
        this.busService.DownloadPDF(request).subscribe(resp => {
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

}

