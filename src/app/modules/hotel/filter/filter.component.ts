import { keyframes } from '@angular/animations';
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Router } from '@angular/router';
import { __values } from 'tslib';
declare  var  $:any;
@Component({
  selector: 'app-filter',
  templateUrl: './filter.component.html',
  styleUrls: ['./filter.component.css']
})
export class FilterComponent implements OnInit {
  @Input('result') Response : any =[];
  @Input('filter') Filter : any =[];
  @Input('clearfilter') clearfilter : any =[];
  @Output() messageEvent =  new EventEmitter();
  @Output() fareEvent = new EventEmitter();
  GetSearchData: any=[];

  filterresponse:any=[];

  shownetfare=false;
  showincentivefare=false;
  LocationType:any=[];

  HotelNameList:any=[];
  HotelFacilitiesList:any=[];
  HotelAddressList:any=[];
  PicodeList:any=[];

  InputHotelNametxt:any='';
  HotelFacilityText:any='';
  HotelAddressText:any='';

  InputPincodetxt:any='';


  SelectedHotelName='';
  SelectedHotelFacility='';
  SelectedHotelAddress='';
  SelectedHotelPinCode='';
  
  min:any=0;
  max:any=0;
  constructor(private router:Router ) {
    if (sessionStorage.getItem('HotelSearch')) {
      let HotelSearch:any=sessionStorage.getItem('HotelSearch');
      this.GetSearchData = JSON.parse(HotelSearch);
    } else {
      this.router.navigate(['/hotel']);
    }
   }

  ngOnInit(): void {
    this.LocationType  =  this.Filter['LocationType'];
    this.min=this.Filter?.['Price']?.['min']
    this.max=this.Filter?.['Price']?.['max']
  }

  ngOnChanges() {
    if(this.clearfilter)
    {
      this.clearFilterByCat('all'); 
    }
  }
  
  showfares(type:any,val:any) {
    let obj={
                'type':type,
                'val':val
            }
    this.fareEvent.emit(obj);
  }
  togglebutton(event:any)
  {
    if(event.target.classList.contains("collapsed"))
    {
      event.target.classList.remove('fa-minus');
      event.target.classList.add('fa-plus');
    } else {
      event.target.classList.add('fa-minus');
      event.target.classList.remove('fa-plus');
    }
  }
  clearFilterByCat(type:any)
  {
   
    if(type=='all')
    {
      this.resetfilter(this.Filter['StarRatingType']);
      this.resetfilter(this.Filter['LocationType']);
      this.min=this.Filter?.['Price']?.['min']
      this.max=this.Filter?.['Price']?.['max']
    }

    if(type=='Price')
    {
      this.min=this.Filter?.['Price']?.['min']
      this.max=this.Filter?.['Price']?.['max']
    }
    if(type=='HotelName')
    {
      this.InputHotelNametxt='';
      this.SelectedHotelName='';
      this.HotelNameList=[];
    }
    if(type=='PinCode')
    {
      this.InputPincodetxt='';
      this.SelectedHotelPinCode='';
      this.PicodeList=[];
    }
    if(type=='HotelFacilitiesList')
    {
      this.HotelFacilityText='';
      this.SelectedHotelFacility='';
      this.HotelFacilitiesList=[];
    }
    if(type=='HotelAddressList')
    {
      this.HotelAddressText='';
      this.SelectedHotelAddress='';
      this.HotelAddressList=[];
    }
    if(type=='StarRating')
    {
      this.resetfilter(this.Filter['StarRatingType']);
    }
    if(type=='PropertyType')
    {
      this.resetfilter(this.Filter['PropertyType']);
    }
    if(type=='HotelMealType')
    {
      this.resetfilter(this.Filter['HotelMealType']);
    }
    if(type=='FareType')
    {
      this.resetfilter(this.Filter['FareType']);
    }
    if(type=='Location')
    {
      this.resetfilter(this.Filter['LocationType']);
    }
    this.doFilter('re-call', '', '');
  }

