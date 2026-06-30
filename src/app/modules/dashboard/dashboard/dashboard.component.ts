import { Component } from '@angular/core';
import { DashboardService } from '../dashboard.service';
import { AuthenticationService } from '../../../services/authentication.service';
import { CommonService } from '../../../services/common.service';
@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.css'
})
export class DashboardComponent {
  Loading=false;
  Response:any;
  LoginAgentinfo:any=[]
  BalanceData:any;
  showbalance=false
  constructor(private dashboardService:DashboardService,private authenticationservice:AuthenticationService,private commonservice:CommonService){
    this.GetDashBoardDetails();
  }

  ngOnInit(){
    this.authenticationservice.currentUser.subscribe(data => {
      if(data && data['CompanyId'])
      {
        this.LoginAgentinfo=data; 

        // this.RefreshBalance();
      }
    });
    this.commonservice.GetWalletBalance().subscribe((data:any) => {
      if(data && data.length!==0){
        this.BalanceData=data;
      }
    })
  }

  RefreshBalance()
  {
    this.commonservice.SetWalletBalance();
  }
  GetDashBoardDetails(){
    this.Loading=true;
    this.dashboardService.DashboardDetails().subscribe((resp:any)=>{
      this.Loading=false;
      if(resp['Error']['ErrorCode']==0){
        this.Response=resp['Result'];
      }
    })
  }
}
