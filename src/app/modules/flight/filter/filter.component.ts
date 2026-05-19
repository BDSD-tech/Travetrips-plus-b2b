import { Component, OnInit, Input, EventEmitter, Output} from '@angular/core';
import { Router } from '@angular/router';

declare var $: any;

@Component({
  selector: 'app-filter',
  templateUrl: './filter.component.html',
  styleUrls: ['./filter.component.css']
})
export class FilterComponent implements OnInit {

  @Input('result') Response : any =[];
  @Input('filter') Filter : any =[];
  @Input('filtertype') filtertype : any =[];
  @Input('clearfilter') clearfilter : any =[];
  @Input('clearfilterib') clearfilterib : any =[];
 
  @Output() messageEvent = new EventEmitter();
  @Output() fareEvent = new EventEmitter();

  GetSearchData: any=[];

  filterresponse:any=[];

  shownetfare=false;
  showincentivefare=false;

  ispriceshow:any=0;
  isstopshow:any=0;


  min:any=0
  max:any=0
  minib:any=0
  maxib:any=0


  constructor(private router: Router) { 

    if (sessionStorage.getItem('FlightSearch')) {
      let flightsearch:any=sessionStorage.getItem('FlightSearch');
      this.GetSearchData = JSON.parse(flightsearch);
    } else {
      this.router.navigate(['/']);
    }

  }

  ngOnInit(): void {
  
    // this.pricefilter();
    // if(this.Filter.length==2)
    // {
    //   setTimeout(() => {
    //     this.pricefilterIB();
    //   }, 200);
    
    // }
    this.min=this.Filter[0]['Price']['MinPrice'];
    this.max=this.Filter[0]['Price']['MaxPrice'];
    if(this.Filter.length==2)
    {
      this.minib=this.Filter[1]['Price']['MinPrice']
      this.maxib=this.Filter[1]['Price']['MaxPrice']
    
    }
  }
 clearFilter(){
   this.clearFilterByCat(0,'all');
 
   if(this.Filter[1]){
     this.clearFilterByCat(1,'all');
   }
   
 }
  ngOnChanges() {
    if(this.clearfilter)
    {
      this.clearFilterByCat(0,'all');
      
    }
    if(this.clearfilterib)
    {
      this.clearFilterByCat(1,'all');
    }
  }

  showfares(type:any,val:any) {
    let obj={
                'type':type,
                'val':val
            }
    this.fareEvent.emit(obj);
  }

  isshowfilter(type:any,event:any,val:any)
  {
      if(type=='stop')
      {
        this.isstopshow=val;
      }
      if(type=='price')
      {
        this.ispriceshow=val;
      }
  }


