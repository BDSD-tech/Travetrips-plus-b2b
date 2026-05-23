import { Component, CUSTOM_ELEMENTS_SCHEMA, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators, FormArray } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { NavigationExtras, Router } from '@angular/router';
import { AlertService } from '../../services/alert.service';
import { CommonService } from '../../services/common.service';
import Validation from '../../utils/validation';
import { tts_config } from '../../../environments/tts_config';
import { FlightService } from './flight.service';
declare var $: any;

@Component({
  selector: 'app-flight',
  templateUrl: './flight.component.html',
  styleUrls: ['./flight.component.css'],
})
export class FlightComponent implements OnInit {

  GetWebSiteData: any = [];
  Offer: any = [];
  Notifications: any = [];
  offerloading = true;

  SearchForm: FormGroup;
  submitted = false;
  Flightloading = false;
  paxcountstop = false;
  isShow = false;

  adultcount: number = 1;
  childcount: number = 0;
  infantcount: number = 0;
  travellertxt: string | undefined;
  totalpaxcount: number | undefined;

  flightrecent: any = [];
  getRecentSearch: any = [];

  preferredairlinedata: any = [];
  preferredairlinelist = [
    {
      'name': 'Indigo',
      'code': '6E',
      'ischecked': false
    },
    {
      'name': 'Air India Express',
      'code': 'I5',
      'ischecked': false
    },
    {
      'name': 'Akasa Air',
      'code': 'QP',
      'ischecked': false
    },
    {
      'name': 'AirIndia',
      'code': 'AI',
      'ischecked': false
    },
    {
      'name': 'Spice jet',
      'code': 'SG',
      'ischecked': false
    }

  ];

  popupmodal: any;
  timeoutId: any;
  compareKeepOrder = (a: any, b: any): number => {
    return 0; // keep API order
  };
  constructor(public fb: FormBuilder, private router: Router, private flightservice: FlightService, private commonservice: CommonService, private alertservice: AlertService, public dialog: MatDialog) {

    this.SearchForm = this.fb.group({
      Type: ['O', Validators.required],
      Origin: ['Delhi(DEL)', Validators.required],
      OriginCode: ['DEL'],
      OriginCountry: ['IN'],
      Destination: ['', Validators.required],
      DestinationCode: [''],
      DestinationCountry: [''],
      DepartDate: ['', Validators.required],
      ReturnDate: [''],
      Class: ['Economy', Validators.required],
      Nonstop: [],
      SeriesFare: [],
      Adult: [1],
      Child: [0],
      Infant: [0],
      Isdomestic: [''],
      PreferredAirline: [''],
      ResultFareType: ['RegularFare'],
      MultiCity: this.fb.array([]),
    },
      {
        validators: [Validation.NotMatch('Origin', 'Destination')]
      });

    this.travellertxt = this.SearchForm.value.Adult + this.SearchForm.value.Child + this.SearchForm.value.Infant + ' Passenger | ' + this.SearchForm.value.Class;

    let currentdate = this.flightservice.DefaultDateFormat(new Date());
    let Return = this.flightservice.CurrentDatePlus(1);
    this.SearchForm.patchValue({ DepartDate: currentdate, ReturnDate: Return });
    this.AddCity();
    this.AddCity();
    this.RemoveMultiValidation();
  }

  ngOnInit(): void {

    sessionStorage.removeItem('FlightSearch');
    sessionStorage.removeItem('time');
    sessionStorage.removeItem('FSUM');
    sessionStorage.removeItem('TSF');
    sessionStorage.removeItem('TSFP');
    sessionStorage.removeItem('TSFPAX');
    sessionStorage.removeItem('TAGM');

    this.commonservice.GetWebSiteData().subscribe(data => {
      this.GetWebSiteData = data;

    });
    this.commonservice.GetHomeOffer().subscribe(data => {
      this.Offer = data;
      this.offerloading = false;
    });
    this.commonservice.GetHomeNotifications().subscribe(data => {
      this.Notifications = data;
    });




    this.flightautocomplete();
    this.flightdepartcalendar();
    this.flightreturncalendar();

    this.alertservice.clear();

  }

