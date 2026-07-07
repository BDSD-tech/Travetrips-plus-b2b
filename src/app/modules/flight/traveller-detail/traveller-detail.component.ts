import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router, ActivatedRoute, NavigationExtras } from '@angular/router';
import { AuthenticationService } from '../../../services/authentication.service';
import { CommonService } from '../../../services/common.service';
import { FlightService } from '../flight.service';
import { Location } from '@angular/common';
import { AlertService } from '../../../services/alert.service';
import { MatAutocompleteSelectedEvent } from '@angular/material/autocomplete';
import { tts_config } from '../../../../environments/tts_config';


declare var $: any;
declare var bootstrap: any;
declare var window: any;

@Component({
  selector: 'app-traveller-detail',
  templateUrl: './traveller-detail.component.html',
  styleUrls: ['./traveller-detail.component.css']
})
export class TravellerDetailComponent implements OnInit {
  AllResponse: any = []

  SessionTime: any;

  Response: any = [];

  WebSiteData: any = [];
  GetSearchData: any = [];
  SearchTokenId: any;
  SearchTokenIdIB: any = '';

  param: any = [];
  CurrentFare: any = {};
  isshowmarkup: any = false;
  markupvalue = 0;

  isGSTShow = false;
  Gstsubmitted = false;
  GSTForm: FormGroup;
  GSTTxt = 'Optional';

  showadtdob = false;
  showchddob = true;
  showinfdob = true;

  infdob = false
  childdob = true
  Adltdob = true


  FlightForm!: FormGroup;
  submitted = false;
  loading = true;
  paxloading = false;

  IsPANMandatory = false;
  IsPassportMandatory = false;

  Dialcode: any = [];

  IsFFDiv: boolean | undefined;
  ExpandAll: any = true;

  IsDomestic: any | undefined;

  gstlist: any = [];

  travellerlist: any = [];
  SSRDetail: any = []

  // For baggage by Pradeep 

  baggageSubmit = false
  SSRData: any = []
  SSRTotal = 0
  @ViewChild('gsteInput') gsteInput!: ElementRef<HTMLInputElement>;

  lccFlight: any | boolean;

  maintainOrder = () => 0;

  SegmentData: any = []
  AllTSFPRESP: any = {}


  seatData: any = [];
  seatactivetab: any = 0;
  tootipstyle: any = {};
  clickedseat: any = {};
  travellerJson: any = [];
  paxseatselected: any = [];

  paxseatob = [];
  paxseatib = [];
  obseatprice = 0;
  ibseatprice = 0

  objectKeys = Object.keys;


  BaggegeC: any = []
  BaggegeA: any = []

  FinalSSRdata: any = {}
  SeatJson: any = {}
  ssrshow = false;
  DocumentTitle: any = ''
  DocumentMendatory: any = false;
  DocumentIssueDate: any = false;
  DocumentExpiryDate = false;

  InsuranceDetail: any = [];
  SelectedInsurance: any = {};
  SelectedIns: any = ''
  SelectedInsib: any = ''
  allpaxCount: any | number
  InsurancePrice = 0;
  KnowmoreData: any = []
  TermandCondition: any
  inSUranceDetailmodal: any
  TermConditionModal: any

  fareloading = false
  FareList: any = [];
  ssr_Request: any = {}
  FareBrekdown: any = {}

  modaldata: any = [];
  formModal: any;
  isconfimation = false;
  Segments: any = [];

  oldprice: any = 0;
  AirlineLogoURL: any = tts_config['BASEURL'] + 'uploads/airline-images/';

  MainSegments: any = [];
  UserIp: any;

  showReviewpage = false;

  Showmeal: any = '';


  fareRuleLoading = false;
  FlightFareRule: any = [];
  FareRuleErrorCode: any;
  FareRuleErrorMessage: any;

  FareRuleModal: any
  constructor(private flightService: FlightService, private router: Router, private route: ActivatedRoute, private commonservice: CommonService, private fb: FormBuilder, private authenticationservice: AuthenticationService, private location: Location, private alertservice: AlertService) {
    this.route.queryParams.subscribe(params => {
      if (params) {
        this.param = params;
      } else {
        this.router.navigate(['/']);
      }
    });

    if (sessionStorage.getItem('FlightSearch')) {
      let flightsearch: any = sessionStorage.getItem('FlightSearch');

      this.GetSearchData = JSON.parse(flightsearch);
      this.allpaxCount = this.GetSearchData['Adult'] + this.GetSearchData['Child'] + this.GetSearchData['Infant']

      this.IsDomestic = this.GetSearchData['Isdomestic']
    } else {
      this.router.navigate(['/']);
    }

    this.GSTForm = fb.group({
      GSTNumber: ['', [Validators.required]],
      CompanyName: ['', [Validators.required]],
      Email: ['', [Validators.required, Validators.email]],
      Address: ['', [Validators.required]],
      ISDCode: ['91', [Validators.required]],
      PhoneNumber: ['', [Validators.required, Validators.minLength(10), Validators.maxLength(15), Validators.pattern('[0-9]+')]],
      SaveGST: [''],
    });


    //Start:: baggage dynamic form by Pradeep 
    for (let i = 0; i < this.GetSearchData['Adult']; i++) {
      this.BaggegeA.push(i)
    }
    for (let i = 0; i < this.GetSearchData['Child']; i++) {
      this.BaggegeC.push(i)
    }
    //End:: baggage dynamic form by Pradeep

  }

  GetPhonecodeVal(event: Event): void {
    const value = (event.target as HTMLSelectElement).value;
    const phoneControl = this.FlightForm.get('MobileNumber');

    if (!phoneControl) return;

    if (value === '91') {
      phoneControl.setValidators([
        Validators.required,
        Validators.minLength(10),
        Validators.maxLength(15),
        Validators.pattern(/^[0-9]+$/)
      ]);
    } else {
      phoneControl.setValidators([
        Validators.required
      ]);
    }

    phoneControl.updateValueAndValidity();
  }

