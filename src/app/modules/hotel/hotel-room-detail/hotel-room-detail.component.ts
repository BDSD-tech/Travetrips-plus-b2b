import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, NavigationExtras, Router } from '@angular/router';
import { HotelService } from '../hotel.service';
import { MatDialog } from '@angular/material/dialog';
import { DialogModalComponent } from '../../modal/dialog-modal/dialog-modal.component';
import { AlertService } from '../../../services/alert.service';
import { ViewportScroller } from '@angular/common';

declare var window:any;
declare var bootstrap:any;

@Component({
  selector: 'app-hotel-room-detail',
  templateUrl: './hotel-room-detail.component.html',
  styleUrls: ['./hotel-room-detail.component.css']
})
export class HotelRoomDetailComponent implements OnInit {

  @ViewChild('mapRef') mapElement: ElementRef | undefined;
  Selecttab:any='Overview';
  Requestparams :any = [];
  HotelInfoErrorCode : string|undefined|0;
  HotelInfoErrorMessage :string|undefined;
  HotelInfoResult  :any = [];
  HotelRoomPriceData  :any = [];
  HotelRoomData  :any = [];
  HotelRoomPrices  :any = [];
  AboutRooms  :any = [];
  CancellationPolicyData  :any = [];
  CancellationPolicyModal  :any;
  AboutRoomsModal:any;
  SearchTokenId :any = '';
  InfoSourceval :String = '';
  HotelLoading :any = true;
  HotelRoomLoading :any = true;
  Blockroomloading :any = true;
  HotelRoomErrorCode : string|undefined|0;
  HotelRoomErrorMessage :string|undefined;

  GetSearchData: any=[];

  dialogRef:any;

  selectroomtxt:string='';
  totalpubprice=0;
  reqloading = false;


  CancellationPolicytext:any=''
  MealTypetext:any=''
  RoomNameText:any=''
  Result:any=[]
  RoomeNameList:any=[]

  sortedRooms:any=[]

  min:any=0
  max:any=0
  price:any={
    "min":0,
    "max":0
  };
  constructor(private viewportScroller: ViewportScroller,public dialog: MatDialog,private router:Router,private route:ActivatedRoute,private Hotelservice:HotelService, private alertService:AlertService) {

    this.route.queryParams.subscribe(params  => {
    if(this.isEmpty(params)){
        this.router.navigate(['/hotel']);
        }  
        else{
          this.Requestparams = params;
        }
    })

    if (sessionStorage.getItem('HotelSearch')) {
      let GetSearchData:any=sessionStorage.getItem('HotelSearch');
      this.GetSearchData=JSON.parse(GetSearchData);
      } else {
      this.router.navigate(['/hotel']);
    }

   }

  ngOnInit(): void 
  {
    let RequestData  =  {
      'SearchTokenId':this.Requestparams['stoken'],
      'HotelCode':this.Requestparams['hcode'],
      'ResultIndex':this.Requestparams['rindex'],
    }
    this.GetHotelInfo(RequestData);
    this.GetHotelRoomInfo(RequestData);  
  }


  formatCustomDate(dateString: string): Date {
  // Convert "27-07-2025T00:00:00" to "2025-07-27T00:00:00"
  const [day, month, yearWithTime] = dateString.split('-');
  const [year, time] = yearWithTime.split('T');
  const isoDate = `${year}-${month}-${day}T${time}`;
  return new Date(isoDate);
}



 scrollToLetter(letter: string): void {
    this.Selecttab = letter;

    const element = document.getElementById(letter);

    if (element) {
      const offset = 200; 
      const y = element.getBoundingClientRect().top + window.pageYOffset - offset;

      window.scrollTo({
        top: y,
        behavior: 'smooth'
      });
    }
  }
  GetHotelInfo(Request:any)
  {
    this.Hotelservice.HotelInfo(Request).subscribe(res=>{
        this.HotelLoading =false;
        let response:any =res;
        this.HotelInfoErrorCode =  response['Error']['ErrorCode'];
        this.HotelInfoErrorMessage =  response['Error']['ErrorMessage'];
        this.SearchTokenId  =  response['SearchTokenId'];
        if(response['Error']['ErrorCode']==0)
        {
          this.HotelInfoResult =  response['Result'];
          setTimeout(() => {
            this.ShowMap(this.HotelInfoResult);
          }, 1000);
        }
    });
  }

