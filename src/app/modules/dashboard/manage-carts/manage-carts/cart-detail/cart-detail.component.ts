import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router, ActivatedRoute, NavigationExtras } from '@angular/router';
import { AlertService } from '../../../../../services/alert.service';
import { AuthenticationService } from '../../../../../services/authentication.service';
import { tts_config } from '../../../../../../environments/tts_config';
import { DashboardService } from '../../../dashboard.service';
import { CommonService } from '../../../../../services/common.service';
declare var window: any;
declare var $:any;



  
@Component({
  selector: 'app-cart-detail',
  templateUrl: './cart-detail.component.html',
  styleUrls: ['./cart-detail.component.css']
})
export class CartDetailComponent implements OnInit {

  loading=true;
  BookingDetail:any=[];

  AddAmendmentModal:any;
  AddAmendmentForm:FormGroup;
  amendmentsubmitted=false;
  amendmentloading=false;

  AddNotesModal:any;
  AddNotesForm:FormGroup;
  notesubmitted=false;
  notesloading=false;

  AmendmentList:any=[];
  NoteList:any=[];
  PaymentInfo:any=[];
  TicketInvoiceJourney:any;
  LoginAgentinfo:any=[];

  AbortAmendmentModal:any;
  AmendmentReasonNote:any;
  AmendmentRefNumber:any;
  abortloading=false;

  refno:any;

  Notespreview = '';
  NotesselectedFiles?: FileList;
  NotescurrentFile?: File;
  Notesupload =false;

  AirlineLogoURL:any=tts_config['BASEURL']+'uploads/airline-images/';
  NotesImage:any=tts_config['BASEURL']+'uploads/savenotes/';
  

  BookingReachModal:any

  BookingReachForm:any=FormGroup;
  Reachsubmitted=false;

  Submitloading=false;
  CurrentFare:any={}


  TicketWithPrice:any=true;
  TicketWithAgency:any=true;
  selectedPaxIds: number[] = [];
  passengers:any=[]
  constructor(private commonService:CommonService,private router: Router,private route: ActivatedRoute,private alertservice:AlertService,private dashboardservice:DashboardService,private fb: FormBuilder,private authenticationservice: AuthenticationService) { 

    if(this.route.snapshot.params['refno']) {
      this.refno = this.route.snapshot.params['refno'];
      this.GetDetail(this.refno);
    } else {
      this.router.navigate(['dashboard/manage-carts']);
     }  

     this.AddAmendmentForm=this.fb.group({
                                            BookingID: ['',[Validators.required]],
                                            AmendmentType: ['',[Validators.required]]
                                        });  
     this.BookingReachForm=this.fb.group({
                                            Token: ['',[Validators.required]],
                                            Remark: ['',[Validators.required]]
                                        });  

     this.AddNotesForm=this.fb.group({
                                            BookingID: ['',[Validators.required]],
                                            NoteType: ['',[Validators.required]],
                                            Message: ['',[Validators.required]],
                                            ShowToAll: [''],
                                        });  
  }

  ngOnInit(): void {
    sessionStorage.removeItem('FareDetails');
    this.AddAmendmentModal = new window.bootstrap.Modal(
      document.getElementById('addamendmentmodal')
    );


    this.AbortAmendmentModal = new window.bootstrap.Modal(
      document.getElementById('tts-abort-modal')
    );

    this.AddNotesModal = new window.bootstrap.Modal(
      document.getElementById('addnotesmodal')
    );
    this.BookingReachModal = new window.bootstrap.Modal(
      document.getElementById('booking-reach-modal')
    );
    

    this.authenticationservice.currentUser.subscribe(data => {
      if(data && data['CompanyId'])
      {
        this.LoginAgentinfo=data;  
      }
    });
  }

  get reach(){return this.BookingReachForm.controls}
  GetDetail(refno:any)
  {
      this.dashboardservice.FlightDetail(refno).subscribe(data=>{
          let resp:any=data;
          this.loading=false;
          if(resp['Error']['ErrorCode']==0)
          {
            this.BookingDetail=resp['Result'];
            this.passengers=this.BookingDetail['travelersInfo']
            this.CreateFB(this.BookingDetail['travelersInfo']);
            this.AmendmentList=resp['Result']['amendmentList'];
            this.NoteList=resp['Result']['BookingNotes'];
            this.PaymentInfo=resp['Result']['paymentInfo'];
            if(resp['Result']['trip_indicator']=='1')
            {
              this.TicketInvoiceJourney='Onward';
            }
            if(resp['Result']['trip_indicator']=='2')
            {
              this.TicketInvoiceJourney='Return';
            }
           
          } else {
            this.BookingDetail=[];
            this.AmendmentList=[];
            this.NoteList=[];
            this.PaymentInfo=[];
            this.alertservice.error(resp['Error']['ErrorCode']);
          }
      });
  }