  doFilter(filtertype:any,type:any,event:any,item:any)
  {
    if (type == "Stop") {
      if (event.target.checked) {
          item['isChecked']=true;
      } else {
          item['isChecked']=false;
      }
    }
    
    if (type == "DepartTime") {
      if (event.target.checked) {
          item['isChecked']=true;
      } else {
          item['isChecked']=false;
      }
    }

    if (type == "ArrivalTime") {
      if (event.target.checked) {
          item['isChecked']=true;
      } else {
          item['isChecked']=false;
      }
    }

    if (type == "FareIdentifier") {
      if (event.target.checked) {
          item['isChecked']=true;
      } else {
          item['isChecked']=false;
      }
    }
    if (type == "FareType") {
      if (event.target.checked) {
          item['isChecked']=true;
      } else {
          item['isChecked']=false;
      }
    }

    if (type == "Airline") {
      if (event.target.checked) {
          item['isChecked']=true;
      } else {
          item['isChecked']=false;
      }
    }

    let min = $.trim($(".left-price").val());
    let max = $.trim($(".right-price").val());
   
    
    // let minprice = min.replace(/,/g, "");
    // let maxprice = max.replace(/,/g, "");
     
    let FilterData:any=[];
    FilterData=this.Filter[filtertype];
     
    setTimeout(() => {

      let filtered:any;
      let filters:any = [];
      let filteredResult:any = [];

     
     
      let IRSTOPS:any=[]
      let filterStop:any=[]
      let filterDepartTime:any=[]
      let DepartTimeIR:any=[]
      let filterAirline:any=[]
      let AirlineIR:any=[]
      let filterFareIdentifer:any=[]
      let filterArrivalTime:any=[]
      let faretype:any=[]
      let ir=false
      if(this.GetSearchData['Isdomestic']=='false'&&this.GetSearchData['Type']=='R'){
          ir=true;
          IRSTOPS= this.checkedfilter(this.Filter[1]['Stops'],'value');
           filterAirline = this.checkedfilter(this.Filter[0]['Airlines'],'value');
           AirlineIR = this.checkedfilter(this.Filter[1]['Airlines'],'value');
           filterStop= this.checkedfilter(this.Filter[0]['Stops'],'value');
           filterDepartTime = this.checkedfilter(this.Filter[0]['DepartTime'],'value');
           faretype = this.checkedfilter(this.Filter[0]['FareType'],'label');
            filterFareIdentifer = this.checkedfilter(this.Filter[0]['FareIdentiferColor'],'value');
           DepartTimeIR = this.checkedfilter(this.Filter[1]['DepartTime'],'value');
      }else{
         filterAirline = this.checkedfilter(FilterData['Airlines'],'value');
         filterStop= this.checkedfilter(FilterData['Stops'],'value');
         filterDepartTime = this.checkedfilter(FilterData['DepartTime'],'value');
         faretype = this.checkedfilter(FilterData['FareType'],'label');
         filterFareIdentifer = this.checkedfilter(FilterData['FareIdentiferColor'],'value');
         filterArrivalTime = this.checkedfilter(FilterData['ArrivalTime'],'value');
      }
      if(filterAirline.length !== 0) 
      {
          filters['Airlinecode'] = filterAirline;
      }
      if(filterStop.length !== 0) 
      {
          filters['Stops'] = filterStop;
      }
      if(IRSTOPS.length !== 0) 
      {
          filters['StopsIR'] = IRSTOPS;
      }
      if(DepartTimeIR.length !== 0) 
      {
          filters['DepartTimeIR'] = DepartTimeIR;
      }
      if(AirlineIR.length !== 0) 
      {
          filters['AirlineIR'] = AirlineIR;
      }
      if(faretype.length !== 0) 
      {
          filters['FareType'] = faretype;
      }
      if(filterFareIdentifer.length !== 0) 
      {
          filters['FareTypeColor'] = filterFareIdentifer;
      }
      if(filterDepartTime.length !== 0) 
      {
          filters['DepartString'] = filterDepartTime;
      }
      if(filterArrivalTime.length !== 0) 
      {
          filters['ArrivalString'] = filterArrivalTime;
      }
      if (type == 'clear') {
        filters = [];
      }

      let data:any=[];
      if(this.filtertype=='O')
      {
        data=this.Response;
      }
      if(this.filtertype=='R')
      {
        data=this.Response[filtertype];
      }

      let minprice = this.Filter[filtertype]['Price']['MinPrice'];
      let maxprice = this.Filter[filtertype]['Price']['MaxPrice'];

      filtered=multiFilter(filtertype,data, filters,ir);
     
     
      
      if(filtered) {
        filtered.forEach(function(item:any,key:any) {
           let fareitem:any=[];
           item['FareList'].forEach(function(value:any) {
              if(value.Fare.PublishedPrice >= minprice && value.Fare.PublishedPrice <= maxprice) 
               {  
                       fareitem.push(value);
               }   
           });
           if (fareitem.length!=0) {
             let obj = Object.assign({}, item);
             obj['FareList']=fareitem;
             filteredResult.push(obj);
           }
        });
      }    
      if (filteredResult.length == 0) {
        $('.noflight').show();
      } else {
        $('.noflight').hide();
      }
      this.emitdata(filteredResult,filtertype);
    }, 10);

  }

  emitdata(filterresult:any,filtertype:any)
  {
    this.filtertype;
    this.filterresponse=filterresult;

    let obj={
      'response'  : filterresult,
      'filtertype': this.filtertype,
      'Jkey'      : filtertype
    }

    this.messageEvent.emit(obj);
  }


  showmore(event:any)
  {
      if(event.target.text=="Show more")
      {
        $(".airline").removeClass("alirlinehide",200);
        event.target.text="Hide more"
      } else {
        $(".airline").addClass("alirlinehide",200);
        event.target.text="Show more"
      }
  }


