import { Component, OnInit } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { Router, ActivatedRoute, NavigationExtras } from '@angular/router';
import { AuthenticationService } from '../../../services/authentication.service';
import { CommonService } from '../../../services/common.service';
import { FlightService } from '../flight.service';
import { Location } from '@angular/common';
import { AlertService } from '../../../services/alert.service';
import { tts_config } from '../../../../environments/tts_config';
import { Baggage } from './baggage';
@Component({
  selector: 'app-review',
  templateUrl: './review.component.html',
  styleUrls: ['./review.component.css']
})




export class ReviewComponent implements OnInit {
[x: string]: any;


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

 

  

  constructor(private flightService: FlightService,private router: Router,private route: ActivatedRoute,private commonservice: CommonService,private fb: FormBuilder,private authenticationservice: AuthenticationService,private location: Location,private alertservice:AlertService) { 

    this.route.queryParams.subscribe(params => {
      if(params) {
          this.param=params;
      } else {
          this.router.navigate(['/']);
       }
    });

    if (sessionStorage.getItem('FlightSearch')) {
      let flightsearch:any=sessionStorage.getItem('FlightSearch');
      this.GetSearchData = JSON.parse(flightsearch);
    } else {
      this.router.navigate(['/']);
    } 

  }

  ngOnInit(): void {


    if(sessionStorage.getItem('time')) {
      let time:any=sessionStorage.getItem('time');
      this.SessionTime=JSON.parse(time);
    }

    if (sessionStorage.getItem('TSFP')) {
      let TSFP:any=sessionStorage.getItem('TSFP');
      let resp=JSON.parse(TSFP);
      this.Response=resp['response']['Result'];
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
      
    } else {
      this.router.navigate(['flight']);
    }

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

  ProceedToPay()
  {
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
