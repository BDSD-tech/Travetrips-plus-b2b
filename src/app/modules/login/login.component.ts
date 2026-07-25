import { Component, ElementRef, OnInit, QueryList, ViewChildren } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Title } from '@angular/platform-browser';
import { Router } from '@angular/router';
import { first } from 'rxjs';
import { AuthenticationService } from '../../services/authentication.service';
import { CommonService } from '../../services/common.service';
import { register } from 'swiper/element';
import { IdleTimeoutService } from '../../services/auto-logout';
import { AlertService } from '../../services/alert.service';
import {UAParser} from 'ua-parser-js';

register();
declare var $: any;
@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  GetWebSiteData: any = [];
  LoginForm: FormGroup;
  VarifyOTP: FormGroup;
  Loginsubmitted = false;
  Loginloading = false;
  LoginMessage = '';
  isVisible: boolean = false;

  ActiveStep: String = 'CheckUser'
  OTPLoginloading = false
  VerifyOTPSubmitted = false
  inputotp: string[] = ['', '', '', '', '', ''];
  digits: number[] = Array(6).fill(0);
  @ViewChildren('otpInput') otpInputs!: QueryList<ElementRef>;
  currentIndex: any = 0
  interval: any;

  constructor(private alertService:AlertService,private idleService:IdleTimeoutService,private commonservice: CommonService, private fb: FormBuilder, private authenticationservice: AuthenticationService, private router: Router, private serviceTitle: Title) {

    this.LoginForm = this.fb.group({
      emailphone: ['', [Validators.required, Validators.pattern(/^([a-zA-Z0-9_\.\-])+\@(([a-zA-Z0-9\-])+\.)+([a-zA-Z0-9]{2,4})|([0-9]{10})+$/)]],
      password: ['', [Validators.required, Validators.minLength(8), Validators.maxLength(16)]],
      istrust:[false]
    });

    this.VarifyOTP = this.fb.group({
      emailphone: ['', [Validators.required, Validators.pattern(/^([a-zA-Z0-9_\.\-])+\@(([a-zA-Z0-9\-])+\.)+([a-zA-Z0-9]{2,4})|([0-9]{10})+$/)]],
      password: ['', [Validators.required, Validators.minLength(8), Validators.maxLength(16)]],
      otp: ['', [Validators.required, Validators.minLength(6), Validators.maxLength(6)]],
    });
  }

  ngOnInit(): void {
   
    if (this.authenticationservice.currentUserValue) {
      this.router.navigate(['/flight']);
    } 

    this.commonservice.GetWebSiteData().subscribe(data => {
      this.GetWebSiteData = data;
      if (this.GetWebSiteData['CompanyName']) {
        this.serviceTitle.setTitle(this.GetWebSiteData['CompanyName']);
      }
    });
    

  const swiperEl:any = document.getElementById('Slider-second')
  Object.assign(swiperEl, {
    slidesPerView: 1,
    spaceBetween: 50,
    navigation: {
      nextEl: '.swiper-button-next',
      prevEl: '.swiper-button-prev',
    },
    autoplay: {
      delay: 3000,
      disableOnInteraction: false, 
    },
    breakpoints: {
      640: {
        slidesPerView: 2,
        spaceBetween: 20,
      },
      768: {
        slidesPerView: 2,
        spaceBetween: 40,
      },
      1024: {
        slidesPerView: 3,
        spaceBetween: 50,
      },
    },
  });
  swiperEl.initialize();
  }

  ngOnDestroy() {
    if (this.interval) {
      clearInterval(this.interval);
    }
  }

  showPassword() {
    this.isVisible = !this.isVisible;
  }

  get f() { return this.LoginForm.controls; }

  get fv() { return this.VarifyOTP.controls }

  LoginSubmit() {
    this.LoginMessage = '';
    this.Loginsubmitted = true;
    if (this.LoginForm.invalid) {
      return;
    }
    this.Loginloading = true;
    let devicedetails:any=this.getDeviceInfo();
    this.authenticationservice.login(this.f['emailphone'].value, this.f['password'].value,this.f['istrust'].value,devicedetails).pipe(first(),).subscribe(data => {
      this.Loginloading = false;
      if (data['Error']['ErrorCode'] == 0) {
        if (data['Result']['WithOTP'] == false) {
          // this.alertService.success('Welcome to TRAVELTRIPPLUS.');
          this.idleService.startWatching()
          this.router.navigate(['/flight'],{state: {login: true}});
        }
        if (data['Result']['WithOTP'] == true) {
          this.ActiveStep = 'VarifyOTP';
        }

      } else {
        this.LoginMessage = '<div class="error-msg">' + data['Error']['ErrorMessage'] + '</div>';
      }
    });
  }

    getDeviceInfo() {
    const parser = new UAParser();
    const result = parser.getResult();
 
    return {
      browser_name: result.browser.name,
      browser_version: result.browser.version,
      os_name: result.os.name,
      os_version: result.os.version,
      device_type: result.device.type || 'Desktop',
      user_agent: navigator.userAgent,
      language: navigator.language,
      screen: screen.width + "x" + screen.height,
      timezone: Intl.DateTimeFormat().resolvedOptions().timeZone
    };
  }

  numberOnly(event: any) {
    const charCode = (event.which) ? event.which : event.keyCode;
    if (charCode > 31 && (charCode < 48 || charCode > 57)) {
      return false;
    }
    return true;
  }

  clickEvent(event: any, last: any) {
    if (event.target.value.length === 1) {
      const nextInput = document.getElementById(last);
      if (nextInput) {
        nextInput.focus();
      }
    }
  }

  LoginSubmitOTP() {
    this.VerifyOTPSubmitted = true;
    // let otp = this.inputotp.join("");
    // if (otp.length == 6) {
      this.VarifyOTP.patchValue({'emailphone': this.f['emailphone'].value, 'password': this.f['password'].value });
    // } else {
    //   this.VarifyOTP.patchValue({ 'otp': '' });
    //   return;
    // }
    this.OTPLoginloading = true;
    this.authenticationservice.VarifyOTP(this.fv['emailphone'].value, this.fv['password'].value, this.fv['otp'].value).subscribe((data: any) => {
      this.OTPLoginloading = false;
      if (data['Error']['ErrorCode'] == 0) {
        // this.alertService.success('Welcome to TRAVELTRIPPLUS.');
        this.idleService.startWatching()
        
        this.router.navigate(['/flight'],{state: {login: true}});
      } else {
        this.LoginMessage = '<div class="error-msg">' + data['Error']['ErrorMessage'] + '</div>';
      }
    })
  }

  onPaste(event: ClipboardEvent) {
    let clipboardData = event.clipboardData?.getData('text') || '';
    clipboardData = clipboardData.trim();
    if (clipboardData.length === this.digits.length) {
      clipboardData.split('').forEach((char, i) => {
        this.inputotp[i] = char;
      });
      this.otpInputs.toArray().forEach((input, i) => {
        input.nativeElement.value = clipboardData[i];
      });
      //this.VerifyOTPSubmit(); // auto submit
    }
    event.preventDefault();
  }

  onKeyDown(event: KeyboardEvent, index: number) {
    if (event.key === 'Backspace' && !this.inputotp[index] && index > 0) {
      this.otpInputs.toArray()[index - 1].nativeElement.focus();
    }
  }
}