  doFilter(type:any,event:any,item:any){
      if(type=='StarRating')
      {
        if(event.target.checked){
          item['isChecked']=true;
        }
        else{
          item['isChecked']=false;
        }
          
      }
      if(type=='HotelLocation')
      {
        if(event.target.checked){
          item['isChecked']=true;
        }
        else{
          item['isChecked']=false;
        }
      }
      let hotelname='';
      if(type=='HotelName')
      {
        hotelname=item;
      }
      let pincode='';
      if(type=='PinCode')
      {
        pincode=item;
      }
      let hotelfacility=''
      if(type=='HotelFacilitiesList')
      {
        hotelfacility=item;
      }
      
    let min = this.Filter['Price']['min'];
    let max = this.Filter['Price']['max'];
    

    let FilterData:any=[];
    FilterData=this.Filter;
    setTimeout(() => {

      let filtered:any;
      let filters:any = [];
      let filteredResult:any = [];

      let StarRatingType = this.checkedfilter(FilterData['StarRatingType'],'label');
      let HotelMealType = this.checkedfilter(FilterData['HotelMealType'],'label');
      let LocationType = this.checkedfilter(FilterData['LocationType'],'label');
      let FareType = this.checkedfilter(FilterData['FareType'],'label');
      let PropertyType = this.checkedfilter(FilterData['PropertyType'],'label');
      
      if(PropertyType.length !== 0) 
      {
          filters['PropertyType'] = PropertyType;
      }
      if(FareType.length !== 0) 
      {
          filters['FareType'] = FareType;
      }
      if(HotelMealType.length !== 0) 
      {
          filters['MealType'] = HotelMealType;
      }
      if(StarRatingType.length !== 0) 
      {
          filters['StarRating'] = StarRatingType;
      }
      if(LocationType.length !== 0) 
      {
          filters['HotelLocation'] = LocationType;
      }
      if(this.SelectedHotelName!='')
      {
        filters['HotelName'] = this.SelectedHotelName;
      }
      if(this.SelectedHotelPinCode!='')
      {
        filters['PinCode'] = this.SelectedHotelPinCode;
      }
      if(this.SelectedHotelFacility!='')
      {
        filters['HotelFacilities'] = this.SelectedHotelFacility;
      }
      if(this.HotelAddressText!='')
      {
        filters['HotelAddress'] = this.SelectedHotelAddress;
      }
      
      if (type == 'clear') {
        filters = [];
      }

      let data:any=[];
      data=this.Response;
  
      filtered=multiFilter(data, filters);

      if(filtered) {
        filtered.forEach(function(item:any,key:any) {
          if(item['Price']['PublishedPrice'] >= min && item['Price']['PublishedPrice'] <= max) {
            filteredResult.push(item);
           }
        });
      }    
      if (filteredResult.length == 0) {
        $('.nohotels').show();
      } else {
        $('.nohotels').hide();
      }

      this.emitdata(filteredResult);
    }, 10);

  }
  checkedfilter(array:any,field:any)
  {
    let response:any = [];
    array.forEach(function(value:any, key:any) {
        if (value.isChecked) {
            response.push(value[field]);
        }
    });
    return response;
  }
 

