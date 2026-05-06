import { Component, OnInit } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute, NavigationExtras, Router } from '@angular/router';
import { AuthenticationService } from '../../../services/authentication.service';
import { CommonService } from '../../../services/common.service';
import { FlightService } from '../flight.service';
import { Location } from '@angular/common';
import { AlertService } from '../../../services/alert.service';
import { tts_config } from '../../../../environments/tts_config';


declare var $: any;
declare var window: any;

@Component({
  selector: 'app-details-review',
  templateUrl: './details-review.component.html',
  styleUrls: ['./details-review.component.css']
})
export class DetailsReviewComponent implements OnInit {

  WebSiteData:any=[];
  GetSearchData: any=[];

  UserIp:any;
  Response:any=[];
  MainSegments:any=[];
  Segments:any=[];
  FareList:any=[];


  CurrentFare:any={};
  
  faretype:any;
  param:any=[];

  SessionTime:any;
  userinfo:any={};
  fareloading=true;

  fareRuleLoading=false;
  FlightFareRule:any=[];
  FareRuleErrorCode:any;
  FareRuleErrorMessage:any;

  modaldata:any=[];
  formModal: any;
  isshowmarkup:any=false;
  markupvalue=0;

  oldprice:any=0;
  isconfimation:any=false;
  
  AirlineLogoURL:any=tts_config['BASEURL']+'uploads/airline-images/';


