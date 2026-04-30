import { Component, OnInit } from '@angular/core';
import { Sort } from '@angular/material/sort';
import { Title } from '@angular/platform-browser';
import { Router, ActivatedRoute, NavigationEnd, NavigationExtras } from '@angular/router';
import { AlertService } from '../../../services/alert.service';
import { AuthenticationService } from '../../../services/authentication.service';
import { CommonService } from '../../../services/common.service';
import { FlightService } from '../flight.service';
import { tts_config } from '../../../../environments/tts_config';

declare var $: any;
declare var window: any;

@Component({
  selector: 'app-domestic-roundtrip',
  templateUrl: './domestic-roundtrip.component.html',
  styleUrls: ['./domestic-roundtrip.component.css']
})
export class DomesticRoundtripComponent implements OnInit {

  WebSiteData:any=[];
  GetSearchData: any=[];
  mySubscription: any;

  resultloading=true;
  Response: any=[];
  FilterResponse:any=[];
  filtertype:string | undefined;
  ErrorCode: number | undefined=0;
  ErrorMessage: string | undefined;
  SearchToken: string | undefined;
  UserIp:string | undefined;

  sortedData:any =[];

  filterresultcount:number| undefined;
  filterresultcountib:number| undefined;


  fareactiveshow:number=0;

  fareloading = false;

  userinfo:any={};

  fareshowlimit:any=3;
  resultlimit=10;

  FlightFareDetail:any=[];
  FareBreakdown:any=[];
  FlightBaggageInfo:any=[];
  fareRuleLoading=true;
  FareRuleErrorCode:any=[];
  FlightFareRule:any=[];
  FareRuleErrorMessage:any=[];
  showFareDetail=false;
  showTTsIndex:any | undefined;
  showFareRule=false;

  shownetfare=false;
  showincentivefare=false;

  formModal: any;
  formmodalemail: any;
  sharebuttontext='';
  shareviewdetail='';
  sharetype='';
  shareemaillist:any;
  shareselectedfareid:any;
  sharebuttonloding=false;

  selectedfareob:any=[];
  selectedfareib:any=[];

  clearfilter:any=false;
  clearfilterib:any=false;

  radiochecked:any=[];

  obreverse:any='asc';
  obfield:any='totalfare';
  ibreverse:any='asc';
  ibfield:any='totalfare';

  APISUPPLIERLIST:any=[];
  APILoading=true;
  AirlineLogoURL:any=tts_config['BASEURL']+'uploads/airline-images/';
  APISEARCHTOKENLIST:any=[];

  showFlightTab=['',''];

  Activestep:any='totalfare';
  RActivestep:any='totalfare';

  OBMaxIncentive:any=0;
  OBMinPrice:any=0;
  OBMinDuration:any='';

  IBMaxIncentive:any=0;
  IBMinPrice:any=0;
  IBMinDuration:any='';
 