  CreateFB(data:any){
    let agentmarkup=0; let basefare=0; let tax=0; let offerprice=0;let publishprice=0;let commission=0;let discount=0;let SeatCharges=0;
    let mealcharge=0;let baggagecharge=0;let gst=0;let othercharge=0;let servicecharge=0;let tds=0;let yq=0;let webpmarkup=0;
    data.forEach((pax:any) => {
      basefare+= pax.fare.BaseFare
      tax+= pax.fare.Tax
      offerprice+= pax.fare.OfferedPrice
      publishprice+= pax.fare.PublishedPrice
      commission+= pax.fare.AgentCommission
      discount+= pax.fare.Discount
      SeatCharges+= pax.fare.SeatCharges
      mealcharge+= pax.fare.MealCharges
      baggagecharge+= pax.fare.BaggageCharges
      gst+= pax.fare.GSTAmount
      othercharge+= pax.fare.OtherCharges
      servicecharge+= pax.fare.ServiceCharges
      tds+= pax.fare.TDS
      yq+= pax.fare.YQTax
      webpmarkup+= pax.fare.WebPMarkUp
      agentmarkup+=pax.fare.WebPMarkUp
    });
    this.CurrentFare={
      'BaseFare':basefare,
      'InsurancePrice':0,
      'AgentMarkup':agentmarkup,
      'Tax':tax,
      'OfferedPrice':offerprice,
      'PublishedPrice':publishprice,
      'AgentCommission':commission,
      'Discount':discount,
      'SeatCharges':SeatCharges,
      'MealCharges':mealcharge,
      'BaggageCharges':baggagecharge,
      'GSTAmount':gst,
      'OtherCharges':othercharge,
      'ServiceCharges':servicecharge,
      'TDS':tds,
      'YQTax':yq,
      'webpmarkup':webpmarkup,
    }
  } 
  SpacePartialcanceled(data:any){
    return data.replace(/([a-z])([A-Z])/g, '$1 $2');
  }
  RaiseAmendment(BookingID:any)
  {
      this.AddAmendmentModal.show();
      this.AddAmendmentForm.patchValue({'BookingID':BookingID});
  }

  get fa() { return this.AddAmendmentForm.controls; }

  selectFile(event:any) {
    this.NotesselectedFiles = event.target.files;
    if (this.NotesselectedFiles) {
      const file: File | null = this.NotesselectedFiles.item(0);
      if (file) {
        this.Notesupload=true;
        this.Notespreview = '';
        this.NotescurrentFile = file;
        const reader = new FileReader();
        reader.onload = (e: any) => {
          this.Notespreview = e.target.result;
        };
        reader.readAsDataURL(this.NotescurrentFile);
      }
    }
  }

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
    
