import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router, ActivatedRoute, NavigationExtras } from '@angular/router';
import { AlertService } from '../../../../services/alert.service';
import { AuthenticationService } from '../../../../services/authentication.service';
import { DashboardService } from '../../dashboard.service';


declare var window: any;
declare var $:any;
declare var bootstrap:any;


@Component({
  selector: 'app-cart-detail',
  templateUrl: './cart-detail.component.html',
  styleUrls: ['../../manage-carts/manage-carts/cart-detail/cart-detail.component.css']
})
export class CartDetailHotelComponent  implements OnInit {

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
  LoginAgentinfo:any=[];

  AbortAmendmentModal:any;
  AmendmentReasonNote:any;
  AmendmentRefNumber:any;
  abortloading=false;

  refno:any;

  activeroomkey:any;


  CancellationPolicyData  :any = [];
  CancellationPolicyModal  :any;

  atagtext='Show Room Description(+)';
  
  constructor(private router: Router,private route: ActivatedRoute,private alertservice:AlertService,private dashboardservice:DashboardService,private fb: FormBuilder,private authenticationservice: AuthenticationService) { 

    if(this.route.snapshot.params['refno']) {
      this.refno = this.route.snapshot.params['refno'];
      this.GetDetail(this.refno);
    } else {
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
      if(data && data['EmailId'])
      {
        this.LoginAgentinfo=data;  
      }
    });
  }


  GetDetail(refno:any)
  {
      this.dashboardservice.HotelDetail(refno).subscribe(data=>{
          let resp:any=data;
          this.loading=false;
          if(resp['Error']['ErrorCode']==0)
          {
            this.BookingDetail=resp['Result']['BookingDetail'];
            this.AmendmentList=resp['Result']['amendmentList'];
            this.NoteList=resp['Result']['BookingDetail']['BookingNotes'];
            this.PaymentInfo=resp['Result']['BookingDetail']['paymentInfo'];

          } else {
            this.BookingDetail=[];
            this.AmendmentList=[];
            this.NoteList=[];
            this.PaymentInfo=[];
            this.alertservice.error(resp['Error']['ErrorCode']);
          }
      });
  }

  RaiseAmendment(BookingID:any)
  {
      this.AddAmendmentModal.show();
      this.AddAmendmentForm.patchValue({'BookingID':BookingID});
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
    this.dashboardservice.AddNote(this.AddNotesForm.value,'hotel').subscribe(data=>{
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
        this.dashboardservice.AbortAmendments(request,'hotel').subscribe(data=>{
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

  Jsonparse(item:any)
  {
    return JSON.parse(item);
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

