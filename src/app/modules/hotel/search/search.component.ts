import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { HotelService } from '../hotel.service';
import { Sort } from '@angular/material/sort';

declare var $: any;
declare var window: any;

@Component({
  selector: 'app-search',
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.css']
})
export class SearchComponent implements OnInit {
  @ViewChild('mapRef', {static: false }) mapElement: ElementRef | undefined;
  routeSubscription!: Subscription;
  
  WebSiteData:any=[];
  GetSearchData: any=[];
  resultloading=true;
  clearfilter:any=false;
  hotelMapModal:any;
  resultlimit=20;
  Response: any=[];
  shownetfare=false;
  sort:any={};
  showincentivefare=false;
  formModal: any;
  formmodalemail: any;
  FilterResponse:any=[];
  filtertype:string | undefined;
  ErrorCode: number | undefined=0;
  ErrorMessage: string | undefined;
  SearchTokenId: string | undefined;
  UserIp:string | undefined;
  APILoading=true;
  sortedData:any =[];
  Resultcount:number | undefined;
  filterresultcount:number| undefined;


  obfield:any='totalfare';

  constructor(private router: Router,private hotelservice:HotelService) {

    this.router.routeReuseStrategy.shouldReuseRoute = function () {
      return false;
    };

    this.routeSubscription = this.router.events.subscribe((event) => {
      if (event instanceof NavigationEnd) {
        // Trick the Router into believing it's last link wasn't previously loaded
        this.router.navigated = false;
      }
    });
    if (sessionStorage.getItem('HotelSearch')) {
      let GetSearchData:any=sessionStorage.getItem('HotelSearch');
      this.GetSearchData=JSON.parse(GetSearchData);
      } else {
      this.router.navigate(['/hotel']);
      }
   }

  ngOnInit(): void {
    sessionStorage.removeItem('time');
    this.GetResult(this.GetSearchData);
    this.windowscroll();
  }

  
  ngOnDestroy() {
    if (this.routeSubscription) {
      this.routeSubscription.unsubscribe();
    }
  }
  GetResult(dataval:any){


    /*------------ Start Session ----------*/
    let initial_date = new Date;
    let added15Min = new Date(initial_date.getTime() + (14*60*1000));
    sessionStorage.setItem('time',JSON.stringify(added15Min));
   
    /*------------ End Session ----------*/

    let room = dataval['Room'] - 1;
    let finalroomobject:any = [];
    dataval['RoomGuests'].forEach(function (value: { Child: number; ChildAge: any[]; Adult: any; }, key: number) {
      if (key <= room) {
        let ChildAge = [];
        if (value.Child == 0) {
          ChildAge = [];
        } else if (value.Child == 1) {
          ChildAge[0] = value.ChildAge[0];
        } else if (value.Child == 2) {
          ChildAge = value.ChildAge;
        }
        let obj = {
          'Adult': value.Adult,
          'Child': value.Child,
          'ChildAge': ChildAge
        }
        finalroomobject[key] = obj;
      }
    });
    let finaldata: any = {};
    finaldata['CheckInDate'] = this.hotelservice.APIDateFormat(dataval['CheckIn']);
    finaldata['CheckOutDate'] = this.hotelservice.APIDateFormat(dataval['CheckOut']);
    finaldata['NoOfNights'] = dataval['Nights'];
    finaldata['CountryCode'] = dataval['CountryCode'];
    finaldata['DestinationCityId'] = dataval['CityID'];
    finaldata['ResultCount'] = null;
    finaldata['Currency'] = "INR";
    finaldata['GuestNationality'] = dataval['Nationality'];
    finaldata['NoOfRooms'] = dataval['Room'];
    finaldata['MaxRating'] = dataval['MaxRating'];
    finaldata['MinRating'] = dataval['MinRating'];
    finaldata['RoomGuests'] = finalroomobject;

    this.hotelservice.HotelResult(finaldata).subscribe(resp => {
      this.resultloading = false;
      let response:any=resp;
      this.ErrorCode = response['Error']['ErrorCode'];
      this.ErrorMessage = response['Error']['ErrorMessage'];
      if(response && response['Error']['ErrorCode']==0)
      {
        this.APILoading  = false;
        this.Response  = response['Result'];
        this.SearchTokenId = response['SearchTokenId'];
        this.Resultcount = response['Result'].length;
        this.filterresultcount = response['Result'].length;
        this.sortedData = this.Response.slice();
        this.FilterResponse['Price'] =  response['Price'];
        this.FilterResponse['LocationType'] =  response['LocationType'];
        this.FilterResponse['HotelName'] =  response['HotelName'];
        this.FilterResponse['StarRatingType'] =  response['StarRatingType'];
        this.FilterResponse['HotelFacilitiesList'] =  response['HotelFacilitiesList'];
        this.FilterResponse['HotelMealType'] =  response['HotelMealType'];
        this.FilterResponse['HotelAddressList'] =  response['HotelAddressList'];
        this.FilterResponse['FareType'] =  response['FareType'];

      }
    });
  }

