import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NavigationExtras, Router } from '@angular/router';
import { HotelService } from './hotel.service';
import Validation from '../../utils/validation';
import { tts_config } from '../../../environments/tts_config';
import { CommonService } from '../../services/common.service';
import { __values } from 'tslib';
declare var $: any;

@Component({
  selector: 'app-hotel',
  templateUrl: './hotel.component.html',
  styleUrls: ['./hotel.component.css']
})
export class HotelComponent implements OnInit {

  GetWebSiteData:any=[];
  Offer:any=[];
  Notifications:any=[];
  offerloading=true;

  HotelSearchForm: FormGroup;
  roomobject:any=[];
  roomcount=1;
  Occupancy='1 Room 2 Guest';
  Hotelloading=false;
  hotelsubmitted = false;
  isHotelShow = false;


  StarRatingList: string[] = ['5 Star', '4 Star', '3 Star', '2 Star', '1 Star'];

  NationalityLits:any=[];

  BlogList:any=[];
  TestimonialsList:any=[];


  getRecentSearch:any=[]

  hotelrecent:any=[]
  constructor(public fb: FormBuilder,private router: Router,private hotelservice:HotelService,private commonservice:CommonService) {
    for(var i = 0; i<4; i++)
      {
        let roomObject={
                            'Adult':2,
                            'Child':0,
                            'ChildAge':[1,1]
                          };
         this.roomobject.push(roomObject);
      }

      let CheckIn=hotelservice.DefaultDateFormat(hotelservice.GetCurrentDate(1));
      let CheckOut=hotelservice.DefaultDateFormat(hotelservice.GetCurrentDate(2));

      this.HotelSearchForm = this.fb.group({
                Destination:['',Validators.required],
                CityID:[''],
                Occupancy:[this.Occupancy],
                CheckIn : [CheckIn,Validators.required],
                CheckOut : [CheckOut,Validators.required],
                RoomGuests:[this.roomobject],
                Room:[this.roomcount],
                CountryCode:['IN'],
                Isdomestic:['true'],
                Nights:[],
                MaxRating:[5],
                MinRating:[0],
                Nationality:['IN',Validators.required]
            },{
              validator: Validation.NoofNight('CheckIn', 'CheckOut')
            });
   }

  ngOnInit(): void {
    sessionStorage.removeItem('HotelSearch');
    sessionStorage.removeItem('time');
    this.HotelCheckInDate();
    this.HotelCheckOutDate();
    this.hotelautocomplete();

    this.commonservice.GetWebSiteData().subscribe(data => {
      this.GetWebSiteData =data;
    });
    this.commonservice.GetHomeOffer().subscribe(data => {
      this.Offer=data;
      this.offerloading=false; 
    });
    this.commonservice.GetHomeNotifications().subscribe(data => {
      this.Notifications=data;
    });

    // this.commonservice.GetBlogList().subscribe(data => {
    //   this.BlogList=data;
    // });

    // this.commonservice.GetTestimonialsList().subscribe(data => {
    //   this.TestimonialsList=data;
    // });

    this.commonservice.dialcode().subscribe(data => {
      let resp:any=data;
      if(resp['Error']['ErrorCode']==0)
      {
          this.NationalityLits=resp['Result'];
      }
    });
    if(sessionStorage.getItem('HotelRecentSearch')){
    let recentdata:any=sessionStorage.getItem('HotelRecentSearch');
    let val:any=JSON.parse(recentdata);
    if(val)
      {
        let finalsearch:any=[];
        let currentdate=this.hotelservice.DateToTimestamp(this.hotelservice.AddDayDefaultDate(new Date(),0));
          val.forEach((element:any) => {
             let deptime=this.hotelservice.DateToTimestamp(element['CheckIn']);
              if(currentdate <= deptime)
              {
                finalsearch.push(element);
              }
          });
          this.getRecentSearch=finalsearch;
      } 
    }

  }

  get fh() { return this.HotelSearchForm.controls; }

