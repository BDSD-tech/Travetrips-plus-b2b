import { Component, HostListener, OnDestroy, OnInit } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { ActivatedRoute, NavigationEnd, NavigationExtras, Router } from '@angular/router';
import { CommonService } from '../../../services/common.service';
import { FlightService } from '../flight.service';
import { Sort } from '@angular/material/sort';
import { AuthenticationService } from '../../../services/authentication.service';
import { AlertService } from '../../../services/alert.service';
import { tts_config } from '../../../../environments/tts_config';
import { Subscription } from 'rxjs';

declare var $: any;
declare var window: any;
declare var bootstrap: any;

@Component({
  selector: 'app-search',
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.css']
})
export class SearchComponent implements OnInit, OnDestroy {

  routeSubscription!: Subscription;

  WebSiteData: any = [];
  GetSearchData: any = [];

  resultloading = true;
  Response: any = [];
  FilterResponse: any = [];
  filtertype: string | undefined;
  ErrorCode: number | undefined = 0;
  ErrorMessage: string | undefined;
  SearchToken: string | undefined;
  UserIp: string | undefined;

  sortedData: any = [];
  resultcount: number | undefined;
  filterresultcount: number | undefined;


  CalendorRespone: any = [];
  fareactiveshow: number = 0;
  fareloading = false;

  userinfo: any = {};

  fareshowlimit: any = 3;
  resultlimit = 20;

  FlightFareDetail: any | undefined;
  FareBreakdown: any = [];
  FlightBaggageInfo: any | undefined;
  fareRuleLoading = true;
  FareRuleErrorCode: any | undefined;
  FlightFareRule: any | undefined;
  fareruleerrormessage: any | undefined;
  showFareDetail = false;
  showTTsIndex: any | undefined;
  showFareRule = false;

  shownetfare = false;
  showincentivefare = false;

  formModal: any;
  formmodalemail: any;
  FareRuleModal: any;
  sharebuttontext = '';
  shareviewdetail = '';
  sharetype = '';
  shareemaillist: any;
  shareselectedfareid: any;
  sharebuttonloding = false;

  clearfilter: any = false;
  clearfilterib: any = false;

  obfield: any = 'totalfare';

  APISUPPLIERLIST: any = [];
  APILoading = true;
  AirlineLogoURL: any = tts_config['BASEURL'] + 'uploads/airline-images/';
  APISEARCHTOKENLIST: any = [];
  showFlightTab: any;

  Activestep: any = 'totalfare';

  MaxIncentive: any = 0;
  MinPrice: any = 0;
  MinDuration: any = '';
  fareupsellloading = false