  ngOnInit(): void {

    this.inSUranceDetailmodal = new bootstrap.Modal(document.getElementById('insurancedetailmodal'));
    this.TermConditionModal = new bootstrap.Modal(document.getElementById('term&condition'));
    this.FareRuleModal = new bootstrap.Modal(document.getElementById('fare-rule-modal'));

    if (sessionStorage.getItem('time')) {
      let time: any = sessionStorage.getItem('time');
      this.SessionTime = JSON.parse(time);
    }

    this.formModal = new window.bootstrap.Modal(
      document.getElementById('pricemodel')
    );
    if (sessionStorage.getItem('TSF')) {
      let TSF: any = sessionStorage.getItem('TSF');
      let resp = JSON.parse(TSF);
      let Segment: any = []; let farelist: any = []; let mainsegments: any = []; let oldprice = 0;
      resp.forEach(function (value: any, key: any) {
        Segment.push(value['Segments']);
        farelist.push(value['FareList']);
        mainsegments.push(value['MainSegment']);
        oldprice += value['FareList']['Fare']['PublishedPrice'];
      });
      this.MainSegments = mainsegments;
      this.Segments = Segment;


      this.FareList = farelist;
      this.oldprice = oldprice;
      this.UserIp = resp[0]['UserIp'];
      if (sessionStorage.getItem('Response')) {
        let data: any = sessionStorage.getItem('Response');
        this.AllResponse = JSON.parse(data);
        this.fareloading = true;
        this.SetStoredData(this.AllResponse)
      } else {
        this.FareConfirmation();
      }

    } else {
      this.router.navigate(['flight']);
    }
    // if (sessionStorage.getItem('TSFP')) {



    //   if (resp['ssrresp'].length !== 0) {
    //     this.SSRDetail = resp['ssrresp']
    //     this.CreateSSRData(resp);
    //     this.seatData = resp['ssrresp']['SeatData'];
    //     this.travellerJson = resp['ssrresp']['SeatPaxData'];

    //     setTimeout(() => {
    //       this.CreateSeatJson()
    //     }, 100);
    //   }

    this.SearchTokenId = this.param['stoken'];
    if (this.param['ibstoken']) {
      this.SearchTokenIdIB = this.param['ibstoken'];
    }
    // if (sessionStorage.getItem('TAGM')) {
    //   let markup: any = sessionStorage.getItem('TAGM');
    //   this.markupvalue = parseFloat(markup);
    //   this.CurrentFare['AgentMarkup'] = this.markupvalue;
    // }

    // Added By Pradeep*********************
    if (!this.CurrentFare['SSR']) {
      this.CurrentFare['SSR'] = {}
    }
    this.CurrentFare['SSR']['Meal'] = 0
    this.CurrentFare['SSR']['Baggage'] = 0
    this.CurrentFare['SSR']['Seat'] = 0

    //   let obpanrequired: boolean | undefined;
    //   let ibpanrequired: boolean | undefined;

    //   let obpassportrequired: boolean | undefined;
    //   let ibpassportrequired: boolean | undefined;

    //   let obgstrequired: boolean | undefined;
    //   let ibgstrequired: boolean | undefined;

    //   let obislcc: boolean | undefined;
    //   let ibislcc: boolean | undefined;

    //   let obisadtdob: boolean | undefined;
    //   let ibisadtdob: boolean | undefined;

    //   let obischddob: boolean | undefined;
    //   let ibischddob: boolean | undefined;

    //   let obisinfdob: boolean | undefined;
    //   let ibisinfdob: boolean | undefined;
    //   this.Response.forEach(function (value: any, key: any) {

    //     if (key == 0) {

    //       if (value['IsGSTMandatory']) {
    //         obgstrequired = value['IsGSTMandatory'];
    //       }

    //       if (value['IsPanRequiredAtBook']) {
    //         obpanrequired = value['IsPanRequiredAtBook'];

    //       } else if (value['IsPanRequiredAtTicket']) {
    //         obpanrequired = value['IsPanRequiredAtTicket'];
    //       }
    //       if (value['IsPassportRequiredAtBook']) {
    //         obpassportrequired = value['IsPassportRequiredAtBook'];

    //       } else if (value['IsPassportRequiredAtTicket']) {
    //         obpassportrequired = value['IsPassportRequiredAtTicket'];
    //       }

    //       if (value['IsLCC']) {
    //         obislcc = true;
    //       } else {
    //         obislcc = false;
    //       }

    //       if (value['IsADTDOBRequired']) {
    //         obisadtdob = true;
    //       } else {
    //         obisadtdob = false;
    //       }
    //       if (value['IsCHDDOBRequired']) {
    //         obischddob = true;
    //       } else {
    //         obischddob = false;
    //       }
    //       if (value['IsINFTDOBRequired']) {
    //         obisinfdob = true;
    //       } else {
    //         obisinfdob = false;
    //       }

    //     } else if (key == 1) {
    //       if (value['IsGSTMandatory']) {
    //         ibgstrequired = value['IsGSTMandatory'];
    //       }

    //       if (value['IsPanRequiredAtBook']) {
    //         ibpanrequired = value['IsPanRequiredAtBook'];

    //       } else if (value['IsPanRequiredAtTicket']) {
    //         ibpanrequired = value['IsPanRequiredAtTicket'];
    //       }
    //       if (value['IsPassportRequiredAtBook']) {
    //         ibpassportrequired = value['IsPassportRequiredAtBook'];

    //       } else if (value['IsPassportRequiredAtTicket']) {
    //         ibpassportrequired = value['IsPassportRequiredAtTicket'];
    //       }

    //       if (value['IsLCC']) {
    //         ibislcc = true;
    //       } else {
    //         ibislcc = false;
    //       }

    //       if (value['IsADTDOBRequired']) {
    //         ibisadtdob = true;
    //       } else {
    //         ibisadtdob = false;
    //       }
    //       if (value['IsCHDDOBRequired']) {
    //         ibischddob = true;
    //       } else {
    //         ibischddob = false;
    //       }
    //       if (value['IsINFTDOBRequired']) {
    //         ibisinfdob = true;
    //       } else {
    //         ibisinfdob = false;
    //       }
    //     }

    //   });

    //   if (obgstrequired || ibgstrequired) {
    //     this.isGSTShow = true;
    //     this.GSTTxt = 'Required';
    //   } else {
    //     this.isGSTShow = false;
    //     this.GSTTxt = 'Optional';
    //   }

    //   if (obpanrequired || ibpanrequired) {
    //     this.IsPANMandatory = true;
    //   } else {
    //     this.IsPANMandatory = false;
    //   }

    //   if (obpassportrequired || ibpassportrequired) {
    //     this.IsPassportMandatory = true;
    //   } else {
    //     this.IsPassportMandatory = false;
    //   }

    //   if (obislcc || ibislcc) {
    //     this.IsFFDiv = true;
    //   } else {
    //     this.IsFFDiv = false;
    //   }

    //   if (obisadtdob || ibisadtdob) {
    //     this.showadtdob = true;
    //     this.Adltdob=true
    //   } else {
    //     this.showadtdob = false;
    //     this.Adltdob=false
    //   }
    //   if (obischddob || ibischddob) {
    //     this.showchddob = true;
    //     this.childdob=true
    //   } else {
    //     this.showchddob = false;
    //     this.childdob=false
    //   }
    //   if (obisinfdob || ibisinfdob) {
    //     this.showinfdob = true;
    //     this.infdob=true
    //   } else {
    //     this.showinfdob = false;
    //      this.infdob=false
    //   }

    //   setTimeout(() => {
    //     this.PassportIssueDate();
    //     this.DocExpiryDate();
    //     this.DocumentDate();
    //     this.PassportExpiryDate();
    //     this.ADTDOBDate();
    //     this.CHDDOBDate();
    //     this.INFDOBDate();
    //   }, 50);
    // } else {
    //   this.router.navigate(['flight']);
    // }

    //this.GeneratePax();




    this.GetDialCode();
    if (sessionStorage.getItem('TSFPAX')) {
      let TSFPAX: any = sessionStorage.getItem('TSFPAX');
      let resp = JSON.parse(TSFPAX);
      this.FlightForm.patchValue({
        'Adult': resp['paxdata']['Adult'],
        'Child': resp['paxdata']['Child'],
        'Infant': resp['paxdata']['Infant'],
        'ISDCode': resp['ISDCode'],
        'MobileNumber': resp['MobileNumber'],
        'EmailId': resp['EmailId'],
      });
      this.GSTForm.patchValue(resp['gstdata']);
      this.CalculateSSrPrice()
    }
    this.GetInsuranceData();

  }
  FTduration(n: number) {
    var num = n;
    var hours = (num / 60);
    var rhours = Math.floor(hours);
    var minutes = (hours - rhours) * 60;
    var rminutes = Math.round(minutes);
    return rhours + "h  " + rminutes + "m";
  }
  FareConfirmation() {
    this.fareloading = true;
    let data = {
      'SearchTokenId': this.param['stoken'],
      'ResultIndex': this.param['fareid'],
      'FareRuleId': this.FareList[0]['FareRuleId']
    };

    if (this.param['ibfareid']) {
      Object.assign(data, { ResultIndexIB: this.param['ibfareid'], SearchTokenIdIB: this.param['ibstoken'], FareRuleId: this.FareList[1]['FareRuleId'] });
    }


    this.ssr_Request = data
    this.flightService.fare_confimation(data).subscribe(data => {

      this.isconfimation = true;
      let response: any = data;
      this.AllResponse = data;
      this.SearchTokenId = response['stoken'];

      // if (resp['param']['ibstoken']) {
      //   this.SearchTokenIdIB = resp['param']['ibstoken'];
      // }
      if (response['Error']['ErrorCode'] == 0) {
        this.Response = response['Result'];
        this.AddRequiredFields()
        this.DocumentMendatory = this.Response[0]['IsDocumentIdMandatory'];
        this.DocumentIssueDate = this.Response[0]['IsDocumentIssueDateMandatory'];
        this.DocumentExpiryDate = this.Response[0]['IsDocumentExpiryDateMandatory'];
        this.DocumentTitle = this.Response[0]['DocumentType'];
        this.SegmentData = this.Response[0]['Segments']
        this.lccFlight = this.Response[0]['IsLCC']
        this.get_ssr()
        this.markupvalue = response['TotalMarkup'];
        let markup: any = this.markupvalue;
        sessionStorage.setItem('TAGM', markup);

        let Segment: any = [];
        let BaseFare = 0; let Tax = 0; let YQTax = 0; let OtherCharges = 0; let Discount = 0; let PublishedPrice = 0; let OfferedPrice = 0; let AgentCommission = 0; let ServiceCharges = 0; let TDS = 0; let CGSTAmount = 0; let CGSTRate = 0; let IGSTAmount = 0; let IGSTRate = 0; let SGSTAmount = 0; let SGSTRate = 0; let TaxableAmount = 0;

        let adltpaxcount = 0; let adltbasefare = 0; let adlttax = 0; let adltyqtax = 0; let adltservicecharge = 0;
        let childpaxcount = 0; let childbasefare = 0; let childtax = 0; let childyqtax = 0; let childservicecharge = 0;
        let infpaxcount = 0; let infbasefare = 0; let inftax = 0; let infyqtax = 0; let infservicecharge = 0;

        response['Result'].forEach(function (value: any, key: any) {
          Segment.push(value['Segments']);

          BaseFare += value['Fare']['BaseFare'];
          Tax += value['Fare']['Tax'];
          YQTax += value['Fare']['YQTax'];
          OtherCharges += value['Fare']['OtherCharges'];
          Discount += value['Fare']['Discount'];
          PublishedPrice += value['Fare']['PublishedPrice'];
          OfferedPrice += value['Fare']['OfferedPrice'];
          AgentCommission += value['Fare']['AgentCommission'];
          ServiceCharges += value['Fare']['ServiceCharges'];
          TDS += value['Fare']['TDS'];
          CGSTAmount += value['Fare']['GST']['CGSTAmount'];
          CGSTRate += value['Fare']['GST']['CGSTRate'];
          IGSTAmount += value['Fare']['GST']['IGSTAmount'];
          IGSTRate += value['Fare']['GST']['IGSTRate'];
          SGSTAmount += value['Fare']['GST']['SGSTAmount'];
          SGSTRate += value['Fare']['GST']['SGSTRate'];
          TaxableAmount += value['Fare']['GST']['TaxableAmount'];
          if (value['FareBreakdown']['ADT']) {
            adltpaxcount = value['FareBreakdown']['ADT']['PassengerCount']
            adltbasefare += value['FareBreakdown']['ADT']['BaseFare']
            adlttax += value['FareBreakdown']['ADT']['Tax']
            adltyqtax += value['FareBreakdown']['ADT']['YQTax']
            adltservicecharge += value['FareBreakdown']['ADT']['ServiceCharges']
          }
          if (value['FareBreakdown']['CHD']) {
            childpaxcount = value['FareBreakdown']['CHD']['PassengerCount']
            childbasefare += value['FareBreakdown']['CHD']['BaseFare']
            childtax += value['FareBreakdown']['CHD']['Tax']
            childyqtax += value['FareBreakdown']['CHD']['YQTax']
            childservicecharge += value['FareBreakdown']['CHD']['ServiceCharges']
          }
          if (value['FareBreakdown']['INF']) {
            infpaxcount = value['FareBreakdown']['INF']['PassengerCount']
            infbasefare += value['FareBreakdown']['INF']['BaseFare']
            inftax += value['FareBreakdown']['INF']['Tax']
            infyqtax += value['FareBreakdown']['INF']['YQTax']
            infservicecharge += value['FareBreakdown']['INF']['ServiceCharges']
          }
        });

        this.Segments = Segment;
        //  this.MainSegments=response['MainSegment'];
        this.FareBrekdown['Adult'] = {
          'BaseFare': adltbasefare,
          "PaxCount": adltpaxcount,
          "Tax": adlttax,
          "YQTax": adltyqtax,
          "ServiceCharge": adltservicecharge,
        }
        this.FareBrekdown['Child'] = {
          'BaseFare': childbasefare,
          "PaxCount": childpaxcount,
          "Tax": childtax,
          "YQTax": childyqtax,
          "ServiceCharge": childservicecharge,
        }
        this.FareBrekdown['Infant'] = {
          'BaseFare': infbasefare,
          "PaxCount": infpaxcount,
          "Tax": inftax,
          "YQTax": infyqtax,
          "ServiceCharge": infservicecharge,
        }
        this.CurrentFare['BaseFare'] = BaseFare;
        this.CurrentFare['Tax'] = Tax;
        this.CurrentFare['YQTax'] = YQTax;
        this.CurrentFare['OtherCharges'] = OtherCharges;
        this.CurrentFare['Discount'] = Discount;
        this.CurrentFare['PublishedPrice'] = PublishedPrice;
        this.CurrentFare['OfferedPrice'] = OfferedPrice;
        this.CurrentFare['AgentCommission'] = AgentCommission;
        this.CurrentFare['ServiceCharges'] = ServiceCharges;
        this.CurrentFare['TDS'] = TDS;
        this.CurrentFare['AgentMarkup'] = this.markupvalue;
        this.CurrentFare['GST'] = {
          'CGSTAmount': CGSTAmount,
          'CGSTRate': CGSTRate,
          'IGSTAmount': IGSTAmount,
          'IGSTRate': IGSTRate,
          'SGSTAmount': SGSTAmount,
          'SGSTRate': SGSTRate,
          'TaxableAmount': TaxableAmount
        };
        if (response['IsPriceChanged']) {
          let newprice = this.CurrentFare['PublishedPrice'] + this.CurrentFare['AgentMarkup'];
          let pricetxt = '<div class="col-lg-12 text-center">'
            + '<table class="table">'
            + '<tbody class="border">'
            + '<tr>'
            + '<td>Old Fare was-</td>'
            + '<td>₹ ' + this.flightService.transformDecimal(this.oldprice) + ' </td>'
            + '</tr>'
            + '<tr>'
            + '<td> New Fare is -</td>'
            + '<td class="text-danger">₹ ' + this.flightService.transformDecimal(newprice) + '</td>'
            + '</tr>'
            + '</table>'
            + '</div>';

          this.modaldata['head'] = 'Fare have changed';
          this.modaldata['message'] = pricetxt;
          this.modaldata['type'] = '';

          this.formModal.show();
        }
      } else {

        this.formModal.show();
        this.modaldata['head'] = 'Fare Error';
        this.modaldata['message'] = response['Error']['ErrorMessage'];
        this.modaldata['type'] = 'FC';
      }

    });



  }


