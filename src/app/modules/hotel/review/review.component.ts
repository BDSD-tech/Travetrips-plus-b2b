import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, NavigationExtras, Router } from '@angular/router';
import { Location } from '@angular/common';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CommonService } from '../../../services/common.service';
import { MatAutocompleteSelectedEvent } from '@angular/material/autocomplete';
import { HotelService } from '../hotel.service';
import { AlertService } from '../../../services/alert.service';
import { AuthenticationService } from '../../../services/authentication.service';

declare var bootstrap:any;
declare var $: any;

@Component({
  selector: 'app-review',
  templateUrl: './review.component.html',
  styleUrls: ['./review.component.css']
})
export class ReviewComponent implements OnInit {
showFullText=false
  userinfo:any=[];
  BlockRoomResult:any =[];
  GetSearchData:any =[];
  RoomCancellationPolicyData:any =[];
  RoomCancellationPolicyModal:any;
  IsPANMandatory=false;
  IsPassportMandatory=false;
  HotelPaxForm!:FormGroup;
  submitted=false;

  Dialcode:any=[];

  isGSTShow = false;
  Gstsubmitted=false;
  GSTForm: FormGroup;
  GSTTxt='Optional';

  gstlist:any=[];

  params:any=[];

  CurrentFare:any=[];
  isshowmarkup:any=false;
  markupvalue=0;

  nopaxcount=0;
  ShowReviewModal=false;
  @ViewChild('gsteInput') gsteInput!: ElementRef<HTMLInputElement>;
  constructor(private router:Router,private route:ActivatedRoute,private location:Location,private fb:FormBuilder, private commonservice:CommonService, private hotelService:HotelService,private authenticationservice: AuthenticationService,private alertservice:AlertService) {

    if(sessionStorage.getItem('HotelBlockRoomData')!=null)
    {
      let blockRoomData:any=sessionStorage.getItem('HotelBlockRoomData');
      blockRoomData=JSON.parse(blockRoomData)

      this.BlockRoomResult=blockRoomData['Result'];
      this.IsPANMandatory=this.BlockRoomResult['HotelRoomsDetails'][0]['IsPANMandatory'];
      this.IsPassportMandatory=this.BlockRoomResult['HotelRoomsDetails'][0]['IsPassportMandatory'];

    } else{
       this.router.navigate(['/hotel']);
    }
    if (sessionStorage.getItem('HotelSearch')) {
      let hotelsearch:any=sessionStorage.getItem('HotelSearch');
      this.GetSearchData = JSON.parse(hotelsearch);
    }

    this.route.queryParams.subscribe(params  => {
      if(this.isEmpty(params)){
          this.router.navigate(['/hotel']);
          }  
          else{
            this.params = params;
          }
      })


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

    this.HotelPaxForm=this.fb.group({
        EmailId:['',[Validators.required,Validators.email]],
        ISDCode:['91',[Validators.required]],
        MobileNumber: ['', [Validators.required, Validators.minLength(10), Validators.maxLength(15), Validators.pattern('[0-9]+')]],
        RoomDetails:this.fb.array(this.createform()) 
      });
      this.GetDialCode();

      this.authenticationservice.currentUser.subscribe(data => {
        if(data)
        {
          this.userinfo=data;
          this.HotelPaxForm.patchValue({'EmailId':data['EmailId'],'MobileNumber':data['MobileNo']});
        }
      });
      if(sessionStorage.getItem('TSFPAX')){
        let resp:any=sessionStorage.getItem('TSFPAX')
        let paxdetail:any=JSON.parse(resp)
        this.HotelPaxForm.get('RoomDetails')?.patchValue(paxdetail['paxdata'])
      }
      setTimeout(() => {
        this.PassportIssueDate();
        this.PassportExpiryDate();
      }, 50);

      this.Fare_information(this.BlockRoomResult);
  }
  GetPhonecodeVal(event: Event): void {
    const value = (event.target as HTMLSelectElement).value;
    const phoneControl = this.HotelPaxForm.get('MobileNumber');

    if (!phoneControl) return;

    if (value === '91') {
      phoneControl.setValidators([
        Validators.required,
        Validators.minLength(10),
        Validators.maxLength(15),
        Validators.pattern(/^[0-9]+$/)
      ]);
    } else {
      phoneControl.setValidators([
        Validators.required
      ]);
    }

    phoneControl.updateValueAndValidity();
  }

  createform()
  {
    let arr=[];
    let room= this.GetSearchData['Room'];
    let roomarray  =  this.GetSearchData['RoomGuests'];
    for(let i=0;i< roomarray.length;i++)
    {
      if(i<room) {
      arr.push(this.BuildRoomFormDynamic(roomarray[i]))
      }
    }
   return arr;
  }

  BuildRoomFormDynamic(room:any) : FormGroup {
    let arradt=[];
    let arrchd=[];
    for(let i=0; i<room['Adult'];i++)
    {
      arradt.push(this.BuildFormPaxDynamic());
      this.nopaxcount++;
    }
    for(let c=0; c<room['Child'];c++)
    {
      arrchd.push(this.BuildFormPaxDynamic());
      this.nopaxcount++;
    }
    return this.fb.group({
      Adult:this.fb.array(arradt),
      Child:this.fb.array(arrchd),
      ChildAge:this.fb.array(room['ChildAge'])
    })

   }