  pricefilter()
  {
      var _this = this;
      var step:any=0.01;
      $(".price-range" ).slider({
        range: true,
        min:_this.Filter[0]['Price']['MinPrice'],
        max:_this.Filter[0]['Price']['MaxPrice'],
        step: parseFloat(step),
        values: [_this.Filter[0]['Price']['MinPrice'],_this.Filter[0]['Price']['MaxPrice']],
        slide: function( event:any, ui:any ) {
          $(".left-price").val(ui.values[0].toString().replace(/(\d)(?=(\d\d\d)+(?!\d))/g, "$1,"));
          $(".right-price").val(ui.values[1].toString().replace(/(\d)(?=(\d\d\d)+(?!\d))/g, "$1,"));
        },
        stop: function( event:any, ui:any ) {

          var min = ui.values[0];
          var max = ui.values[1];

          let FilterData:any=[];
          FilterData=_this.Filter[0];

          let filtered:any;
          let filters:any = [];
          let filteredResult:any = [];

          let filterAirline = _this.checkedfilter(FilterData['Airlines'],'value');
          let filterStop = _this.checkedfilter(FilterData['Stops'],'value');
          let filterFareIdentifer = _this.checkedfilter(FilterData['FareIdentiferColor'],'value');
          let filterDepartTime = _this.checkedfilter(FilterData['DepartTime'],'value');
          let filterArrivalTime = _this.checkedfilter(FilterData['ArrivalTime'],'value');

          if(filterAirline.length !== 0) 
          {
              filters['Airlinecode'] = filterAirline;
          }
          if(filterStop.length !== 0) 
          {
              filters['Stops'] = filterStop;
          }
          if(filterFareIdentifer.length !== 0) 
          {
              filters['FareTypeColor'] = filterFareIdentifer;
          }
          if(filterDepartTime.length !== 0) 
          {
              filters['DepartString'] = filterDepartTime;
          }
          if(filterArrivalTime.length !== 0) 
          {
              filters['ArrivalString'] = filterArrivalTime;
          }


          let data:any=[];
          if(_this.filtertype=='O')
          {
            data=_this.Response;
          }
          if(_this.filtertype=='R')
          {
            data=_this.Response[0];
          }
          
          
          filtered=multiFilter(0,data, filters);
          if(filtered) {
            filtered.forEach(function(item:any,key:any) {

              let fareitem:any=[];
              item['FareList'].forEach(function(value:any) {
                 if(value.Fare.PublishedPrice >= min && value.Fare.PublishedPrice <= max) 
                  {  
                          fareitem.push(value);
                  }   
              });

              if (fareitem.length!=0) {
                let obj = Object.assign({}, item);
                obj['FareList']=fareitem;
                filteredResult.push(obj);
              }

            });
          }     
          if (filteredResult.length == 0) {
            $('.noflight').show();
          } else {
            $('.noflight').hide();
          }
        
          _this.emitdata(filteredResult,0);
       }

      });

      $( ".left-price" ).val($(".price-range" ).slider( "values", 0 ).toString().replace(/(\d)(?=(\d\d\d)+(?!\d))/g, "$1,"));
      $( ".right-price" ).val($(".price-range" ).slider( "values", 1 ).toString().replace(/(\d)(?=(\d\d\d)+(?!\d))/g, "$1,"));

  }
  pricefilterIB()
  {
    var _this = this;
      $(".return-price-range" ).slider({
        range: true,
        min:_this.Filter[1]['Price']['MinPrice'],
        max:_this.Filter[1]['Price']['MaxPrice'],
        values: [_this.Filter[1]['Price']['MinPrice'],_this.Filter[1]['Price']['MaxPrice']],
        slide: function( event:any, ui:any ) {
          $(".return-left-price").val(ui.values[0].toString().replace(/(\d)(?=(\d\d\d)+(?!\d))/g, "$1,"));
          $(".return-right-price").val(ui.values[1].toString().replace(/(\d)(?=(\d\d\d)+(?!\d))/g, "$1,"));
        },
        stop: function( event:any, ui:any ) {

          var min = ui.values[0];
          var max = ui.values[1];

          let FilterData:any=[];
          FilterData=_this.Filter[1];

          let filtered:any;
          let filters:any = [];
          let filteredResult:any = [];

          
            let IRSTOPS:any=[]
      let filterStop:any=[]
      let filterDepartTime:any=[]
      let DepartTimeIR:any=[]
      let filterAirline:any=[]
      let AirlineIR:any=[]
      let filterFareIdentifer:any=[]
      let filterArrivalTime:any=[]
      let faretype:any=[]
      let ir=false
      if(_this.GetSearchData['Isdomestic']=='false'&&_this.GetSearchData['Type']=='R'){
          ir=true;
          IRSTOPS= this.checkedfilter(_this.Filter[1]['Stops'],'value');
           filterAirline = this.checkedfilter(_this.Filter[0]['Airlines'],'value');
           AirlineIR = this.checkedfilter(_this.Filter[1]['Airlines'],'value');
           filterStop= this.checkedfilter(_this.Filter[0]['Stops'],'value');
           filterDepartTime = this.checkedfilter(_this.Filter[0]['DepartTime'],'value');
           faretype = this.checkedfilter(_this.Filter[0]['FareType'],'label');
            filterFareIdentifer = this.checkedfilter(_this.Filter[0]['FareIdentiferColor'],'value');
           DepartTimeIR = this.checkedfilter(_this.Filter[1]['DepartTime'],'value');
      }else{
        filterAirline = _this.checkedfilter(FilterData['Airlines'],'value');
         filterStop= _this.checkedfilter(FilterData['Stops'],'value');
         filterDepartTime = _this.checkedfilter(FilterData['DepartTime'],'value');
         faretype = _this.checkedfilter(FilterData['FareType'],'label');
         filterFareIdentifer = _this.checkedfilter(FilterData['FareIdentiferColor'],'value');
         filterArrivalTime = _this.checkedfilter(FilterData['ArrivalTime'],'value');
      }
      if(filterAirline.length !== 0) 
      {
          filters['Airlinecode'] = filterAirline;
      }
      if(filterStop.length !== 0) 
      {
          filters['Stops'] = filterStop;
      }
      if(IRSTOPS.length !== 0) 
      {
          filters['StopsIR'] = IRSTOPS;
      }
      if(DepartTimeIR.length !== 0) 
      {
          filters['DepartTimeIR'] = DepartTimeIR;
      }
      if(AirlineIR.length !== 0) 
      {
          filters['AirlineIR'] = AirlineIR;
      }
      if(faretype.length !== 0) 
      {
          filters['FareType'] = faretype;
      }
      if(filterFareIdentifer.length !== 0) 
      {
          filters['FareTypeColor'] = filterFareIdentifer;
      }
      if(filterDepartTime.length !== 0) 
      {
          filters['DepartString'] = filterDepartTime;
      }
      if(filterArrivalTime.length !== 0) 
      {
          filters['ArrivalString'] = filterArrivalTime;
      }

          let data:any=[];
          data=_this.Response[1];
          filtered=multiFilter(1,data, filters);
          if(filtered) {
            filtered.forEach(function(item:any,key:any) {

              let fareitemib:any=[];
              item['FareList'].forEach(function(value:any) {
                 if(value.Fare.PublishedPrice >= min && value.Fare.PublishedPrice <= max) 
                  {  
                    fareitemib.push(value);
                  }   
              });

              if (fareitemib.length!=0) {
                let objib = Object.assign({}, item);
                objib['FareList']=fareitemib;
                filteredResult.push(objib);
              }

            });
          }     
          _this.emitdata(filteredResult,1);
       }
      });

      $( ".return-left-price" ).val($(".return-price-range" ).slider( "values", 0 ).toString().replace(/(\d)(?=(\d\d\d)+(?!\d))/g, "$1,"));
      $( ".return-right-price" ).val($(".return-price-range" ).slider( "values", 1 ).toString().replace(/(\d)(?=(\d\d\d)+(?!\d))/g, "$1,"));

  }