  ShowSSR(type: any) {
    if (this.Showmeal == type) {
      this.Showmeal = '';
    } else {
      this.Showmeal = type;
    }
  }
  AddRequiredFields() {
    let obpanrequired: boolean = false;
    let ibpanrequired: boolean = false;

    let obpassportrequired: boolean = false;
    let ibpassportrequired: boolean = false;

    let obgstrequired: boolean = false;
    let ibgstrequired: boolean = false;

    let obislcc: boolean = false;
    let ibislcc: boolean = false;

    let obisadtdob: boolean = false;
    let ibisadtdob: boolean = false;

    let obischddob: boolean = false;
    let ibischddob: boolean = false;

    let obisinfdob: boolean = false;
    let ibisinfdob: boolean = false;
    this.Response.forEach(function (value: any, key: any) {

      if (key == 0) {

        if (value['IsGSTMandatory']) {
          obgstrequired = value['IsGSTMandatory'];
        }

        if (value['IsPanRequiredAtBook']) {
          obpanrequired = value['IsPanRequiredAtBook'];

        } else if (value['IsPanRequiredAtTicket']) {
          obpanrequired = value['IsPanRequiredAtTicket'];
        }
        if (value['IsPassportRequiredAtBook']) {
          obpassportrequired = value['IsPassportRequiredAtBook'];

        } else if (value['IsPassportRequiredAtTicket']) {
          obpassportrequired = value['IsPassportRequiredAtTicket'];
        }

        if (value['IsLCC']) {
          obislcc = true;
        } else {
          obislcc = false;
        }

        if (value['IsADTDOBRequired']) {
          obisadtdob = true;
        } else {
          obisadtdob = false;
        }
        if (value['IsCHDDOBRequired']) {
          obischddob = true;
        } else {
          obischddob = false;
        }
        if (value['IsINFTDOBRequired']) {
          obisinfdob = true;
        } else {
          obisinfdob = false;
        }

      } else if (key == 1) {
        if (value['IsGSTMandatory']) {
          ibgstrequired = value['IsGSTMandatory'];
        }

        if (value['IsPanRequiredAtBook']) {
          ibpanrequired = value['IsPanRequiredAtBook'];

        } else if (value['IsPanRequiredAtTicket']) {
          ibpanrequired = value['IsPanRequiredAtTicket'];
        }
        if (value['IsPassportRequiredAtBook']) {
          ibpassportrequired = value['IsPassportRequiredAtBook'];

        } else if (value['IsPassportRequiredAtTicket']) {
          ibpassportrequired = value['IsPassportRequiredAtTicket'];
        }
        if (value['IsLCC']) {
          ibislcc = true;
        } else {
          ibislcc = false;
        }

        if (value['IsADTDOBRequired']) {
          ibisadtdob = true;
        } else {
          ibisadtdob = false;
        }
        if (value['IsCHDDOBRequired']) {
          ibischddob = true;
        } else {
          ibischddob = false;
        }
        if (value['IsINFTDOBRequired']) {
          ibisinfdob = true;
        } else {
          ibisinfdob = false;
        }
      }

    });
    if (obgstrequired || ibgstrequired) {
      this.isGSTShow = true;
      this.GSTTxt = 'Required';
    } else {
      this.isGSTShow = false;
      this.GSTTxt = 'Optional';
    }

    if (obpanrequired || ibpanrequired) {
      this.IsPANMandatory = true;
    } else {
      this.IsPANMandatory = false;
    }

    if (obpassportrequired || ibpassportrequired) {
      this.IsPassportMandatory = true;
    } else {
      this.IsPassportMandatory = false;
    }
    if (obislcc || ibislcc) {
      this.IsFFDiv = true;
    } else {
      this.IsFFDiv = false;
    }

    if (obisadtdob || ibisadtdob) {
      this.showadtdob = true;
      this.Adltdob = true
    } else {
      this.showadtdob = false;
      this.Adltdob = false
    }
    if (obischddob || ibischddob) {
      this.showchddob = true;
      this.childdob = true
    } else {
      this.showchddob = false;
      this.childdob = false
    }
    if (obisinfdob || ibisinfdob) {
      this.showinfdob = true;
      this.infdob = true
    } else {
      this.showinfdob = false;
      this.infdob = false
    }




    this.GeneratePax();
  }



  get_ssr() {
    let req = this.ssr_Request
    this.flightService.ssr_info(req).subscribe((ssrresp: any) => {
      this.fareloading = false;
      setTimeout(() => {
        this.PassportIssueDate();
        this.DocExpiryDate();
        this.DocumentDate();
        this.PassportExpiryDate();
        this.ADTDOBDate();
        this.CHDDOBDate();
        this.INFDOBDate();
      }, 100);
      if (ssrresp['Error']['ErrorCode'] == 0) {
        this.SSRDetail = ssrresp['Result'];
        this.SSRDetail = ssrresp['Result']
        this.CreateSSRData(this.SSRDetail);
        this.seatData = this.SSRDetail['SeatData'];
        this.travellerJson = this.SSRDetail['SeatPaxData'];

        setTimeout(() => {
          this.CreateSeatJson()
        }, 100);

      }
    })

  }

  GetInsuranceData() {
    this.flightService.insurance_info(null).subscribe((resp: any) => {
      if (resp['Error']['ErrorCode'] == 0) {
        this.InsuranceDetail = resp['Result'];
      }
    })
  }

  AddInsurance(item: any, type: any) {

    if (type == 'onward') {

      let key = this.GetSearchData['OriginCode'] + '-' + this.GetSearchData['DestinationCode'];
      if (this.SelectedInsurance?.[key]?.['policy_resultindex'] == item['ResultIndex']) {
        delete this.SelectedInsurance[key]
        this.SelectedIns = ''

      } else {
        this.SelectedInsurance[key] = {}
        this.SelectedInsurance[key]['type'] = type
        this.SelectedInsurance[key]['searchtoken'] = this.SearchTokenId;
        this.SelectedInsurance[key]['policy_resultindex'] = item['ResultIndex'];
        this.SelectedInsurance[key]['price'] = item['Fare']['PublishedPrice'];
        this.SelectedIns = item['ResultIndex']
      }

    } else if (type == 'return') {
      let key = this.GetSearchData['DestinationCode'] + '-' + this.GetSearchData['OriginCode']
      if (this.SelectedInsurance?.[key]?.['policy_resultindex'] == item['ResultIndex']) {
        delete this.SelectedInsurance[key]
        this.SelectedInsib = ''

      } else {
        this.SelectedInsurance[key] = {}
        this.SelectedInsurance[key]['type'] = type
        this.SelectedInsurance[key]['searchtoken'] = this.SearchTokenId;
        this.SelectedInsurance[key]['policy_resultindex'] = item['ResultIndex'];
        this.SelectedInsurance[key]['price'] = item['Fare']['PublishedPrice'];
        this.SelectedInsib = item['ResultIndex']
      }
    }
    this.calculateInsurancePrice();

  }


