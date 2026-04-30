import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import Validation from '../../../utils/validation';
import { LoginService } from '../login.service';

@Component({
  selector: 'app-forgot-password',
  templateUrl: './forgot-password.component.html',
  styleUrls: ['./forgot-password.component.css']
})
export class ForgotPasswordComponent implements OnInit {

  ForgotForm: FormGroup;
  Forgotsubmitted = false;
  Forgotloading = false;
  ForgotMessage='';
  ForgotNextStep:boolean=false;
  ISNextStep:boolean=false;

  NewPasswordForm: FormGroup;
  NewPasswordsubmitted = false;
  NewPasswordloading = false;
  NewPasswordMessage='';
  NewPasswordMessageError='';
  

  constructor(private loginservice:LoginService,private fb: FormBuilder) { 

    this.ForgotForm = this.fb.group({
      emailphone: ['', [Validators.required,Validators.pattern(/^([a-zA-Z0-9_\.\-])+\@(([a-zA-Z0-9\-])+\.)+([a-zA-Z0-9]{2,4})|([0-9]{10})+$/)]]
    });

    this.NewPasswordForm = this.fb.group({
      otp: ['', [Validators.required,Validators.maxLength(6)]],
      password: ['', [Validators.required,Validators.minLength(8),Validators.maxLength(16),Validators.pattern(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/)]],
      confirmPassword:['',[Validators.required]]
    },{
      validators: [Validation.match('password', 'confirmPassword')]
    });

  }


  ngOnInit(): void {
  }

  get fps() { return this.ForgotForm.controls; }

  ForgotSubmit()
  {
    this.Forgotsubmitted = true;
    if (this.ForgotForm.invalid) {
      return;
    }
    this.Forgotloading=true;
    this.loginservice.ForgotPassword(this.ForgotForm.value).subscribe(data => {
      this.Forgotloading=false;
       let respone:any=data;
      if(respone['Error']['ErrorCode']===0)
      {
        this.ForgotNextStep=true;
        this.ISNextStep=true;
        this.ForgotMessage='<div class="success-msg">'+respone['Error']['ErrorMessage']+'</div>';
      } else {
        this.ForgotMessage='<div class="error-msg">'+respone['Error']['ErrorMessage']+'</div>';
      }
    });
  }

  get fnps() { return this.NewPasswordForm.controls; }

  NewPasswordSubmit()
  {
    this.NewPasswordMessage='';
    this.NewPasswordMessageError='';
    this.NewPasswordsubmitted = true;
    if (this.NewPasswordForm.invalid) {
      return;
    }
    this.NewPasswordloading=true;
    this.loginservice.GenerateNewPassword(this.NewPasswordForm.value).subscribe(data => {
      this.NewPasswordloading=false;
      let respone:any=data;
      if(respone['Error']['ErrorCode']===0)
      {
        this.NewPasswordForm.reset();
        this.NewPasswordsubmitted = false;
        this.NewPasswordMessage=respone['Error']['ErrorMessage'];
        this.ISNextStep=false;
      } else {
        this.NewPasswordMessageError=respone['Error']['ErrorMessage'];
      }
    });

  }

}
