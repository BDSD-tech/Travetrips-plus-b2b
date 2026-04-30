import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NavigationExtras, Router } from '@angular/router';
import Validation from '../../../utils/validation';
import { HotelService } from '../hotel.service';
import { tts_config } from '../../../../environments/tts_config';
declare var $: any;
@Component({
  selector: 'app-modify-search',
  templateUrl: './modify-search.component.html',
  styleUrls: ['./modify-search.component.css']
})
export class ModifySearchComponent implements OnInit {

  HotelSearchForm: FormGroup;
  roomobject:any=[];
  roomcount=1;
  Occupancy='1 Room 1 Guest';
  Hotelloading=false;
  hotelsubmitted = false;
  isHotelShow = false;
  GetSearchData: any=[];
  isModifyShow = false;
  constructor(private fb:FormBuilder,private router:Router,private hotelservice:HotelService) {

    if(sessionStorage.getItem('HotelSearch')){
  let  hotelSearchdata:any  = sessionStorage.getItem('HotelSearch');
  this.GetSearchData  = JSON.parse(hotelSearchdata);;
    }
    else{
      this.router.navigate(['hotel']);
    }
    this.roomobject = this.GetSearchData['RoomGuests'];
    this.Occupancy=this.GetSearchData['Occupancy'];
    this.roomcount=this.GetSearchData['Room'];
    this.HotelSearchForm = this.fb.group({
      Destination:[ this.GetSearchData['Destination'],Validators.required],
      CityID:[this.GetSearchData['CityID']],
      Occupancy:[this.GetSearchData['Occupancy']],
      CheckIn : [this.GetSearchData['CheckIn'],Validators.required],
      CheckOut : [this.GetSearchData['CheckOut'],Validators.required],
      RoomGuests:[this.roomobject],
      Room:[this.GetSearchData['Room']],
      CountryCode:[this.GetSearchData['CountryCode']],
      Isdomestic:[this.GetSearchData['Isdomestic']],
      Nights:[this.GetSearchData['Nights']],
      MaxRating:[this.GetSearchData['MaxRating']],
      MinRating:[this.GetSearchData['MinRating']],
      Nationality:[this.GetSearchData['Nationality'],Validators.required]
  },{
    validator: Validation.NoofNight('CheckIn', 'CheckOut')
  });
   }

   ngOnInit(): void {
    this.hotelautocomplete();
  }
  modifysearch()
  {
     this.isModifyShow=!this.isModifyShow;
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
    request['RoomGuests'] =  this.fh['RoomGuests'].value;
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
    const navigationExtras: NavigationExtras = {
      queryParams:request
    };
    sessionStorage.setItem('HotelSearch',JSON.stringify(this.HotelSearchForm.value));
    this.router.navigate(['hotel/search'],navigationExtras);
    
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
        this.roomobject[this.roomcount]['Adult']=1;
        this.roomobject[this.roomcount]['Child']=0;
        this.roomcount++;
        this.hoteltotalpaxcount();
    }

  }

  removeroom()
  {
      $(".hotelpaxcount_message").removeClass("shake").html("");
      this.roomcount--;
      this.roomobject[this.roomcount]['Adult']=1;
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
          $(this).autocomplete('widget').css('z-index', 9999);
          return false;
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
                "<div>"
                + "<div class='tts-autosuggest-li'>"
                + "<div class='location-dot'>"
                + "<i class='fa-solid fa-location-dot'></i>"
                + "</div>"
                + "<b class='label'>"
                + label
                + "</b>"
                + "</div>"
                + "</div>").appendTo(ul);
          };
        }
      });
    });
    }
    dateEventEmitter(dateobj:any)
    {
      if(dateobj.calType=='CheckIN') {
        this.HotelSearchForm.patchValue({CheckIn:dateobj.Date});
        let nextdate:any=this.hotelservice.AddDayDefaultDate(dateobj.Date,1);
        this.HotelSearchForm.patchValue({CheckOut:nextdate});
      }
      if(dateobj.calType=='CheckOut') {
        this.HotelSearchForm.patchValue({CheckOut:dateobj.Date});
      }
    
    }


    Cleardata(field:any,key:any=null)
    {
      if(field=='Destination')
      {
        this.HotelSearchForm.patchValue({ Destination:'',CityID:''});
      }
    }
  
}