  emitdata(filterresult:any)
  {
    this.filterresponse=filterresult;
    let obj={'response':filterresult}
    this.messageEvent.emit(obj);
  }
  search(event:any,searchType:any)
  {
    let  searchValue  =  event.target.value;
    let data= this.Filter[searchType].filter((val:any) =>
    val.label.toLowerCase().includes(searchValue));
    if(searchType=='Location')
    {
      this.LocationType =  data;
    }
  }
  search_hotel(event:any,searchType:any)
  {
    if(this.InputHotelNametxt)
    {
    const searchText = (this.InputHotelNametxt || '').toLowerCase().trim();
    let data = this.Filter[searchType].filter((val: any) =>
      val?.toString().toLowerCase().includes(searchText)
    );
      if(searchType=='HotelName')
      {
        this.HotelNameList =  data;
      }
    } else {
      this.HotelNameList=[];
    }

    // hotel Facility Search

    if(this.HotelFacilityText)
    {
      // let data= this.Filter[searchType].filter((val:any) =>
      // val.toLowerCase().includes(this.HotelFacilityText));
      
      const searchText = (this.HotelFacilityText || '').toLowerCase().trim();
        let data = this.Filter[searchType].filter((val: any) =>
          val?.toString().toLowerCase().includes(searchText)
        );
      if(searchType=='HotelFacilitiesList')
      {
        this.HotelFacilitiesList =  data;
      }
    } else {
      this.HotelFacilitiesList=[];
    }
    
    // Hotel Adress List 
    if(this.HotelAddressText)
    {
      // let data= this.Filter[searchType].filter((val:any) =>
      // val.toLowerCase().includes(this.HotelAddressText));
       const searchText = (this.HotelAddressText || '').toLowerCase().trim();
        let data = this.Filter[searchType].filter((val: any) =>
          val?.toString().toLowerCase().includes(searchText)
        );
      if(searchType=='HotelAddressList')
      {
        this.HotelAddressList =  data;
      }
    } else {
      this.HotelAddressList=[];
    }


    if(this.InputPincodetxt)
    {
       const searchText = (this.InputPincodetxt || '').toLowerCase().trim();
        let data = this.Filter[searchType].filter((val: any) =>
          val?.toString().toLowerCase().includes(searchText)
        );
      if(searchType=='PinCode')
      {
        this.PicodeList=  data;
      }
    } else {
      this.PicodeList=[];
    }
  }

  select_hotelname(item:any,type:any)
  {
    if(type=='HotelName'){
      this.InputHotelNametxt=item;
      this.HotelNameList=[];
      this.SelectedHotelName=item;
      this.doFilter('HotelName',null,item)
    }

    if(type=='HotelFacilitiesList'){
      this.HotelFacilityText=item;
      this.HotelFacilitiesList=[];
      this.SelectedHotelFacility=item;
      this.doFilter('HotelFacilitiesList',null,item)
    }
    if(type=='HotelAddressList'){
      this.HotelAddressText=item;
      this.HotelAddressList=[];
      this.SelectedHotelAddress=item;
      this.doFilter('HotelAddressList',null,item)
    }
    if(type=='PinCode'){
      this.InputPincodetxt=item;
      this.PicodeList=[];
      this.SelectedHotelPinCode=item;
      this.doFilter('PinCode',null,item)
    }
    
  }

  resetfilter(array:any)
  {
    let response:any = [];
    array.forEach(function(value:any, key:any) {
        value.isChecked = false;
        response.push(value);
    });
    return response;
  }

}
// function multiFilter(array:any, filters:any) {
  
//   var filterKeys = Object.keys(filters);
//    return array.filter((item:any) => {
//    return filterKeys.every(key => !!~filters[key].indexOf(item[key]));		 
//   });
// }


function multiFilter(array:any, filters:any) {
  var filterKeys = Object.keys(filters);
  let response:any=[];

  array.filter((item:any) => {
      if(filterKeys.includes("HotelFacilities")){
        if(item['HotelFacilities'].every((value:any) => filters['HotelFacilities'].includes(value))){
              response.push(item)
            }
        
      }
      if(filterKeys.includes("FareType")){
        if(filters['FareType'].includes("Free Cancellation")){
          if(item['IsRefundable'].every((value:any) => value ==true)){
            response.push(item)
          }
        }
        if(filters['FareType'].includes("Non-Refundable")){
          if(item['IsRefundable'].every((value:any) => value ==false)){
            response.push(item)
          }
        }
        
        
      }
      if(filterKeys.includes("MealType"))
      {
        
            if(filters['MealType'].every((value:any) => item['MealType'].includes(value))){
              response.push(item)
            }
      } else {
          if(filterKeys.every(key => !!~filters[key].indexOf(item[key])))
          {
                  response.push(item);
          }
      }
  });
  return response;
}
