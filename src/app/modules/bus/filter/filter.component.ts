import { Component, OnInit, Input, EventEmitter, Output} from '@angular/core';

declare var $: any;

@Component({
  selector: 'app-filter',
  templateUrl: './filter.component.html',
  styleUrls: ['./filter.component.css']
})
export class FilterComponent implements OnInit {

  @Input('result') Response : any =[];
  @Input('filter') Filter : any =[];
  @Input('clearfilter') clearfilter : any =[];
 
  @Output() messageEvent = new EventEmitter();
  @Output() fareEvent = new EventEmitter();

  GetSearchData: any=[];
  filterresponse:any=[];

  shownetfare=false;
  showincentivefare=false;

  bustypelist:any=[];
  bustravellist:any=[];
  min:any=0;
  max:any=0;

  constructor() { 

  
  }

  ngOnInit(): void {
    this.bustypelist=this.Filter['BusType'];
    this.bustravellist=this.Filter['TravelName'];
      this.min=this.Filter?.['Price']?.['min']
    this.max=this.Filter?.['Price']?.['max']
    
  }

  ngOnChanges() {
    if(this.clearfilter)
    {
      this.clearFilterByCat('all'); 
    }
  }


  search(event:any,type:string): void {
    let value=event.target.value;
    let data= this.Filter[type].filter((val:any) =>
      val.label.toLowerCase().includes(value)
    );
    if(type=='BusType')
    {
      this.bustypelist=data;
    }
    if(type=='TravelName')
    {
      this.bustravellist=data;
    }
  }

  showfares(type:any,val:any) {
    let obj={
                'type':type,
                'val':val
            }
    this.fareEvent.emit(obj);
  }

  doFilter(type:any,event:any,item:any)
  {
    if (type == "TravelName") {
      if (event.target.checked) {
          item['isChecked']=true;
      } else {
          item['isChecked']=false;
      }
    }
    if (type == "BusType") {
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

    let min = this.Filter['Price']['min'];
    let max = this.Filter['Price']['max'];
    // min = parseFloat($.trim(min.replace(",", "")));
    // max = parseFloat($.trim(max.replace(",", "")));

    let FilterData:any=[];
    FilterData=this.Filter;

    setTimeout(() => {

      let filtered:any;
      let filters:any = [];
      let filteredResult:any = [];

      let filterTravelName = this.checkedfilter(FilterData['TravelName'],'label');
      let filterBusType = this.checkedfilter(FilterData['BusType'],'label');
      let filterDepartTime = this.checkedfilter(FilterData['DepartureTimeType'],'value');
      let filterArrivalTime = this.checkedfilter(FilterData['ArrivalTimeType'],'value');

      if(filterTravelName.length !== 0) 
      {
          filters['TravelName'] = filterTravelName;
      }
      if(filterBusType.length !== 0) 
      {
          filters['BusType'] = filterBusType;
      }
      if(filterDepartTime.length !== 0) 
      {
          filters['DepartureDayType'] = filterDepartTime;
      }
      if(filterArrivalTime.length !== 0) 
      {
          filters['ArrivalDayType'] = filterArrivalTime;
      }
      if (type == 'clear') {
        filters = [];
      }

      let data:any=[];
      data=this.Response;
  
      filtered=multiFilter(data, filters);
      if(filtered) {
        filtered.forEach(function(item:any,key:any) {
          if(item['BusPrice']['PublishedPrice'] >= min && item['BusPrice']['PublishedPrice'] <= max) {
            filteredResult.push(item);
           }
        });
      }    
      if (filteredResult.length == 0) {
        $('.nobuses').show();
      } else {
        $('.nobuses').hide();
      }

      this.emitdata(filteredResult);
    }, 10);

  }

  emitdata(filterresult:any)
  {
    this.filterresponse=filterresult;
    let obj={
      'response'  : filterresult
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
        min:_this.Filter['Price']['min'],
        max:_this.Filter['Price']['max'],
        step: parseFloat(step),
        values: [_this.Filter['Price']['min'],_this.Filter['Price']['max']],
        slide: function( event:any, ui:any ) {
          $(".left-price").val(ui.values[0].toString().replace(/(\d)(?=(\d\d\d)+(?!\d))/g, "$1,"));
          $(".right-price").val(ui.values[1].toString().replace(/(\d)(?=(\d\d\d)+(?!\d))/g, "$1,"));
        },
        stop: function( event:any, ui:any ) {

          var min = ui.values[0];
          var max = ui.values[1];

          let FilterData:any=[];
          FilterData=_this.Filter;

          let filtered:any;
          let filters:any = [];
          let filteredResult:any = [];

          let filterTravelName = _this.checkedfilter(FilterData['TravelName'],'label');
          let filterBusType = _this.checkedfilter(FilterData['BusType'],'label');
          let filterDepartTime = _this.checkedfilter(FilterData['DepartureTimeType'],'value');
          let filterArrivalTime = _this.checkedfilter(FilterData['ArrivalTimeType'],'value');

          if(filterTravelName.length !== 0) 
          {
              filters['TravelName'] = filterTravelName;
          }
          if(filterBusType.length !== 0) 
          {
              filters['BusType'] = filterBusType;
          }
          if(filterDepartTime.length !== 0) 
          {
              filters['DepartureDayType'] = filterDepartTime;
          }
          if(filterArrivalTime.length !== 0) 
          {
              filters['ArrivalDayType'] = filterArrivalTime;
          }
         
          let data:any=[];
          data=_this.Response;
      
          filtered=multiFilter(data, filters);
          if(filtered) {
            filtered.forEach(function(item:any,key:any) {
              if(item['BusPrice']['PublishedPrice'] >= min && item['BusPrice']['PublishedPrice'] <= max) {
                filteredResult.push(item);
               }
            });
          }    
          if (filteredResult.length == 0) {
            $('.nobuses').show();
          } else {
            $('.nobuses').hide();
          }
        
          _this.emitdata(filteredResult);
       }

      });

      $( ".left-price" ).val($(".price-range" ).slider( "values", 0 ).toString().replace(/(\d)(?=(\d\d\d)+(?!\d))/g, "$1,"));
      $( ".right-price" ).val($(".price-range" ).slider( "values", 1 ).toString().replace(/(\d)(?=(\d\d\d)+(?!\d))/g, "$1,"));

  }
  
  clearFilterByCat(type:any)
  {
   
    if(type=='all')
    {
      this.resetfilter(this.Filter['TravelName']);
      this.resetfilter(this.Filter['BusType']);
      this.resetfilter(this.Filter['DepartureTimeType']);
      this.resetfilter(this.Filter['ArrivalTimeType']);
      this.pricefilter();
    }

    if(type=='Price')
    {
      this.pricefilter();
    }
    if(type=='TravelName')
    {
      this.resetfilter(this.Filter['TravelName']);
    }
    if(type=='BusType')
    {
      this.resetfilter(this.Filter['BusType']);
    }
    if(type=='DepartTime')
    {
      this.resetfilter(this.Filter['DepartureTimeType']);
    }
    if(type=='ArrivalTime')
    {
      this.resetfilter(this.Filter['ArrivalTimeType']);
    }

    this.doFilter('re-call', '', '');
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

function multiFilter(array:any, filters:any) {
  var filterKeys = Object.keys(filters);
   return array.filter((item:any) => {
   return filterKeys.every(key => !!~filters[key].indexOf(item[key]));		 
  });
}