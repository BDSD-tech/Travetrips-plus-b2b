import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { CommonService } from '../../services/common.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  GetWebSiteData:any=[];
  FooterMenu:any=[];
  FooterData:any=[];

  constructor(private router:Router,private commonservice:CommonService) {
   }

  ngOnInit(): void {
    this.commonservice.GetWebSiteData().subscribe((data:any)=>{
      this.GetWebSiteData=data;
      if(this.GetWebSiteData['Favicon']){
          this.commonservice.updateFavicon(this.GetWebSiteData['Favicon'])
      } 
    });
    this.commonservice.GetFooterData().subscribe(data => {
      if( data && data.length!==0){
        this.FooterMenu=data;
      }
    });
      this.commonservice.GetFooterData().subscribe(data => {
      if(data && data.length!==0){
         this.FooterData = data;
        
      }
     
     
    });
  }

  GotoPage(title:any){
    if(title=='Flight'){
      this.router.navigate(['/pages/flight'])
    }
    if(title=='Packages'){
      this.router.navigate(['/pages/products'])
    }
    if(title=='Hotels'){
      this.router.navigate(['/pages/hotel'])
    }
    if(title=='Visa'){
      this.router.navigate(['/pages/visa'])
    }
   
  }
 
}
