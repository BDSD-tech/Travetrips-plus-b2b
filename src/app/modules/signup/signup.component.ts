import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CommonService } from '../../services/common.service';
import Validation from '../../utils/validation';
import { LoginService } from '../login/login.service';

declare var $: any;

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.css']
})
export class SignupComponent implements OnInit {

  SinupForm: FormGroup;
  Sinupsubmitted = false;
  Sinuploading = false;
  SinupMessage='';
  ErrorSinupMessage='';
  Sinupdone=false;

  countrylist:any=[];
  DialCode:any=[];
  statelist:any=[];
  citylist:any=[];

  isshowmobileotp=false;
  submitmobile=false;
  mobiletimer='';
  activeResend=false;
  OTPTime=30;
  
  isshowemailotp=false;
  submitemail=false;
  activeEmailResend=false;
  EmailOTPTime=30;
  emailtimertxt='';

  isPassVisible:boolean=false;
  isConPassVisible:boolean=false;

  verifysubmitmobile=false;
  verifysubmitemail=false;

  storeemailid:any='';
  storemobileno:any='';

  emaildownloadTimer:any;
  mobiledownloadTimer:any;

  emailverifydone=false;
  mobileverifydone=false;

  mobileOTPEnable=true;
 
  MobileError:any=''
  EmailError:any=''
  constructor(private loginservice:LoginService,private commonservice:CommonService,private fb: FormBuilder) {
    this.getCountry();
    this.GetCountry();
    this.SinupForm = this.fb.group({
      AgencyName: ['',[Validators.required]],
      PhoneNumber: ['',[Validators.pattern('[0-9]+'),Validators.minLength(10),Validators.maxLength(10)]],
      DialCode:['91',[Validators.required]],
      MobileNumber: ['', [Validators.required,Validators.pattern('[0-9]+'),Validators.minLength(10),Validators.maxLength(10)]],
      MobileNumberVerify:['false'],
      MobileOTP:['',[Validators.required,Validators.minLength(6),Validators.maxLength(6),Validators.pattern('[0-9]+')]],
      Password:['',[Validators.required,Validators.minLength(8),Validators.maxLength(16),Validators.pattern(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/)]],
      ConfirmPassword:['',[Validators.required]],
      EmailID: ['', [Validators.required,Validators.email]],
      EmailVerify: ['false'],
      EmailOTP: ['',[Validators.required,Validators.minLength(6),Validators.maxLength(6),Validators.pattern('[0-9]+')]],
      PANName: ['', [Validators.required]],
      PANNumber: ['', [Validators.required,Validators.pattern(/([A-Z]){5}([0-9]){4}([A-Z]){1}$/)]],
      PersonName:[''],
      PersonEmail:['', [Validators.email]],
      PersonMobileNumber:['', [Validators.pattern('[0-9]+'),Validators.minLength(10),Validators.maxLength(10)]],
      GSTName:[''],
      GSTEmail:['', [Validators.email]],
      GSTNumber:[''],
      GSTMobileNumber:['',[Validators.pattern('[0-9]+'),Validators.minLength(10),Validators.maxLength(10)]],
      GSTAddress:[''],
      Street:['', [Validators.required]],
      Pincode:['', [Validators.required]],
      Country:['', [Validators.required]],
      State:['', [Validators.required]],
      City:['', [Validators.required]],
      Agree:[, [Validators.requiredTrue]],
    },{
      validators: [Validation.match('Password', 'ConfirmPassword')]
    });
    if(this.mobileOTPEnable==false){
      this.SinupForm.patchValue({MobileNumberVerify:'true'})
      this.SinupForm.patchValue({MobileNumberVerify:'true'})
      //this.SinupForm.get('MobileOTP')?.setValidators(null)
    }else{
      
    }
   }

  ngOnInit(): void {
  
   
  }

  DialChange(e:any){
    const mobileControl = this.SinupForm.get('MobileNumber');
    if(e.target.value=='91'){
       mobileControl?.setValidators([
        Validators.required,
        Validators.pattern('^[0-9]+$'),
        Validators.minLength(10),
        Validators.maxLength(10)
      ]);
    }else{
        mobileControl?.setValidators([
        Validators.required
    ]);
    }
    mobileControl?.updateValueAndValidity();
  }
  get f() { return this.SinupForm.controls; }

  SignupSubmit()
  {
    this.SinupMessage='';
    this.ErrorSinupMessage='';
    this.Sinupsubmitted = true;
    if (this.SinupForm.invalid) {
      return;
    }
    this.Sinuploading=true;
    this.SinupForm.get('MobileNumber')?.enable();
    this.SinupForm.get('EmailID')?.enable();
    this.loginservice.AgentSignup(this.SinupForm.value).subscribe(data => {
      let response:any=data;
      this.Sinuploading=false;
        if(response['Error']['ErrorCode']==0)
        {
          this.Sinupdone=true;
          window.scroll(0, 0);
          this.SinupMessage=response['Error']['ErrorMessage'];
        } else {
          this.ErrorSinupMessage='<div class="alert alert-danger">'+response['Error']['ErrorMessage']+'</div>';
        }
    });
    
  }
  