   BuildFormPaxDynamic() {
          let passportval;
          let passportissueval;
          let passportexpiryval;
          let pan;
          if(this.IsPassportMandatory)
          {
            passportval=[Validators.required];
            passportissueval=[Validators.required];
            passportexpiryval=[Validators.required];
          }
          if(this.IsPANMandatory)
          {
            pan=[Validators.required,Validators.pattern('[A-Z]{5}[0-9]{4}[A-Z]{1}')];
          }

          return this.fb.group({
              Title:['Mr'],
              FirstName:['',[Validators.required,Validators.pattern('[a-zA-Z /\s/g]+'),Validators.minLength(2)]],
              LastName :['',[Validators.required,Validators.pattern('[a-zA-Z /\s/g]+'),Validators.minLength(2)]],
              Nationality:['',passportval],
              PassportNo:['',passportval],
              PassportIssue:['',passportissueval],
              PassportExpiry:['',passportexpiryval],
              PAN:['',pan]
          });
  }

  goBack() {
    this.location.back();
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

  roomCancellationPolicy(RoomData:any)
  {
    this.RoomCancellationPolicyData =  RoomData;
    this.RoomCancellationPolicyModal = new bootstrap.Modal(document.getElementById('CancellationPolicyModal'))
    this.RoomCancellationPolicyModal.show();
  }

  formatCustomDate(dateString: string): Date {
  // Convert "27-07-2025T00:00:00" to "2025-07-27T00:00:00"
  const [day, month, yearWithTime] = dateString.split('-');
  const [year, time] = yearWithTime.split('T');
  const isoDate = `${year}-${month}-${day}T${time}`;
  return new Date(isoDate);
}


  get fpax()
  { 
    return this.HotelPaxForm.controls['RoomDetails']  as FormArray;
  }

  getpaxadt(roomindex:number): FormArray {
    return this.HotelPaxForm.get('RoomDetails.'+roomindex+'.Adult') as FormArray;
  }
  getpaxchd(roomindex:number): FormArray {
    return this.HotelPaxForm.get('RoomDetails.'+roomindex+'.Child') as FormArray;
  }
 
  SubmitPax(){

    if(this.isGSTShow) {
      this.submitted = true;
      this.Gstsubmitted = true;
      if(this.GSTForm.invalid || this.HotelPaxForm.invalid) {
        return;
      }
        this.SavepaxInfo();
    } else {
      this.submitted = true;
      if (this.HotelPaxForm.invalid) {
        return;
      }
      this.SavepaxInfo();
    }
  }

  SavepaxInfo()
  {

    let savedata:any={};
    savedata['gstdata']=this.GSTForm.value;
    savedata['SearchTokenId']=this.params['stoken'];
    savedata['ISDCode']=this.HotelPaxForm.get('ISDCode')?.value;
    savedata['MobileNumber']=this.HotelPaxForm.get('MobileNumber')?.value;
    savedata['EmailId']=this.HotelPaxForm.get('EmailId')?.value;
    savedata['IsPANMandatory']=this.IsPANMandatory;
    savedata['IsPassportMandatory']=this.IsPassportMandatory;
    savedata['ResultIndex']=this.params['rindex'];
    savedata['HotelCode']=this.params['hcode'];
    savedata['IsGST']=false;
    savedata['paxdata']=this.HotelPaxForm.get('RoomDetails')?.value;
    savedata['Service']='Hotel';

    sessionStorage.setItem('TSFPAX',JSON.stringify(savedata));
    const navigationExtras: NavigationExtras = {
     queryParams:this.params
    };
    this.ShowReviewModal=true;
    setTimeout(() => {
        this.openModal();
    }, 100);
    
    // this.router.navigate(['hotel/review'],navigationExtras);
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

  GSTAutocomplete(event:any) {

    let val=event.target.value;
    if(val.length >=3) {
    let req={ 'term':val}
      this.hotelService.MasterGST(req).subscribe((data:any)=>{
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
  
  get f() { return this.GSTForm.controls; }

  isEmpty(obj:any) {
    return Object.keys(obj).length === 0;
  }

  SelectAllPaxPan(event:any)
  {
    let pan=this.HotelPaxForm.get('RoomDetails.0.Adult.0.PAN')?.value;
    if(pan)
    {
      if(event.target.checked)
      {
          
      } else{
        pan='';
      }

      let room= this.GetSearchData['Room'];
      let roomarray  =  this.GetSearchData['RoomGuests'];
      for(let r=0;r< roomarray.length;r++)
      {
        if(r<room) {
          for(let a=0;a< roomarray[r]['Adult'];a++)
          {
            this.HotelPaxForm.get('RoomDetails.'+r+'.Adult.'+a+'.PAN')?.setValue(pan);
          }
          for(let c=0;c< roomarray[r]['Child'];c++)
          {
            this.HotelPaxForm.get('RoomDetails.'+r+'.Child.'+c+'.PAN')?.setValue(pan);
          }
        }
      }

    } else {
      event.target.checked=false;
      this.alertservice.error('Please enter first passenger Pan');
    }
   
  }

  PassportIssueDate()
  {
     var _this = this;
    $("[passport-issue-date]").datepicker({
      defaultDate : "",
      dateFormat : "d M yy",
      maxDate: 0,
      changeMonth: true,
      changeYear: true,
      numberOfMonths: 1,
      yearRange: '1990:' + new Date().getFullYear().toString(),
      beforeShow : function(input:any, inst:any) {
        $(inst.dpDiv).addClass('tts-calandor');
        /*---Start Open in bottom--*/
        var $this = $(this);
        var cal = inst.dpDiv;
        var top = $this.offset().top + $this.outerHeight();
        var left = $this.offset().left;
        setTimeout(function() {
            cal.css({
                'top': top,
                'left': left,
                'height':'auto'
            });
        }, 10);
        /*---End Open in bottom--*/
      },
      onSelect: function(selectedDate:any,inst:any) {

        var newdate=_this.hotelService.AddDayDefaultDate(selectedDate,3652);
        let roomkey:any=$(inst.input[0]).attr('roomkey');
        let key:any=$(inst.input[0]).attr('key');
        let paxkey:any=$(inst.input[0]).attr('paxtype');
        _this.HotelPaxForm.get('RoomDetails.'+roomkey+'.'+paxkey+'.'+key+'')?.patchValue({'PassportIssue':selectedDate,'PassportExpiry':newdate});

        _this.CheckExpiryDate(newdate);

      },
      onClose : function(selectedDate:any,inst:any) {

      }

      });
  }

  PassportExpiryDate()
  {
    var _this = this;
    $("[passport-expiry-date]").datepicker({
        dateFormat : "d M yy",
        minDate: 0,
        changeMonth: true,
        changeYear: true,
        numberOfMonths: 1,
        beforeShow : function(input:any, inst:any) {
          $(inst.dpDiv).addClass('tts-calandor');
          var newdate = new Date(_this.GetSearchData['DepartDate']);
          $(this).datepicker("option", "minDate",newdate);

          /*---Start Open in bottom--*/
          var $this = $(this);
          var cal = inst.dpDiv;
          var top = $this.offset().top + $this.outerHeight();
          var left = $this.offset().left;
          setTimeout(function() {
              cal.css({
                  'top': top,
                  'left': left,
                  'height':'auto'
                  
              });
          }, 10);
          /*---End Open in bottom--*/
        },
        onClose : function(selectedDate:any, inst:any ) {
          let roomkey:any=$(inst.input[0]).attr('roomkey');
          let key:any=$(inst.input[0]).attr('key');
          let paxkey:any=$(inst.input[0]).attr('paxtype');

          _this.HotelPaxForm.get('RoomDetails.'+roomkey+'.'+paxkey+'.'+key+'')?.patchValue({'PassportExpiry':selectedDate});

          _this.CheckExpiryDate(selectedDate);
        }
      });
  }


  CheckExpiryDate(expirydate:any)
  {
    
    let departdate=this.GetSearchData['CheckOut'];
    let newdepartdate:any=this.hotelService.AddDayDefaultDate(departdate,183); // 6 Month
    if(new Date(newdepartdate).getTime() < new Date(expirydate).getTime())
    {
    } else {
      alert('Expiry Date cannot be less than 6 months from last checkout date');
    }
  }

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


  Fare_information(Result : any)
  {
      let RoomPrice=0;
      let Tax=0;
      let AgentCommission=0;
      let OtherCharges=0;
      let Discount=0;
      let ServiceCharges=0;
      let OfferedPrice=0;
      let PublishedPrice=0;
      let TDS=0;
     
      Result['HotelRoomsDetails'].forEach(function(value:any , key:any) {
           RoomPrice+=value['Price']['RoomPrice'];
           Tax+=value['Price']['Tax'];
           AgentCommission+=value['Price']['AgentCommission'];
           OtherCharges+=value['Price']['OtherCharges'];
           Discount+=value['Price']['Discount'];
           ServiceCharges+=value['Price']['ServiceCharges'];
           OfferedPrice+=value['Price']['OfferedPrice'];
           PublishedPrice+=value['Price']['PublishedPrice'];
           TDS+=value['Price']['TDS'];
      });

      this.CurrentFare['RoomPrice']=RoomPrice;
      this.CurrentFare['Tax']=Tax;
      this.CurrentFare['AgentCommission']=AgentCommission;
      this.CurrentFare['Discount']=Discount;
      this.CurrentFare['OtherCharges']=OtherCharges;
      this.CurrentFare['ServiceCharges']=ServiceCharges;
      this.CurrentFare['OfferedPrice']=OfferedPrice;
      this.CurrentFare['PublishedPrice']=PublishedPrice;
      this.CurrentFare['AgentMarkup']=0;
      this.CurrentFare['TDS']=TDS;
  }


  openModal() {
    const modalElement = document.getElementById('ReviewModal')!;
    const modal = new bootstrap.Modal(modalElement);
    modal.show();
  }

}