  HotelSearchData() {
    this.hotelsubmitted = true;
    if (this.HotelSearchForm.invalid) {
      return;
    }

    this.Hotelloading=true;
    let night=this.hotelservice.Calculatedatediff(this.HotelSearchForm.get('CheckIn')?.value,this.HotelSearchForm.get('CheckOut')?.value);
    this.HotelSearchForm.patchValue({ Nights: night });
    let request :any =  {};
    request['CheckOutDate'] =  this.fh['CheckOut'].value;
    request['CheckInDate'] =  this.fh['CheckIn'].value;
    request['NoOfNights'] =  night;
    request['CountryCode'] =  this.fh['CountryCode'].value;
    request['DestinationCityId'] =  this.fh['CityID'].value;
    request['GuestNationality'] =  this.fh['Nationality'].value;
    request['NoOfRooms'] =  this.fh['Room'].value;
    request['RoomGuests'] =  JSON.stringify(this.fh['RoomGuests'].value);
    request['MaxRating'] =  this.fh['MaxRating'].value;
    request['MinRating'] =  this.fh['MinRating'].value;
    let CountryCode  =  this.HotelSearchForm.get('CountryCode')?.value;
    if(CountryCode=='IN'){
      let isdomestic =  true;
      this.HotelSearchForm.patchValue({'Isdomestic':isdomestic});
    }
    else{
      let isdomestic =  false;
      this.HotelSearchForm.patchValue({'Isdomestic':isdomestic});
    }


      /* --- Start Recent Search ---- */
     let isvaluesame:any=[];
    //  this.storageservice.getObject('HotelRecentSearch').then((val:any) => {
   
      let recentdata:any=sessionStorage.getItem('HotelRecentSearch');
      let val:any=JSON.parse(recentdata);
        if(val)
         {
           if(val.length<6)
           {
             val.forEach((element:any) => {
               isvaluesame.push(this.JsonCompare(element,this.HotelSearchForm.value));
             });
             if (Object.values(isvaluesame).indexOf(true) > -1) {
             } else {
               val.push(this.HotelSearchForm.value);
              sessionStorage.setItem('HotelRecentSearch',JSON.stringify(val));
             }
           } else {
             val.unshift(this.HotelSearchForm.value);
             val.pop();
             sessionStorage.setItem('HotelRecentSearch',JSON.stringify(val));
           }
         } else { 
           this.hotelrecent.push(this.HotelSearchForm.value);
           sessionStorage.setItem('HotelRecentSearch',JSON.stringify(this.hotelrecent));
         }


    //  });
    /* --- End Recent Search ---- */

  


    const navigationExtras: NavigationExtras = {
      queryParams:request
    };
    sessionStorage.setItem('HotelSearch',JSON.stringify(this.HotelSearchForm.value));
    this.router.navigate(['hotel/search'],navigationExtras);
  }


  JsonCompare(obj1:any, obj2:any)
  {
    var keys1 = Object.keys(obj1);
    var keys2 = Object.keys(obj2);
    return keys1.length === keys2.length && Object.keys(obj1).every(key=>obj1[key]==obj2[key]);
  }
  HotelPaxDisplay()
  {
    this.isHotelShow = !this.isHotelShow;
  }
  arrayOne(n: number): any[] {
    return Array(n);
  }
  addroom()
  {
    if(this.roomcount < 4)
    {
        $(".hotelpaxcount_message").removeClass("shake").html("");
        this.roomobject[this.roomcount]['Adult']=2;
        this.roomobject[this.roomcount]['Child']=0;
        this.roomcount++;
        this.hoteltotalpaxcount();
    }

  }

  removeroom()
  {
      $(".hotelpaxcount_message").removeClass("shake").html("");
      this.roomcount--;
      this.roomobject[this.roomcount]['Adult']=2;
      this.roomobject[this.roomcount]['Child']=0;
      this.hoteltotalpaxcount();
  }

  hotelplus(paxtype : string, room :number)
  {
    $(".hotelpaxcount_message").removeClass("shake").html("");
    if(paxtype==='a') {
      if(this.roomobject[room]['Adult'] < 4)
      {
        let adtcount=this.roomobject[room]['Adult'];
        adtcount++;
        this.roomobject[room]['Adult']=adtcount;
      } else {
        $(".hotelpaxcount_message").addClass("shake").html("Maximum 4 Adults Allowed in one Room");
      }
    } else if(paxtype==='c')
    {
      if(this.roomobject[room]['Child'] < 2)
      {
         let chdcount=this.roomobject[room]['Child'];
         chdcount++;
         this.roomobject[room]['Child']=chdcount;
      } else {
        $(".hotelpaxcount_message").addClass("shake").html("Maximum 2 Child Allowed in one Room");
      }
    }
    this.hoteltotalpaxcount();
  }
  hotelminus(paxtype : string, room :number)
  {
    $(".hotelpaxcount_message").removeClass("shake").html("");
     if(paxtype==='a') {

      if(this.roomobject[room]['Adult']!=1)
      {
        let adtcount=this.roomobject[room]['Adult'];
        adtcount--;
        this.roomobject[room]['Adult']=adtcount;
      }

    } else if(paxtype==='c')
    {
      if(this.roomobject[room]['Child']!=0) {
        let chdcount=this.roomobject[room]['Child'];
        chdcount--;
        this.roomobject[room]['Child']=chdcount;
      }
    }
    this.hoteltotalpaxcount();
  }
  childage(event : any, childcount :number , room :number)
  {
    let age=event.target.value;
    if(childcount==0)
    {
      this.roomobject[room]['ChildAge'][0]=age;
    } else if(childcount==1)
    {
      this.roomobject[room]['ChildAge'][1]=age;
    }
    this.HotelSearchForm.patchValue({RoomGuests:this.roomobject});
  }