  clearSeat() {

    let adult: any = this.FlightForm.get('Adult')?.value
    let child: any = this.FlightForm.get('Child')?.value
    adult.forEach((pax: any) => {
      pax.Seat = []
    });
    child.forEach((pax: any) => {
      pax.Seat = []
    });
    this.travellerJson.forEach((pax: any, key: any) => {
      Object.keys(pax).forEach((paxtype: any) => {
        Object.keys(this.travellerJson[key][paxtype]).forEach((paxkey: any) => {
          Object.keys(this.travellerJson[key][paxtype][paxkey]).forEach((sector: any) => {
            this.travellerJson[key][paxtype][paxkey][sector] = []
          });
        });
      });
    });

    Object.keys(this.paxseatselected).forEach((sec: any) => {
      this.paxseatselected[sec] = []
    });
    this.CalculateSSrPrice()
  }


  calculateInsurancePrice() {
    if (Object.keys(this.SelectedInsurance).length !== 0) {
      this.showadtdob = true;
      this.showchddob = true;
      this.showinfdob = true;
      this.addValidators(true)
      setTimeout(() => {
        this.ADTDOBDate();
        this.CHDDOBDate();
        this.INFDOBDate();
      }, 100);
    } else {
      this.addValidators(false)
      this.showadtdob = this.Adltdob;
      this.showchddob = this.childdob;
      this.showinfdob = this.infdob;
    }
    let total = 0
    Object.keys(this.SelectedInsurance).forEach((element: any) => {
      total += this.SelectedInsurance[element]['price']
    });
    this.CurrentFare['InsurancePrice'] = total * this.allpaxCount;
    this.InsurancePrice = total * this.allpaxCount
  }
  addValidators(tag: any) {
    let Adult = this.FlightForm.get('Adult')?.value;
    let Child = this.FlightForm.get('Child')?.value;
    let Infant = this.FlightForm.get('Infant')?.value;

    if (tag == true) {
      for (let i = 0; i < Adult.length; i++) {
        this.FlightForm.get('Adult.' + i + '.DOB')?.setValidators([Validators.required,])
        this.FlightForm.get('Adult.' + i + '.DOB')?.updateValueAndValidity();
      }
      for (let i = 0; i < Child.length; i++) {
        this.FlightForm.get('Child.' + i + '.DOB')?.setValidators([Validators.required,])
        this.FlightForm.get('Child.' + i + '.DOB')?.updateValueAndValidity();
      }
      for (let i = 0; i < Infant.length; i++) {
        this.FlightForm.get('Infant.' + i + '.DOB')?.setValidators([Validators.required,])
        this.FlightForm.get('Infant.' + i + '.DOB')?.updateValueAndValidity();
      }
    } else {
      if (this.Adltdob) {
        for (let i = 0; i < Adult.length; i++) {
          this.FlightForm.get('Adult.' + i + '.DOB')?.setValidators([Validators.required,])
          this.FlightForm.get('Adult.' + i + '.DOB')?.updateValueAndValidity();
        }
      } else {
        for (let i = 0; i < Adult.length; i++) {
          this.FlightForm.get('Adult.' + i + '.DOB')?.setValidators(null)
          this.FlightForm.get('Adult.' + i + '.DOB')?.updateValueAndValidity();
        }
      }
      if (this.childdob) {
        for (let i = 0; i < Child.length; i++) {
          this.FlightForm.get('Child.' + i + '.DOB')?.setValidators([Validators.required,])
          this.FlightForm.get('Child.' + i + '.DOB')?.updateValueAndValidity();
        }
      } else {
        for (let i = 0; i < Child.length; i++) {
          this.FlightForm.get('Child.' + i + '.DOB')?.setValidators(null)
          this.FlightForm.get('Child.' + i + '.DOB')?.updateValueAndValidity();
        }
      }
      if (this.infdob) {
        for (let i = 0; i < Infant.length; i++) {
          this.FlightForm.get('Infant.' + i + '.DOB')?.setValidators([Validators.required,])
          this.FlightForm.get('Infant.' + i + '.DOB')?.updateValueAndValidity();
        }
      } else {
        for (let i = 0; i < Infant.length; i++) {
          this.FlightForm.get('Infant.' + i + '.DOB')?.setValidators(null)
          this.FlightForm.get('Infant.' + i + '.DOB')?.updateValueAndValidity();
        }
      }
    }
  }
  OpenModal(data: any, type: any) {
    if (type == 'KnowMore') {
      this.KnowmoreData = data['CoverageDetails']
      this.inSUranceDetailmodal.show();

    } else {
      if (data['PlanDescription']) {
        this.TermandCondition = data['PlanDescription']
        this.TermConditionModal.show()
      } else {
        this.alertservice.error('there are no have any term and conditions')
      }

    }


  }


  CreateSeatJson() {
    let seatjson: any = {}
    this.travellerJson.forEach((element: any, tripkey: any) => {
      Object.keys(element).forEach((paxtype: any) => {
        if (!seatjson[paxtype]) {
          seatjson[paxtype] = []
        }
        Object.entries(this.travellerJson[tripkey][paxtype]).forEach(([key, value], paxkey: any) => {
          if (!seatjson[paxtype][paxkey]) {
            seatjson[paxtype][paxkey] = []
          }
          if (!seatjson[paxtype][paxkey][tripkey]) {
            seatjson[paxtype][paxkey][tripkey] = {}
          }
          seatjson[paxtype][paxkey][tripkey] = value
        });
      })
    });
    this.SeatJson = seatjson
  }
  removeCityCode(city: string): string {
    return city.replace(/\(.*\)/, ''); // This will remove any part inside parentheses
  }
  GeneratePax() {
    let arradt = [];
    let arrchd = [];
    let arrinf = [];
    for (let a = 0; a < this.GetSearchData['Adult']; a++) {
      arradt.push(this.BuildFormPaxDynamic('Adult'));
    }
    for (let c = 0; c < this.GetSearchData['Child']; c++) {
      arrchd.push(this.BuildFormPaxDynamic('Child'));
    }
    for (let i = 0; i < this.GetSearchData['Infant']; i++) {
      arrinf.push(this.BuildFormPaxDynamic('Infant'));
    }

    this.FlightForm = this.fb.group({
      EmailId: ['', [Validators.required, Validators.email]],
      ISDCode: ['91', [Validators.required]],
      MobileNumber: ['', [Validators.required, Validators.minLength(10), Validators.maxLength(15), Validators.pattern('[0-9]+')]],
      Adult: this.fb.array(arradt),
      Child: this.fb.array(arrchd),
      Infant: this.fb.array(arrinf),
    });
    this.loading = false;
    this.authenticationservice.currentUser.subscribe(data => {
      if (data) {
        this.FlightForm.patchValue({ 'EmailId': data['EmailId'], 'MobileNumber': data['MobileNo'] });
      }
    });
  }

  BuildFormPaxDynamic(paxtype: any) {

    let passportval;
    let passportissueval;
    let passportexpiryval;
    let pan;
    let doc;
    let docIssue;
    let docExpiry
    let title
    if (this.IsPassportMandatory) {
      passportval = [Validators.required];
      passportissueval = [Validators.required];
      passportexpiryval = [Validators.required];
    }
    let airlinecode: any = this.Response[0]['Segments'][0][0]['Airline']['AirlineCode'];

    let dob;
    if (paxtype == "Adult") {
      if (this.showadtdob) {
        dob = [Validators.required];
      }
    }
    if (paxtype == "Child") {
      if (this.showchddob) {
        dob = [Validators.required];
      }
    }
    if (paxtype == "Infant") {
      if (this.showinfdob) {
        dob = [Validators.required];
      }
    }

    if (this.IsPANMandatory) {
      pan = [Validators.required, Validators.pattern('[A-Z]{5}[0-9]{4}[A-Z]{1}')];
    }
    if (this.DocumentMendatory) {
      doc = [Validators.required]
    }
    if (this.DocumentExpiryDate) {
      docExpiry = [Validators.required]
    }
    if (this.DocumentIssueDate) {
      docIssue = [Validators.required]
    }
    if (this.GetSearchData['Isdomestic'] !== 'false') {
      title = [Validators.required]
    }

    return this.fb.group({
      Title: ['', title],
      FirstName: ['', [Validators.required, Validators.pattern('[a-zA-Z /\s/g]+'), Validators.minLength(2)]],
      LastName: ['', [Validators.required, Validators.pattern('[a-zA-Z /\s/g]+'), Validators.minLength(2)]],
      DOB: ['', dob],
      Nationality: ['', passportval],
      PassportNo: ['', passportval],
      PassportIssue: ['', passportissueval],
      PassportExpiry: ['', passportexpiryval],
      PassportIssueCountry: [''],
      DocumentNumber: ['', doc],
      DocumentIssueDate: ['', docIssue],
      DocumentExpireDate: ['', docExpiry],
      PAN: ['', pan],
      FFAirline: [airlinecode],
      FFNumber: [''],
      Baggage: [''],
      Meal: [''],
      Seat: [''],
      SavePax: [''],
    });

  }

  showmarkup() {
    this.isshowmarkup = !this.isshowmarkup;
  }

  updatemarkup() {
    this.CurrentFare['AgentMarkup'] = this.markupvalue;
    let markup: any = this.markupvalue;
    sessionStorage.setItem('TAGM', markup);
    this.showmarkup();
  }

  goBack() {
    this.formModal.hide();
    window.close();
  }

  get fadt() {
    return this.FlightForm.controls['Adult'] as FormArray;
  }
  get fchd() {
    return this.FlightForm.controls['Child'] as FormArray;
  }

  get finf() {
    return this.FlightForm.controls['Infant'] as FormArray;
  }

  get f() { return this.GSTForm.controls; }




  //Start ::Pradeep'Code form *****************************************************************************************************************