  constructor(private flightService: FlightService,private router: Router, private route: ActivatedRoute,private serviceTitle: Title,private commonservice: CommonService,private authenticationservice: AuthenticationService,private alertservice:AlertService) {


    this.router.routeReuseStrategy.shouldReuseRoute = function () {
      return false;
    };

    this.mySubscription = this.router.events.subscribe((event) => {
      if (event instanceof NavigationEnd) {
        // Trick the Router into believing it's last link wasn't previously loaded
        this.router.navigated = false;
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
  
    sessionStorage.removeItem('time');
    sessionStorage.removeItem('FSUM');
    sessionStorage.removeItem('TSF');
    sessionStorage.removeItem('TSFP');
    sessionStorage.removeItem('TSFPAX');
    sessionStorage.removeItem('TAGM');

    this.SearchQueryList(this.GetSearchData);

    this.WebSiteData=this.commonservice.GetWebSiteData();
      this.authenticationservice.currentUser.subscribe(data => {
        if(data)
        {
            this.userinfo=data;
            this.shareemaillist= this.userinfo['EmailId'];
        }
      });

       this.windowscroll();

       this.formModal = new window.bootstrap.Modal(
        document.getElementById('formmodal')
      );
       this.formmodalemail = new window.bootstrap.Modal(
        document.getElementById('formmodal-email')
      );
  }

  ngOnDestroy() {
    if (this.mySubscription) {
      this.mySubscription.unsubscribe();
    }
  }


  SearchQueryList(val:any)
  {
    let data=this.flightService.GenerateSearchRequest(val,'');
    this.flightService.SearchQueryList(data).subscribe(resp => {
      let response:any=resp;
        if(response['Error']['ErrorCode']==0)
        {
          this.APISUPPLIERLIST=response['Result']['F'];
          this.GenerateRequest(this.GetSearchData);
        }
    });
  }


  GenerateRequest(val : any) {
    this.resultloading=true;
    this.filtertype="R";
    /*------------ Start Session ----------*/
    let initial_date = new Date;
    // remove 140 to 14 for 15 minute
    let added15Min = new Date(initial_date.getTime() + (14*60*1000));
    sessionStorage.setItem('time',JSON.stringify(added15Min));

    
    /*------------ End Session ----------*/
   
    let allapiobresponse:any= []; let allapiibresponse:any= []; let key=0;  this.ErrorCode = 0; let tempresponseob:any=[]; let tempresponseib:any=[];

    this.APISUPPLIERLIST.forEach((element:any) => {
      let data=this.flightService.GenerateSearchRequest(val,element);
      this.flightService.get_search(data).subscribe(resp => {
        let response:any=resp;
        if(response && response['Error']['ErrorCode']==0) {
          this.UserIp=response['UserIp'];
          this.APISEARCHTOKENLIST[element]=response['SearchTokenId'];
          
          this.resultloading=false;
          if(response['Result'][0])
          {
            response['Result'][0].forEach((item:any) => {
                if(tempresponseob[item['Key']])
                {
                  let update_fare=tempresponseob[item['Key']]['FareList'].concat(item['FareList']);
                  update_fare=update_fare.sort((a:any, b:any)=> a.PublishedPrice - b.PublishedPrice);
                  tempresponseob[item['Key']]['FareList']=update_fare;
                } else{
                  tempresponseob[item['Key']] =item;
                }
            });
          }
          if(response['Result'][1])
          {
            response['Result'][1].forEach((itemib:any) => {
              if(tempresponseib[itemib['Key']])
                {
                  let update_fare=tempresponseib[itemib['Key']]['FareList'].concat(itemib['FareList']);
                  update_fare=update_fare.sort((a:any, b:any)=> a.PublishedPrice - b.PublishedPrice);
                  tempresponseib[itemib['Key']]['FareList']=update_fare;
                } else{
                  tempresponseib[itemib['Key']] =itemib;
                }
            });
          }

          allapiobresponse=Object.values(tempresponseob);
          allapiibresponse=Object.values(tempresponseib);

          this.Response[0]=allapiobresponse;
          this.Response[1]=allapiibresponse;
  
          this.sortedData = this.Response.slice();
          this.filterresultcount=this.sortedData[0].length;
          this.filterresultcountib=this.sortedData[1].length;

        }
       
        if(key === this.APISUPPLIERLIST.length - 1) { 
          
            setTimeout(() => {
              this.APILoading=false;

              let finalmaxcommision:any=[];
              let finalminprice:any=[];
              let finalduration:any=[];

              let IBfinalmaxcommision:any=[];
              let IBfinalminprice:any=[];
              let IBfinalduration:any=[];

              allapiobresponse.forEach((element:any) => {
                let getpricelist:any=[];
                let getincentivelist:any=[];
                element['FareList'].forEach((value1:any) => {
                  getpricelist.push(value1['Fare']['PublishedPrice']);
                  getincentivelist.push(value1['Incentive']);
                });
                const min = getpricelist.reduce((a:any, b:any) => Math.min(a, b));
                const maxIncentive = getincentivelist.reduce((a:any, b:any) => Math.max(a, b));
                element['MinPublishedPrice']=min;
                element['MaxIncentive']=parseFloat(maxIncentive);

                finalmaxcommision.push(parseFloat(maxIncentive));
                finalminprice.push(parseFloat(min));
                finalduration.push(element['MainSegment'][0]['DurationMin']);
              });
              allapiobresponse=allapiobresponse.sort((a:any, b:any)=> a.MinPublishedPrice - b.MinPublishedPrice);

              if(finalmaxcommision.length!=0)
              {
                this.OBMaxIncentive=finalmaxcommision.reduce((a:any, b:any) => Math.max(a, b));
                this.OBMinPrice=finalminprice.reduce((a:any, b:any) => Math.min(a, b));
                this.OBMinDuration=finalduration.reduce((a:any, b:any) => Math.min(a, b));
              }


              allapiibresponse.forEach((element:any) => {
                let getpricelist:any=[];
                let getincentivelist:any=[];
                element['FareList'].forEach((value1:any) => {
                  getpricelist.push(value1['Fare']['PublishedPrice']);
                  getincentivelist.push(value1['Incentive']);
                });
                const min = getpricelist.reduce((a:any, b:any) => Math.min(a, b));
                const IBmaxIncentive = getincentivelist.reduce((a:any, b:any) => Math.max(a, b));
                element['MinPublishedPrice']=parseFloat(min);
                element['MaxIncentive']=parseFloat(IBmaxIncentive);

                IBfinalmaxcommision.push(parseFloat(IBmaxIncentive));
                IBfinalminprice.push(parseFloat(min));
                IBfinalduration.push(element['MainSegment'][0]['DurationMin']);

              });
              allapiibresponse=allapiibresponse.sort((a:any, b:any)=> a.MinPublishedPrice - b.MinPublishedPrice);
              if(IBfinalmaxcommision.length!=0)
              {
                this.IBMaxIncentive=IBfinalmaxcommision.reduce((a:any, b:any) => Math.max(a, b));
                this.IBMinPrice=IBfinalminprice.reduce((a:any, b:any) => Math.min(a, b));
                this.IBMinDuration=IBfinalduration.reduce((a:any, b:any) => Math.min(a, b));
              }

              this.Response[0]=allapiobresponse;
              this.Response[1]=allapiibresponse;
             
              this.sortedData = this.Response.slice();
              this.filterresultcount=this.sortedData[0].length;
              this.filterresultcountib=this.sortedData[1].length;

          

              if(this.Response[0].length!=0 && this.Response[1].length!=0)
              {
                this.ErrorCode = 0;
                this.ErrorMessage = '';

                  /*----------------- Start For Filter --------------------*/
                  this.FilterResponse.push(this.flightService.CreateFilterData(this.Response[0]));
                  this.FilterResponse.push(this.flightService.CreateFilterData(this.Response[1]));
                /*----------------- Start For Filter --------------------*/
 
             
 
               $(document).ready(function() {
                 $("body").tooltip({ selector: '[data-toggle=tooltip]' });
               });
               
             
               
               this.sortData({'active':this.obfield,'direction':'asc'},0);
               this.sortData({'active':this.ibfield,'direction':'asc'},1);
 
               if(this.sortedData[0][0])
               {
 
                this.selectedfareob={'TTSIndex':this.sortedData[0][0]['TtsIndex'],'fareindex':this.sortedData[0][0]['FareList'][0]['FareId'],'segment':this.sortedData[0][0]['MainSegment'][0],'fare':this.sortedData[0][0]['FareList'][0]['Fare']['PublishedPrice']};
                this.radiochecked[0]=this.sortedData[0][0]['FareList'][0]['FareId'];
               }
 
               if(this.sortedData[1][0])
               {
                 this.selectedfareib={'TTSIndex':this.sortedData[1][0]['TtsIndex'],'fareindex':this.sortedData[1][0]['FareList'][0]['FareId'],'segment':this.sortedData[1][0]['MainSegment'][0],'fare':this.sortedData[1][0]['FareList'][0]['Fare']['PublishedPrice']};
                 this.radiochecked[1]=this.sortedData[1][0]['FareList'][0]['FareId'];
               }
               
      
               
              } else {
                this.ErrorCode = 1;
                this.ErrorMessage = response['Error']['ErrorMessage'];
              }

             
            }, 300);
        }
      
        key++;
      });
  });


   

  }

  receiveMessage($event:any) {
    let key=$event.Jkey;
    if(key==0)
    {
      this.sortedData[0]=$event.response;
    }
    if(key==1)
    {
      this.sortedData[1]=$event.response;
    }
    this.filterresultcount=this.sortedData[0].length;
    this.filterresultcountib=this.sortedData[1].length;
    this.resultlimit=20;
    this.clearfilter=false;
    
  }

  receiveFare($event:any) {
    if($event.type=='incv')
    {
      this.showincentivefare=$event.val;
    }
    if($event.type=='net')
    {
      this.shownetfare=$event.val;
    }
  }



  MoreFare(event:any,ttsindex:any,jkey:any)
  { 
    event.target.classList.toggle("flight__dropdown__icon--selected");
    let limit = this.fareshowlimit;
    let uldata:any = document.querySelector('.farelist_' + ttsindex+jkey);
    for (var i = 0; i < uldata.children.length; ++i) {
        var item = uldata.children.item(i);
        if (i >= limit) {
            if (item.classList.contains('d-none')) {
                item.classList.remove('d-none');
            } else {
                item.classList.add('d-none');
            }
        }
    }
  }

  flightdetail(event:any,item:any,jkey:any)
  {    
    if(event.target.classList.contains('tts-minus'))
    {
      this.showFlightTab[jkey]='';
    } else {
      this.showFlightTab[jkey]=item['TtsIndex'];

      let ttsindex=item['TtsIndex'];

      let checkbox:any = document.getElementsByName('search_result_'+jkey);
      let selindex:any;
      for (var i = 0; i < checkbox.length; i++) {
          if (checkbox[i].checked) {
              selindex = checkbox[i].value;
          }
      }
      let flightInfo:any;
      if(selindex) {
         flightInfo =this.Response[jkey].filter(function(flightItem:any) {
                    return flightItem.TtsIndex == ttsindex;
            })[0];
  
      
       let farelistobj=flightInfo['FareList'].filter(function(item:any) {
              return item.FareId == selindex;
        })[0];
        if (typeof(farelistobj) != "undefined")
        {
          this.FlightFareDetail[jkey] = farelistobj;
          this.FlightBaggageInfo[jkey] = farelistobj['SeatBaggage'];
        } else {
          this.FlightFareDetail[jkey] = flightInfo['FareList'][0];
          this.FlightBaggageInfo[jkey] = flightInfo['FareList'][0]['SeatBaggage'];
        }
        
        let breakdown=[]
        if(this.FlightFareDetail[jkey]['FareBreakdown']['ADT'])
        {
          this.FlightFareDetail[jkey]['FareBreakdown']['ADT']['PaxType']='Adult';
          breakdown.push(this.FlightFareDetail[jkey]['FareBreakdown']['ADT']);
        }
        if(this.FlightFareDetail[jkey]['FareBreakdown']['CHD'])
        {
          this.FlightFareDetail[jkey]['FareBreakdown']['CHD']['PaxType']='Child';
          breakdown.push(this.FlightFareDetail[jkey]['FareBreakdown']['CHD']);
        }
        if(this.FlightFareDetail[jkey]['FareBreakdown']['INF'])
        {
          this.FlightFareDetail[jkey]['FareBreakdown']['INF']['PaxType']='Infant';
          breakdown.push(this.FlightFareDetail[jkey]['FareBreakdown']['INF']);
        }
        this.FareBreakdown[jkey]=breakdown;
      }

      this.showFareDetail=true;
      this.showTTsIndex=ttsindex;
      this.showFareRule=false;

    }
   
    
  }

  hideflightdetail(ttsindex:any,jkey:any)
  {
    this.showFlightTab[jkey]='';
    this.showFareDetail=false;
    this.showTTsIndex='';
  }

  FareOptionSelected(ttsindex:any,jkey:any)
  {
    let checkbox:any = document.getElementsByName('search_result_'+jkey);
    let selindex:any;
    for (var i = 0; i < checkbox.length; i++) {
        if (checkbox[i].checked) {
            selindex = checkbox[i].value;
        }
    }
    console.log(selindex);
    
  if(selindex) {
      let flightInfo =this.Response[jkey].filter(function(flightItem:any) {
                  return flightItem.TtsIndex == ttsindex;
          })[0];
    
      let farelistobj=flightInfo['FareList'].filter(function(item:any) {
            return item.FareId == selindex;
      })[0];
      this.FlightFareDetail[jkey] = farelistobj;
      this.FlightBaggageInfo[jkey] = farelistobj['SeatBaggage'];

      
      let breakdown=[]
      if(this.FlightFareDetail[jkey]['FareBreakdown']['ADT'])
      {
        this.FlightFareDetail[jkey]['FareBreakdown']['ADT']['PaxType']='Adult';
        breakdown.push(this.FlightFareDetail[jkey]['FareBreakdown']['ADT']);
      }
      if(this.FlightFareDetail[jkey]['FareBreakdown']['CHD'])
      {
        this.FlightFareDetail[jkey]['FareBreakdown']['CHD']['PaxType']='Child';
        breakdown.push(this.FlightFareDetail[jkey]['FareBreakdown']['CHD']);
      }
      if(this.FlightFareDetail[jkey]['FareBreakdown']['INF'])
      {
        this.FlightFareDetail[jkey]['FareBreakdown']['INF']['PaxType']='Infant';
        breakdown.push(this.FlightFareDetail[jkey]['FareBreakdown']['INF']);
      }
      this.FareBreakdown[jkey]=breakdown;

      if(jkey==0)
      {
        this.selectedfareob={'TTSIndex':ttsindex,'fareindex':farelistobj['FareId'],'segment':flightInfo['MainSegment'][0],'fare':this.FlightFareDetail[jkey]['Fare']['PublishedPrice']};

        this.radiochecked[0]=farelistobj['FareId'];
      }
      if(jkey==1)
      {
        this.selectedfareib={'TTSIndex':ttsindex,'fareindex':farelistobj['FareId'],'segment':flightInfo['MainSegment'][0],'fare':this.FlightFareDetail[jkey]['Fare']['PublishedPrice']};

        this.radiochecked[1]=farelistobj['FareId'];
      }
      
        for (let seats = 0; seats < this.FlightBaggageInfo[jkey].length; ++seats) {
          if(this.FlightBaggageInfo[jkey][seats][0].NoOfSeatAvailable)
          {
           
            $("#seat_left_"+ttsindex+seats+jkey).text(' Seats left:' +this.FlightBaggageInfo[jkey][seats][0].NoOfSeatAvailable);
          } else {
            $("#seat_left_"+ttsindex+seats+jkey).text('');
          }
        }

        $("#airline_remark_"+jkey+"_"+ttsindex).text('Airline Remark : ' +farelistobj['AirlineRemark']);

        let specialnotes='';
        if(farelistobj['SpecialNotes'])
          {
            farelistobj['SpecialNotes'].forEach((notes:any) => {
              specialnotes+='<span class="message-content d-block">* '+notes+'</span>';
            });
          }
        $("#special_notes_"+jkey+'_'+ttsindex).html(specialnotes);

        if(this.showFareRule)
        {
            this.farerule(ttsindex,jkey);
        }
    }

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

  paxtype(paxval:any)
  {
    let type;
    if(paxval==1)
    {
      type='Adult';
    } else if(paxval==2) {
      type='Child';
    } else if(paxval==3) {
      type='Infant';
    }
    return type;
  }

  confirmation()
  {



      let _this = this;
      let selectedfare:any=[]; let mainsegment:any=[];  let JMainSegment:any=[];
      this.Response[0].filter(function(flightItem:any) {
        if(flightItem.TtsIndex == _this.selectedfareob['TTSIndex'])
        {
          flightItem['FareList'].filter(function(fareItem:any) {
              if(fareItem['FareId']==_this.selectedfareob['fareindex'])
              {
                selectedfare=fareItem;
              }
          });

          flightItem['Segments'].forEach(function(mainsegvalue:any,mainsegkey:any) {
            let segment:any=[];
            mainsegvalue.forEach(function(segvalue:any,segkey:any) {
              segvalue['CheckInBaggage']=selectedfare['SeatBaggage'][mainsegkey][segkey]['CheckIn'];
              segvalue['CabinBaggage']=selectedfare['SeatBaggage'][mainsegkey][segkey]['Cabin'];
              segvalue['CabinClass']=selectedfare['CabinClass'];
              segment.push(segvalue);
            });
            mainsegment.push(segment);
          });

          flightItem['MainSegment'].forEach(function(value:any,key:any) {
              let obj={
                          'Duration'    : value['Duration'],
                          'DurationMin' : value['DurationMin'],
                          'ArrivalDays' : value['ArrivalDays'],
                      }
            JMainSegment.push(obj);
          });
        }
      });

      let selectedfareib:any=[]; let mainsegmentib:any=[];  let JMainSegmentib:any=[];
      this.Response[1].filter(function(flightItemib:any) {
        if(flightItemib.TtsIndex == _this.selectedfareib['TTSIndex'])
        {
          flightItemib['FareList'].filter(function(fareItem:any) {
              if(fareItem['FareId']==_this.selectedfareib['fareindex'])
              {
                selectedfareib=fareItem;
              }
          });

          flightItemib['Segments'].forEach(function(mainsegvalue:any,mainsegkey:any) {
            let segment:any=[];
            mainsegvalue.forEach(function(segvalue:any,segkey:any) {
              segvalue['CheckInBaggage']=selectedfareib['SeatBaggage'][mainsegkey][segkey]['CheckIn'];
              segvalue['CabinBaggage']=selectedfareib['SeatBaggage'][mainsegkey][segkey]['Cabin'];
              segvalue['CabinClass']=selectedfareib['CabinClass'];
              segment.push(segvalue);
            });
            mainsegmentib.push(segment);
          });

          flightItemib['MainSegment'].forEach(function(value:any,key:any) {
              let obj={
                          'Duration'    : value['Duration'],
                          'DurationMin' : value['DurationMin'],
                          'ArrivalDays' : value['ArrivalDays'],
                      }
            JMainSegmentib.push(obj);
          });
        }
      });

      let supplier = selectedfare['Supplier'];
      let stoken=this.APISEARCHTOKENLIST[supplier];
  
      let supplierib = selectedfareib['Supplier'];
      let stokenib=this.APISEARCHTOKENLIST[supplierib];


      let selectflight=[{  
                            'Segments'   : mainsegment,
                            'FareList'   : selectedfare,
                            'UserIp'     : this.UserIp,
                            'MainSegment': JMainSegment,
                            'SearchTokenId': stoken,
                        },
                        {  
                          'Segments'   : mainsegmentib,
                          'FareList'   : selectedfareib,
                          'UserIp'     : this.UserIp,
                          'MainSegment': JMainSegmentib,
                          'SearchTokenId': stokenib,
                        }
                      ];
    sessionStorage.setItem('TSF',JSON.stringify(selectflight));

   
    let data = {
      'stoken': stoken,
      'ibstoken': stokenib,
      'fareid': selectedfare['FareId'],
      'ibfareid': selectedfareib['FareId'],
     };

    const navigationExtras: NavigationExtras = {
      queryParams:data
    };
   this.router.navigate(['flight/itinerary'],navigationExtras);
  }

  farerule(ttsindex:any,jkey:any) {
    this.showFareRule=true;
    let checkbox:any = document.getElementsByName('search_result_'+jkey);
    let selindex:any;
    for (var i = 0; i < checkbox.length; i++) {
        if (checkbox[i].checked) {
            selindex = checkbox[i].value;
           
        }
    }
    if(selindex) {
        let flightInfo =this.Response[jkey].filter(function(flightItem:any) {
                    return flightItem.TtsIndex == ttsindex;
            })[0];
        let farelistobj=flightInfo['FareList'].filter(function(item:any) {
              return item.FareId == selindex;
        })[0];

        let rindex:any;
        if (typeof(farelistobj) != "undefined")
        {
          rindex = farelistobj['FareId'];
        } else {
          rindex = flightInfo['FareList'][0]['FareId'];
        }
      let supplier = farelistobj['Supplier'];
      this.SearchToken=this.APISEARCHTOKENLIST[supplier];
      
      let data = {
        'UserIp': this.UserIp,
        'SearchTokenId': this.SearchToken,
        'ResultIndex': rindex,
        'FareRuleId':farelistobj['FareRuleId']
      };
  
        this.flightService.fare_rule(data).subscribe(resp => {
          this.fareRuleLoading=false;
          let response:any=resp;
          this.FlightFareRule[jkey]=response['Result'];
          this.FareRuleErrorCode[jkey]=response['Error']['ErrorCode'];
          this.FareRuleErrorMessage[jkey]=response['Error']['ErrorMessage'];
      });

    }
  }

  Shareby(type:any)
  {
    this.sharetype=type;
    if(type=='Close')
    {
      this.sharebuttontext='';
    } else if(type=='Whatsapp'){
      this.sharebuttontext='Send';
    } else if(type=='Email'){
      this.sharebuttontext='Send';
    } else if(type=='View'){
      this.sharebuttontext='Open';
    }
  }

  SendData()
  {
    let selecteddata:any=[];
    let checkbox:any = document.getElementsByName('shareinput[]');
    let ln = 0;
    for (var i = 0; i < checkbox.length; i++) {
        if (checkbox[i].checked){
          ln++;
          selecteddata.push(checkbox[i].value);
        }
    }
    if (ln === 0) {
        alert("Select atleast 1 flight");
    } else {

        this.shareselectedfareid=selecteddata;
        
        let html:any='';
        let Whatsapphtml:any='';
        var _this=this;
        selecteddata.forEach(function(value:any,key:any) {
          let keys=value.split("_");
          _this.Response.filter(function(MainItem:any,mainkey:any) {
                MainItem.filter(function(flightItem:any) {

                  if(mainkey==keys[0] && flightItem.TtsIndex == keys[1])
                  {
                    let fare:any;
                    flightItem['FareList'].filter(function(fareItem:any) {
                        if(fareItem.FareId==keys[2])
                        {
                          fare='₹'+ _this.flightService.transformDecimal(fareItem['Fare']['PublishedPrice']);
                        }
                    });
                    flightItem['MainSegment'].filter(function(segItem:any,mainkey:any) {

                      if(flightItem['MainSegment'].length==mainkey+1)
                      {
                          
                      } else {
                        fare='';
                      }

                      html+='<p>'
                            + (key+1) +'. '+ segItem['AirlineName'] +' ('+ segItem['AirlineCodeFlightNumberString'] +') : <br/>'
                            + segItem['DepartureCity']+' - '+ segItem['ArrivalCity'] + ' on ' + segItem['DepartTime']+' '+  segItem['DepartDate']+ ' - ' + segItem['ArrivalTime']+' '+  segItem['ArrivalDate']+ ' Duration:'+ segItem['Duration']+', '+fare +'.'
                          '</p>';

                       Whatsapphtml+='*'+(key+1) +'. '+ segItem['AirlineName'] +' ('+ segItem['AirlineCodeFlightNumberString'] +') :* %0a'
                            + segItem['DepartureCity']+' - '+ segItem['ArrivalCity'] + ' on ' + segItem['DepartTime']+' '+  segItem['DepartDate']+ ' - ' + segItem['ArrivalTime']+' '+  segItem['ArrivalDate']+ ' Duration:'+ segItem['Duration']+', '+fare +'. %0a%0a';
                    });
                    
                  } 
             });
         });

        });

        this.shareviewdetail=html;

        if(this.sharetype=='Whatsapp')
        {
          this.goToLink('https://api.whatsapp.com/send?text='+Whatsapphtml+'');
        } else if(this.sharetype=='Email')
        {
          this.formmodalemail.show();

        } else if(this.sharetype=='View') {
          this.formModal.show();
        }

    }
  }

  goToLink(url: string){
    window.open(url, "_blank");
   }

   sendemail(type:any)
   {
     this.sharebuttonloding=true;
     let emaillist=this.shareemaillist.split(",");
     let data={
               'pricetype':type,
               'sharetype':this.sharetype,
               'emailid':emaillist,
               'selectedfareid':this.shareselectedfareid
              }
     this.flightService.send_itinerary(data).subscribe(resp => {
       let response:any=resp;
       this.sharebuttonloding=false;
       this.formmodalemail.hide();
       if(response['Error']['ErrorCode']==0)
       {
         this.alertservice.success(response['Error']['ErrorMessage']);
       } else {
         this.alertservice.error(response['Error']['ErrorMessage']);
       }
     });
   }

  resetfilterdata(jkey:any)
  {
    if(jkey==0)
    {
      this.clearfilter=true;
    }
    if(jkey==1)
    {
      this.clearfilterib=true;
    }
   
  }

  windowscroll()
  {
    var _this=this;
    $(window).scroll(function() {
        var windowHeight = "innerHeight" in window ? window.innerHeight: document.documentElement.offsetHeight;
				var body = document.body, html = document.documentElement;
				var docHeight = Math.max(body.scrollHeight,body.offsetHeight, html.clientHeight,html.scrollHeight, html.offsetHeight);
				var windowBottom = windowHeight + window.pageYOffset+1000;
				if (windowBottom >= docHeight) {
          _this.resultlimit=_this.resultlimit+20;	
        }
    });
  }

  orderby(field:any,jkey:any,event:any)
  {
      if(jkey==0)
      {
          this.obreverse = (this.obfield === field) ? !this.obreverse : true;
          this.obfield = field;
          let direction:any;
          if(this.obreverse)
          {
            direction='asc';
          } else {
            direction='desc';
          }
          let sort={
                      'active':this.obfield,
                      'direction':direction,
                   };
          this.sortData(sort,0);
      }
      if(jkey==1)
      {
        this.ibreverse = (this.ibfield === field) ? !this.ibreverse : true;
        this.ibfield = field;
        let ibdirection:any;
        if(this.ibreverse)
        {
          ibdirection='asc';
        } else {
          ibdirection='desc';
        }
        let ibsort={
                    'active':this.ibfield,
                    'direction':ibdirection,
                 };
        this.sortData(ibsort,1);
      }
  }

  sortData(sort: Sort,jkey:any) {
    //const data = this.Response[jkey].slice();
    const data = this.sortedData[jkey].slice();
    if (!sort.active || sort.direction === '') {
      this.sortedData[jkey] = data;
      return;
    }
    this.sortedData[jkey] = data.sort((a:any, b:any) => {
      const isAsc = sort.direction === 'asc';
      switch (sort.active) {
        case 'AirlineName': return compare(a.MainSegment[0].AirlineName, b.MainSegment[0].AirlineName, isAsc);
        case 'departtime': return compare(a.MainSegment[0].DepartTime, b.MainSegment[0].DepartTime, isAsc);
        case 'arrivaltime': return compare(a.MainSegment[0].ArrivalTime, b.MainSegment[0].ArrivalTime, isAsc);
        case 'duration': return compare(a.MainSegment[0].DurationMin, b.MainSegment[0].DurationMin, isAsc);
        case 'totalfare': return compare(a.MinPublishedPrice, b.MinPublishedPrice, isAsc);
        case 'commision': return compare(a.MaxIncentive, b.MaxIncentive, isAsc);
        default: return 0;
      }
    });
  }
  ActiveStep(data:any,index:any,dir:any='asc') {
    if(index==0){
      
      if(this.Activestep!=data)
      {
        this.Activestep=data;
          let sort={
            'active':data,
            'direction':dir,
          };
        this.sortData(sort,0);
      }
    }
    if(index==1){

      if(this.RActivestep!=data)
      {
        this.RActivestep=data;

        let sort={
          'active':data,
          'direction':dir,
        };
        this.sortData(sort,1);
      }
    }
    
  }
}




function compare(a: number | string, b: number | string, isAsc: boolean) {
  return (a < b ? -1 : 1) * (isAsc ? 1 : -1);
}