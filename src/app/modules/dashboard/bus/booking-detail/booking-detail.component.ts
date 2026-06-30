import { Component } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Router, ActivatedRoute, NavigationExtras } from '@angular/router';
import { tts_config } from '../../../../../environments/tts_config';
import { AlertService } from '../../../../services/alert.service';
import { AuthenticationService } from '../../../../services/authentication.service';
import { DashboardService } from '../../dashboard.service';


declare var $:any
declare var window:any
@Component({
  selector: 'app-booking-detail',
  templateUrl: './booking-detail.component.html',
  styleUrl: './booking-detail.component.css'
})
export class BookingDetailComponent {

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
  constructor(private router: Router,private route: ActivatedRoute,private alertservice:AlertService,private dashboardservice:DashboardService,private fb: FormBuilder,private authenticationservice: AuthenticationService) { 

    if(this.route.snapshot.params['id']) {
      this.refno = this.route.snapshot.params['id'];
      this.GetDetail(this.refno);
    } else {
      // this.router.navigate(['dashboard/manage-carts']);
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
      this.dashboardservice.BusBookingDetail(refno).subscribe(data=>{
          let resp:any=data;
          this.loading=false;
          if(resp['Error']['ErrorCode']==0)
          {
            
            this.BookingDetail=resp['Result']['BookingDetail'];
            this.AmendmentList=resp['Result']['AmendmentList'] ||[];
            this.NoteList=resp['Result']['BookingNotes'];
            this.PaymentInfo=this.BookingDetail['paymentInfo'];
            
           
          } else {
            this.BookingDetail=[];
            this.AmendmentList=[];
            this.NoteList=[];
            this.PaymentInfo=[];
            this.alertservice.error(resp['Error']['ErrorCode']);
          }
      });
  }

  GetParse(data:any){
    return JSON.parse(data);
  }

  SpacePartialcanceled(data:any){
    return data.replace(/([a-z])([A-Z])/g, '$1 $2');
  }
  RaiseAmendment(BookingID:any)
  {
      this.AddAmendmentModal.show();
      this.AddAmendmentForm.patchValue({'BookingID':BookingID});
  }
  Back(){
    window.close();
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
    this.dashboardservice.RaiseAmendments(this.AddAmendmentForm.value,'bus').subscribe((resp:any)=>{
        this.amendmentsubmitted = false;
        if(resp['Error']['ErrorCode']==0){
          this.alertservice.success(resp['Error']['ErrorMessage']);
          this.AddAmendmentModal.hide();
          this.GetDetail(this.refno);
        }else{
          this.alertservice.error(resp['Error']['ErrorMessage']);
        }
      })
  }

  GeneratePayment(){
    
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
        this.BookingReachForm.hide();
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