  CreateSSRData(resp: any) {
    let ssrAPiMeal: any = resp['Meal']
    let ssrAPibag: any = resp['Baggage']
    let SSRData: any = []
    if (this.IsDomestic === "true") {
      ssrAPiMeal.forEach((element: any, dkey: any) => {
        element.forEach((element: any, ikey: any) => {
          let segmentDetail: any = {}
          Object.entries(element).forEach(([segment, value]) => {
            if (!segmentDetail[segment]) {
              segmentDetail[segment] = []
            }
            if (!segmentDetail[segment]['Meal']) {
              segmentDetail[segment]['Meal'] = []
            }
            segmentDetail[segment]['Meal'] = value
          });
          SSRData[dkey] = segmentDetail
        });
      });
      ssrAPibag.forEach((element: any, trip: any) => {
        element.forEach((element: any, tripkey: any) => {
          Object.entries(element).forEach(([key, value]) => {
            if (!SSRData[trip][key]['Baggage']) {
              SSRData[trip][key]['Baggage'] = []
            }
            SSRData[trip][key]['Baggage'] = value;
          });

        });
      });
    } else {
      ssrAPiMeal.forEach((element: any, dkey: any) => {
        element.forEach((element: any, ikey: any) => {
          let segmentDetail: any = {}
          Object.entries(element).forEach(([segment, value]) => {
            if (!segmentDetail[segment]) {
              segmentDetail[segment] = []
            }
            if (!segmentDetail[segment]['Meal']) {
              segmentDetail[segment]['Meal'] = []
            }
            segmentDetail[segment]['Meal'] = value
          });
          SSRData[ikey] = segmentDetail
        });
      });
      ssrAPibag.forEach((element: any, trip: any) => {
        element.forEach((element: any, tripkey: any) => {
          Object.entries(element).forEach(([key, value]) => {

            if (!SSRData[tripkey][key]['Baggage']) {
              SSRData[tripkey][key]['Baggage'] = []
            }
            SSRData[tripkey][key]['Baggage'] = value;
          });

        });
      });
    }
    this.SSRData = SSRData;
    setTimeout(() => {
      this.ssrshow = true
    }, 100);
  }


  getSegment(val: any) {
    const [originCode, destinationCode] = val.split('-');

    for (const trip1 of this.Response) {
      for (const trip of trip1['Segments']) {
        for (const segment of trip) {
          if (segment.Origin.AirportCode === originCode && segment.Destination.AirportCode === destinationCode) {
            let data: any = {
              Date: segment.Origin.DepartTime,
              Origin: segment.Origin.CityName,
              Destination: segment.Destination.CityName,
            }
            return data;
          }
        }
      }
    }
    return '';
  }

  getSegmentValues(value: any, type: any) {
    let val: any = value[type]
    return Array.isArray(val) ? val : [];
  }

  SelectSSr(paxtype: any, paxkey: any, segment: any, type: any, data: any, t1key: any) {
    let val = data.target.value;
    let selectseg: any = ''
    let arra: any = this.SSRData[t1key][segment][type]
    let selecteddata: any = {}
    arra.forEach((element: any) => {
      if (element['Code'] == val) {
        selecteddata = element
        selectseg = element['Origin'] + '-' + element['Destination'];
      }
    });

    if (!this.FinalSSRdata[paxtype]) {
      this.FinalSSRdata[paxtype] = []
    }

    if (!this.FinalSSRdata[paxtype][paxkey]) {
      this.FinalSSRdata[paxtype][paxkey] = {}
    }
    if (!this.FinalSSRdata[paxtype][paxkey][type]) {
      this.FinalSSRdata[paxtype][paxkey][type] = []
    }
    if (!this.FinalSSRdata[paxtype][paxkey][type][t1key]) {
      this.FinalSSRdata[paxtype][paxkey][type][t1key] = []
    }


    if (this.FinalSSRdata[paxtype][paxkey][type][t1key].length !== 0) {


      let updated = false;

      this.FinalSSRdata[paxtype][paxkey][type][t1key].forEach((element: any, index: number) => {
        let arraseg = element['Origin'] + '-' + element['Destination'];
        let selectseg = selecteddata['Origin'] + '-' + selecteddata['Destination'];

        if (arraseg === selectseg) {

          this.FinalSSRdata[paxtype][paxkey][type][t1key][index] = selecteddata;
          updated = true;
        }
      });

      if (!updated) {
        this.FinalSSRdata[paxtype][paxkey][type][t1key].push(selecteddata);
      }

    } else {

      this.FinalSSRdata[paxtype][paxkey][type][t1key].push(selecteddata);
    }

    this.FlightForm.get(paxtype + '.' + paxkey + '.' + type)?.patchValue(this.FinalSSRdata[paxtype][paxkey][type]);
    this.CalculateSSrPrice();

  }


  CalculateSSrPrice() {

    let Adults = this.FlightForm.get('Adult')?.value
    let Childs = this.FlightForm.get('Child')?.value
    let meal: any = 0
    let baggage: any = 0
    let seat: any = 0
    Adults.forEach((element: any, paxkey: any) => {

      if (element['Meal']) {
        element['Meal'].forEach((segment: any) => {
          segment.forEach((value: any) => {
            meal += parseFloat(value.Price) || 0
          });
        });
      }
      if (element['Baggage']) {
        element['Baggage'].forEach((segment: any) => {
          segment.forEach((value: any) => {
            baggage += parseFloat(value.Price) || 0
          });
        });
      }
      if (element['Seat']) {
        element['Seat'].forEach((segment: any) => {
          Object.values(segment).forEach((data: any) => {
            seat += parseFloat(data.Price) || 0
          })
        });
      }
    });

    Childs.forEach((element: any, paxkey: any) => {
      if (element['Meal']) {
        element['Meal'].forEach((segment: any) => {
          segment.forEach((value: any) => {
            meal += parseFloat(value.Price) || 0
          });
        });
      }
      if (element['Baggage']) {
        element['Baggage'].forEach((segment: any) => {
          segment.forEach((value: any) => {
            baggage += parseFloat(value.Price) || 0
          });
        });
      }
      if (element['Seat']) {
        element['Seat'].forEach((segment: any) => {
          Object.values(segment).forEach((data: any) => {
            seat += parseFloat(data.Price) || 0
          })
        });
      }
    });
    this.CurrentFare['SSR']['Meal'] = meal;
    this.CurrentFare['SSR']['Baggage'] = baggage;
    this.CurrentFare['SSR']['Seat'] = seat;

  }

  // End:: Pradeep's Code Here*********************************************************************************************************************


  SubmitPax() {

    this.AllTSFPRESP['param'] = this.param;
    this.AllTSFPRESP['response'] = this.AllResponse;
    this.AllTSFPRESP['fare'] = this.CurrentFare;
    this.AllTSFPRESP['fare']['SSR'] = this.CurrentFare['SSR'];
    if (!this.AllTSFPRESP['fare']['SSR']) {
      this.AllTSFPRESP['fare']['SSR'] = {}
      this.AllTSFPRESP['fare']['SSR']['Meal'] = 0
      this.AllTSFPRESP['fare']['SSR']['Baggage'] = 0
      this.AllTSFPRESP['fare']['SSR']['Seat'] = 0
    }
    if (this.isGSTShow) {
      this.submitted = true;
      this.Gstsubmitted = true;

      if (this.GSTForm.invalid || this.FlightForm.invalid) {
        return;
      }
      this.SavepaxInfo();
    } else {
      this.submitted = true;
      if (this.FlightForm.invalid) {
        return;
      }
      this.SavepaxInfo();
    }
  }

  SavepaxInfo() {
    this.CurrentFare['InsurancePrice'] = this.InsurancePrice
    let savedata: any = {};
    savedata['gstdata'] = this.GSTForm.value;
    savedata['SearchTokenId'] = this.param['stoken'];
    if (this.param['ibstoken']) {
      savedata['SearchTokenIdIB'] = this.param['ibstoken'];
    }
    savedata['ISDCode'] = this.FlightForm.get('ISDCode')?.value;
    savedata['MobileNumber'] = this.FlightForm.get('MobileNumber')?.value;
    savedata['EmailId'] = this.FlightForm.get('EmailId')?.value;
    savedata['IsADTDOB'] = this.showadtdob;
    savedata['IsGST'] = this.isGSTShow;
    savedata['IsPANMandatory'] = this.IsPANMandatory;
    savedata['IsPassportMandatory'] = this.IsPassportMandatory;
    savedata['ResultIndex'] = this.Response[0]['ResultIndex'];
    if (Object.keys(this.SelectedInsurance).length !== 0) {
      savedata['InsuranceDetail'] = this.SelectedInsurance;

    }
    if (this.Response[1]) {
      savedata['ResultIndexIB'] = this.Response[1]['ResultIndex'];
    }
    let paxobj: any = {}
    if (this.FlightForm.get('Adult')?.value?.length != 0) {
      Object.assign(paxobj, { 'Adult': this.FlightForm.get('Adult')?.value });
    }
    if (this.FlightForm.get('Child')?.value?.length != 0) {
      Object.assign(paxobj, { 'Child': this.FlightForm.get('Child')?.value });
    }
    if (this.FlightForm.get('Infant')?.value?.length != 0) {
      Object.assign(paxobj, { 'Infant': this.FlightForm.get('Infant')?.value });
    }

    Object.assign(savedata, { 'paxdata': paxobj });
    sessionStorage.setItem('TSFP', JSON.stringify(this.AllTSFPRESP))
    sessionStorage.setItem('TSFPAX', JSON.stringify(savedata));

    let data = { "APIRes": this.AllResponse, "SSR": this.SSRDetail }
    sessionStorage.setItem('Response', JSON.stringify(data))
    const navigationExtras: NavigationExtras = {
      queryParams: this.param
    };
    // this.router.navigate(['flight/review-detail'], navigationExtras);

    this.showReviewpage = false;
    setTimeout(() => {
      this.showReviewpage = true;
      setTimeout(() => {
        this.openModal();
      }, 100);
    });

  }


