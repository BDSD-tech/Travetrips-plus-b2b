import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Title, Meta } from '@angular/platform-browser';
import { CommonService } from '../../../services/common.service';

@Component({
  selector: 'app-contact-us',
  templateUrl: './contact-us.component.html',
  styleUrls: ['./contact-us.component.css']
})
export class ContactUsComponent implements OnInit {

  GetWebSiteData:any=[];

  loading=false;
  submitted = false;
  ContactForm: FormGroup;
  ContactMessage='';
  Message:any='';


  constructor(private commonservice:CommonService,public formBuilder: FormBuilder,private serviceTitle: Title,private meta: Meta) {

    this.ContactForm = formBuilder.group({
      name: ['', [Validators.required, Validators.pattern('[a-zA-Z /\s/g]+')]],
      email: ['', [Validators.required, Validators.email]],
      phone: ['', [Validators.required, Validators.minLength(10), Validators.maxLength(15), Validators.pattern('[0-9]+')]],
      message: ['',Validators.required]
    });

   }

  ngOnInit(): void {
    this.commonservice.GetWebSiteData().subscribe(data => {
      this.GetWebSiteData =data;
      if(this.GetWebSiteData['CompanyName'])
      {
        this.serviceTitle.setTitle(this.GetWebSiteData['CompanyName']+' Contact Us');
      }
     
    });
    window.scroll(0,0); 
  }

  get f() { return this.ContactForm.controls; }

  SubmitContact() {
    this.Message='';
    this.submitted = true;
    if (this.ContactForm.invalid) {
      return;
    }
    this.loading=true;

    this.commonservice.Contactus(this.ContactForm.value).subscribe(data=>{
      this.loading=false;
      let response:any=data;
      if(response['Error']['ErrorCode']===0)
      {
        this.ContactForm.reset();
        this.submitted = false;
        this.Message='<div class="success-msg text-center">'+response['Error']['ErrorMessage']+'</div>';
      } else {
        this.Message='<div class="success-msg text-center">'+response['Error']['ErrorMessage']+'</div>';
      }
    });
    
  }

}
