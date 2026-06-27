import { Component } from '@angular/core';
import { AuthenticationService } from '../../services/authentication.service';
import { Router } from '@angular/router';
import { CommonService } from '../../services/common.service';
import { Title } from '@angular/platform-browser';

@Component({
  selector: 'app-landing-page',
  templateUrl: './landing-page.component.html',
  styleUrl: './landing-page.component.css'
})
export class LandingPageComponent {

  GetWebSiteData:any=[]
  FooterData:any=[]
  LandingPageData:any=[]

  constructor(private serviceTitle:Title,private commonservice:CommonService,private authenticationservice:AuthenticationService,private router:Router){
    if (this.authenticationservice.currentUserValue) {
      this.router.navigate(['/flight']);
    } else {
      this.router.navigate(['/']);
    }

   
  }

  ngOnInit(){
     this.commonservice.GetWebSiteData().subscribe(data => {
      this.GetWebSiteData = data;
      console.log(this.GetWebSiteData);
      
      if (this.GetWebSiteData['CompanyName']) {
        this.serviceTitle.setTitle(this.GetWebSiteData['CompanyName']);
      }
    });
     this.commonservice.GetLandingPageData().subscribe((data:any) => {
      if(data && data.length!==0){
        this.LandingPageData=data;
        console.log(this.LandingPageData);
        
      }
     
    });
     this.commonservice.GetFooterData().subscribe(data => {
      if(data && data.length!==0){
         this.FooterData = data;
        
      }
     
     
    });
  }
}