  PassportIssueDate() {
    var _this = this;
    $("[passport-issue-date]").datepicker({
      defaultDate: "",
      dateFormat: "d M yy",
      maxDate: 0,
      changeMonth: true,
      changeYear: true,
      numberOfMonths: 1,
      yearRange: '1990:' + new Date().getFullYear().toString(),
      beforeShow: function (input: any, inst: any) {
        $(inst.dpDiv).addClass('tts-calandor');
        /*---Start Open in bottom--*/
        var $this = $(this);
        var cal = inst.dpDiv;
        var top = $this.offset().top + $this.outerHeight();
        var left = $this.offset().left;
        setTimeout(function () {
          cal.css({
            'top': top,
            'left': left,
            'height': 'auto'
          });
        }, 10);
        /*---End Open in bottom--*/
      },
      onSelect: function (selectedDate: any, inst: any) {
        var newdate = _this.flightService.AddDayDefaultDate(selectedDate, 364);
        let key: any = $(inst.input[0]).attr('key');
        let paxkey: any = $(inst.input[0]).attr('paxtype');
        _this.FlightForm.get(paxkey + '.' + key + '')?.patchValue({ 'PassportIssue': selectedDate, 'PassportExpiry': newdate });

        // _this.CheckExpiryDate(newdate);

      },
      onClose: function (selectedDate: any, inst: any) {

      }

    });
  }

  PassportExpiryDate() {
    var _this = this;
    $("[passport-expiry-date]").datepicker({
      dateFormat: "d M yy",
      minDate: 0,
      changeMonth: true,
      changeYear: true,
      numberOfMonths: 1,
      beforeShow: function (input: any, inst: any) {
        $(inst.dpDiv).addClass('tts-calandor');
        var newdate = new Date(_this.GetSearchData['DepartDate']);
        $(this).datepicker("option", "minDate", newdate);

        /*---Start Open in bottom--*/
        var $this = $(this);
        var cal = inst.dpDiv;
        var top = $this.offset().top + $this.outerHeight();
        var left = $this.offset().left;
        setTimeout(function () {
          cal.css({
            'top': top,
            'left': left,
            'height': 'auto'

          });
        }, 10);
        /*---End Open in bottom--*/
      },
      onClose: function (selectedDate: any, inst: any) {
        let key: any = $(inst.input[0]).attr('key');
        let paxkey: any = $(inst.input[0]).attr('paxtype');
        _this.FlightForm.get(paxkey + '.' + key + '')?.patchValue({ 'PassportExpiry': selectedDate });

        // _this.CheckExpiryDate(selectedDate);
      }
    });
  }

  DocExpiryDate() {
    var _this = this;
    $("[adt-docexpiry-date]").datepicker({
      dateFormat: "d M yy",
      minDate: 0,
      changeMonth: true,
      changeYear: true,
      numberOfMonths: 1,
      beforeShow: function (input: any, inst: any) {
        $(inst.dpDiv).addClass('tts-calandor');
        var newdate = new Date(_this.GetSearchData['DepartDate']);
        $(this).datepicker("option", "minDate", newdate);

        /*---Start Open in bottom--*/
        var $this = $(this);
        var cal = inst.dpDiv;
        var top = $this.offset().top + $this.outerHeight();
        var left = $this.offset().left;
        setTimeout(function () {
          cal.css({
            'top': top,
            'left': left,
            'height': 'auto'

          });
        }, 10);
        /*---End Open in bottom--*/
      },
      onClose: function (selectedDate: any, inst: any) {
        let key: any = $(inst.input[0]).attr('key');
        let paxkey: any = $(inst.input[0]).attr('paxtype');
        _this.FlightForm.get(paxkey + '.' + key + '')?.patchValue({ 'DocumentExpireDate': selectedDate });

        //_this.CheckExpiryDate(selectedDate);
      }
    });

  }

  onDobInput(type: any, event: any, index: number, field: any) {
    const rawValue: string = event.target.value;

    const monthNames = [
      'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
      'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'
    ];

    if (/[a-zA-Z]/.test(rawValue)) {
      const parsedDate = new Date(rawValue);
      if (!isNaN(parsedDate.getTime())) {
        const day = String(parsedDate.getDate()).padStart(2, '0');
        const month = monthNames[parsedDate.getMonth()];
        const year = parsedDate.getFullYear();
        const formattedDate = `${day} ${month} ${year}`;

        event.target.value = formattedDate;
        this.FlightForm
          .get(`${type}.${index}.${field}`)
          ?.setValue(formattedDate, { emitEvent: false });
      }
      return;
    }

    // Case 2: manual typing — digits only
    const input = rawValue.replace(/\D/g, '').slice(0, 8);
    event.target.value = input;

    if (input.length < 8) {
      return;
    }

    const day = input.substring(0, 2);
    const month = input.substring(2, 4);
    const year = input.substring(4, 8);

    const monthIndex = Number(month) - 1;
    if (monthIndex < 0 || monthIndex > 11) {
      return;
    }

    const formattedDate = `${day} ${monthNames[monthIndex]} ${year}`;

    this.FlightForm
      .get(`${type}.${index}.${field}`)
      ?.setValue(formattedDate, { emitEvent: false });
  }



  CheckExpiryDate(expirydate: any) {
    let departdate;
    if (this.GetSearchData['Type'] != 'M') {
      departdate = this.GetSearchData['ReturnDate'];
    } else {
      let lastindex = this.GetSearchData['MultiCity'].length - 1;
      departdate = this.GetSearchData['MultiCity'][lastindex]['DepartDate'];
    }
    let newdepartdate: any = this.flightService.AddDayDefaultDate(departdate, 183); // 6 Month
    if (new Date(newdepartdate).getTime() < new Date(expirydate).getTime()) {
    } else {
      alert('Expiry Date cannot be less than 6 months from last travel date');
    }
  }

  DocumentDate() {
    var _this = this;
    $("[adt-docissue-date]").datepicker({
      dateFormat: "d M yy",
      minDate: "-10Y",
      maxDate: "10Y",
      changeMonth: true,
      changeYear: true,
      numberOfMonths: 1,
      yearRange: '-100y:c+nn',
      beforeShow: function (input: any, inst: any) {
        $(inst.dpDiv).addClass('tts-calandor');
        /*---Start Open in bottom--*/
        var $this = $(this);
        var cal = inst.dpDiv;
        var top = $this.offset().top + $this.outerHeight();
        var left = $this.offset().left;
        setTimeout(function () {
          cal.css({
            'top': top,
            'left': left,
            'height': 'auto'
          });
        }, 10);
        /*---End Open in bottom--*/
      },
      onClose: function (selectedDate: any, inst: any) {

        let key: any = $(inst.input[0]).attr('key');
        let paxkey: any = $(inst.input[0]).attr('paxtype');
        _this.FlightForm.get(paxkey + '.' + key + '')?.patchValue({ 'DocumentIssueDate': selectedDate });

      }
    });
  }


  ADTDOBDate() {
    var _this = this;
    $("[adt-dob-date]").datepicker({
      dateFormat: "d M yy",
      maxDate: "-12Y",
      changeMonth: true,
      changeYear: true,
      numberOfMonths: 1,
      yearRange: '-100y:c+nn',
      beforeShow: function (input: any, inst: any) {
        $(inst.dpDiv).addClass('tts-calandor');
        /*---Start Open in bottom--*/
        var $this = $(this);
        var cal = inst.dpDiv;
        var top = $this.offset().top + $this.outerHeight();
        var left = $this.offset().left;
        setTimeout(function () {
          cal.css({
            'top': top,
            'left': left,
            'height': 'auto'
          });
        }, 10);
        /*---End Open in bottom--*/
      },
      onClose: function (selectedDate: any, inst: any) {

        let key: any = $(inst.input[0]).attr('key');
        let paxkey: any = $(inst.input[0]).attr('paxtype');
        _this.FlightForm.get(paxkey + '.' + key + '')?.patchValue({ 'DOB': selectedDate });

      }
    });
  }
  CHDDOBDate() {

    var _this = this;
    $("[chd-dob-date]").datepicker({
      dateFormat: "d M yy",
      minDate: "-12Y",
      maxDate: "-2Y",
      changeMonth: true,
      changeYear: true,
      numberOfMonths: 1,
      beforeShow: function (input: any, inst: any) {
        $(inst.dpDiv).addClass('tts-calandor');
        /*---Start Open in bottom--*/
        var $this = $(this);
        var cal = inst.dpDiv;
        var top = $this.offset().top + $this.outerHeight();
        var left = $this.offset().left;
        setTimeout(function () {
          cal.css({
            'top': top,
            'left': left,
            'height': 'auto'
          });
        }, 10);
        /*---End Open in bottom--*/
      },
      onClose: function (selectedDate: any, inst: any) {

        let key: any = $(inst.input[0]).attr('key');
        let paxkey: any = $(inst.input[0]).attr('paxtype');
        _this.FlightForm.get(paxkey + '.' + key + '')?.patchValue({ 'DOB': selectedDate });

      }
    });

  }
  INFDOBDate() {
    var _this = this;
    $("[inf-dob-date]").datepicker({
      dateFormat: "d M yy",
      minDate: "-2Y",
      maxDate: "+0D",
      changeMonth: true,
      changeYear: true,
      numberOfMonths: 1,
      beforeShow: function (input: any, inst: any) {
        $(inst.dpDiv).addClass('tts-calandor');
        /*---Start Open in bottom--*/
        var $this = $(this);
        var cal = inst.dpDiv;
        var top = $this.offset().top + $this.outerHeight();
        var left = $this.offset().left;
        setTimeout(function () {
          cal.css({
            'top': top,
            'left': left,
            'height': 'auto'
          });
        }, 10);
        /*---End Open in bottom--*/
      },
      onClose: function (selectedDate: any, inst: any) {

        let key: any = $(inst.input[0]).attr('key');
        let paxkey: any = $(inst.input[0]).attr('paxtype');
        _this.FlightForm.get(paxkey + '.' + key + '')?.patchValue({ 'DOB': selectedDate });

      }
    });
  }

  GetDialCode() {
    this.commonservice.dialcode().subscribe(data => {
      let resp: any = data;
      if (resp['Error']['ErrorCode'] == 0) {
        this.Dialcode = resp['Result'];
      }

    });

  }

