import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router, ActivatedRoute, NavigationExtras } from '@angular/router';
import { AlertService } from '../../../../../services/alert.service';
import { AuthenticationService } from '../../../../../services/authentication.service';
import { tts_config } from '../../../../../../environments/tts_config';
import { DashboardService } from '../../../dashboard.service';

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
  
  constructor(private router: Router,private route: ActivatedRoute,private alertservice:AlertService,private dashboardservice:DashboardService,private fb: FormBuilder,private authenticationservice: AuthenticationService) { 

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

     this.AddNotesForm=this.fb.group({
                                            BookingID: ['',[Validators.required]],
                                            NoteType: ['',[Validators.required]],
                                            Message: ['',[Validators.required]],
                                            ShowToAll: [''],
                                        });  
  }

  ngOnInit(): void {

    this.AddAmendmentModal = new window.bootstrap.Modal(
      document.getElementById('addamendmentmodal')
    );


    this.AbortAmendmentModal = new window.bootstrap.Modal(
      document.getElementById('tts-abort-modal')
    );

    this.AddNotesModal = new window.bootstrap.Modal(
      document.getElementById('addnotesmodal')
    );
    

    this.authenticationservice.currentUser.subscribe(data => {
      if(data && data['CompanyId'])
      {
        this.LoginAgentinfo=data;  
      }
    });
  }


  GetDetail(refno:any)
  {
      this.dashboardservice.FlightDetail(refno).subscribe(data=>{
          let resp:any=data;
          this.loading=false;
          if(resp['Error']['ErrorCode']==0)
          {
            this.BookingDetail=resp['Result'];
            console.log(this.BookingDetail['travelersInfo']);
            
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
    let icon = $("#"+id+'_main').find("i");
    icon.toggleClass("fa fa-angle-up fa fa-angle-down");
  }
  
}