  getCountry(){
    this.commonservice.dialcode().subscribe((resp:any)=>{
      if(resp['Error']['ErrorCode']==0){
        this.DialCode=resp['Result']
       
      }
    })
  } 
  GetCountry(){
    this.commonservice.GetCountry().subscribe((resp:any)=>{
      if(resp['Error']['ErrorCode']==0){
        this.countrylist=resp['Result'];
      
      }
    })
  } 

  getstate(event:any)
  {
    
    let value:any
    this.countrylist.filter((count:any)=>{
      if(count['name']==event.target.value){
        value=count['id']
      }
    })
    if(value) {
      this.commonservice.statelist(value).subscribe(response => { 
        let data:any=response;
        if(data['Error']['ErrorCode']==0)
        {
          this.statelist=data['Result'];     
        }else{
           this.statelist=[]
        }
       
      });
    } 
  }
  

  getcity(event:any)
  {
    let id:any='';
    this.statelist.forEach(function(value:any ,key:any) {
        if(value['name']==event.target.value)
        {
          id=value['id'];
        }
    });
    if(id) { 
      this.commonservice.citylist(id).subscribe(response => { 
        let data:any=response;
        if(data['Error']['ErrorCode']==0)
        {
          this.citylist=data['Result'];     
        }else{
          this.citylist=[]
        }
      });       
    }    
  }

  sendotp(type:any,id:any)
  {
    if(type=='mobile')
    {
      this.submitmobile=true;
      if(this.SinupForm.get('MobileNumber')?.valid)
      {
        
        
        let request={
                      'dialcode':this.SinupForm.get('DialCode')?.value,
                      'emailphone':this.SinupForm.get('MobileNumber')?.value
                    };
        this.loginservice.MobileOTPSend(request).subscribe((data:any) => {
            if(data['Error']['ErrorCode']==0){
              this.timer(this.OTPTime);
              $("#"+id).text('OTP Send').addClass('text-success');
              this.isshowmobileotp=true;
              let response:any=data;
              this.MobileError=''
            }else{
              this.MobileError=data['Error']['ErrorMessage'];
              setTimeout(() => {
                  this.MobileError=''
              }, 3000);
            }
              
        });

      }
    }

    if(type=='email')
    {
      this.submitemail=true;
      if(this.SinupForm.get('EmailID')?.valid)
      {
        let request={'emailphone':this.SinupForm.get('EmailID')?.value};
        this.loginservice.EmailOTPSend(request).subscribe(data => {
         let response:any=data;
         if(response['Error']['ErrorCode']==0){
            this.isshowemailotp=true;
           
            $("#"+id).text('OTP Send').addClass('text-success');
            this.emailtimer(this.EmailOTPTime);
         }else{
           this.EmailError=response['Error']['ErrorMessage'];
           setTimeout(() => {
              this.EmailError=''
           }, 3000);
         }
        });

      }
    }
  }

  ResendOTP(type:any)
  {
    if(type=='mobile')
    {
      this.verifysubmitmobile=false;
      $("#mobile-otp-error").text('');
      this.SinupForm.patchValue({'MobileOTP':''});

      this.submitmobile=true;
      if(this.SinupForm.get('MobileNumber')?.valid)
      {
      
        this.timer(this.OTPTime);
        let request={
                       'emailphone':this.SinupForm.get('MobileNumber')?.value
                    };
        this.loginservice.MobileOTPSend(request).subscribe(data => {
              let response:any=data;
              if(response['Error']['ErrorCode']==0){
                  this.isshowmobileotp=true;
                  this.MobileError=''
              }else{
                this.MobileError=response['Error']['ErrorMessage'];
              }
        });

      }
    }
    if(type=='email')
    {
      this.verifysubmitemail=false;
    
      this.SinupForm.patchValue({'EmailOTP':''});

      this.submitemail=true;
      if(this.SinupForm.get('EmailID')?.valid)
      {
        
        let request={
          'emailphone':this.SinupForm.get('EmailID')?.value
         };
        this.loginservice.EmailOTPSend(request).subscribe(data => {
          let response:any=data;
          if(response['Error']['ErrorCode']==0){
              $("#email-otp-error").text('');
              this.storeemailid=this.SinupForm.get('EmailID')?.value;
              this.isshowemailotp=true;
              this.emailtimer(this.EmailOTPTime);
          }else{
            this.EmailError=response['Error']['ErrorMessage'];
            setTimeout(() => {
                 this.EmailError=''
            }, 3000);
          }
           
        });
      }

    }
  }