  upSellData: any = []
  farelist: any = []
  FareupsellModal: any
  fareselectFight: any = []
  searchtockenFareupselll: any
  selectedfare: any = {}
  constructor(private flightService: FlightService, private router: Router, private route: ActivatedRoute, private serviceTitle: Title, private commonservice: CommonService, private authenticationservice: AuthenticationService, private alertservice: AlertService) {

    this.router.routeReuseStrategy.shouldReuseRoute = function () {
      return false;
    };

    this.routeSubscription = this.router.events.subscribe((event) => {
      if (event instanceof NavigationEnd) {
        // Trick the Router into believing it's last link wasn't previously loaded
        this.router.navigated = false;
      }
    });

    if (sessionStorage.getItem('FlightSearch')) {
      let flightsearch: any = sessionStorage.getItem('FlightSearch');
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


    this.FareupsellModal = new bootstrap.Modal(document.getElementById('fareupseelmodal'))
    this.SearchQueryList(this.GetSearchData);

    this.WebSiteData = this.commonservice.GetWebSiteData();
    this.authenticationservice.currentUser.subscribe(data => {
      if (data) {
        this.userinfo = data;
        this.shareemaillist = this.userinfo['EmailId'];
      }
    });

    setTimeout(() => {
      //this.windowscroll();
    }, 1000);

    this.FareRuleModal = new window.bootstrap.Modal(
      document.getElementById('farerule-modal')
    );
    this.formModal = new window.bootstrap.Modal(
      document.getElementById('formmodal')
    );
    this.formmodalemail = new window.bootstrap.Modal(
      document.getElementById('formmodal-email')
    );


  }

  ngOnDestroy() {
    if (this.routeSubscription) {
      this.routeSubscription.unsubscribe();
    }
  }

  SearchQueryList(val: any) {
    let data = this.flightService.GenerateSearchRequest(val, '');
    this.flightService.SearchQueryList(data).subscribe(resp => {
      let response: any = resp;
      if (response['Error']['ErrorCode'] == 0) {
        this.APISUPPLIERLIST = response['Result']['F'];
        this.GenerateRequest(this.GetSearchData);
      }
    });
  }


  async GenerateRequest(val: any) {
    this.resultloading = true;
    this.filtertype = "O";

    /*------------ Start Session ----------*/
    let initial_date = new Date;
    // remove 140 to 14 for 15 minute
    let added15Min = new Date(initial_date.getTime() + (14 * 60 * 1000));
    sessionStorage.setItem('time', JSON.stringify(added15Min));

    /*------------ End Session ----------*/

    let farecalendor = [];
    let currentdate = new Date().getTime();
    let day = this.flightService.datediff(val['DepartDate'], currentdate);
    for (let i = 0; i < day; i++) {
      if (i <= 3) {
        let myDate = new Date(new Date(val['DepartDate']).getTime() - (i * 24 * 60 * 60 * 1000));
        farecalendor.push(myDate.getTime());
      }
    }

    let c = 7 - farecalendor.length;
    for (let i = 1; i <= c; i++) {
      let myDate = new Date(new Date(val['DepartDate']).getTime() + (i * 24 * 60 * 60 * 1000));
      farecalendor.push(myDate.getTime());
    }
    farecalendor = farecalendor.sort();

    let convertfarecalendor: any = [];
    farecalendor.forEach(element => {
      let newdate = this.flightService.DefaultDateFormat(element); let active: any;
      if (val['DepartDate'] == newdate) {
        active = 'true';
      } else {
        active = 'false';
      }
      let obj = {
        'active': active,
        'date': newdate
      }
      convertfarecalendor.push(obj);
    });
    this.CalendorRespone = convertfarecalendor;


    let allapiresponse: any = []; let key = 0; this.ErrorCode = 0; let tempresponse: any = [];
    this.APISUPPLIERLIST.forEach((element: any) => {
      let data = this.flightService.GenerateSearchRequest(val, element);
      this.flightService.get_search(data).subscribe(resp => {
        this.filtertype = "O";
        let response: any = resp;
        if (response && response['Error']['ErrorCode'] == 0) {
          this.UserIp = response['UserIp'];
          this.APISEARCHTOKENLIST[element] = response['SearchTokenId'];

          this.resultloading = false;
          if (response['Result'][0]) {
            response['Result'][0].forEach((item: any) => {

              if (tempresponse[item['Key']]) {
                let update_fare = tempresponse[item['Key']]['FareList'].concat(item['FareList']);
                update_fare = update_fare.sort((a: any, b: any) => a.Fare.PublishedPrice - b.Fare.PublishedPrice);
                tempresponse[item['Key']]['FareList'] = update_fare;
              } else {
                tempresponse[item['Key']] = item;
              }
            });
          }

          allapiresponse = Object.values(tempresponse);

          this.Response = allapiresponse;
          this.resultcount = allapiresponse.length;
          this.sortedData = allapiresponse;
          this.sortedData.forEach((trip: any, key: any) => {
            if (trip.FareList?.length) {
              this.selectedfare[trip.TtsIndex] = trip.FareList.reduce(
                (cheapest: any, current: any) =>
                  current.Fare.OfferedPrice < cheapest.Fare.OfferedPrice
                    ? current
                    : cheapest
              );
            }
          });
          // console.log(this.selectedfare);
          
          this.filterresultcount = this.sortedData.length;

        }
        if (key === this.APISUPPLIERLIST.length - 1) {

          setTimeout(() => {
            this.APILoading = false;
            let finalmaxcommision: any = [];
            let finalminprice: any = [];
            let finalduration: any = [];
            allapiresponse.forEach((element: any) => {
              let getpricelist: any = [];
              let getincentivelist: any = [];
              element['FareList'].forEach((value1: any) => {
                getpricelist.push(value1['Fare']['PublishedPrice']);
                getincentivelist.push(value1['Incentive']);
              });
              const min = getpricelist.reduce((a: any, b: any) => Math.min(a, b));
              const maxIncentive = getincentivelist.reduce((a: any, b: any) => Math.max(a, b));
              element['MinPublishedPrice'] = parseFloat(min);
              element['MaxIncentive'] = parseFloat(maxIncentive);

              finalmaxcommision.push(parseFloat(maxIncentive));
              finalminprice.push(parseFloat(min));
              finalduration.push(element['MainSegment'][0]['DurationMin']);
            });

            allapiresponse = allapiresponse.sort((a: any, b: any) => a.MinPublishedPrice - b.MinPublishedPrice);

            if (finalmaxcommision.length != 0) {
              this.MaxIncentive = finalmaxcommision.reduce((a: any, b: any) => Math.max(a, b));
              this.MinPrice = finalminprice.reduce((a: any, b: any) => Math.min(a, b));
              this.MinDuration = finalduration.reduce((a: any, b: any) => Math.min(a, b));
            }

            this.Response = allapiresponse;
            this.resultcount = allapiresponse.length;
            this.sortedData = allapiresponse;
            this.sortedData.forEach((trip: any) => {
              if (trip.FareList?.length) {
                this.selectedfare[trip.TtsIndex] = trip.FareList.reduce(
                  (cheapest: any, current: any) =>
                    current.Fare.OfferedPrice < cheapest.Fare.OfferedPrice
                      ? current
                      : cheapest
                );
              }
            });

            this.filterresultcount = this.sortedData.length;
            if (this.Response.length != 0) {
              this.ErrorCode = 0;
              this.ErrorMessage = '';

              /*----------------- Start For Filter --------------------*/

              this.FilterResponse.push(this.flightService.CreateFilterData(this.Response));

              if (this.GetSearchData['Type'] == "R" && this.GetSearchData['Isdomestic'] == "false") {
                this.FilterResponse.push(this.flightService.intCreateFilterData(this.Response));
                //this.FilterResponse[0]['Stop1']=this.FilterResponse[0]['Stops'];
              }

              /*----------------- Start For Filter --------------------*/

              $(document).ready(function () {
                $("body").tooltip({ selector: '[data-toggle=tooltip]' });
              });
              this.topsort('totalfare', 'asc', '');

            } else {
              this.ErrorCode = 1;
              this.ErrorMessage = response['Error']['ErrorMessage'];
            }


          }, 200);
        }

        key++;
      });
    });
  }

  topsort(active: any, direction: any, _event: any) {
    let sort = {
      "active": active,
      "direction": direction
    };
    this.sortData(sort);
  }

  ActiveStep(data: any, dir: any = 'asc') {
    if (this.Activestep != data) {
      this.Activestep = data;
      this.topsort(data, dir, '');
    }

  }


  receiveMessage($event: any) {
    this.sortedData = $event.response;
    this.sortedData.forEach((trip: any) => {
      if (trip.FareList?.length) {
        this.selectedfare[trip.TtsIndex] = trip.FareList.reduce(
          (cheapest: any, current: any) =>
            current.Fare.OfferedPrice < cheapest.Fare.OfferedPrice
              ? current
              : cheapest
        );
      }
    });
    this.filterresultcount = this.sortedData.length;
    this.resultcount = this.filterresultcount;
    this.resultlimit = 20;
    this.clearfilter = false;


  }

  receiveFare($event: any) {
    if ($event.type == 'incv') {
      this.showincentivefare = $event.val;
    }
    if ($event.type == 'net') {
      this.shownetfare = $event.val;
    }

  }

  farecalendor_activedate(date: any, i: number) {

    let g1 = this.GetSearchData['DepartDate'];
    let g2 = this.flightService.DefaultDateFormat(date);
    if (g1 === g2) {
      this.fareactiveshow = i;
      return true;
    } else {
      return false;
    }
  }

  Farecalendorsearch(item: any) {
    this.GetSearchData['DepartDate'] = item;
    let data = []; let searchstring: any;
    data = this.GetSearchData;
    if (data['Type'] != 'M') {
      searchstring = {
        'from': data['OriginCode'],
        'to': data['DestinationCode'],
        'dep': data['DepartDate'].replaceAll(' ', '-'),
        'ADT': data['Adult'],
        'CHD': data['Child'],
        'INF': data['Infant'],
        'Isdomestic': data['Isdomestic'],
        'Class': data['Class'],
        'tripType': data['Type'],
      };
    } else {
      searchstring = {
        'from': data['MultiCity'][0]['OriginCode'],
        'to': data['MultiCity'][data['MultiCity'].length - 1]['DestinationCode'],
        'dep': data['MultiCity'][0]['DepartDate'].replaceAll(' ', '-'),
        'ADT': data['Adult'],
        'CHD': data['Child'],
        'INF': data['Infant'],
        'Isdomestic': data['Isdomestic'],
        'Class': data['Class'],
        'tripType': data['Type'],
      };
    }
    if (data['Type'] == 'R') {
      Object.assign(searchstring, { ret: data['ReturnDate'].replaceAll(' ', '-') });
    }

    const navigationExtras: NavigationExtras = {
      queryParams: searchstring
    };

    sessionStorage.setItem('FlightSearch', JSON.stringify(this.GetSearchData));

    if (this.GetSearchData['Isdomestic'] == "true" && this.GetSearchData['Type'] == "R") {
      this.router.navigate(['flight/rtsearch'], navigationExtras);
    } else {
      this.router.navigate(['flight/search'], navigationExtras);
    }
  }

  MoreFare(event: any, ttsindex: any) {
    const icon = event.currentTarget;
    icon.classList.toggle("flight__dropdown__icon--selected");
    let limit = this.fareshowlimit;
    let uldata: any = document.querySelector('.farelist_' + ttsindex);
    for (let i = 0; i < uldata.children.length; ++i) {
      let item = uldata.children.item(i);
      if (i >= limit) {
        item.classList.toggle('d-none');
      }
    }
  }

  flightdetail(_event: any, item: any) {
    if (_event.target.classList.contains('tts-minus')) {
      this.showFlightTab = '';
    } else {
      this.showFlightTab = item['TtsIndex'];

      let ttsindex = item['TtsIndex'];

      let checkbox: any = document.getElementsByName('search_result_' + ttsindex);
      let selindex: any;
      for (var i = 0; i < checkbox.length; i++) {
        if (checkbox[i].checked) {
          selindex = checkbox[i].value;
        }
      }
      if (selindex) {
        let flightInfo = this.Response.filter(function (flightItem: any) {
          return flightItem.TtsIndex == ttsindex;
        })[0];

        let farelistobj = flightInfo['FareList'].filter(function (item: any) {
          return item.FareId == selindex;
        })[0];
        this.FlightFareDetail = farelistobj;
        this.FlightBaggageInfo = farelistobj['SeatBaggage'];


        this.FareBreakdown = [];
        if (this.FlightFareDetail['FareBreakdown']['ADT']) {
          this.FlightFareDetail['FareBreakdown']['ADT']['PaxType'] = 'Adult';
          this.FareBreakdown.push(this.FlightFareDetail['FareBreakdown']['ADT']);
        }
        if (this.FlightFareDetail['FareBreakdown']['CHD']) {
          this.FlightFareDetail['FareBreakdown']['CHD']['PaxType'] = 'Child';
          this.FareBreakdown.push(this.FlightFareDetail['FareBreakdown']['CHD']);
        }
        if (this.FlightFareDetail['FareBreakdown']['INF']) {
          this.FlightFareDetail['FareBreakdown']['INF']['PaxType'] = 'Infant';
          this.FareBreakdown.push(this.FlightFareDetail['FareBreakdown']['INF']);
        }
      }

      this.showFareDetail = true;
      this.showTTsIndex = ttsindex;
      this.showFareRule = false;
    }

  }

  hideflightdetail(ttsindex: any) {
    this.showFlightTab = '';
    this.showFareDetail = false;
    this.showTTsIndex = '';
  }

  FareOptionSelected(ttsindex: any) {
    let checkbox: any = document.getElementsByName('search_result_' + ttsindex);
    let selindex: any;
    for (var i = 0; i < checkbox.length; i++) {
      if (checkbox[i].checked) {
        selindex = checkbox[i].value;
      }
    }

    if (selindex) {
      let flightInfo = this.Response.filter(function (flightItem: any) {
        return flightItem.TtsIndex == ttsindex;
      })[0];
      let farelistobj = flightInfo['FareList'].filter(function (item: any) {
        return item.FareId == selindex;
      })[0];
      this.selectedfare[ttsindex] = farelistobj;
      
      this.FlightFareDetail = farelistobj;
      this.FlightBaggageInfo = farelistobj['SeatBaggage'];
      this.FareBreakdown = [];
      if (this.FlightFareDetail['FareBreakdown']['ADT']) {
        this.FlightFareDetail['FareBreakdown']['ADT']['PaxType'] = 'Adult';
        this.FareBreakdown.push(this.FlightFareDetail['FareBreakdown']['ADT']);
      }
      if (this.FlightFareDetail['FareBreakdown']['CHD']) {
        this.FlightFareDetail['FareBreakdown']['CHD']['PaxType'] = 'Child';
        this.FareBreakdown.push(this.FlightFareDetail['FareBreakdown']['CHD']);
      }
      if (this.FlightFareDetail['FareBreakdown']['INF']) {
        this.FlightFareDetail['FareBreakdown']['INF']['PaxType'] = 'Infant';
        this.FareBreakdown.push(this.FlightFareDetail['FareBreakdown']['INF']);
      }


      for (let seats = 0; seats < this.FlightBaggageInfo.length; ++seats) {
        if (this.FlightBaggageInfo[seats][0].NoOfSeatAvailable) {
          $("#seat_left_" + ttsindex + seats).text(' Seats left:' + this.FlightBaggageInfo[seats][0].NoOfSeatAvailable);
        } else {
          $("#seat_left_" + ttsindex + seats).text('');
        }

      }


      $("#airline_remark_" + ttsindex).text('Airline Remark : ' + farelistobj['AirlineRemark']);

      let specialnotes = '';
      if (farelistobj['SpecialNotes']) {
        farelistobj['SpecialNotes'].forEach((notes: any) => {
          specialnotes += '<span class="message-content d-block">* ' + notes + '</span>';
        });
      }
      $("#special_notes_" + ttsindex).html(specialnotes);

      if (this.showFareRule) {
        this.farerule(ttsindex);
      }
    }

  }

  FTduration(n: number) {
    var num = n;
    var hours = (num / 60);
    var rhours = Math.floor(hours);
    var minutes = (hours - rhours) * 60;
    var rminutes = Math.round(minutes);
    return rhours + "h  " + rminutes + "m";
  }

  paxtype(paxval: any) {
    let type;
    if (paxval == 1) {
      type = 'Adult';
    } else if (paxval == 2) {
      type = 'Child';
    } else if (paxval == 3) {
      type = 'Infant';
    }
    return type;
  }

  confirmation(ttsindex: any) {
    let checkbox: any = document.getElementsByName('search_result_' + ttsindex);

    let selindex: any;
    for (var i = 0; i < checkbox.length; i++) {
      if (checkbox[i].checked) {
        selindex = checkbox[i].value;
      }
    }
    if (selindex) {
      let flightInfo = this.Response.filter(function (flightItem: any) {
        return flightItem.TtsIndex == ttsindex;
      })[0];
      let farelistobj = flightInfo['FareList'].filter(function (item: any) {
        return item.FareId == selindex;
      })[0];

      let MainSegment: any = []
      flightInfo['MainSegment'].forEach(function (value: any, _key: any) {
        let obj = {
          'Duration': value['Duration'],
          'DurationMin': value['DurationMin'],
          'ArrivalDays': value['ArrivalDays'],
        }
        MainSegment.push(obj);
      });
      let obmainsegment: any = [];
      flightInfo['Segments'].forEach(function (mainsegvalue: any, mainsegkey: any) {
        let segment: any = [];
        mainsegvalue.forEach(function (segvalue: any, segkey: any) {
          segvalue['CheckInBaggage'] = farelistobj['SeatBaggage'][mainsegkey][segkey]['CheckIn'];
          segvalue['CabinBaggage'] = farelistobj['SeatBaggage'][mainsegkey][segkey]['Cabin'];
          segvalue['CabinClass'] = farelistobj['CabinClass'];
          segment.push(segvalue);
        });
        obmainsegment.push(segment);
      });

      let selectflight = [{
        'Segments': obmainsegment,
        'FareList': farelistobj,
        'UserIp': this.UserIp,
        'MainSegment': MainSegment
      }];
      sessionStorage.setItem('TSF', JSON.stringify(selectflight));
      let supplier = farelistobj['Supplier'];
      this.SearchToken = this.APISEARCHTOKENLIST[supplier];
      let data = {
        'stoken': this.SearchToken,
        'fareid': farelistobj['FareId'],
      };
      const navigationExtras: NavigationExtras = {
        queryParams: data
      };
      this.router.navigate(['flight/traveller'], navigationExtras);
    }

  }
  confirmationMore(fare: any) {

    let farelistobj = fare
    let flightInfo: any = this.fareselectFight;
    let MainSegment: any = []
    flightInfo['MainSegment'].forEach(function (value: any, _key: any) {
      let obj = {
        'Duration': value['Duration'],
        'DurationMin': value['DurationMin'],
        'ArrivalDays': value['ArrivalDays'],
      }
      MainSegment.push(obj);
    });
    let obmainsegment: any = [];
    flightInfo['Segments'].forEach(function (mainsegvalue: any, mainsegkey: any) {
      let segment: any = [];
      mainsegvalue.forEach(function (segvalue: any, segkey: any) {
        segvalue['CheckInBaggage'] = farelistobj['SeatBaggage'][mainsegkey][segkey]['CheckIn'];
        segvalue['CabinBaggage'] = farelistobj['SeatBaggage'][mainsegkey][segkey]['Cabin'];
        segvalue['CabinClass'] = farelistobj['CabinClass'];
        segment.push(segvalue);
      });
      obmainsegment.push(segment);
    });

    let selectflight = [{
      'Segments': obmainsegment,
      'FareList': farelistobj,
      'UserIp': this.UserIp,
      'MainSegment': MainSegment
    }];
    sessionStorage.setItem('TSF', JSON.stringify(selectflight));
    this.SearchToken = this.searchtockenFareupselll;
    this.FareupsellModal.hide();
    let data = {
      'stoken': this.SearchToken,
      'fareid': farelistobj['FareId']
    };
    const navigationExtras: NavigationExtras = {
      queryParams: data
    };
    this.router.navigate(['flight/traveller'], navigationExtras);


  }

  OpenFareruleModal(ttsindex: any) {
    this.FlightFareRule = []
    this.FareRuleModal.show()
    this.farerule(ttsindex)
  }

  farerule(ttsindex: any) {

    this.fareRuleLoading = true;

    this.showFareRule = true;
    let checkbox: any = document.getElementsByName('search_result_' + ttsindex);
    let selindex: any;
    for (var i = 0; i < checkbox.length; i++) {
      if (checkbox[i].checked) {
        selindex = checkbox[i].value;
      }
    }
    if (selindex) {
      let flightInfo = this.Response.filter(function (flightItem: any) {
        return flightItem.TtsIndex == ttsindex;
      })[0];

      let farelistobj = flightInfo['FareList'].filter(function (item: any) {
        return item.FareId == selindex;
      })[0];
      let rindex = farelistobj['FareId'];
      let supplier = farelistobj['Supplier'];
      let FareRuleId = farelistobj['FareRuleId'];
      this.SearchToken = this.APISEARCHTOKENLIST[supplier];
      let data = {
        'UserIp': this.UserIp,
        'SearchTokenId': this.SearchToken,
        'FareRuleId': FareRuleId,
        'ResultIndex': rindex
      };
      this.fareRuleLoading = true;
      this.flightService.fare_rule(data).subscribe(resp => {
        this.fareRuleLoading = false;
        let response: any = resp;
        this.FlightFareRule = response['Result'];
        this.FareRuleErrorCode = response['Error']['ErrorCode'];
        this.fareruleerrormessage = response['Error']['ErrorMessage'];
      });

    }
  }


  Shareby(type: any) {
    this.sharetype = type;
    if (type == 'Close') {
      this.sharebuttontext = '';
    } else if (type == 'Whatsapp') {
      this.sharebuttontext = 'Send';
    } else if (type == 'Email') {
      this.sharebuttontext = 'Send';
    } else if (type == 'View') {
      this.sharebuttontext = 'Open';
    }
  }

  SendData() {
    let selecteddata: any = [];
    let checkbox: any = document.getElementsByName('shareinput[]');

    let ln = 0;
    for (var i = 0; i < checkbox.length; i++) {
      if (checkbox[i].checked) {
        ln++;
        selecteddata.push(checkbox[i].value);
      }
    }
    if (ln === 0) {
      alert("Select atleast 1 flight");
    } else {

      this.shareselectedfareid = selecteddata;

      let html: any = '';
      let Whatsapphtml: any = '';
      var _this = this;
      selecteddata.forEach(function (value: any, key: any) {
        let keys = value.split("_");
        _this.Response.filter(function (flightItem: any) {

          if (flightItem.TtsIndex == keys[1]) {
            let fare: any;
            flightItem['FareList'].filter(function (fareItem: any) {
              if (fareItem.FareId == keys[2]) {
                fare = '₹' + _this.flightService.transformDecimal(fareItem['Fare']['PublishedPrice']);
              }
            });
            flightItem['MainSegment'].filter(function (segItem: any, mainkey: any) {

              if (flightItem['MainSegment'].length == mainkey + 1) {

              } else {
                fare = '';
              }
              if (fare !== undefined) {
                html += '<p>'
                  + (key + 1) + '. ' + segItem['AirlineName'] + ' (' + segItem['AirlineCodeFlightNumberString'] + ') : <br/>'
                  + segItem['DepartureCity'] + ' - ' + segItem['ArrivalCity'] + ' on ' + segItem['DepartTime'] + ' ' + segItem['DepartDate'] + ' - ' + segItem['ArrivalTime'] + ' ' + segItem['ArrivalDate'] + ' Duration:' + segItem['Duration'] + ', ' + fare + '.'
                '</p>';

                Whatsapphtml += '*' + (key + 1) + '. ' + segItem['AirlineName'] + ' (' + segItem['AirlineCodeFlightNumberString'] + ') :* %0a'
                  + segItem['DepartureCity'] + ' - ' + segItem['ArrivalCity'] + ' on ' + segItem['DepartTime'] + ' ' + segItem['DepartDate'] + ' - ' + segItem['ArrivalTime'] + ' ' + segItem['ArrivalDate'] + ' Duration:' + segItem['Duration'] + ', ' + fare + '. %0a%0a';
              }
            });

          }
        });

      });

      this.shareviewdetail = html;
      if (this.sharetype == 'Whatsapp') {
        this.goToLink('https://api.whatsapp.com/send?text=' + Whatsapphtml + '');

      } else if (this.sharetype == 'Email') {
        this.formmodalemail.show();

      } else if (this.sharetype == 'View') {
        this.formModal.show();
      }

    }
  }

  goToLink(url: string) {
    window.open(url, "_blank");
  }

  sendemail(type: any) {
    this.sharebuttonloding = true;
    let emaillist = this.shareemaillist.split(",");
    let data = {
      'pricetype': type,
      'sharetype': this.sharetype,
      'emailid': emaillist,
      'selectedfareid': this.shareselectedfareid
    }
    this.flightService.send_itinerary(data).subscribe(resp => {
      let response: any = resp;
      this.sharebuttonloding = false;
      this.formmodalemail.hide();
      if (response['Error']['ErrorCode'] == 0) {
        this.alertservice.success(response['Error']['ErrorMessage']);
      } else {
        this.alertservice.error(response['Error']['ErrorMessage']);
      }
    });
  }

  resetfilterdata() {
    this.clearfilter = true;
  }

  getfaretype(faretype: any) {
    return faretype.replace(/\s+/g, '-').toLowerCase();
  }


  //  @HostListener('window:scroll', [])
  //   onScroll(): void {
  //     const windowHeight = window.innerHeight;
  //     const scrollPosition = window.scrollY;
  //     const documentHeight = document.documentElement.scrollHeight;
  //     // Check bottom reach (adjust 800 as per your need)
  //     if (windowHeight + scrollPosition + 800 >= documentHeight) {
  //       this.resultlimit += 20;
  //       console.log("Increasing limit = ", this.resultlimit);
  //     }
  //   }
  // windowscroll(event:any)
  // {
  //   // console.log(event);

  //   //   const element = event.target;
  //   //    const atBottom =
  //   //   element.scrollHeight - element.scrollTop <= element.clientHeight + 1;
  //   //   if (atBottom) {
  //   //     this.resultlimit += 20;

  //   //   }
  //   var _this=this;
  //   $(window).scroll(function() {
  //       var windowHeight = "innerHeight" in window ? window.innerHeight: document.documentElement.offsetHeight;
  // 			var body = document.body, html = document.documentElement;
  // 			var docHeight = Math.max(body.scrollHeight,body.offsetHeight, html.clientHeight,html.scrollHeight, html.offsetHeight);
  // 			var windowBottom = windowHeight + window.pageYOffset+800;
  // 			if (windowBottom >= docHeight) {
  //         _this.resultlimit=_this.resultlimit+20;	
  //       }
  //   });
  // }

  sortData(sort: Sort) {
    //const data = this.Response.slice();
    const data = this.sortedData.slice();
    if (!sort.active || sort.direction === '') {
      this.sortedData = data;
      return;
    }
    this.obfield = sort.active;
    this.sortedData = data.sort((a: any, b: any) => {
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


  FareUpSell(flight: any) {
    this.upSellData = []
    this.farelist = []
    let ResultIndex: any = this.selectedfare[flight['TtsIndex']];
    this.fareselectFight = flight;
    this.searchtockenFareupselll = this.APISEARCHTOKENLIST[ResultIndex['Supplier']]
    let req = { "SearchTokenId": this.APISEARCHTOKENLIST[ResultIndex['Supplier']], "ResultIndex": ResultIndex['FareId'], "FareRuleId": ResultIndex['FareRuleId'] }
    this.fareupsellloading = true
    this.FareupsellModal.show()
    this.flightService.fare_up_sell(req).subscribe((response: any) => {
      this.fareupsellloading = false;
      if (response['Error']['ErrorCode'] === 0) {
        this.upSellData = response['Result']['upSellMakingData'];
        this.farelist = response['Result']['FareList'];
      } else {
        this.FareupsellModal.hide()
        this.alertservice.error(response['Error']['ErrorMessage'])
      }
    });


  }

  getSectorKeys() {
    return Object.keys(this.upSellData);
  }

  getFeatureKeysForSector(sector: string): string[] {
    return this.upSellData[sector] ? Object.keys(this.upSellData[sector]) : [];
  }
}

function compare(a: number | string, b: number | string, isAsc: boolean) {
  return (a < b ? -1 : 1) * (isAsc ? 1 : -1);
}

function min(input: any) {
  if (toString.call(input) !== "[object Array]")
    return false;
  return Math.min.apply(null, input);
}