import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute, NavigationExtras } from '@angular/router';

@Component({
  selector: 'app-payment-response',
  templateUrl: './payment-response.component.html',
  styleUrls: ['./payment-response.component.css']
})
export class PaymentResponseComponent implements OnInit {

  constructor(private router: Router, private route: ActivatedRoute) {

    this.route.queryParams.subscribe(params => {
      if(params) {
          this.PaymentResponse(params)
      } else {
          this.router.navigate(['/flight']);
       }
    });
   }

  ngOnInit(): void {
  }


  PaymentResponse(params:any)
  {
      
      if(params['service']=='Flight')
      {
        let navigationExtras: NavigationExtras = {
              queryParams: {'token':params['token'],'type':'Booking'}
        };
        this.router.navigate(['flight/confirmation'], navigationExtras); 
      }
      if(params['service']=='Hotel')
      {
        let navigationExtras: NavigationExtras = {
              queryParams: {'token':params['token'],'type':'Booking'}
        };
        this.router.navigate(['hotel/confirmation'], navigationExtras); 
      }
      if(params['service']=='Bus')
      {
        let navigationExtras: NavigationExtras = {
              queryParams: {'token':params['token'],'type':'Booking'}
        };
        this.router.navigate(['bus/confirmation'], navigationExtras); 
      }
      if(params['service']=='Make_Payment')
      {
        let navigationExtras: NavigationExtras = {
          queryParams: {'transactionid':params['TransactionId'],'service':params['service']}
        };
        this.router.navigate(['dashboard/online-recharge'], navigationExtras); 
      }
  }

}
