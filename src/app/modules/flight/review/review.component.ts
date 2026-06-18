import { Component, Input, OnInit } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { Router, ActivatedRoute, NavigationExtras } from '@angular/router';
import { AuthenticationService } from '../../../services/authentication.service';
import { CommonService } from '../../../services/common.service';
import { FlightService } from '../flight.service';
import { Location } from '@angular/common';
import { AlertService } from '../../../services/alert.service';
import { tts_config } from '../../../../environments/tts_config';
declare var bootstrap: any;
@Component({
  selector: 'app-review',
  templateUrl: './review.component.html',
  styleUrls: ['./review.component.css']
})




export class ReviewComponent implements OnInit {
  [x: string]: any;
  ISSSRHave:any=false;
  @Input() params:any=[];

  SessionTime:any;
  Response:any=[];

  MainSegments:any=[];
  Segments:any=[];
  FareList:any=[];

  WebSiteData:any=[];
  GetSearchData: any=[];
  param:any=[];
  CurrentFare:any={};
  isshowmarkup:any=false;
  markupvalue=0;

  Paxinfo:any=[];
  AirlineLogoURL:any=tts_config['BASEURL']+'uploads/airline-images/';

 
  HoldableWithoutSSR:any=false;
  HoldableWithSSR:any=false;


  SaveData:any


  bookingloading=false;
  constructor(private flightService: FlightService,private router: Router,private route: ActivatedRoute,private commonservice: CommonService,private fb: FormBuilder,private authenticationservice: AuthenticationService,private location: Location,private alertservice:AlertService) { 

    // this.route.queryParams.subscribe(params => {
    //   if(params) {
    //       this.param=params;
    //   } else {
    //       this.router.navigate(['/']);
    //    }
    // });
  
  
    if (sessionStorage.getItem('FlightSearch')) {
      let flightsearch:any=sessionStorage.getItem('FlightSearch');
      this.GetSearchData = JSON.parse(flightsearch);
    } else {
      this.router.navigate(['/']);
    } 

  }

  ngOnInit(): void {
    this.param=this.params;
    if(sessionStorage.getItem('time')) {
      let time:any=sessionStorage.getItem('time');
      this.SessionTime=JSON.parse(time);
    }

    if(sessionStorage.getItem('TSFPAX')){
      let data:any =sessionStorage.getItem('TSFPAX');
      this.SaveData=JSON.parse(data);
      
    }
    
    if (sessionStorage.getItem('TSFP')) {
      let TSFP:any=sessionStorage.getItem('TSFP');
      let resp=JSON.parse(TSFP);
      this.Response=resp['response']['Result'];
     

      this.HoldableWithoutSSR = this.Response.every(
        (item:any) => item.IsHoldabelWithOutSsr === true
      );

      this.HoldableWithSSR = this.Response.every(
        (item:any) => item.IsHoldabelWithSsr === true
      );


      this.CurrentFare=resp['fare'];
      if (sessionStorage.getItem('TAGM')) {
        let markup:any=sessionStorage.getItem('TAGM');
        this.markupvalue=parseFloat(markup);
        this.CurrentFare['AgentMarkup']=this.markupvalue;
      }

      let Segment:any=[]; let farelist:any=[];let mainsegments:any=[];
      this.Response.forEach(function(value:any,key:any) {
        Segment.push(value['Segments']);
        let obj={
                  'FareType'    :value['FareType'],
                  'FareTypeColor'    :value['FareTypeColor'],
                  'IsRefundable':value['IsRefundable'],
                }
        farelist.push(obj);
      });
      this.Segments=Segment;
      this.FareList=farelist;  
      this.MainSegments=resp['response']['MainSegment'];
    } else {
      this.router.navigate(['flight']);
    }
    if (sessionStorage.getItem('TSFPAX')) {
      let TSFPAX:any=sessionStorage.getItem('TSFPAX');
      let resp=JSON.parse(TSFPAX);
      this.Paxinfo=resp;
      this.ISSSRHave=this.checkAncillarySelected(this.Paxinfo)
    } else {
      this.router.navigate(['flight']);
    }

  }

  checkAncillarySelected(data: any) {
    const passengers = [
        ...(data.paxdata?.Adult || []),
        ...(data.paxdata?.Child || [])
        ];

        const hasAncillary = passengers.some(
        pax =>
          Array.isArray(pax.Baggage) && pax.Baggage.length > 0 ||
          Array.isArray(pax.Meal) && pax.Meal.length > 0 ||
          Array.isArray(pax.Seat) && pax.Seat.length > 0
        );

        return hasAncillary;
    }

  objectKeys(obj: any) {
    return Object.keys(obj);

  }

  showmarkup()
  {
    this.isshowmarkup=!this.isshowmarkup;
  }

  updatemarkup()
  {
    this.CurrentFare['AgentMarkup']=this.markupvalue;
    let markup:any=this.markupvalue;
    sessionStorage.setItem('TAGM',markup);
    this.showmarkup();
  }

  goBack()
  {
    this.location.back();
  }

  FTduration(n : number)
  {
    var num = n;
    var hours = (num / 60);
    var rhours = Math.floor(hours);
    var minutes = (hours - rhours) * 60;
    var rminutes = Math.round(minutes);
    return  rhours + "h  "+ rminutes + "m";
  }

  ProceedToPay(type:any)
  {
  
    if(type=='Hold'){
      this.SaveData['BookingType']='Hold';
      this.SaveData['Markup']=this.markupvalue;
      this.SaveData['TotalPrice']=Number(this.CurrentFare['OfferedPrice'])+Number(this.CurrentFare['TDS'])+Number(this.CurrentFare['AgentMarkup'])+Number(this.CurrentFare['SSR']['Meal'])
                                            + Number(this.CurrentFare['SSR']['Baggage'])+Number(this.CurrentFare['SSR']['Seat']);
      this.bookingloading=true;
      this.flightService.SavePaxdata(this.SaveData,'Flight').subscribe(resp => {
        let data:any=resp;
        this.bookingloading=false;
        if(data['Error']['ErrorCode']==0)
        {
          this.closeModal();
          window.location.href=data['Result']['url'];
        } else {
          this.alertservice.error(data['Error']['ErrorMessage']);
        }   
      });
    }else{
        this.closeModal();
        let data:any={
        "service":'Flight',
        "params":this.param
      }
      const navigationExtras: NavigationExtras = {
        queryParams:data
      };
      this.router.navigate(['payment'],navigationExtras);
    }
    
    
  }

closeModal() {
    // this.showReviewpage = false;
    const modalElement = document.getElementById('ReviewModal')!;
    const modal = bootstrap.Modal.getInstance(modalElement);
    modal?.hide();
  }

}