  ngAfterViewInit() {
    // if(sessionStorage.getItem('notification-dialog')!='true')
    // {

    // this.timeoutId=setTimeout(() => {
    //   this.commonservice.GetPopupNotifications().subscribe(data => {
    //     console.log(data);
    //     if(data )
    //     {


    //       const nodeList = document.querySelectorAll(".custom-dialog-container");
    //       if(nodeList.length==0)
    //       {
    //          sessionStorage.setItem('notification-dialog','true');
    //         this.popupmodal=this.dialog.open(ImportantNotificationComponent,{
    //           width: '550px',
    //           data:data,
    //           panelClass: 'custom-dialog-container'
    //         });

    //       }
    //     }
    //   });
    // }, 1500);
    // }
  }



  ngAfterContentInit() {
    if (localStorage.getItem('FlightRecentSearch')) {
      let FlightRecentSearch: any = localStorage.getItem('FlightRecentSearch');
      let val = JSON.parse(FlightRecentSearch);
      if (val) {
        let finalsearch: any = [];
        let currentdate = this.flightservice.DateToTimestamp(this.flightservice.AddDayDefaultDate(new Date(), 0));
        val.forEach((element: any) => {
          let deptime = this.flightservice.DateToTimestamp(element['DepartDate']);
          if (currentdate <= deptime) {
            finalsearch.push(element);
          }
        });
        this.getRecentSearch = finalsearch;
        console.log(this.getRecentSearch);
        
      }

    }
  }

  ngOnDestroy() {

    clearTimeout(this.timeoutId);
  }

  gettrimValue(value:any){
    return value.replace(/\(.*?\)/g, '').trim()
  }
  

  gettype(type: string) {
    this.SearchForm.patchValue({ Type: type });
    if (type == 'O') {
      this.SearchForm.controls['Origin'].setValidators([Validators.required]);
      this.SearchForm.controls['Origin'].updateValueAndValidity();
      this.SearchForm.controls['Destination'].setValidators([Validators.required]);
      this.SearchForm.controls['Destination'].updateValueAndValidity();
      this.SearchForm.controls['DepartDate'].setValidators([Validators.required]);
      this.SearchForm.controls['DepartDate'].updateValueAndValidity();
      this.SearchForm.controls['ReturnDate'].clearValidators();
      this.SearchForm.controls['ReturnDate'].updateValueAndValidity();

      this.RemoveMultiValidation();

    } else if (type == 'R') {
      this.SearchForm.controls['Origin'].setValidators([Validators.required]);
      this.SearchForm.controls['Origin'].updateValueAndValidity();
      this.SearchForm.controls['Destination'].setValidators([Validators.required]);
      this.SearchForm.controls['Destination'].updateValueAndValidity();
      this.SearchForm.controls['DepartDate'].setValidators([Validators.required]);
      this.SearchForm.controls['DepartDate'].updateValueAndValidity();
      this.SearchForm.controls['ReturnDate'].setValidators([Validators.required]);
      this.SearchForm.controls['ReturnDate'].updateValueAndValidity();

      this.RemoveMultiValidation();

    } else {
      this.SearchForm.controls['Origin'].clearValidators();
      this.SearchForm.controls['Origin'].updateValueAndValidity();
      this.SearchForm.controls['Destination'].clearValidators();
      this.SearchForm.controls['Destination'].updateValueAndValidity();
      this.SearchForm.controls['DepartDate'].clearValidators();
      this.SearchForm.controls['DepartDate'].updateValueAndValidity();
      this.SearchForm.controls['ReturnDate'].clearValidators();
      this.SearchForm.controls['ReturnDate'].updateValueAndValidity();

      this.AddMultiValidation();
    }
  }
  get multicity() {
    return this.SearchForm.controls["MultiCity"] as FormArray;
  }

