import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute, Data } from '@angular/router';
import { AlertService } from '../../../../services/alert.service';
import { tts_config } from '../../../../../environments/tts_config';
import { DashboardService } from '../../dashboard.service';

@Component({
  selector: 'app-itinerary',
  templateUrl: './itinerary.component.html',
  styleUrls: ['./itinerary.component.css']
})
export class ItineraryComponent implements OnInit {

  params:any;
  loading=true;
  BookingDetail:any=[];
  PaxID:any=[];
  Remark:any='';

  submitloading=false;

  AirlineLogoURL:any=tts_config['BASEURL']+'uploads/airline-images/';

  constructor(private router: Router,private route: ActivatedRoute,private alertservice:AlertService,private dashboardservice:DashboardService) { 


    this.route.queryParams.subscribe(params => {
      if(params['bookingid'] && params['amendment-type']) {
        this.params=params;
      } else {
          this.router.navigate(['dashboard/manage-carts']);
       }
    });


  }
  
  ngOnInit(): void {

    this.GetBookingDetail();
  }

  GetBookingDetail()
  {
      
      this.dashboardservice.FlightDetail(this.params['bookingid']).subscribe(data=>{
          let resp:any=data;
          this.loading=false;
          if(resp['Error']['ErrorCode']==0)
          {
            this.BookingDetail=resp['Result'];
            console.log(this.BookingDetail);
            
            let AmendmentPaxID:any=[];
            this.BookingDetail['amendmentList'].forEach((element:any) => {
              if(element['amendment_status']=='requested')
              { 
                element['request']['PaxId'].forEach((e:any) => {
                  AmendmentPaxID.push(e);
                });
              }
            });

            this.BookingDetail['travelersInfo'].forEach((element:any) => {
              if(AmendmentPaxID.indexOf(element['id']) !== -1)  
              {  
                     element['booking_status']='Requested';
              }   
            });

          
          } else {
            this.BookingDetail=[];
            this.alertservice.error(resp['Error']['ErrorCode']);
          }
      });
  }

  SelectPax(event:any,paxid:any)
  {
    if ( event.target.checked ) {
         this.PaxID.push(paxid);
    } else {
      const index = this.PaxID.indexOf(paxid);
      if (index >= 0) {
        this.PaxID.splice(index, 1);
      }
    }  
  }

  SubmitRequest()
  {
    if(this.PaxID.length!=0)
    {

      if(this.Remark)
      {
        let request={
                      'BookingRefNo':this.params['bookingid'],
                      'AmendmentType':this.params['amendment-type'],
                      'PaxID':this.PaxID,
                      'Remark':this.Remark,
                    }
        this.submitloading=true;
        this.dashboardservice.RaiseAmendments(request,'flight').subscribe(data=>{
          let resp:any=data;
          this.submitloading=false;
          if(resp['Error']['ErrorCode']==0)
          { 
            //this.GetBookingDetail();
            this.router.navigate(['dashboard/manage-carts/cart-detail/',this.BookingDetail['booking_ref_number']]);
            this.PaxID=[];
            this.Remark='';
            
            this.alertservice.success(resp['Error']['ErrorMessage']);
          } else {
            this.alertservice.error(resp['Error']['ErrorMessage']);
          }
        });

      } else {
        this.alertservice.error('Please enter Remark');
      }
    } else {
      this.alertservice.error('Select atleast one passenger');
    }
  }
}