  selecthotel(item:any) {
    window.open('hotel/hotel-detail?stoken='+this.SearchTokenId+'&hcode='+item['HotelCode']+'&rindex='+item['ResultIndex']+'', '_blank');
  }

  star_rating(star: number) {
    var starhtml = "";
    const count = 5 - star;
    for (let index = 0; index < star; index++) {
      starhtml += '<img src="assets/img/fill-star.svg">';
    }
    for (let index = 0; index < count; index++) {
      starhtml += '';
    }
    return starhtml;
  }
  ShowMap(item:any)
  {
       this.hotelMapModal = new window.bootstrap.Modal(
        document.getElementById('hotel-map')
      );
      this.hotelMapModal.show()
      document.getElementById("showmap-title")!.innerHTML=item['HotelName'];
      document.getElementById("showmap-address")!.innerHTML=item['HotelAddress'];
      window['initMap'] = () => {
        this.loadMap(item);
      }
      if(!window.document.getElementById('google-map')) {
        var s = window.document.createElement("script");
        s.id = "google-map";
        s.type = "text/javascript";
        s.src = "https://maps.googleapis.com/maps/api/js?key=AIzaSyB_CuOFHUtZhKKJUA_xlRJiodvGo6aCeNA&callback=initMap";

        window.document.body.appendChild(s);
      } else {
        this.loadMap(item);
      }
  }

  loadMap = (item:any) => {

    let lat :number=Number(item['Latitude']);
    let lng :number=Number(item['Longitude']);
    var map = new window['google'].maps.Map(this.mapElement?.nativeElement, {
      center: {lat:lat, lng: lng},
      zoom: 16
    });

    var marker = new window['google'].maps.Marker({
      position: {lat:lat, lng: lng},
      map: map,
      title: item['HotelName'],
      draggable: true,
      animation: window['google'].maps.Animation.DROP,
    });

    var contentString = '<div id="content">'+
    '<div id="siteNotice">'+
    '</div>'+
    '<h3 id="thirdHeading" class="thirdHeading">'+item['HotelName']+'</h3>'+
    '<div id="bodyContent">'+
    '<p>'+item['HotelAddress']+'</p>'+
    '</div>'+
    '</div>';

    var infowindow = new window['google'].maps.InfoWindow({
      content: contentString
    });

      marker.addListener('click', function() {
        infowindow.open(map, marker);
      });
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
  receiveMessage($event:any){
    this.sortedData=$event.response;
    this.filterresultcount=this.sortedData.length;
    this.Resultcount=this.filterresultcount;
    this.resultlimit=20;
    this.clearfilter=false;
  }
  receiveFare($event:any){
    if($event.type=='incv')
    {
      this.showincentivefare=$event.val;
    }
    if($event.type=='net')
    {
      this.shownetfare=$event.val;
    }
  }
  
  resetfilterdata()
  {
    this.clearfilter=true;
  }
  topsort(active:any,direction:any,event:any)
  {
    let sort={
              "active":active,
              "direction":direction
             };
    this.sort=sort;         
    this.sortData(sort);
  }

  sortData(sort: Sort) {
    const data = this.sortedData.slice();
    if (!sort.active || sort.direction === '') {
      this.sortedData = data;
      return;
    }
    
    this.obfield=sort.active;
    this.sortedData = data.sort((a:any, b:any) => {
      const isAsc = sort.direction === 'asc';
      switch (sort.active) {
        case 'totalfare': return compare(parseFloat(a.Price.PublishedPrice), parseFloat(b.Price.PublishedPrice), isAsc);
        case 'hotelname': return compare(a.HotelName, b.HotelName, isAsc);
        case 'starrating': return compare(a.StarRating, b.StarRating, isAsc);
        default: return 0;
      }
    });
  }
}
function compare(a: number | string, b: number | string, isAsc: boolean) {
  return (a < b ? -1 : 1) * (isAsc ? 1 : -1);
}