  togglebutton(id: any) {
    $('#' + id).toggle();
  }

  GSTAutocomplete(event: any) {

    let val = event.target.value;
    if (val.length >= 3) {
      let req = { 'term': val }
      this.flightService.MasterGST(req).subscribe(data => {
        let resp: any = data;
        if (resp['Error']['ErrorCode'] == 0) {
          this.gstlist = resp['Result'];
        } else {
          this.gstlist = [];
        }
      });
    } else {
      this.gstlist = [];
    }
  }

  selectedgst(event: MatAutocompleteSelectedEvent) {
    let company_name = event.option.value;
    this.gstlist.forEach((element: any) => {
      if (element['company_name'] == company_name) {
        this.GSTForm.patchValue({
          'GSTNumber': element['gst_number'],
          'CompanyName': element['company_name'],
          'Email': element['email'],
          'Address': element['address'],
          'PhoneNumber': element['phone_number'],
        });
      }
    });

  }

  cleargst() {
    this.gsteInput.nativeElement.value = '';
    this.gstlist = [];
    this.GSTForm.patchValue({
      'GSTNumber': '',
      'CompanyName': '',
      'Email': '',
      'Address': '',
      'PhoneNumber': '',
    });
  }


  TravellerAutocomplete(event: any, paxtype: any, paxno: any) {
    let val = event.target.value;
    if (val.length >= 3) {
      let req = { 'term': val, 'paxtype': paxtype }
      this.flightService.MasterTravelers(req).subscribe(data => {
        let resp: any = data;
        if (resp['Error']['ErrorCode'] == 0) {
          this.travellerlist = resp['Result'];
        } else {
          this.travellerlist = [];
        }
      });
    } else {
      this.travellerlist = [];
    }
  }


  selectedpax(event: MatAutocompleteSelectedEvent, paxtype: any, paxno: any) {


    let name = event.option.value;
    this.travellerlist.forEach((element: any) => {
      let paxname = element['first_name'] + ' ' + element['last_name'];
      if (paxname == name) {
        let DOB: any; let PassportIssue: any; let PassportExpiry: any;
        if (element['date_of_birth']) {
          DOB = this.flightService.DefaultDateFormat(element['date_of_birth']);
        }
        if (element['passport_issue_date']) {
          PassportIssue = this.flightService.DefaultDateFormat(element['passport_issue_date']);
        }
        if (element['passport_expiry']) {
          PassportExpiry = this.flightService.DefaultDateFormat(element['passport_expiry']);
        }


        if (paxtype == 'Adult') {
          this.fadt['controls'][paxno].patchValue({
            'Title': element['title'],
            'FirstName': element['first_name'],
            'LastName': element['last_name'],
            'DOB': DOB,
            'Nationality': element['nationality'],
            'PassportNo': element['passport_number'],
            'PassportIssue': PassportIssue,
            'PassportExpiry': PassportExpiry,
            'PAN': element['pan_number']
          });
        }

        if (paxtype == 'Child') {
          this.fchd['controls'][paxno].patchValue({
            'Title': element['title'],
            'FirstName': element['first_name'],
            'LastName': element['last_name'],
            'DOB': DOB,
            'Nationality': element['nationality'],
            'PassportNo': element['passport_number'],
            'PassportIssue': PassportIssue,
            'PassportExpiry': PassportExpiry,
            'PAN': element['pan_number']
          });
        }

        if (paxtype == 'Infant') {
          this.finf['controls'][paxno].patchValue({
            'Title': element['title'],
            'FirstName': element['first_name'],
            'LastName': element['last_name'],
            'DOB': DOB,
            'Nationality': element['nationality'],
            'PassportNo': element['passport_number'],
            'PassportIssue': PassportIssue,
            'PassportExpiry': PassportExpiry,
            'PAN': element['pan_number']
          });
        }

      }
    });

  }


  selectseattab(jkey: any, segkey: any, Segment: any) {
    this.seatactivetab = jkey + '' + segkey;
    this.finalselectedseat(jkey, Segment);
    this.CLOSETootip();
  }

  seatTooltip(segmentli: any, type: any) {
    if (type == 'mouseover') {
      segmentli.tooltrip = { 'display': "block" };
    }
    if (type == 'mouseleave') {
      segmentli.tooltrip = { 'display': "none" };
    }
  }

  selectseat(clickedseat: any, detail: any, Segment: any, jkey: any) {
    let segmentkey = Segment.Origin + '-' + Segment.Destination;
    if (detail[segmentkey]['Code']) {

      if (detail[segmentkey]['Key'] == clickedseat['Key']) {

        detail[segmentkey] = [];
      } else {

        let selectedindex = this.getPassengerIndex(jkey, clickedseat);
        if (selectedindex != '') {
          //remove previous seat
          let previouskey = selectedindex.split('_');
          this.travellerJson[previouskey[0]][previouskey[1]][previouskey[2]][previouskey[3]] = [];
          //add again seat
          detail[segmentkey] = clickedseat;

        } else {
          detail[segmentkey] = clickedseat;
        }
      }
    } else {


      let selectedindex = this.getPassengerIndex(jkey, clickedseat);

      if (selectedindex != '') {
        //remove previous seat

        let previouskey = selectedindex.split('_');
        setTimeout(() => {
          if (detail[segmentkey]['Key'] === clickedseat['Key']) {
            this.travellerJson[previouskey[0]][previouskey[1]][previouskey[2]][previouskey[3]] = [];
          }
        }, 100);

        this.travellerJson[previouskey[0]][previouskey[1]][previouskey[2]][previouskey[3]] = [];

        //add again seat
        detail[segmentkey] = clickedseat;
      } else {
        detail[segmentkey] = clickedseat;
      }
    }
    this.finalselectedseat(jkey, Segment);
  }

  seatClicked(event: any, sObj: any) {

    if (sObj['SeatClass'].includes('booked')) {
      return false;
    }

    let pos = this.getposition(event.target, "flightbox");
    this.tootipstyle = {
      top: pos.top + "px",
      left: pos.left + "px",
      display: "block"
    };
    this.clickedseat = sObj;
    return
  }

  getposition(elem: any, cont: any) {
    let classes = elem.offsetParent.classList.toString();
    let parent = elem;
    let top = 0;
    let left = 0;
    while (!classes.includes(cont)) {
      top += parent.offsetTop;
      left += parent.offsetLeft;
      parent = parent.offsetParent;
      classes = parent.classList.toString();
    }

    let selelement = document.querySelector('.seatdetails');
    let wanted_height = this.getHeight(selelement);
    let boxh = wanted_height + 40;

    var scrolloffset = document.getElementsByClassName("flightboxplan")[0].scrollLeft;

    return {
      top: top - boxh,
      left: left - scrolloffset - 102
    };
  }

  getHeight(el: any) {
    let el_style = window.getComputedStyle(el),
      el_display = el_style.display,
      el_position = el_style.position,
      el_visibility = el_style.visibility,
      el_max_height = el_style.maxHeight.replace('px', '').replace('%', ''),

      wanted_height = 0;
    // if its not hidden we just return normal height
    if (el_display !== 'none' && el_max_height !== '0') {
      return el.offsetHeight;
    }

    // the element is hidden so:
    // making the el block so we can meassure its height but still be hidden
    el.style.position = 'absolute';
    el.style.visibility = 'hidden';
    el.style.display = 'block';

    wanted_height = el.offsetHeight;

    // reverting to the original values
    el.style.display = el_display;
    el.style.position = el_position;
    el.style.visibility = el_visibility;

    return wanted_height;
  }

  CLOSETootip() {
    this.tootipstyle = { display: "none" };
  }

  finalselectedseat(jkey: any, Segment: any) {
    let segmentkey = Segment.Origin + '-' + Segment.Destination;
    let j: any = [];
    let s: any = [];
    let c: any = [];
    let price = 0;


    Object.keys(this.travellerJson[jkey]).forEach((paxkey) => {
      Object.keys(this.travellerJson[jkey][paxkey]).forEach((noofpax: any) => {
        Object.keys(this.travellerJson[jkey][paxkey][noofpax]).forEach((noofseg) => {
          if (this.travellerJson[jkey][paxkey][noofpax][noofseg]['Price']) {
            price += parseFloat(this.travellerJson[jkey][paxkey][noofpax][noofseg]['Price']);
          }
          if (segmentkey == noofseg) {
            c.push(this.travellerJson[jkey][paxkey][noofpax][noofseg]['Code']);
            s[noofseg] = c;
            if (jkey == 0) {
              this.paxseatob = s;
            }
            if (jkey == 1) {
              this.paxseatib = s;
            }
          }
        });
      });
    });
    this.paxseatselected = j;
    if (jkey == 0) {
      this.paxseatselected = this.paxseatob;

      this.obseatprice = price;
    }
    if (jkey == 1) {
      this.paxseatselected = this.paxseatib;

      this.ibseatprice = price;
    }

    // patch seat data in form ****************************************
    Object.keys(this.SeatJson).forEach((paxtype: any) => {
      this.SeatJson[paxtype].forEach((element: any, paxkey: any) => {
        this.FlightForm.get(paxtype + '.' + paxkey + '.Seat')?.patchValue(element)
      });
    });
    this.CalculateSSrPrice();
  }


  getPassengerIndex(jkey: any, clickedseat: any) {
    let selectedindex = '';


    Object.keys(this.travellerJson[jkey]).forEach((paxkey) => {
      Object.keys(this.travellerJson[jkey][paxkey]).forEach((noofpax) => {
        Object.keys(this.travellerJson[jkey][paxkey][noofpax]).forEach((noofseg) => {
          if (this.travellerJson[jkey][paxkey][noofpax][noofseg]['Key'] == clickedseat['Key']) {
            selectedindex = jkey + '_' + paxkey + '_' + noofpax + '_' + noofseg;
          }
        });
      });
    });


    return selectedindex;
  }

