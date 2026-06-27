import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Location } from '@angular/common';
import { MatAutocompleteSelectedEvent } from '@angular/material/autocomplete';
import { BusService } from '../bus.service';
import { ActivatedRoute, NavigationExtras, Router } from '@angular/router';
import { CommonService } from '../../../services/common.service';
import { AuthenticationService } from '../../../services/authentication.service';
import { AlertService } from '../../../services/alert.service';
declare var bootstrap:any
@Component({
  selector: 'app-review-detail',
  templateUrl: './review-detail.component.html',
  styleUrls: ['./review-detail.component.css']
})
export class ReviewDetailComponent implements OnInit {
  SHowGST=false
  GetWebSiteData:any=[];
  userinfo:any=[];
  param:any=[];
  GetSearchData:any=[];
  SelectedBus:any=[];
  SelectedBusSeat:any=[];

  isGSTShow = false;
  Gstsubmitted=false;
  GSTForm: FormGroup;
  GSTTxt='Optional';

  CurrentFare:any={};
  isshowmarkup:any=false;
  markupvalue=0;


  BusForm!: FormGroup;
  submitted = false;
  loading=true;

  Dialcode:any=[];

  gstlist:any=[];

  ISIdProofRequired:boolean=false;

  ArrivalDate:any;

  showpolicy=false;
  showpolicytext='View Policies';

  loadingreview=false;
  
  @ViewChild('gsteInput') gsteInput!: ElementRef<HTMLInputElement>;

  showReviewpage=false;
  
  constructor(private fb: FormBuilder,private location: Location,private commonservice: CommonService,private busService:BusService,private authenticationservice: AuthenticationService,private router: Router,private route: ActivatedRoute,private alertservice:AlertService) { 


    this.route.queryParams.subscribe(params => {
      if(params) {
          this.param=params;
      } else {
          this.router.navigate(['/bus']);
       }
    });

    if (sessionStorage.getItem('BusSearch')) {
      let bussearch:any=sessionStorage.getItem('BusSearch');
      this.GetSearchData = JSON.parse(bussearch);
    }

    if (sessionStorage.getItem('BUSRD')) {
      let busreview:any=sessionStorage.getItem('BUSRD'); 
      this.SelectedBusSeat=JSON.parse(busreview);
      this.CurrentFare=this.SelectedBusSeat['Extrafarebrakup'];

  
      let selectedbus=this.SelectedBusSeat['SelectedBusData'];

      if(selectedbus['ArrivalDate'])
      {
        let dateobj = new Date();
        var currentyear = dateobj.getFullYear();
        let finaldate  =selectedbus['ArrivalDate']+' '+currentyear;
        this.ArrivalDate=this.busService.DefaultDateFormat(finaldate);
      } else {
        this.ArrivalDate=this.GetSearchData['DepartDate'];
      }
      this.SelectedBus = selectedbus;
      this.ISIdProofRequired=this.SelectedBus['IdProofRequired'];
    
    } else {
      this.router.navigate(['/bus']);
    } 

    this.GSTForm =fb.group({
      GSTNumber:['',[Validators.required]],
      CompanyName:['',[Validators.required]],
      Email:['',[Validators.required,Validators.email]],
      Address:['',[Validators.required]],
      ISDCode:['91',[Validators.required]],
      PhoneNumber:['',[Validators.required,Validators.minLength(10), Validators.maxLength(15), Validators.pattern('[0-9]+')]],
      SaveGST:[''],
     });

  }

  ngOnInit(): void {

    this.GeneratePax();
    this.authenticationservice.currentUser.subscribe(data => {
      if(data)
      {
        console.log(data);
        
        this.userinfo=data;
        this.BusForm.patchValue({'EmailId':data['EmailId'],'MobileNumber':data['MobileNo']});
      }
    });

    this.commonservice.GetWebSiteData().subscribe(data => {
      this.GetWebSiteData =data;
    });

    this.GetDialCode();
  }

  GeneratePax()
  {
    let noseat=this.SelectedBusSeat['SeatNumber'].length;
    let arrpax=[];
    for(let a=0; a<noseat;a++)
    {
      arrpax.push(this.BuildFormPaxDynamic(a));
    }
    this.BusForm =  this.fb.group({
      EmailId:['',[Validators.required,Validators.email]],
      ISDCode:['91',[Validators.required]],
      MobileNumber: ['', [Validators.required, Validators.minLength(10), Validators.maxLength(15), Validators.pattern('[0-9]+')]],
      PaxDetails:this.fb.array(arrpax),
    });
  }

  BuildFormPaxDynamic(key:any) {

    let IdProofRequired;
    if(this.ISIdProofRequired)
    {
      IdProofRequired=[Validators.required];
    }
    let SeatName=this.SelectedBusSeat['SeatNumber'][key];

    return this.fb.group({
        Title:['',[Validators.required]],
        FirstName:['',[Validators.required,Validators.pattern('[a-zA-Z /\s/g]+'),Validators.minLength(2)]],
        LastName :['',[Validators.required,Validators.pattern('[a-zA-Z /\s/g]+'),Validators.minLength(2)]],
        Age :['',[Validators.required,Validators.pattern('[0-9]+'),Validators.maxLength(2)]],
        Gender:[1],
        IdType:['',IdProofRequired],
        IdNumber:['',IdProofRequired],
        SeatName:[SeatName]
    });
  }

  get fpax()
  { 
    return this.BusForm.controls['PaxDetails']  as FormArray;
  }