  SSRRESP:any=[]
  ssr_Request:any={}
  FareBrekdown:any={}
  constructor(private flightService: FlightService,private router: Router,private route: ActivatedRoute,private commonservice: CommonService,private fb: FormBuilder,private authenticationservice: AuthenticationService,private location: Location,private alertservice:AlertService) {

    this.route.queryParams.subscribe(params => {
      if(params) {
          this.param=params;
      } else {
          this.router.navigate(['']);
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
    



    if (sessionStorage.getItem('TSF')) {
      let TSF:any=sessionStorage.getItem('TSF');
      let resp=JSON.parse(TSF);  
      let Segment:any=[]; let farelist:any=[]; let mainsegments:any=[]; let oldprice=0;
      resp.forEach(function(value:any,key:any) {
        Segment.push(value['Segments']);
        farelist.push(value['FareList']);
        mainsegments.push(value['MainSegment']);
        oldprice+=value['FareList']['Fare']['PublishedPrice'];
      });
      this.MainSegments=mainsegments;
      this.Segments=Segment;
      this.FareList=farelist;
      this.oldprice=oldprice;
      this.UserIp=resp[0]['UserIp'];
  
    } else {
       this.router.navigate(['flight']);
    }

    if(sessionStorage.getItem('time')) {
      let time:any=sessionStorage.getItem('time');
      this.SessionTime=JSON.parse(time);
    
    }

    this.commonservice.GetWebSiteData().subscribe(data => {
      this.WebSiteData =data;
    });
    
    this.authenticationservice.currentUser.subscribe(data => {
      if(data)
      {
          this.userinfo=data;
      }
    });

    this.formModal = new window.bootstrap.Modal(
      document.getElementById('pricemodel')
    );

    if(this.isconfimation==false)
    {
      this.FareConfirmation();
    }
    
  }

  FareConfirmation()
  {
    this.fareloading = true;
    let data = {
      'SearchTokenId'   : this.param['stoken'],
      'ResultIndex'     : this.param['fareid'],
      'FareRuleId'      : this.FareList[0]['FareRuleId']
    };

    if(this.param['ibfareid'])
    {
      Object.assign(data, {ResultIndexIB: this.param['ibfareid'],SearchTokenIdIB:this.param['ibstoken'],FareRuleId:this.FareList[1]['FareRuleId']});
    }

    this.ssr_Request=data
    this.flightService.fare_confimation(data).subscribe(data => {
      
      this.isconfimation=true;
     
     
      let response:any=data;
      this.Response=data;
      if(response['Error']['ErrorCode']==0)
      {
        this.get_ssr()
        this.markupvalue=response['TotalMarkup'];
        let markup:any=this.markupvalue;
        sessionStorage.setItem('TAGM',markup);

        let Segment:any=[];
        let BaseFare=0; let Tax=0; let YQTax=0; let OtherCharges=0; let Discount=0; let PublishedPrice=0; let OfferedPrice=0;let AgentCommission=0; let ServiceCharges=0; let TDS=0; let CGSTAmount=0; let CGSTRate=0; let IGSTAmount=0; let IGSTRate=0; let SGSTAmount=0; let SGSTRate=0; let TaxableAmount=0;

        let adltpaxcount=0;let adltbasefare=0; let adlttax=0;let adltyqtax=0;let adltservicecharge=0;
        let childpaxcount=0;let childbasefare=0; let childtax=0;let childyqtax=0;let childservicecharge=0;
        let infpaxcount=0;let infbasefare=0; let inftax=0;let infyqtax=0;let infservicecharge=0;

        response['Result'].forEach(function(value:any,key:any) {
        Segment.push(value['Segments']);
  
          BaseFare+=value['Fare']['BaseFare'];
          Tax+=value['Fare']['Tax'];
          YQTax+=value['Fare']['YQTax'];
          OtherCharges+=value['Fare']['OtherCharges'];
          Discount+=value['Fare']['Discount'];
          PublishedPrice+=value['Fare']['PublishedPrice'];
          OfferedPrice+=value['Fare']['OfferedPrice'];
          AgentCommission+=value['Fare']['AgentCommission'];
          ServiceCharges+=value['Fare']['ServiceCharges'];
          TDS+=value['Fare']['TDS'];
          CGSTAmount+=value['Fare']['GST']['CGSTAmount'];
          CGSTRate+=value['Fare']['GST']['CGSTRate'];
          IGSTAmount+=value['Fare']['GST']['IGSTAmount'];
          IGSTRate+=value['Fare']['GST']['IGSTRate'];
          SGSTAmount+=value['Fare']['GST']['SGSTAmount'];
          SGSTRate+=value['Fare']['GST']['SGSTRate'];
          TaxableAmount+=value['Fare']['GST']['TaxableAmount'];
          if(value['FareBreakdown']['ADT']){
            adltpaxcount+=value['FareBreakdown']['ADT']['PassengerCount']
            adltbasefare+=value['FareBreakdown']['ADT']['BaseFare']
            adlttax+=value['FareBreakdown']['ADT']['Tax']
            adltyqtax+=value['FareBreakdown']['ADT']['YQTax']
            adltservicecharge+=value['FareBreakdown']['ADT']['ServiceCharges']
          }
          if(value['FareBreakdown']['CHD']){
            childpaxcount+=value['FareBreakdown']['CHD']['PassengerCount']
            childbasefare+=value['FareBreakdown']['CHD']['BaseFare']
            childtax+=value['FareBreakdown']['CHD']['Tax']
            childyqtax+=value['FareBreakdown']['CHD']['YQTax']
            childservicecharge+=value['FareBreakdown']['CHD']['ServiceCharges']
          }
          if(value['FareBreakdown']['INF']){
            infpaxcount+=value['FareBreakdown']['INF']['PassengerCount']
            infbasefare+=value['FareBreakdown']['INF']['BaseFare']
            inftax+=value['FareBreakdown']['INF']['Tax']
            infyqtax+=value['FareBreakdown']['INF']['YQTax']
            infservicecharge+=value['FareBreakdown']['INF']['ServiceCharges']
          }
        });
  
       this.Segments=Segment;
       this.MainSegments=response['MainSegment'];
       this.FareBrekdown['Adult']={
        'BaseFare':adltbasefare,
        "PaxCount":adltpaxcount,
        "Tax":adlttax,
        "YQTax":adltyqtax,
        "ServiceCharge":adltservicecharge,
       }
       this.FareBrekdown['Child']={
        'BaseFare':childbasefare,
        "PaxCount":childpaxcount,
        "Tax":childtax,
        "YQTax":childyqtax,
        "ServiceCharge":childservicecharge,
       }
       this.FareBrekdown['Infant']={
        'BaseFare':infbasefare,
        "PaxCount":infpaxcount,
        "Tax":inftax,
        "YQTax":infyqtax,
        "ServiceCharge":infservicecharge,
       }
       this.CurrentFare['BaseFare']=BaseFare;
       this.CurrentFare['Tax']=Tax;
       this.CurrentFare['YQTax']=YQTax;
       this.CurrentFare['OtherCharges']=OtherCharges;
       this.CurrentFare['Discount']=Discount;
       this.CurrentFare['PublishedPrice']=PublishedPrice;
       this.CurrentFare['OfferedPrice']=OfferedPrice;
       this.CurrentFare['AgentCommission']=AgentCommission;
       this.CurrentFare['ServiceCharges']=ServiceCharges;
       this.CurrentFare['TDS']=TDS;
       this.CurrentFare['AgentMarkup']=this.markupvalue;
       this.CurrentFare['GST']={
                                  'CGSTAmount':CGSTAmount,
                                  'CGSTRate':CGSTRate,
                                  'IGSTAmount':IGSTAmount,
                                  'IGSTRate':IGSTRate,
                                  'SGSTAmount':SGSTAmount,
                                  'SGSTRate':SGSTRate,
                                  'TaxableAmount':TaxableAmount
                                };
       if(response['IsPriceChanged'])
       {
         let newprice=this.CurrentFare['PublishedPrice']+this.CurrentFare['AgentMarkup'];
         let pricetxt='<div class="col-lg-12 text-center">'
             +'<table class="table">'
               +'<tbody class="border">'
               +'<tr>'
               +'<td>Old Fare was-</td>'
               +'<td>₹ '+this.flightService.transformDecimal(this.oldprice)+' </td>'
               +'</tr>'
               +'<tr>'
               +'<td> New Fare is -</td>'
               +'<td class="text-danger">₹ '+this.flightService.transformDecimal(newprice)+'</td>'
               +'</tr>'
               +'</table>'
               +'</div>';
  
             this.modaldata['head']='Fare have changed';
             this.modaldata['message']=pricetxt;
             this.modaldata['type']='';
  
             this.formModal.show();
       }

       
      } else {
       
        this.formModal.show();
        this.modaldata['head']='Fare Error';
        this.modaldata['message']=response['Error']['ErrorMessage'];
        this.modaldata['type']='FC';
      }

    });

  
    
  }

  get_ssr(){
    let req=this.ssr_Request
    this.flightService.ssr_info(req).subscribe((ssrresp:any)=>{
      this.fareloading = false;
      if(ssrresp['Error']['ErrorCode']==0){
        this.SSRRESP=ssrresp['Result'];
      }
    })

  }

  FareRule(trip:any)
  {
   
    this.fareRuleLoading=true;
    let data:any;
    if(trip==0)
    {
      data = {
          'UserIp'        : this.UserIp,
          'SearchTokenId' : this.param['stoken'],
          'ResultIndex'   : this.param['fareid'],
          'FareRuleId'   : this.FareList[0]['FareRuleId'],
        };
    } else if(trip==1)
    {
       data = {
        'UserIp'        : this.UserIp,
        'SearchTokenId' : this.param['ibstoken'],
        'ResultIndex'   : this.param['ibfareid'],
        'FareRuleId'   : this.FareList[1]['FareRuleId'],
      };
    }
    this.flightService.fare_rule(data).subscribe(resp => {
      this.fareRuleLoading=false;
      let response:any=resp;
      this.FlightFareRule=response['Result'];
      this.FareRuleErrorCode=response['Error']['ErrorCode'];
      this.FareRuleErrorMessage=response['Error']['ErrorMessage'];
    });    
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

  isEmpty(obj:any) {
    return Object.keys(obj).length === 0;
  }

  goBack()
  {
    this.formModal.hide();
    this.location.back();
  }

  faretogglebutton(event:any,tripkey:any)
  {
    $("#fare-rule-"+tripkey).toggle('d-none');
    let isexpanded=event.target.getAttribute('data-expanded');
    if(isexpanded=='false')
    {
      $(".ttsfare"+tripkey).removeClass('fa-minus');
      $(".ttsfare"+tripkey).addClass('fa-plus');
      event.target.setAttribute('data-expanded','true');
      
    } else {
      $(".ttsfare"+tripkey).addClass('fa-minus');
      $(".ttsfare"+tripkey).removeClass('fa-plus');
      event.target.setAttribute('data-expanded','false');
      this.FareRule(tripkey);
    }
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

  addpassengers()
  {
    let selectobj={
                    'response':this.Response,
                    'fare':this.CurrentFare,
                    'param':this.param,
                    'ssrresp':this.SSRRESP,
                  }
    sessionStorage.setItem('TSFP',JSON.stringify(selectobj));

    this.formModal.hide();
    const navigationExtras: NavigationExtras = {
      queryParams:this.param
    };
    this.router.navigate(['flight/traveller'],navigationExtras);
  }
}