  AddCity() {
    const cityForm = this.fb.group({
      Origin: ['', Validators.required],
      OriginCode: [''],
      OriginCountry: [''],
      Destination: ['', Validators.required],
      DestinationCode: [''],
      DestinationCountry: [''],
      DepartDate: ['', Validators.required],
    }, {
      validators: [Validation.NotMatch('Origin', 'Destination')]
    });
    this.multicity.push(cityForm);

    if (this.multicity.length == 4) {
      $(".tts-addmulti-btn").hide();
    }
    setTimeout(() => {
      this.flightdepartcalendar();
    }, 50);
  }

  AddMultiValidation() {
    for (let i = 0; i <= this.multicity.length; i++) {
      this.SearchForm.get('MultiCity.' + i + '.Origin')?.setValidators([Validators.required]);
      this.SearchForm.get('MultiCity.' + i + '.Origin')?.updateValueAndValidity();
      this.SearchForm.get('MultiCity.' + i + '.Destination')?.setValidators([Validators.required]);
      this.SearchForm.get('MultiCity.' + i + '.Destination')?.updateValueAndValidity();
      this.SearchForm.get('MultiCity.' + i + '.DepartDate')?.setValidators([Validators.required]);
      this.SearchForm.get('MultiCity.' + i + '.DepartDate')?.updateValueAndValidity();
    }
  }

  RemoveMultiValidation() {
    for (let i = 0; i <= this.multicity.length; i++) {
      this.SearchForm.get('MultiCity.' + i + '.Origin')?.clearValidators();
      this.SearchForm.get('MultiCity.' + i + '.Origin')?.updateValueAndValidity();
      this.SearchForm.get('MultiCity.' + i + '.Destination')?.clearValidators();
      this.SearchForm.get('MultiCity.' + i + '.Destination')?.updateValueAndValidity();
      this.SearchForm.get('MultiCity.' + i + '.DepartDate')?.clearValidators();
      this.SearchForm.get('MultiCity.' + i + '.DepartDate')?.updateValueAndValidity();
    }
  }

  RemoveCity(Index: number) {
    this.multicity.removeAt(Index);

    if (this.multicity.length < 4) {
      $(".tts-addmulti-btn").show();
    }
  }

  swapecity() {
    let Origin = this.SearchForm.value.Origin;
    let OriginCode = this.SearchForm.value.OriginCode;
    let OriginCountry = this.SearchForm.value.OriginCountry;
    let Destination = this.SearchForm.value.Destination;
    let DestinationCode = this.SearchForm.value.DestinationCode;
    let DestinationCountry = this.SearchForm.value.DestinationCountry;

    this.SearchForm.patchValue({ Origin: Destination, OriginCode: DestinationCode, OriginCountry: DestinationCountry, Destination: Origin, DestinationCode: OriginCode, DestinationCountry: OriginCountry });
  }

  openautocomplete(event: any, type: any) {
    $(event.target).autocomplete("search", "");
  }

  Cleardata(field: any, key: any = null) {
    if (key != null) {
      if (field == 'Origin') {
        this.SearchForm.get('MultiCity.' + key + '')?.patchValue({ Origin: '', OriginCode: '', OriginCountry: '' });
        $('#multi-f-origin-' + key + '').val('');
      }
      if (field == 'Destination') {
        this.SearchForm.get('MultiCity.' + key + '')?.patchValue({ Destination: '', DestinationCode: '', DestinationCountry: '' });
        $('#multi-f-destination-' + key + '').val('');

        let newkey = key + 1;
        this.SearchForm.get('MultiCity.' + newkey + '')?.patchValue({ Origin: '', OriginCode: '', OriginCountry: '' });
        $('#multi-f-origin-' + newkey + '').val('');
      }

    } else {
      if (field == 'Origin') {
        this.SearchForm.patchValue({ Origin: '', OriginCode: '', OriginCountry: '' });
      }
      if (field == 'Destination') {
        this.SearchForm.patchValue({ Destination: '', DestinationCode: '', DestinationCountry: '' });
      }
    }
  }