  GetDialCode()
  {
    this.commonservice.dialcode().subscribe(data => {
      let resp:any=data;
      if(resp['Error']['ErrorCode']==0)
      {
          this.Dialcode=resp['Result'];
      }

    });

  }
  
  get f() { return this.GSTForm.controls; }

  showmarkup()
  {
    this.isshowmarkup=!this.isshowmarkup;
  }

  updatemarkup()
  {
    this.CurrentFare['AgentMarkup']=Math.abs(this.markupvalue);
    let markup:any=Math.abs(this.markupvalue);
    sessionStorage.setItem('TAGM',markup);
    this.showmarkup();
  }

  toggle()
  {
    this.showpolicy=!this.showpolicy;
    if(this.showpolicy)
    {
      this.showpolicytext='Hide Policies';
    }
    if(this.showpolicy==false)
    {
      this.showpolicytext='View Policies';
    }
  }

  goBack()
  {
    this.location.back();
  }

  GSTAutocomplete(event:any) {

    let val=event.target.value;
    if(val.length >=3) {
    let req={ 'term':val}
      this.busService.MasterGST(req).subscribe(data=>{
        let resp:any=data;
        if(resp['Error']['ErrorCode']==0)
        {
            this.gstlist=resp['Result'];
        } else {
          this.gstlist=[];
        }
      });
    } else {
      this.gstlist=[];
    }
  }

  selectedgst(event:MatAutocompleteSelectedEvent)
  {
    let company_name=event.option.value;
    this.gstlist.forEach((element:any) => {
      if(element['company_name']==company_name)
      {
          this.GSTForm.patchValue({
                                    'GSTNumber':element['gst_number'],
                                    'CompanyName':element['company_name'],
                                    'Email':element['email'],
                                    'Address':element['address'],
                                    'PhoneNumber':element['phone_number'],
                                  });
      }
    });

  }

  cleargst()
  {
    this.gsteInput.nativeElement.value = '';
    this.gstlist=[];
    this.GSTForm.patchValue({
                              'GSTNumber':'',
                              'CompanyName':'',
                              'Email':'',
                              'Address':'',
                              'PhoneNumber':'',
                            });
  }

  SubmitPax()
  {
    if(this.isGSTShow) {
      this.submitted = true;
      this.Gstsubmitted = true;
      if(this.GSTForm.invalid || this.BusForm.invalid) {
        return;
      }
        this.SavepaxInfo();
    } else {
      this.submitted = true;
      if (this.BusForm.invalid) {
        return;
      }
      this.SavepaxInfo();
    }
  }
  SavepaxInfo()
  {
    let savedata:any={};
    savedata['gstdata']=this.GSTForm.value;
    savedata['SearchTokenId']=this.SelectedBusSeat['SearchTokenId'];
    savedata['ISDCode']=this.BusForm.get('ISDCode')?.value;
    savedata['MobileNumber']=this.BusForm.get('MobileNumber')?.value;
    savedata['EmailId']=this.BusForm.get('EmailId')?.value;
    savedata['ISIdProofRequired']=this.ISIdProofRequired;
    savedata['ResultIndex']=this.SelectedBus['ResultIndex'];
    savedata['paxdata']=this.BusForm.get('PaxDetails')?.value;
    savedata['SeatNumber']=this.SelectedBusSeat['SeatNumber'];
    savedata['BoardingPointsDetails']=this.SelectedBusSeat['BoardingPointsDetails'];
    savedata['DroppingPointsDetails']=this.SelectedBusSeat['DroppingPointsDetails'];
    savedata['Service']='Bus';
    this.SeatBlock(savedata);
  }

  SeatBlock(data:any)
  {
    this.loadingreview=true;
    let request={
                  'SearchTokenId':data['SearchTokenId'],
                  'ResultIndex':data['ResultIndex'],
                  'BoardingPointId':data['BoardingPointsDetails']['CityPointIndex'],
                  'DroppingPointId':data['DroppingPointsDetails']['CityPointIndex'],
                };

    let paxobj:any=[];
    if(data['paxdata'].length!=0)
    {
       data['paxdata'].forEach((element:any,key:any) => {
            let LeadPassenger;
            if(key==0)
            {
              LeadPassenger=true;
            } else {
              LeadPassenger=false;
            }
            let Address=this.GetWebSiteData['Street'].substring(0,30);
            let obj={
                        'LeadPassenger':LeadPassenger,
                        'Title':element['Title'],
                        'FirstName':element['FirstName'],
                        'LastName':element['LastName'],
                        'Email':data['EmailId'],
                        'Phoneno':data['MobileNumber'],
                        'Gender':element['Gender'],
                        'IdType':element['IdType'],
                        'IdNumber':element['IdNumber'],
                        'Address':Address,
                        'Age':element['Age'],
                        'SeatName':element['SeatName'],
                    };
            paxobj.push(obj);
        });
    }
    Object.assign(request, {'Passenger': paxobj});
  
    this.busService.BlockSeat(request).subscribe(rs=>{
      let resp:any=rs;
      this.loadingreview=false;
     
      
      if(resp['Error']['ErrorCode']==0)
      {
        sessionStorage.setItem('TSFPAX',JSON.stringify(data));
        const navigationExtras: NavigationExtras = {
          queryParams:this.param
        };
       this.showReviewpage = true;
        setTimeout(() => {
            this.openModal()
        }, 100);
      } else {
          this.alertservice.error(resp['Error']['ErrorMessage']);
      }
    });

  }
  
    openModal() {
    const modalElement = document.getElementById('ReviewModal')!;
    const modal = new bootstrap.Modal(modalElement);
    modal.show();
  }
}