    this.router.navigate(['dashboard/amendments/itinerary'],navigationExtras);
  }

  GeneratePayment(){
      let data:any={
        "service":'Flight',
        "token":this.BookingDetail['Token'],
        "SearchTokenId":this.BookingDetail['tts_search_token'],
        "ResultIndex":this.BookingDetail['resultIndex']
      }
      sessionStorage.setItem('FareDetails',this.commonService.encrypt(this.CurrentFare))

      const navigationExtras: NavigationExtras = {
        queryParams:data
      };
      this.router.navigate(['/dashboard/payment'],navigationExtras);
  }


  OpenModal(){
    this.BookingReachForm.patchValue({
      Token:this.BookingDetail['Token']
    })
    this.BookingReachModal.show();
  }

  SubmitReach(){
    this.Reachsubmitted=true;
    if(this.BookingReachForm.invalid){
      return;
    }

    this.Submitloading=true;
    this.dashboardservice.ReachFlight(this.BookingReachForm.value).subscribe((resp:any)=>{
      this.Submitloading=false;
      if(resp['Error']['ErrorCode']==0){
        this.BookingReachModal.hide();
        this.GetDetail(this.refno);
        this.alertservice.success(resp['Error']['ErrorMessage']);
      }else{  
          this.alertservice.error(resp['Error']['ErrorMessage']);
      }
    })
  }

  AddNotes(BookingID:any)
  {
      this.AddNotesModal.show();
      this.AddNotesForm.patchValue({'BookingID':BookingID});
  }


  get fn() { return this.AddNotesForm.controls; }

  SubmitNotes()
  {
    this.notesubmitted = true;
    if (this.AddNotesForm.invalid) {
      return;
    }
    let filedata:any=this.NotesselectedFiles?.[0];
    const formData = new FormData();
    formData.append('file' , filedata);
    formData.append('data',JSON.stringify(this.AddNotesForm.value))
    this.dashboardservice.AddNote(formData,'flight').subscribe(data=>{
      let resp:any=data;
      this.notesloading=false;
      if(resp['Error']['ErrorCode']==0)
      {
        this.GetDetail(this.refno);
        this.AddNotesModal.hide();
        this.alertservice.success(resp['Error']['ErrorMessage']);
      } else{
        this.alertservice.error(resp['Error']['ErrorMessage']);
      }
    });
  }
  GoBack(){
    window.close()
  }
  AbortAmendments(amendment_ref_number:any)
  {
    this.AbortAmendmentModal.show();
    this.AmendmentRefNumber=amendment_ref_number;
    
  }
  SubmitAbortAmendments()
  {
      if(this.AmendmentReasonNote!=null && this.AmendmentReasonNote!='')
      {
        let request={
                        'BookingID':this.BookingDetail['booking_ref_number'],
                        'AmendmentRefNumber':this.AmendmentRefNumber,
                        'AmendmentReasonNote':this.AmendmentReasonNote,
                    }

        this.abortloading=true;
        this.dashboardservice.AbortAmendments(request,'flight').subscribe(data=>{
          let resp:any=data;
          this.abortloading=false;
          if(resp['Error']['ErrorCode']==0)
          {
            this.AbortAmendmentModal.hide();
            this.alertservice.success(resp['Error']['ErrorMessage']);
          }
        });

      } else {
        this.alertservice.error('Please add reason');
      }
  }


  getTotalDebit() {
    if(this.PaymentInfo.length!=0)
    {
      return this.PaymentInfo.map((t:any) => parseFloat(t.debit)).reduce((acc:any , value:any) => acc + value, 0);
    }
  }

  togglediv(id:any)
  {

    $("#"+id).toggle();
    let icon = $("#"+id+'_main').find("i.fa-angle-up");
    icon.toggleClass("fa fa-angle-up fa fa-angle-down");
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
      BookingId=this.BookingDetail['booking_ref_number'];
    }
    if(this.TicketInvoiceJourney=='Return')
    {
      BookingId=this.BookingDetail['booking_ref_number'];
    }
    if(this.TicketInvoiceJourney=='Both')
    {
      BookingId=this.BookingDetail['booking_ref_number']+','+this.BookingDetail['ConfirmationBookingData'][1]['BookingId'];
    }

     let data={
                  'BookingId':BookingId,
                  'SearchTokenId':this.BookingDetail['tts_search_token'],
                  'HtmlType':type,
                  'UserType':'WebPartner',
                  'ViewService':'View',
                  'WithPrice':WithPrice,
                  'WithAgencyDetail':WithAgencyDetail,
                  'TicketInvoiceJourney':this.TicketInvoiceJourney,
                  'ViewSize':'',
                  'PaxIds':this.selectedPaxIds
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

  isSelected(id: number): boolean {
    return this.selectedPaxIds.includes(id);
  }
 
  togglePassenger(id: number): void {
    if (this.isSelected(id)) {
      this.selectedPaxIds = this.selectedPaxIds.filter(paxId => paxId !== id);
    } else {
      this.selectedPaxIds = [...this.selectedPaxIds, id];
    }
  }
 
  get allSelected(): boolean {
    return this.selectedPaxIds.length === this.passengers.length;
  }
 
  get someSelected(): boolean {
    return this.selectedPaxIds.length > 0 && !this.allSelected;
  }

  toggleAll(): void {
    if (this.allSelected) {
      this.selectedPaxIds = [];
    } else {
      this.selectedPaxIds = this.passengers.map((p:any) => p.id);
    }
  }
 
  getPaxTypeClass(type: string): string {
    switch (type) {
      case 'Adult':  return 'badge-adult';
      case 'Child':  return 'badge-child';
      case 'Infant': return 'badge-infant';
      default:       return '';
    }
  }
 
  getInitials(firstName: string, lastName: string): string {
    return `${firstName.charAt(0)}${lastName.charAt(0)}`.toUpperCase();
  }


}