  flightautocomplete() {
    var _this = this;
    $(document).on('focus', '.autosuggeest', () => {
      $(".autosuggeest").autocomplete({
        minLength: 0,
        maxResults: 15,
        source: function (request: any, response: any) {
          let url = tts_config.APIURL + '/flight/airports';
          $.ajax({
            url: url,
            dataType: "json",
            cache: false,
            data: {
              term: request.term
            },
            success: function (data: any) {
              response(data);
            }
          });
        },
        open: function () {
          $(".ui-autocomplete").addClass('ttsautocomplet');
        },
        select: function (event: any, ui: any) {
          var type = $(this).attr('tp');
          if (typeof type === "undefined") {
            var fieldname = $(this).attr('formControlName');
            if (fieldname == "Origin") {


              _this.SearchForm.patchValue({ Origin: ui.item.label, OriginCode: ui.item.airport_code, OriginCountry: ui.item.country_code });

            } else if (fieldname == "Destination") {

              _this.SearchForm.patchValue({ Destination: ui.item.label, DestinationCode: ui.item.airport_code, DestinationCountry: ui.item.country_code });

            }
            var inputs = $(this).closest('#flight-form').find(':input');
            inputs.eq(inputs.index(this) + 1).focus().click();
          } else {

            setTimeout(() => {
              var datakey = $(event.target).attr('key');
              var fieldname = $(event.target).attr('tp');
              if (fieldname == 'Origin') {
                _this.SearchForm.get('MultiCity.' + datakey + '')?.patchValue({ 'Origin': ui.item.label, 'OriginCode': ui.item.airport_code, 'OriginCountry': ui.item.country_code });

              } else if (fieldname == "Destination") {
                _this.SearchForm.get('MultiCity.' + datakey + '')?.patchValue({ 'Destination': ui.item.label, 'DestinationCode': ui.item.airport_code, 'DestinationCountry': ui.item.country_code });

                var newkey = parseInt(datakey) + 1;
                if (_this.SearchForm.controls["MultiCity"].value[newkey]) {
                  _this.SearchForm.get('MultiCity.' + newkey + '')?.patchValue({ 'Origin': ui.item.label, 'OriginCode': ui.item.airport_code, 'OriginCountry': ui.item.country_code });

                  $("#multi-f-origin-" + newkey).val(ui.item.label);
                }

              }
            }, 10);

            var inputs = $(this).closest('#flight-form').find(':input');
            inputs.eq(inputs.index(this) + 1).focus().click();
          }

        },
        change: function (event: any, ui: any) {
          $(this).val(ui.item ? ui.item.label : '');
        },
        create: function () {
          $(this).data('ui-autocomplete')._renderItem = function (ul: any, item: any) {
            var label = item.label;
            var airportname = item.airport_name;
            var airportcode = item.airport_code;
            return $("<li>")
              .data("ui-autocomplete-item", item)
              .append(
                "<a href='javascript:void(0)' class='autocomplete-link'>" +
                "<div class='item-left'>" +

                "<span class='city-name''>" +
                label +
                "</span>" +
                "<span class='airport-name'>" +
                "<i class='fa-solid fa-plane-departure'></i>" +
                airportname +
                ")</span>" +
                "</div><div class='item-right'><span class='airport-code'>[" +
                airportcode +
                "]</span></div>" +
                "</a>").appendTo(ul);
          };
        }
      });
    });
    }
    