  GetHotelRoomInfo(Request:any)
  {
      this.Hotelservice.HotelRoom(Request).subscribe(res=>{
          this.HotelRoomLoading =false;
          let  response:any = res;
          this.Result=response['Result']
          this.HotelRoomErrorCode =  response['Error']['ErrorCode'];
          this.HotelRoomErrorMessage =  response['Error']['ErrorMessage'];
          this.HotelRoomData =  response['Result']['RoomDataWithRoomType'];
          //this.RoomeNameList =  response['Result']['RoomTypeNameList'];
          this.sortedRooms= this.HotelRoomData.slice();
          this.price=this.Result['Price']
          this.min=this.price['min']
          this.max=this.price['max']
          
          this.HotelRoomPriceData =  response['Result']['FinalPriceDataRoomData'];
          this.InfoSourceval  =  response['Result']['InfoSource'];
      });
  }

  isEmpty(obj:any) {
    return Object.keys(obj).length === 0;
  }


  GetPricefilter(){
   this.Filter()
    
  }
  HotelFacilities(item:any)
  {
    let Facilities="";
      if(item) {
        item.forEach(function(value:any , key:any) {
          let a= value.split(',');
          if(a){
            a.forEach(function(v:any, k:any) {
              Facilities+='<li class="facility-list__li">'+ v +'</li>';
            });
          }
        });
      }
      return Facilities;
  }
  HotelAttractions(item:any)
  {
    let Attractions="";
      if(item) {
        item.forEach(function(value:any , key:any) {
          if(value['Value']){
            Attractions+='<li>'+ value['Value'] +'</li>';
       }
   
        });
      }
      return Attractions;
  }
  Replace(val:any,repl:any){
    return val.replace(repl,' ')
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



 findPosition(obj:any):number[] | undefined {
      let currenttop = 0;
      if (obj.offsetParent) {
      do {
      currenttop += obj.offsetTop-100;
      } while ((obj = obj.offsetParent));
      }
      return [currenttop];
}

ShowMap(item:any)
{
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
  '<p>'+item['Address']+'</p>'+
  '</div>'+
  '</div>';

  var infowindow = new window['google'].maps.InfoWindow({
    content: contentString
  });

    marker.addListener('click', function() {
      infowindow.open(map, marker);
    });
}

ContinueRoom(item:any,type:string,priceKey:any)
{
  this.OpenConfirmDialog();
  this.BlockRoom(item,type,priceKey);
}

ContinueOpen()
{
     
}

RoomDescription(item:any)
{
  this.AboutRooms  =  item;
  this.AboutRoomsModal=new bootstrap.Modal(
    document.getElementById('AboutRomms')
  );
  this.AboutRoomsModal.show();
}

CancellationPolicy(item:any)
{
  this.CancellationPolicyData  =  item;
  this.CancellationPolicyModal=new bootstrap.Modal(
    document.getElementById('CancellationPolicyModal')
  );

  this.CancellationPolicyModal.show();
}

BlockRoom(roomData:any,type:string,priceKey:any)
{

    let selectHotelRoomsDetails:any=[];  
    roomData['RoomData'].forEach((item:any, index:any)=>{
      let Roomdata:any ={};
      Object.assign(Roomdata, {'RoomIndex': item['RoomIndex']});
      selectHotelRoomsDetails.push(Roomdata);
    })
    let data:any={};
    data['HotelName'] =  this.HotelInfoResult['HotelName'];
    data['ResultIndex'] =  this.Requestparams['rindex'];
    data['HotelCode'] =  this.Requestparams['hcode'];
    data['NoOfRooms'] =  this.GetSearchData['Room'];
    data['SearchTokenId'] =  this.Requestparams['stoken'];
    data['HotelRoomsDetails'] =  selectHotelRoomsDetails;
    this.Hotelservice.HotelBlock(data).subscribe(result=>{
      let response:any = result;
      this.Blockroomloading=false;
      this.dialogRef.close();
      if(response['Error']['ErrorCode']==0)
      {
        sessionStorage.setItem("HotelBlockRoomData",JSON.stringify(response));
        if(response['Result']['IsPriceChanged'])
        {
        let  OldPrie  =  this.HotelRoomPriceData[priceKey];
        let NewPrice =  response['Result']['TotalPrice'];
        let PricedMessage='<div class="col-lg-12 text-center">'
             +'<table class="table">'
               +'<tbody class="border">'
               +'<tr>'
               +'<td>Old Fare was-</td>'
               +'<td>₹ '+this.Hotelservice.transformDecimal(OldPrie)+' </td>'
               +'</tr>'
               +'<tr>'
               +'<td> New Fare is -</td>'
               +'<td class="text-danger">₹ '+this.Hotelservice.transformDecimal(NewPrice)+'</td>'
               +'</tr>'
               +'</table>'
               +'</div>';
               this.alertService.error(PricedMessage);
        }
        else
        {
          const navigationExtras: NavigationExtras = {
            queryParams:{'stoken':this.Requestparams['stoken'],'hcode':this.Requestparams['hcode'],'rindex':this.Requestparams['rindex']}
          };
          this.router.navigate(['hotel/itinerary'],navigationExtras);
        }  
       
      }
      else{
        this.alertService.error(response['Error']['ErrorMessage']);
      }
    });
}

OpenConfirmDialog()
  {
      this.dialogRef =this.dialog.open(DialogModalComponent,{
        height: '200px',
        width: '500px',
        data: { servicetype: 'loading' },
      });
  }

  Filter(){
  let filter:any={}
  if(this.CancellationPolicytext){
      filter['IsRefundable']=this.CancellationPolicytext
  }
  if(this.MealTypetext){
      filter['MealType']=this.MealTypetext
  }
  if(this.RoomNameText!==''){
      filter['RoomType']=this.RoomNameText
  }
  let filtereesp:any=[]
  let filteresp:any=[]
  filtereesp = this.doFilter(this.HotelRoomData,filter)

  filtereesp.forEach((roomType: any) => {
      let rooms:any=[]
      roomType['Rooms'].forEach((room:any) => {
        if(room['Price'] >=this.min  && room['Price'] <=this.max){
          rooms.push(room)
        }
      });
      if(rooms.length!==0){
        filteresp.push({
           ...roomType,
          Rooms: rooms
        })
      }
    });
    
    this.sortedRooms=filteresp;

  }
  ResetFilter(){
    this.RoomNameText=''
    this.MealTypetext=''
    this.CancellationPolicytext=''
    this.RoomeNameList=[]
    this.min=this.price['min']
    this.max=this.price['max']
    this.Filter();
  }

  Search_room(){
    if(this.RoomNameText!==''){
    let data= this.Result['RoomTypeNameList'].filter((val:any) =>
      val.toLowerCase().includes(this.RoomNameText));
       this.RoomeNameList=data;
    }
    
    
    
  }

  doFilter(array:any,filter:any){
   
    const filterKeys = Object.keys(filter);
    const resp: any[] = [];
    array.forEach((roomType: any) => {
      const filteredRooms = roomType.Rooms.filter((room: any) =>
        filterKeys.every(key => filter[key].includes(room[key]))
      );

      if (filteredRooms.length > 0) {
        resp.push({
          ...roomType,
          Rooms: filteredRooms
        });
      }
    });
    return resp;
    
  }
}