  clearFilterByCat(filtertype:any,type:any)
  {
    if(type=='all')
    {
      

      this.resetfilter(this.Filter[filtertype]['Airlines']);
      this.resetfilter(this.Filter[filtertype]['Stops']);
      this.resetfilter(this.Filter[filtertype]['FareIdentiferColor']);
      this.resetfilter(this.Filter[filtertype]['DepartTime']);
      this.resetfilter(this.Filter[filtertype]['ArrivalTime']);

      if(filtertype==0)
      {
          this.min=this.Filter[0]['Price']['MinPrice'];
          this.max=this.Filter[0]['Price']['MaxPrice'];
      }
      if(filtertype==1)
      {
        this.minib=this.Filter[1]['Price']['MinPrice']
        this.maxib=this.Filter[1]['Price']['MaxPrice']
      }

      this.shownetfare=false;
      this.showincentivefare=false;
     
    }
    if(type=='Airlines')
    {
      this.resetfilter(this.Filter[filtertype]['Airlines']);
    }
    if(type=='Price')
    {
      if(filtertype==0)
      {
        this.pricefilter();
      }
      if(filtertype==1)
      {
        this.pricefilterIB();
      }
      
    }

    this.doFilter(filtertype,'re-call', '', '');
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

// function multiFilter(filtertype:any,array:any, filters:any,ir:any=null) {
//   var filterKeys = Object.keys(filters);
//   let newfilters:any=[];
//   filterKeys.forEach(function(value, key) {
//       if(value!='FareTypeColor')
//       {
//           newfilters[value]=filters[value];
//       }
//   });
//   var newfilterKeys=Object.keys(newfilters);
//   let response:any=[];
//   array.filter((item:any) => {
//       if(filterKeys.includes("FareTypeColor"))
//       {
//           let fareitem:any=[];
//           item['FareList'].forEach(function(value:any, key:any) {
//               if(filters['FareTypeColor'].indexOf(value['FareTypeColor']) !== -1)  
//               {  
//                       fareitem.push(value);
//               }   
//           });
//           if(newfilterKeys.every(key1 => !!~newfilters[key1].indexOf(item['MainSegment'][0][key1])))
//           {   
//               if(fareitem.length!=0)
//               {
//                   let obj = Object.assign({}, item);
//                   obj['FareList']=fareitem;
//                   response.push(obj);
//               }
//           }
//       }else if (filterKeys.includes("FareType")) {
      
//            const otherKeys = filterKeys.filter(k => k !== "FareType");

//           const otherFiltersMatch = otherKeys.every(key => {
//             if (!filters[key] || filters[key].length === 0) return true;
//             return filters[key].includes(item['MainSegment'][0][key]);
//           });

//           if (!otherFiltersMatch) return;

//           // Filter FareList by selected FareType
//           let filteredFareList = [];

//           if (filters['FareType'].includes("Refundable")) {      
//             filteredFareList = item['FareList'].filter((f:any) => f.IsRefundable === true);
//           } else {
//             filteredFareList = item['FareList'].filter((f:any)=> f.IsRefundable === false);
//           }

//           if (filteredFareList.length > 0) {
//             const cloned = { ...item, FareList: [...filteredFareList] };
//             response.push(cloned);
//           }

//           return;
//       }
//        if (filterKeys.includes("StopsIR")) {
//         if(filterKeys.every(key => !!~filters[key].indexOf(item['MainSegment'][1]['Stops'])))
//           {
//                   response.push(item);
//           }
//       }
//        if (filterKeys.includes("Stops")) {
//         if(filterKeys.every(key => !!~filters[key].indexOf(item['MainSegment'][0]['Stops'])))
//           {
//                   response.push(item);
//           }
//       }else {
//           if(filterKeys.every(key => !!~filters[key].indexOf(item['MainSegment'][0][key])))
//           {
//                   response.push(item);
//           }
//       }
//   });
//   return response;
// }

function multiFilter(filtertype: any, array: any, filters: any, ir: any = null) {
  const filterKeys = Object.keys(filters || {});
  // remove FareType + FareTypeColor so they don't affect keyMatches()
  const normalFilterKeys = filterKeys.filter(
    (k) => k !== "FareType" && k !== "FareTypeColor"
  );

  const keyMatches = (key: string, item: any) => {
    const vals = filters[key];
    if (!vals || vals.length === 0) return true;

    switch (key) {
      case "Stops":
        return vals.includes(item?.MainSegment?.[0]?.Stops);

      case "StopsIR":
        return vals.includes(item?.MainSegment?.[1]?.Stops);

      case "DepartString":
        return vals.includes(item?.MainSegment?.[0]?.DepartString);

      case "DepartTimeIR":
        return vals.includes(item?.MainSegment?.[1]?.DepartString);

      case "Airline":
        return vals.includes(item?.MainSegment?.[0]?.Airline);

      case "AirlineIR":
        return vals.includes(item?.MainSegment?.[1]?.Airline);

      default:
        return vals.includes(item?.MainSegment?.[0]?.[key]);
    }
  };

  const response: any[] = [];
  array.forEach((item: any) => {
    // 1️⃣ Apply all normal filters (Stops, StopsIR, Airline, DepartTime…)
    const normalMatch = normalFilterKeys.every((k) => keyMatches(k, item));
    if (!normalMatch) return;

    let filteredFareList = [...(item.FareList || [])];

    // 2️⃣ Apply FareTypeColor
    if (filters.FareTypeColor) {
      filteredFareList = filteredFareList.filter((f: any) =>
        filters.FareTypeColor.includes(f.FareTypeColor)
      );
    }

    // 3️⃣ Apply FareType (Refundable / Non-Refundable)
    if (filters.FareType) {
      const wantRefundable = filters.FareType.includes("Refundable");
      filteredFareList = filteredFareList.filter(
        (f: any) => f.IsRefundable === wantRefundable
      );
    }

    // If fare list is empty → skip
    if (filteredFareList.length === 0) return;

    // push updated item
    response.push({
      ...item,
      FareList: filteredFareList
    });
  });

  return response;
}