    flightdepartcalendar()
    {
      $("[data-depart-date]").datepicker("destroy");
      var _this = this;
      $("[data-depart-date]").datepicker({
          defaultDate : "",
          dateFormat : "dd M yy",
          minDate : 0,
          maxDate: '+1Y',
          changeMonth : false,
          numberOfMonths: [1,13],
          beforeShow : function(input:any, inst:any) {
            /*---Start Open in bottom--*/
            var $this = $(this);
            var top = $this.offset().top + $this.outerHeight();
            var left = $this.offset().left;
            setTimeout(function() {
              inst.dpDiv.css({
                    'top': top-1,
                    'left': left,
                    'width':'24.1em',
                    'overflow-x':'scroll',
                    'height':'30em',
                    'z-index':'9999'
                });
                $(".ui-datepicker-next").hide();
                $(".ui-datepicker-prev").hide();

                inst.dpDiv.find('.ui-state-active').css({'background':"var(--primary-color)",'color':'#fff'});
            }, 1);
            /*---End Open in bottom--*/

            if ($(input).attr('key') != undefined) {
              var datakey = parseInt($(input).attr('key'));
              if (datakey != 0) {
                  var newdatakey = datakey - 1;
                  var previousdate =   _this.SearchForm.controls["MultiCity"].value[newdatakey]['DepartDate'];
                  var newdate = new Date(previousdate);
                  $(this).datepicker("option", "minDate", newdate);
              }
            }
          },
          onUpdateDatepicker: function (input:any, inst:any) {
            $(".ui-datepicker-multi").css({'width':'24.1em'});
            $(".ui-datepicker-next").hide();
            $(".ui-datepicker-prev").hide();
          },
          onClose : function(selectedDate:any, inst:any) {
            if ($(inst.input[0]).attr('key') === undefined) {

                var date = new Date(selectedDate);
                date.setDate(date.getDate() + 1);
        
                // Format the date as dd M yy
                var options:any = { day: '2-digit', month: 'short', year: '2-digit' };
                var formattedReturnDate = date.toLocaleDateString('en-GB', options);

                _this.SearchForm.patchValue({DepartDate:selectedDate});
                _this.SearchForm.patchValue({ReturnDate:formattedReturnDate});
                var type = _this.SearchForm.value.Type;
                if (type == "R") {
                  $("[data-return-date]").datepicker("option", "minDate",
                      selectedDate).focus().select();
                      _this.SearchForm.patchValue({ReturnDate:formattedReturnDate});
                }
            } else {
              setTimeout(() => {
                var datakey = parseInt($(inst.input[0]).attr('key'));
                var placeholder = $(inst.input[0]).attr('tp');
                if (placeholder == 'DepartDate') {
                    var newdatakey = datakey + 1;
                    _this.SearchForm.get('MultiCity.'+datakey+'')?.patchValue({'DepartDate':selectedDate});

                    $("#multi-f-destination-"+newdatakey).trigger('focus').click();
                }
               }, 10);

            }
      
          }
        });
    } 
    
    flightreturncalendar()
    {
      $("[data-return-date]").datepicker("destroy");
      var _this = this;
      $("[data-return-date]").datepicker({
          defaultDate : "",
          dateFormat : "dd M yy",
          minDate : 0,
          maxDate: '+1Y',
          changeMonth : false,
          numberOfMonths: [1,13],
          beforeShow : function(input:any, inst:any) {
            /*---Start Open in bottom--*/
            var $this = $(this);
            var cal = inst.dpDiv;
            var top = $this.offset().top + $this.outerHeight();
            var left = $this.offset().left;
            // setTimeout(function() {
            //     cal.css({
            //         'top': top-1,
            //         'left': left,
            //         'width':'24.1em',
            //         'overflow-x':'scroll',
            //         'height':'30em',
            //         'z-index':'9999'
            //     });
            //     $(".ui-datepicker-next").hide();
            //     $(".ui-datepicker-prev").hide();
            //     inst.dpDiv.find('.ui-state-active').css({'background':'#46a086','color':'#fff'});
            // }, 1);

            setTimeout(function() {
            cal.css({
        'top': top - 1,
        'left': left,
        'width': '24.1em',
        'overflow-x': 'scroll',
        'height': '30em',
        'z-index': '9999'
    });

    // 🔥 RESET SCROLL POSITION
    cal.scrollTop(0);

    $(".ui-datepicker-next").hide();
    $(".ui-datepicker-prev").hide();

    inst.dpDiv.find('.ui-state-active')
        .css({'background':"var(--primary-color)",'color':'#fff'});
}, 1);

            /*---End Open in bottom--*/
            _this.gettype('R');
            var selectedDate = _this.SearchForm.value.DepartDate;
            var newdate = new Date(selectedDate);
            $(this).datepicker("option", "minDate",newdate);
          },
          onUpdateDatepicker: function (input:any, inst:any) {
            $(".ui-datepicker-multi").css({'width':'24.1em'});
            $(".ui-datepicker-next").hide();
            $(".ui-datepicker-prev").hide();
          },
          onClose : function(selectedDate:any) {
            _this.SearchForm.patchValue({ReturnDate:selectedDate});
            $("[data-depart-date]").datepicker("option", selectedDate);
          }
        });
    }