  hoteltotalpaxcount()
  {
    let room=this.roomcount-1;
    let paxcount=0;
    let finaltxt='';
    let roomtxt='';
    let paxtxt='';
    this.roomobject.forEach(function(value: { Adult: number; Child: number; } , key: number) {
      if(key<=room) {
          paxcount+=value.Adult;
          paxcount+=value.Child;
      }
    });

    if(this.roomcount > 1)
    {
      roomtxt=this.roomcount + " Rooms ";
    } else {
      roomtxt=this.roomcount + " Room ";
    }

    if(paxcount > 1)
    {
      paxtxt=paxcount + " Guests";
    } else {
      paxtxt=paxcount + " Guest";
    }

    finaltxt=roomtxt + paxtxt;
    this.Occupancy=finaltxt;

    this.HotelSearchForm.patchValue({RoomGuests:this.roomobject,Occupancy:this.Occupancy,Room:this.roomcount});
  }
  HotelCheckInDate()
  {
    var _this = this;
    $("[data-checkin-date]").datepicker({
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
          // setTimeout(function() {
          //   inst.dpDiv.css({
          //         'top': top-1,
          //         'left': left,
          //         'width':'24.1em',
          //         'overflow-x':'scroll',
          //         'height':'30em',
          //         'z-index':'9999'
          //     });
          //     $(".ui-datepicker-next").hide();
          //     $(".ui-datepicker-prev").hide();
          //     inst.dpDiv.find('.ui-state-active').css({'background':'var(--second-color)','color':'#fff'});
          // }, 1);
          /*---End Open in bottom--*/
        },
        onUpdateDatepicker: function (input:any, inst:any) {
          $(".ui-datepicker-multi").css({'width':'24.1em'});
          $(".ui-datepicker-next").hide();
          $(".ui-datepicker-prev").hide();
        },
        onClose : function(selectedDate:any, inst:any) {

              let nextdate:any=_this.hotelservice.AddDayDefaultDate(selectedDate,1);
              var newdate = _this.hotelservice.DefaultDateFormat(nextdate);
              _this.HotelSearchForm.patchValue({CheckIn:selectedDate,CheckOut:newdate});

              $(this).datepicker("option");
              $("[data-checkout-date]").datepicker("option", "minDate",selectedDate).focus().select();
        }
      });
  } 
  
  HotelCheckOutDate()
  {
    var _this = this;
    $("[data-checkout-date]").datepicker({
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
          //     cal.scrollTop(0);
          //     $(".ui-datepicker-next").hide();
          //     $(".ui-datepicker-prev").hide();
          //     inst.dpDiv.find('.ui-state-active').css({'background':'var(--second-color)','color':'#fff'});
          // }, 1);
         
          /*---End Open in bottom--*/
          
          var selectedDate = _this.HotelSearchForm.get('CheckIn')?.value;
          var nextdate:any= _this.hotelservice.AddDayDefaultDate(selectedDate,1);
          var newdate = new Date(nextdate);
          $(this).datepicker("option", "minDate",newdate);

        },
        onUpdateDatepicker: function (input:any, inst:any) {
          $(".ui-datepicker-multi").css({'width':'24.1em'});
          $(".ui-datepicker-next").hide();
          $(".ui-datepicker-prev").hide();
        },
        onClose : function(selectedDate:any) {
          _this.HotelSearchForm.patchValue({CheckOut:selectedDate});
          $("[data-checkin-date]").datepicker("option", selectedDate);
        }
      });
  }
  openautocomplete(event:any,type:any)
  {
    $(event.target).autocomplete( "search", "" );
  }
  hotelautocomplete() {
    var _this = this;
    $(document).on('focus','.autosuggeest-hotel',() => {
      $(".autosuggeest-hotel").autocomplete({
        minLength: 0,
        maxResults: 15,
        source: function (request:any, response:any) {
          let url = tts_config.APIURL + '/hotel/destinations';
          $.ajax({
            url: url,
            dataType: "json",
            cache: false,
            data: {
              term: request.term
            },
            success: function (data:any) {
              response(data);
            }
          });
        },
        open: function () {
          $(".ui-autocomplete").addClass('ttsautocomplet');
        },
        select: function (event:any, ui:any) {
            var fieldname = $(this).attr('formControlName');
            if(fieldname=="Destination")
            {
                _this.HotelSearchForm.patchValue({Destination:ui.item.label,CityID:ui.item.city_id,CountryCode:ui.item.country_code});
            } 
            var inputs = $(this).closest('#hotel-form').find(':input');
            inputs.eq(inputs.index(this) + 1).focus().click(); 
        },
        change: function (event:any, ui:any) {
          $(this).val(ui.item ? ui.item.label : '');
        },
        create: function () {
          $(this).data('ui-autocomplete')._renderItem = function (ul:any, item:any) {
            var label = item.label;
            return $("<li>")
              .data("ui-autocomplete-item", item)
               .append(
                  "<a href='javascript:void(0)' class='autocomplete-link justify-content-start'>" +
                      
                          "<i class='fa fa-map-marker-alt location-icon'></i>" +
                          "<span class='city-name'>" + label + "</span>" +
                      
                  "</a>"
              ).appendTo(ul);
          };
        }
      });
    });
    }


    Cleardata(field:any,key:any=null)
    {
      if(field=='Destination')
      {
        this.HotelSearchForm.patchValue({ Destination:'',CityID:''});
      }
    }


    recentsearch(val:any)
  {
    if(val) { 
      this.HotelSearchForm.patchValue(val);
      this.HotelSearchData();
    }
   
  }

}