  getval(item: any) {
    return item?.value;
  }
  GetKey(item: any) {
    return item;
  }


  openModal() {
    const modalElement = document.getElementById('ReviewModal')!;
    const modal = new bootstrap.Modal(modalElement);
    modal.show();
  }

  faretogglebutton(event: any, tripkey: any) {
    // $("#fare-rule-"+tripkey).toggle('d-none');
    // let isexpanded=event.target.getAttribute('data-expanded');
    // if(isexpanded=='false')
    // {
    //   $(".ttsfare"+tripkey).removeClass('fa-minus');
    //   $(".ttsfare"+tripkey).addClass('fa-plus');
    //   event.target.setAttribute('data-expanded','true');

    // } else {
    //   $(".ttsfare"+tripkey).addClass('fa-minus');
    //   $(".ttsfare"+tripkey).removeClass('fa-plus');
    //   event.target.setAttribute('data-expanded','false');
    this.FareRule(tripkey);
    // }
  }
  FareRule(trip: any) {
    this.FareRuleModal.show();
    this.fareRuleLoading = true;
    let data: any;
    if (trip == 0) {
      data = {
        'UserIp': this.UserIp,
        'SearchTokenId': this.param['stoken'],
        'ResultIndex': this.param['fareid'],
        'FareRuleId': this.FareList[0]['FareRuleId'],
      };
    } else if (trip == 1) {
      data = {
        'UserIp': this.UserIp,
        'SearchTokenId': this.param['ibstoken'],
        'ResultIndex': this.param['ibfareid'],
        'FareRuleId': this.FareList[1]['FareRuleId'],
      };
    }
    this.flightService.fare_rule(data).subscribe((resp: any) => {
      this.fareRuleLoading = false;
      let response: any = resp;
      if (response['Error']['ErrorCode'] == 0) {

        this.FlightFareRule = response['Result'];
        this.FareRuleErrorCode = response['Error']['ErrorCode'];
        this.FareRuleErrorMessage = response['Error']['ErrorMessage'];
      } else {
        this.alertservice.error(response['Error']['ErrorMessage'])
      }
    });
  }

  SetStoredData(data: any) {

    if (data['APIRes']) {
      this.isconfimation = true;
      let response: any = data['APIRes'];
      this.AllResponse = data['APIRes'];
      this.SearchTokenId = response['stoken'];
      if (response['Error']['ErrorCode'] == 0) {
        this.Response = response['Result'];
        this.AddRequiredFields()
        this.DocumentMendatory = this.Response[0]['IsDocumentIdMandatory'];
        this.DocumentIssueDate = this.Response[0]['IsDocumentIssueDateMandatory'];
        this.DocumentExpiryDate = this.Response[0]['IsDocumentExpiryDateMandatory'];
        this.DocumentTitle = this.Response[0]['DocumentType'];
        this.SegmentData = this.Response[0]['Segments']
        this.lccFlight = this.Response[0]['IsLCC']
        this.markupvalue = response['TotalMarkup'];
        let markup: any = this.markupvalue;
        sessionStorage.setItem('TAGM', markup);

        let Segment: any = [];
        let BaseFare = 0; let Tax = 0; let YQTax = 0; let OtherCharges = 0; let Discount = 0; let PublishedPrice = 0; let OfferedPrice = 0; let AgentCommission = 0; let ServiceCharges = 0; let TDS = 0; let CGSTAmount = 0; let CGSTRate = 0; let IGSTAmount = 0; let IGSTRate = 0; let SGSTAmount = 0; let SGSTRate = 0; let TaxableAmount = 0;

        let adltpaxcount = 0; let adltbasefare = 0; let adlttax = 0; let adltyqtax = 0; let adltservicecharge = 0;
        let childpaxcount = 0; let childbasefare = 0; let childtax = 0; let childyqtax = 0; let childservicecharge = 0;
        let infpaxcount = 0; let infbasefare = 0; let inftax = 0; let infyqtax = 0; let infservicecharge = 0;

        response['Result'].forEach(function (value: any, key: any) {
          Segment.push(value['Segments']);

          BaseFare += value['Fare']['BaseFare'];
          Tax += value['Fare']['Tax'];
          YQTax += value['Fare']['YQTax'];
          OtherCharges += value['Fare']['OtherCharges'];
          Discount += value['Fare']['Discount'];
          PublishedPrice += value['Fare']['PublishedPrice'];
          OfferedPrice += value['Fare']['OfferedPrice'];
          AgentCommission += value['Fare']['AgentCommission'];
          ServiceCharges += value['Fare']['ServiceCharges'];
          TDS += value['Fare']['TDS'];
          CGSTAmount += value['Fare']['GST']['CGSTAmount'];
          CGSTRate += value['Fare']['GST']['CGSTRate'];
          IGSTAmount += value['Fare']['GST']['IGSTAmount'];
          IGSTRate += value['Fare']['GST']['IGSTRate'];
          SGSTAmount += value['Fare']['GST']['SGSTAmount'];
          SGSTRate += value['Fare']['GST']['SGSTRate'];
          TaxableAmount += value['Fare']['GST']['TaxableAmount'];
          if (value['FareBreakdown']['ADT']) {
            adltpaxcount = value['FareBreakdown']['ADT']['PassengerCount']
            adltbasefare += value['FareBreakdown']['ADT']['BaseFare']
            adlttax += value['FareBreakdown']['ADT']['Tax']
            adltyqtax += value['FareBreakdown']['ADT']['YQTax']
            adltservicecharge += value['FareBreakdown']['ADT']['ServiceCharges']
          }
          if (value['FareBreakdown']['CHD']) {
            childpaxcount = value['FareBreakdown']['CHD']['PassengerCount']
            childbasefare += value['FareBreakdown']['CHD']['BaseFare']
            childtax += value['FareBreakdown']['CHD']['Tax']
            childyqtax += value['FareBreakdown']['CHD']['YQTax']
            childservicecharge += value['FareBreakdown']['CHD']['ServiceCharges']
          }
          if (value['FareBreakdown']['INF']) {
            infpaxcount = value['FareBreakdown']['INF']['PassengerCount']
            infbasefare += value['FareBreakdown']['INF']['BaseFare']
            inftax += value['FareBreakdown']['INF']['Tax']
            infyqtax += value['FareBreakdown']['INF']['YQTax']
            infservicecharge += value['FareBreakdown']['INF']['ServiceCharges']
          }
        });

        this.Segments = Segment;
        //  this.MainSegments=response['MainSegment'];
        this.FareBrekdown['Adult'] = {
          'BaseFare': adltbasefare,
          "PaxCount": adltpaxcount,
          "Tax": adlttax,
          "YQTax": adltyqtax,
          "ServiceCharge": adltservicecharge,
        }
        this.FareBrekdown['Child'] = {
          'BaseFare': childbasefare,
          "PaxCount": childpaxcount,
          "Tax": childtax,
          "YQTax": childyqtax,
          "ServiceCharge": childservicecharge,
        }
        this.FareBrekdown['Infant'] = {
          'BaseFare': infbasefare,
          "PaxCount": infpaxcount,
          "Tax": inftax,
          "YQTax": infyqtax,
          "ServiceCharge": infservicecharge,
        }
        this.CurrentFare['BaseFare'] = BaseFare;
        this.CurrentFare['Tax'] = Tax;
        this.CurrentFare['YQTax'] = YQTax;
        this.CurrentFare['OtherCharges'] = OtherCharges;
        this.CurrentFare['Discount'] = Discount;
        this.CurrentFare['PublishedPrice'] = PublishedPrice;
        this.CurrentFare['OfferedPrice'] = OfferedPrice;
        this.CurrentFare['AgentCommission'] = AgentCommission;
        this.CurrentFare['ServiceCharges'] = ServiceCharges;
        this.CurrentFare['TDS'] = TDS;
        this.CurrentFare['AgentMarkup'] = this.markupvalue;
        this.CurrentFare['GST'] = {
          'CGSTAmount': CGSTAmount,
          'CGSTRate': CGSTRate,
          'IGSTAmount': IGSTAmount,
          'IGSTRate': IGSTRate,
          'SGSTAmount': SGSTAmount,
          'SGSTRate': SGSTRate,
          'TaxableAmount': TaxableAmount
        };
        if (response['IsPriceChanged']) {
          let newprice = this.CurrentFare['PublishedPrice'] + this.CurrentFare['AgentMarkup'];
          let pricetxt = '<div class="col-lg-12 text-center">'
            + '<table class="table">'
            + '<tbody class="border">'
            + '<tr>'
            + '<td>Old Fare was-</td>'
            + '<td>₹ ' + this.flightService.transformDecimal(this.oldprice) + ' </td>'
            + '</tr>'
            + '<tr>'
            + '<td> New Fare is -</td>'
            + '<td class="text-danger">₹ ' + this.flightService.transformDecimal(newprice) + '</td>'
            + '</tr>'
            + '</table>'
            + '</div>';

          this.modaldata['head'] = 'Fare have changed';
          this.modaldata['message'] = pricetxt;
          this.modaldata['type'] = '';

          this.formModal.show();
        }
      }
      this.fareloading = false;
    }
    if (data['SSR']) {
      setTimeout(() => {
        this.PassportIssueDate();
        this.DocExpiryDate();
        this.DocumentDate();
        this.PassportExpiryDate();
        this.ADTDOBDate();
        this.CHDDOBDate();
        this.INFDOBDate();
      }, 100);

      this.SSRDetail = data['SSR'];
      this.CreateSSRData(this.SSRDetail);
      this.seatData = this.SSRDetail['SeatData'];
      this.travellerJson = this.SSRDetail['SeatPaxData'];
      setTimeout(() => {
        this.CreateSeatJson()
      }, 100);
    }
  }
  ClearSSR(paxtype: any, paxi: any, ssrtype: any) {
    this.FlightForm.get(paxtype + '.' + paxi + '.' + ssrtype)?.setValue([]);
    this.CalculateSSrPrice();

  }
}