  get f() { return this.SearchForm.controls; }
  formatDate(date: any) {
    const options: any = { day: '2-digit', month: 'short', year: 'numeric' };
    return new Intl.DateTimeFormat('en-GB', options).format(date);
  }
  SearchData() {
    this.submitted = true;
    if (this.SearchForm.invalid) {
      return;
    }

    this.Flightloading = true;

    if (this.SearchForm.get('Type')?.value != 'M') {
      if (this.f['OriginCountry'].value == "IN" && this.f['DestinationCountry'].value == "IN") {
        this.SearchForm.patchValue({ Isdomestic: 'true' });
      } else {
        this.SearchForm.patchValue({ Isdomestic: 'false' });
      }
    } else {
      let isdomestic: any = [];
      for (let i = 0; i < this.multicity.length; i++) {
        if (this.SearchForm.get('MultiCity.' + i + '.OriginCountry')?.value && this.SearchForm.get('MultiCity.' + i + '.DestinationCountry')?.value) {
          if (this.SearchForm.get('MultiCity.' + i + '.OriginCountry')?.value == "IN" && this.SearchForm.get('MultiCity.' + i + '.DestinationCountry')?.value == "IN") {
            isdomestic.push('true');
          } else {
            isdomestic.push('false');
          }
        }
      }
      if (isdomestic.includes('false')) {
        this.SearchForm.patchValue({ Isdomestic: 'false' });
      } else {
        this.SearchForm.patchValue({ Isdomestic: 'true' });
      }

    }
    this.SearchForm.patchValue({ 'PreferredAirline': this.preferredairlinedata });

    sessionStorage.setItem('FlightSearch', JSON.stringify(this.SearchForm.value));

    /* --- Start Recent Search ---- */
    let isvaluesame: any = [];
    if (localStorage.getItem('FlightRecentSearch')) {
      let FlightRecentSearch: any = localStorage.getItem('FlightRecentSearch');
      let val = JSON.parse(FlightRecentSearch);
      if (val) {
        if (val.length < 3) {
          val.forEach((element: any) => {
            isvaluesame.push(this.JsonCompare(element, this.SearchForm.value));
          });
          if (Object.values(isvaluesame).indexOf(true) > -1) {
          } else {
            val.push(this.SearchForm.value);
            localStorage.setItem('FlightRecentSearch', JSON.stringify(val));
          }

        } else {
          val.unshift(this.SearchForm.value);
          val.pop();
          localStorage.setItem('FlightRecentSearch', JSON.stringify(val));
        }
      }
    } else {
      this.flightrecent.push(this.SearchForm.value);
      localStorage.setItem('FlightRecentSearch', JSON.stringify(this.flightrecent));
    }


    /* --- End Recent Search ---- */

    let data = []; let searchstring: any;
    data = this.SearchForm.value;
    if (this.SearchForm.value.Type != 'M') {
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
    if (this.SearchForm.value.Type == 'R') {
      Object.assign(searchstring, { ret: data['ReturnDate'].replaceAll(' ', '-') });
    }


    const navigationExtras: NavigationExtras = {
      queryParams: searchstring
    };
    if (this.f['Isdomestic'].value == "true" && this.f['Type'].value == "R") {
      this.router.navigate(['flight/rtsearch'], navigationExtras);
    } else {
      this.router.navigate(['flight/search'], navigationExtras);
    }

  }

  arrayOne(n: number): any[] {
    return Array(n);
  }

  JsonCompare(obj1: any, obj2: any) {
    var keys1 = Object.keys(obj1);
    var keys2 = Object.keys(obj2);
    return keys1.length === keys2.length && Object.keys(obj1).every(key => obj1[key] == obj2[key]);
  }

  TravellerCount() {
    this.SearchForm.patchValue({ Adult: this.adultcount, Child: this.childcount, Infant: this.infantcount });
    let paxcount = this.SearchForm.value.Adult + this.SearchForm.value.Child;
    let infant = this.SearchForm.value.Infant
    if (paxcount > 1) {
      this.travellertxt = paxcount + infant + ' Passengers | ' + this.SearchForm.value.Class
    } else {
      this.travellertxt = paxcount + infant + ' Passenger | ' + this.SearchForm.value.Class
    }
    this.totalpaxcount = paxcount;
    if (paxcount > 9) {
      this.paxcountstop = true;
      $(".paxcount_message").addClass("shake").html("Upto 9 passengers allowed");
      setTimeout(() => {
        $(".paxcount_message").removeClass("shake");
      }, 600);
    } else {
      this.paxcountstop = false;
      $(".paxcount_message").removeClass("shake").html("");
    }
    if (this.infantcount <= this.adultcount) {
    } else {
      $(".paxcount_message").addClass("shake").html("Number of Infants can not exceed number of Adults");
      this.paxcountstop = true;
    }
  }

  PaxDisplay() {
    $(".paxcount_message").removeClass("shake").html("");
    let paxcount = this.SearchForm.value.Adult + this.SearchForm.value.Child;
    if (paxcount > 9) {
      this.TravellerCount();
    }
    else if (this.SearchForm.value.Adult < this.SearchForm.value.Infant) {
      $(".paxcount_message").addClass("shake").html("Number of Infants can not exceed number of Adults");
      this.paxcountstop = true;
    } else {
      this.isShow = !this.isShow;
    }
  }

  SelectPax(nopax: any, type: any) {
    if (type == 'ADT') {
      this.adultcount = nopax;
    }
    if (type == 'CHD') {
      this.childcount = nopax;
    }
    if (type == 'INF') {
      this.infantcount = nopax;
    }
    this.TravellerCount();
  }
  MClass(value: any) {
    this.SearchForm.patchValue({ 'Class': value });
  }

  recentsearch(val: any) {
    if (val) {
      this.SearchForm.patchValue({
        Type: val['Type'],
        Origin: val['Origin'],
        OriginCode: val['OriginCode'],
        OriginCountry: val['OriginCountry'],
        Destination: val['Destination'],
        DestinationCode: val['DestinationCode'],
        DestinationCountry: val['DestinationCountry'],
        DepartDate: val['DepartDate'],
        ReturnDate: val['ReturnDate'],
        Class: val['Class'],
        Nonstop: val['Nonstop'],
        SeriesFare: val['SeriesFare'],
        Adult: val['Adult'],
        Child: val['Child'],
        Infant: val['Infant'],
        Isdomestic: val['Isdomestic'],
        PreferredAirline: val['PreferredAirline'],
      });

      if (val['Type'] == 'M') {
        this.SearchForm.get('MultiCity')?.value.forEach((element: any) => {
          this.multicity.removeAt(element);
        });
        val['MultiCity'].forEach((element: any) => {
          if (element) {

            const cityForm = this.fb.group({
              Origin: [element['Origin']],
              OriginCode: [element['OriginCode']],
              OriginCountry: [element['OriginCountry']],
              Destination: [element['Destination']],
              DestinationCode: [element['DestinationCode']],
              DestinationCountry: [element['DestinationCountry']],
              DepartDate: [element['DepartDate']],
            });
            this.multicity.push(cityForm);
          }
        });
      }
      this.gettype(val['Type']);
      this.SearchData();
    }
  }

  GetPreferredAirline(e: any) {
    if (e.target.checked) {
      this.preferredairlinedata.push(e.target.value);
    } else {
      let index = this.preferredairlinedata.indexOf(e.target.value);
      if (index > -1) {
        this.preferredairlinedata.splice(index, 1);
      }
    }
  }
}