  VerifyOTP(type:any,id:any)
  {
    if(type=='mobile')
    {
        this.verifysubmitmobile=true;
        $("#mobile-otp-error").text('');
  
        if(this.SinupForm.get('MobileOTP')?.valid)
       {
          let request={
            'otp':this.SinupForm.get('MobileOTP')?.value
          };
          this.loginservice.VerifyMobileOTP(request).subscribe(data => {
            let response:any=data;
            if(response['Error']['ErrorCode']===0)
            {
              this.mobileverifydone=true;
              this.isshowmobileotp=false;
              this.SinupForm.get('MobileNumber')?.disable({ onlySelf: true });
              this.SinupForm.patchValue({'MobileNumberVerify':'true'});

              $("#"+id).text('Mobile Verified').addClass('text-success');
            } else {
              $("#mobile-otp-error").text(response['Error']['ErrorMessage']).removeClass('text-success').addClass('text-danger');
            }

          });

       }

    }
    if(type=='email')
    {
      this.verifysubmitemail=true;
      $("#email-otp-error").text('');

      if(this.SinupForm.get('EmailOTP')?.valid)
      {
        let request={
          'otp':this.SinupForm.get('EmailOTP')?.value
        };
        this.loginservice.VerifyEmailOTP(request).subscribe(data => {
          let response:any=data;
          if(response['Error']['ErrorCode']==0)
          {
            this.emailverifydone=true;
            this.isshowemailotp=false;
            this.SinupForm.get('EmailID')?.disable({ onlySelf: true });
            this.SinupForm.patchValue({'EmailVerify':'true'});
          

            $("#"+id).text('Email Verified').addClass('text-success');
          } else {
            $("#email-otp-error").text(response['Error']['ErrorMessage']).removeClass('text-success').addClass('text-danger');
          }
        });
      }
    }
  }


  checkvalue(event:any,type:any)
  {
    if(type=='mobile')
    {
      if(this.isshowmobileotp)
      {
        if(event.target.value==this.storeemailid)
        {
  
        } else {
          this.isshowmobileotp=false;
          clearInterval(this.mobiledownloadTimer);

          $("#phone_successMsg").text('An OTP will be sent on your above entered number for verification').removeClass('text-success text-danger');
        }
      }
    }

    if(type=='email')
    {

      if(this.isshowemailotp)
      {
        if(event.target.value==this.storeemailid)
        {
  
        } else {
          this.isshowemailotp=false;
          clearInterval(this.emaildownloadTimer);
          $("#email_successMsg").text('An OTP will be sent on your above entered email for verification').removeClass('text-success text-danger');
        }
      }
    }
     
  }

  edit(type:any,id:any)
  {

    if(type=='mobile')
    {
      this.SinupForm.get('MobileNumber')?.enable();
      this.SinupForm.patchValue({'MobileNumber':'','MobileNumberVerify':'false','MobileOTP':''});
      this.mobileverifydone=false;
      this.verifysubmitmobile=false;
      this.storemobileno='';
      this.isshowmobileotp=false;
      this.submitmobile=false;

      clearInterval(this.mobiledownloadTimer);
      $("#"+id).text('An OTP will be sent on your above entered number for verification').removeClass('text-success text-danger');

    }

    if(type=='email')
    {
      this.SinupForm.get('EmailID')?.enable();
      this.SinupForm.patchValue({'EmailID':'','EmailVerify':'false','EmailOTP':''});
      this.emailverifydone=false;
      this.verifysubmitemail=false;
      this.storeemailid='';
      this.isshowemailotp=false;
      this.submitemail=false;
      
      clearInterval(this.emaildownloadTimer);
      $("#"+id).text('An OTP will be sent on your above entered email for verification').removeClass('text-success text-danger');
    }

  }

  numberOnly(event:any) {
    const charCode = (event.which) ? event.which : event.keyCode;
    if (charCode > 31 && (charCode < 48 || charCode > 57)) {
      return false;
    }
    return true;
  }

  timer(timeleft:any) {
   
    var _this = this;
    _this.activeResend=false;
    this.mobiledownloadTimer = setInterval(function(){
      if(timeleft <= 0){
        clearInterval(_this.mobiledownloadTimer);
        _this.mobiletimer = "";
        _this.activeResend=true;
      } else {
        timeleft=(timeleft < 10 ? '0' : '') + timeleft
        if(timeleft)
        {
          _this.mobiletimer= "00 :"+timeleft + "";
        }
      }
      timeleft -= 1;
    }, 1000);
    }

    emailtimer(timeleft:any) {
      var _this = this;
      _this.activeEmailResend=false;
       this.emaildownloadTimer = setInterval(function(){
        if(timeleft <= 0){
          clearInterval(_this.emaildownloadTimer);
          _this.emailtimertxt = "";
          _this.activeEmailResend=true;
        } else {
          timeleft=(timeleft < 10 ? '0' : '') + timeleft
          if(timeleft)
          {
            _this.emailtimertxt= "00 :"+timeleft + "";
          }
        }
        timeleft -= 1;
      }, 1000);
    }

      showPassword(type:any)
    {
        if(type=='pwa')
        {
          this.isPassVisible = !this.isPassVisible;
        }
        if(type=='cpwa')
        {
          this.isConPassVisible = !this.isConPassVisible;
        }
       
    }
}
