import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { first } from 'rxjs';
import { AlertService } from '../../services/alert.service';
import { AuthenticationService } from '../../services/authentication.service';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { CommonService } from '../../services/common.service';

@Component({
  selector: 'app-emulate-user',
  standalone: true,
  imports: [ReactiveFormsModule],
  templateUrl: './emulate-user.component.html',
  styleUrl: '../login/login.component.css'  
})
export class EmulateUserComponent implements OnInit {
  OTPForm:FormGroup;
  GetWebSiteData:any=[]
  Params:any=[]
  Loginloading=false
  VerifyOTPSubmitted=false
  constructor(private commonService:CommonService,private fb:FormBuilder,private authenticationservice:AuthenticationService,private router: Router,private route: ActivatedRoute,private alertservice:AlertService) {
    this.OTPForm = this.fb.group({
      OTP: ['', [Validators.required, Validators.minLength(6), Validators.maxLength(6)]]
    });
    this.route.queryParams.subscribe(params => {
      if(params) {
        this.Params=params;
          //this.UserCheck(params)
      } else {
          this.router.navigate(['/flight']);
       }
    });

   }

  ngOnInit(): void {
    this.commonService.GetWebSiteData().subscribe((data:any)=>{
        if(data && data.length!==0)
        {
          this.GetWebSiteData = data;
        } 
    })
  }

  get fv(){return this.OTPForm.controls;}
  UserCheck()
  {
    this.VerifyOTPSubmitted=true;

    if(this.OTPForm.invalid){
      return;
    }

    let request={'EmulateUserKey':this.Params['stoken'],"OTP":this.fv['OTP'].value}
    this.Loginloading =true;
    this.authenticationservice.emulateuser(request).subscribe(resp => {
      let data:any=resp;
      this.Loginloading =false;
       this.VerifyOTPSubmitted=false;
      if(data['Error']['ErrorCode']==0)
      {
        this.router.navigate(['/flight'],{state: {login: true}});
      } else {
        this.alertservice.error(data['Error']['ErrorMessage']);
      }
    });
  }

  
  numberOnly(event: any) {
    const charCode = (event.which) ? event.which : event.keyCode;
    if (charCode > 31 && (charCode < 48 || charCode > 57)) {
      return false;
    }
    return true;
  }
}
