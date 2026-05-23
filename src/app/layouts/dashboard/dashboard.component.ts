import { DOCUMENT } from '@angular/common';
import { Component, Inject, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthenticationService } from '../../services/authentication.service';
import { CommonService } from '../../services/common.service';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {
  [x: string]: any;

  LoginAgentinfo:any=[];
  GetWebSiteData:any=[];
  LogoURL:any='assets/img/logo/logo.png';

  WalletBalance:any=0;
  WalletCreditLimit:any=0;
  WalletDueAmount:any=0;
  WalletCreditStatus:any='NA';
  WalletCreditExpireDate:any='';
  WalletStatus:any='';
  WalletDepositBalance:any=0;
  dyclass:any
  PageUrl:any
  Activeab:any=''
  URLSTATIC:any
  constructor(private authenticationservice: AuthenticationService,public commonservice :CommonService,@Inject(DOCUMENT) private document: Document,private router:Router) {
    router.events.subscribe((url:any) => {
      this.PageUrl=url.urlAfterRedirects
      
    });
    
    this.authenticationservice.currentUser.subscribe(data => {
      if(data && data['CompanyId'])
      {
        this.URLSTATIC='/dashboard/user-detail/'+data['CompanyId'];
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

    
    this.document.body.classList.add('adminbg');
    this.document.body.classList.add('font-family-Rubik');

   }

  ngOnInit(): void {
    sessionStorage.removeItem('time');
    
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
   
    
   
  }
  OpenHome() {
  this.router.navigate(['/flight']).then(() => {
    window.location.reload();
  });
}
  Activetab(tab:any){
    if(this.Activeab==tab){
      this.Activeab=null;
    }else{
      this.Activeab=tab;
    }
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

isSidebarOpen = false;

toggleSidebar() {
    if (window.innerWidth <= 991) {
        this.isSidebarOpen = true;
        document.body.classList.add('sidebar-open');
    }
}

closeSidebar() {
  if (window.innerWidth <= 991) {
    this.isSidebarOpen = false;
    document.body.classList.remove('sidebar-open');
  }
}

}
