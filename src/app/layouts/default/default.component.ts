import { DOCUMENT } from '@angular/common';
import { Component, Inject, OnInit } from '@angular/core';
import { AuthenticationService } from '../../services/authentication.service';
import { CommonService } from '../../services/common.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-default',
  templateUrl: './default.component.html',
  styleUrls: ['./default.component.css']
})
export class DefaultComponent implements OnInit {

  LoginAgentinfo:any=[];
  GetWebSiteData:any=[];
  FooterMenu:any=[];
  TextWaterMark:any;
  LogoURL:any='assets/img/logo/logo.png';
  WalletBalance:any=0;
  WalletCreditLimit:any=0;
  WalletDueAmount:any=0;
  WalletCreditStatus:any;
  WalletCreditExpireDate:any='';
  WalletStatus:any='';
  WalletDepositBalance:any=0;

  dyclass:any

  constructor(private router:Router,private authenticationservice: AuthenticationService,public commonservice :CommonService,@Inject(DOCUMENT) private document: Document) { 

    this.authenticationservice.currentUser.subscribe(data => {
      if(data && data['CompanyId'])
      {
        this.LoginAgentinfo=data; 
        this.WalletBalance=data['Balance'];
        if(this.LoginAgentinfo['CreditLimit'])
        {
           this.WalletCreditLimit=parseFloat(this.LoginAgentinfo['CreditLimit']);
        }
        if(this.LoginAgentinfo['DueAmount'])
        {
           this.WalletDueAmount=parseFloat(this.LoginAgentinfo['DueAmount']);
        }
        if(this.LoginAgentinfo['CreditStatus'])
        {
           this.WalletCreditStatus=this.LoginAgentinfo['CreditStatus'];
        }
        if(this.LoginAgentinfo['WalletStatus'])
        {
           this.WalletStatus=this.LoginAgentinfo['WalletStatus'];
        }
        if(this.LoginAgentinfo['DepositBalance'])
        {
           this.WalletDepositBalance=this.LoginAgentinfo['DepositBalance'];
        }
        this.RefreshBalance();
      }
    });

    this.document.body.classList.remove('adminbg');
    this.document.body.classList.remove('font-family-Rubik');
   
  }

  ngOnInit(): void {
    this.commonservice.GetWebSiteData().subscribe(data => {
      this.GetWebSiteData =data;
       if(this.GetWebSiteData['Favicon']){
          this.commonservice.updateFavicon(this.GetWebSiteData['Favicon'])
      } 
        if(this.LoginAgentinfo['AgencyLogo'])
        {
          this.LogoURL=this.LoginAgentinfo['AgencyLogo'];
        } else {
          this.LogoURL=this.GetWebSiteData['Logo'];
        }
    });
   
    this.commonservice.GetFooterData().subscribe(data => {
      if( data && data.length!==0){
        this.FooterMenu=data;
      }
    });
   
    this.commonservice.GetWalletBalance().subscribe(data => {
      this.WalletBalance =data['Balance'];
      this.WalletCreditLimit=data['CreditLimit'];
      this.WalletDueAmount=data['DueAmount'];
      this.WalletCreditStatus=data['CreditStatus'];
      this.WalletCreditExpireDate=data['ExpireDate'];
      this.WalletStatus=data['WalletStatus'];
      this.WalletDepositBalance=data['DepositBalance'];
      if(this.WalletCreditLimit==0){
        this.dyclass='only2';
       }else{
        this.dyclass=''
       }
    });

    this.AddWaterMark();
  }

  OpenHome() {
    this.router.navigate(['/flight']).then(() => {
      window.location.reload();
    });
  }

  AddWaterMark()
  {
    let agentid =this.LoginAgentinfo['CompanyId'];
    let text = '';
    let max = 1000;
    for (let i = 0; i < max; i++) {
         text += ' ' + agentid;
    }
    this.TextWaterMark=text;
  }

  logout() : void {
    this.commonservice.Logout().subscribe(data => {
      let resp:any=data;
      if(resp['Error']['ErrorCode']==0)
      {
        this.authenticationservice.logout();
      }
    });
    
  }
  RefreshBalance()
  {
    this.commonservice.SetWalletBalance();
  }
}
