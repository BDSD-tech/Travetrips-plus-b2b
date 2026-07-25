import { Component } from '@angular/core';
import { DashboardService } from '../dashboard.service';
import { AuthenticationService } from '../../../services/authentication.service';
import { CommonService } from '../../../services/common.service';
declare var bootstrap: any;

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.css'
})
export class DashboardComponent {
  Loading = false;
  Response: any;
  LoginAgentinfo: any = []
  BalanceData: any;
  showbalance = false;
  years: number[] = [];
  months: { value: string; name: string }[] = [];
  selectedYear: any = '';
  selectedMonth: any = '';
  constructor(private dashboardService: DashboardService, private authenticationservice: AuthenticationService, private commonservice: CommonService) {
    this.GetDashBoardDetails();
  }

  ngOnInit() {
    const currentDate = new Date();
    this.selectedYear = String(currentDate.getFullYear());
    this.selectedMonth = String(currentDate.getMonth() + 1).padStart(2, '0');

    this.authenticationservice.currentUser.subscribe(data => {
      if (data && data['CompanyId']) {
        this.LoginAgentinfo = data;

        // this.RefreshBalance();
      }
    });



    this.commonservice.GetWalletBalance().subscribe((data: any) => {
      if (data && data.length !== 0) {
        this.BalanceData = data;
      }
    })
    this.generateYearMonth();
  }

 

  generateYearMonth() {
    const currentDate = new Date();
    const currentYear = currentDate.getFullYear();
    const currentMonth = currentDate.getMonth(); // 0-11

    const monthNames = [
      'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
      'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'
    ];

    this.years = Array.from({ length: 3 }, (_, i) => currentYear - 2 + i);

    // Months till current month
    this.months = monthNames
      .slice(0, currentMonth + 1)
      .map((name, index) => ({
        value: String(index + 1).padStart(2, '0'),
        name
      }));
  }

  getCommission(e: any) {
    if (this.selectedYear && this.selectedMonth) {
      let reqdata = {
        "Month": this.selectedMonth,
        "Year": this.selectedYear
      }
      this.dashboardService.GetCommission(reqdata).subscribe((resp: any) => {
        if (resp['Error']['ErrorCode'] == 0) {
          this.Response['SaleCommission'] = resp['Result'];
        }
      })

    }
  }


  RefreshBalance() {
    this.commonservice.SetWalletBalance();
  }
  GetDashBoardDetails() {
    this.Loading = true;
    this.dashboardService.DashboardDetails().subscribe((resp: any) => {
      this.Loading = false;
      if (resp['Error']['ErrorCode'] == 0) {
        this.Response = resp['Result'];
         setTimeout(() => {
          this.initCarousel()
         }, 1000);
      }
    })
  }

  initCarousel() {

    const element = document.getElementById('travelHeroCarousel');
    // console.log(element);
    
    if (!element) {
      return;
    }

    const carousel = new bootstrap.Carousel(element, {
      interval: 3000,
      ride: 'carousel',
      
    });

    carousel.cycle();

  }
}
