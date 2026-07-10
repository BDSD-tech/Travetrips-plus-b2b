import { Injectable } from '@angular/core';
import { HttpClient,HttpParams } from '@angular/common/http';
import { DatePipe,DecimalPipe} from '@angular/common';
import { tts_config } from '../../../environments/tts_config';
import { CommonService } from '../../services/common.service';

@Injectable({
  providedIn: 'root'
})
export class FlightService {

  constructor(private http: HttpClient,public datepipe: DatePipe,private decimalPipe: DecimalPipe) { }

   SearchQueryList(data: any) {
    let url=tts_config.APIURL+'/agent/search-query-list';
    return this.http.post(url, data, {headers: { 'Content-Type': 'application/json'}});
  }

  get_search(data: any) {
    //return this.http.get('assets/flight-result.json');
    let url=tts_config.APIURL+'/flight/search';
    return this.http.post(url, data, {headers: { 'Content-Type': 'application/json'}});
  }

  fare_calendor(data: any) {
    let url=tts_config.APIURL+'/flight/farecalender';
    return this.http.post(url, data, {headers: { 'Content-Type': 'application/json'}});
  }


  fare_confimation(data : any )
  {
   let url=tts_config.APIURL+'/flight/fareconfirmation';
    return this.http.post(url, data, {headers: { 'Content-Type': 'application/json'}});
  }

    fare_up_sell(data : any )
  {
   let url=tts_config.APIURL+'/flight/fare-up-sell';
    return this.http.post(url, data, {headers: { 'Content-Type': 'application/json'}});
  }
  ssr_info(data : any )
  {
  /*  return this.http.get('assets/ssr-result.json') */
    let url=tts_config.APIURL+'/flight/ssr';
    return this.http.post(url, data, {headers: { 'Content-Type': 'application/json'}});
  }
  insurance_info(data : any )
  {
   return this.http.get('assets/insuranceSearch.json')
    let url=tts_config.APIURL+'/flight/ssr';
    return this.http.post(url, data, {headers: { 'Content-Type': 'application/json'}});
  }
  Getwebchekin(type : any,isdomestic:any )
  {
    if(type=='R' && isdomestic=='false'){
        return this.http.get('assets/internation-round.json');
    }else if(type=='R' && isdomestic){
      return this.http.get('assets/domestic-round.json');
    }else{
      return this.http.get('assets/web-chekin.json');
    }
   return this.http.get('assets/insuranceSearch.json')
    let url=tts_config.APIURL+'/flight/ssr';
    return this.http.post(url, type, {headers: { 'Content-Type': 'application/json'}});
  }

  ssr_seatdata()
  {
    return this.http.get('assets/seat.json');
    
  }


  fare_rule(data: any)
  {
    let url=tts_config.APIURL+'/flight/farerule';
    return this.http.post(url, data, {headers: { 'Content-Type': 'application/json'}});
  }
 
  SavePaxdata(data:any,service:any)
  {
    let services:any=''
    if(service=='Flight'){
        services='flight'
    }else if(service=='Hotel'){
       services='hotel'
    }else if(service=='Bus'){
       services='bus'
    }
    let url=tts_config.APIURL+'/'+services+'/validate-travellers';
    return this.http.post(url, data, {headers: { 'Content-Type': 'application/json'}});
  }
  
  GetConfimationData(data:any,type:any)
  {
    let params = new HttpParams();
    if(type)
    {
      params=params.append('type',type);
    }
    let url=tts_config.APIURL+'/flight/confirmation/'+data['token'];
    return this.http.get(url,{ params: params});
  }

  GetTicketDetails(data:any)
  {
     let url = tts_config.APIURL.slice(0, tts_config.APIURL.lastIndexOf('/'));
     url=url+'/airservice/rest/generate-ticket-invoice';
     return this.http.post(url, data, {headers: { 'Content-Type': 'application/json'}});
  }

  GetInvoiceTicket(data:any)
  {
     let params = new HttpParams();
     params=params.append('booking_ref_number', data['booking_ref_number']);
     params=params.append('type', data['type']);
     params=params.append('price', data['price']);
     params=params.append('agency_detail', data['agency_detail']);
     params=params.append('send_email', data['send_email']);
     params= params.append('to_email', data['to_email']);
     params=params.append('pdf', data['pdf']);

    let url=tts_config.APIURL+'/flight/get-invoice-ticket';
    return this.http.get(url,{ params: params});
  }
  DownloadPDF(data:any)
  {
     let params = new HttpParams();
     params=params.append('booking_ref_number', data['booking_ref_number']);
     params=params.append('type', data['type']);
     params=params.append('price', data['price']);
     params=params.append('agency_detail', data['agency_detail']);
     params=params.append('send_email', data['send_email']);
     params= params.append('to_email', data['to_email']);
     params=params.append('pdf', data['pdf']);

    let url=tts_config.APIURL+'/flight/get-invoice-ticket';
    return this.http.get(url,{ params: params,responseType: 'blob'});
  }

  

  send_itinerary(data : any )
  {
    let url=tts_config.APIURL+'/flight/send-itinerary';
    return this.http.post(url, data, {headers: { 'Content-Type': 'application/json'}});
  }

  SendSMS(data : any )
  {
    let url=tts_config.APIURL+'/flight/send-sms';
    return this.http.post(url, data, {headers: { 'Content-Type': 'application/json'}});
  }

  MasterTravelers(data : any )
  {
    let url=tts_config.APIURL+'/flight/master-travelers-info';
    return this.http.post(url, data, {headers: { 'Content-Type': 'application/json'}});
  }
  MasterGST(data : any )
  {
    let url=tts_config.APIURL+'/flight/master-gst-info';
    return this.http.post(url, data, {headers: { 'Content-Type': 'application/json'}});
  }
  UpdateMarkup(data : any )
  {
    let url=tts_config.APIURL+'/flight/update-webpartner-markup';
    return this.http.post(url, data, {headers: { 'Content-Type': 'application/json'}});
  }

  GetCurrentDate(day :number)
  {
    let myDate = new Date(new Date().getTime()+(day*24*60*60*1000));
    let options:any = { weekday: 'short', year: '2-digit', month: 'short', day: 'numeric' };
     return myDate.toLocaleDateString('en-IN',options);
  }

  AddDayDefaultDate(date : any , day :number)
  {
    let myDate = new Date(new Date(date).getTime()+(day*24*60*60*1000));
     return this.datepipe.transform(myDate, 'dd MMM yyyy');
  }

  RemoveDayDefaultDate(date : any , day :number)
  {
    let myDate = new Date(new Date(date).getTime()-(day*24*60*60*1000));
     return this.datepipe.transform(myDate, 'dd MMM yyyy');
  }

  APIDateFormat(date:any)
  {
    let myDate = new Date(date);
    return this.datepipe.transform(myDate, 'yyyy-MM-dd');
  }

  DefaultDateFormat(date:any)
  {
    let myDate = new Date(date);
    return this.datepipe.transform(myDate, 'dd MMM yyyy');
  }

  SubstractCurrentDate(day :number)
  {
    return new Date(new Date().getTime()-(day*24*60*60*1000));
  }
  CurrentDatePlus( day:number)
  {
    var date = new Date();
    date.setDate(date.getDate() + day);
   
    return this.datepipe.transform(date, 'dd MMM yyyy');
  }

  GetCabinClass(Cabin : string) {
    let CabinClass : number |undefined;
    if(Cabin=='Economy')
    {
      CabinClass=2;
    } else if(Cabin=='Business')
    {
      CabinClass=4;
    } else if(Cabin=='First')
    {
      CabinClass=6;
    } else if(Cabin=='Premium Economy')
    {
      CabinClass=3;
    }
    return  CabinClass;
  }


  datediff(d1:any,d2:any)
  {
    let date1:any = new Date(d1);
    let date2:any = new Date(d2);
    const diffTime = Math.abs(date2 - date1);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)); 
   return diffDays;
  }

  Calculatedatediff(date1:any,date2:any)
  {
    let diffc;
    let days;
    let ndate1=new Date(date1);
    let ndate2=new Date(date2);
    diffc = ndate1.getTime() - ndate2.getTime();
    days = Math.round(Math.abs(diffc/(1000*60*60*24)));
    return days;
  }

 transformDecimal(num:any) {
  return this.decimalPipe.transform(num, '1.0-2');
 }

 GenerateSearchRequest(val:any,supplier:any='')
 {

    let Adult: number = val.Adult;
    let Child: number = val.Child;
    let Infant: number = val.Infant;
    let Type: string = val.Type;
    let ResultFareType:any=val['ResultFareType']
    let JourneyType: number |undefined;
    let CabinClass:any=this.GetCabinClass(val.Class);
    let Nonstop : any = val.Nonstop;
    let DirectFlight: boolean;
    if(Nonstop && Nonstop != null)
    {
      DirectFlight=true;
    } else {
      DirectFlight=false;
    }
    let SeriesFare=val.SeriesFare;

    let Segments=[];
    if (Type == 'O') {
      let OriginCode: string = val.OriginCode;
      let DestinationCode: string = val.DestinationCode;
      let Departdate: any =this.APIDateFormat(val.DepartDate);
      JourneyType = 1;
      let obj:any={};
      obj['Origin']=OriginCode;
      obj['Destination']=DestinationCode;
      obj['PreferredTime']=Departdate+"T00:00:00";
      Segments.push(obj);

    } else if (Type == 'R') {
      let OriginCode: string = val.OriginCode;
      let DestinationCode: string = val.DestinationCode;
      let Departdate: any =this.APIDateFormat(val.DepartDate);
      JourneyType = 2;
      let Returndate: any =this.APIDateFormat(val.ReturnDate);
      let obj:any={};
      let obj1:any={};
      obj['Origin']=OriginCode;
      obj['Destination']=DestinationCode;
      obj['PreferredTime']=Departdate+"T00:00:00";

      obj1['Origin']=DestinationCode;
      obj1['Destination']=OriginCode;
      obj1['PreferredTime']=Returndate+"T00:00:00";

      Segments.push(obj);
      Segments.push(obj1);

    } else if (Type == 'M') {
        JourneyType = 3;
        let obj:any={};
        for (let i = 0; i < val['MultiCity'].length; i++) {
          let Departdate: any =this.APIDateFormat(val['MultiCity'][i]['DepartDate']);
          obj={
                'Origin':val['MultiCity'][i]['OriginCode'],
                'Destination':val['MultiCity'][i]['DestinationCode'],
                'PreferredTime':Departdate+"T00:00:00",
              }
           Segments.push(obj);
        }
    }

    let PreferredCarriers=null;
    if(val.PreferredAirline)
    {
      PreferredCarriers=val.PreferredAirline;
    }


    let data:any = {
      "Adult": Adult,
      "Child": Child,
      "Infant": Infant,
      "DirectFlight": DirectFlight,
      "JourneyType": JourneyType,
      "PreferredCarriers": PreferredCarriers,
      "CabinClass": CabinClass,
      "SeriesFare":SeriesFare,
      "ResultFareType":ResultFareType
    };
    data['AirSegments']=Segments;
    if(supplier)
    {
      data['Supplier']=parseInt(supplier);
    }
    return data;
 }

 DateToTimestamp(date:any)
 {
    return new Date(date).getTime();
 }

 CreateFilterData(Response:any,Searchdata:any=null)
 {
      let Filter:any={};
      let airlinegroup :any= {};
      let airlineArray :any=[];
      let stopcount :any= {};
      let farecount :any= {};
      let fareidentifercount :any= {};
      let fareidentifercountcolor :any= {};
      let priceArray:any=[];
      if(Response)
      {
          Response.forEach(function(value:any , key:any) {

            let getpricelist:any=[];
            value['FareList'].forEach(function(value1:any , key1:any) {
              fareidentifercount[value1['FareType']] = (fareidentifercount[value1['FareType']]||0) + 1;
              fareidentifercountcolor[value1['FareTypeColor']] = (fareidentifercountcolor[value1['FareTypeColor']]||0) + 1;
              farecount[value1['IsRefundable']] = (farecount[value1['IsRefundable']]||0) + 1;
              getpricelist.push(value1['Fare']['PublishedPrice']);
              priceArray.push(value1['Fare']['PublishedPrice']);
            });

          let obj={
                    'label':value.MainSegment[0]['AirlineName'],
                    'value':value.MainSegment[0]['Airlinecode'],
                    'fare':min(getpricelist),
                    'isChecked':false,
                  }
            airlinegroup[value.MainSegment[0]['Airlinecode']] = (airlinegroup[value.MainSegment[0]['Airlinecode']] || []).concat(obj);
            stopcount[value.MainSegment[0]['Stops']] = (stopcount[value.MainSegment[0]['Stops']]||0) + 1;
           

          });
       }
      let price={
                    'MinPrice':min(priceArray),
                    'MaxPrice':max(priceArray),
                };
      Object.keys(airlinegroup).forEach(function(key) {
        let airlinedata=  airlinegroup[key].reduce(function(prev:any, current:any) {
          current['count']=prev['count']=airlinegroup[key].length;
          return (prev.fare < current.fare) ? prev : current
        });
        airlineArray.push(airlinedata);
      });

      let stopArray:any=[];
      Object.keys(stopcount).forEach(function(key) {
        let stoplabel;
        if(key=='0')
        {
          stoplabel='Non Stop';
        } else {
          stoplabel=key +' Stop';
        }
        let objstop={
                      'label'     : stoplabel,
                      'value'     : parseInt(key),
                      'count'     : parseInt(stopcount[key]),
                      'isChecked' : false
                    }
        stopArray.push(objstop);
      });
      let objfare=[
                  {
                      'label'     : 'Refundable',
                      'value'     : true,
                      'isChecked' : false
                  },
                  {
                    'label'     : 'Non Refundable',
                    'value'     : false,
                    'isChecked' : false
                  }
                ];
      let objdep=[
                      {
                        'label'     : '00-06',
                        'value'     : 'EarlyMorning',
                        'isChecked' : false,
                        'icon'      : 'icon-morning'
                      },
                      {
                        'label'     : '06-12',
                        'value'     : 'Morning',
                        'isChecked' : false,
                        'icon'      : 'icon-noon'
                      },
                      {
                        'label'     : '12-18',
                        'value'     : 'Afternoon',
                        'isChecked' : false,
                        'icon'      : 'icon-evening'
                      },
                      {
                        'label'     : '18-00',
                        'value'     : 'Night',
                        'isChecked' : false,
                        'icon'      : 'icon-night'
                      }
                ];
      let objarrival = JSON.parse(JSON.stringify(objdep));
              
      let identiferArray:any=[];
      Object.keys(fareidentifercount).forEach(function(key) {

        let objidentifer={
                      'label'     : key.replace(/\s+/g, '-').toLowerCase(),
                      'value'     : key,
                      'count'     : parseInt(fareidentifercount[key]),
                      'isChecked' : false
                    }
        identiferArray.push(objidentifer);
      });

      let identiferColorArray:any=[];
      Object.keys(fareidentifercountcolor).forEach(function(key) {

        let objidentifer={
                      'label'     : key,
                      'value'     : key,
                      'count'     : parseInt(fareidentifercountcolor[key]),
                      'isChecked' : false
                    }
        identiferColorArray.push(objidentifer);
      });


      Filter['Price']=price;
      Filter['Airlines']=airlineArray;
      Filter['Stops']=stopArray;   
      Filter['FareType']=objfare;
      Filter['FareIdentiferColor']=identiferColorArray;
      Filter['FareIdentifer']=identiferArray;
      Filter['DepartTime']=objdep;
      Filter['ArrivalTime']=objarrival;
      return Filter;
}
 intCreateFilterData(Response:any)
 {
       let Filter:any={};
      let airlinegroup :any= {};
      let airlineArray :any=[];
      let stopcount :any= {};
      let farecount :any= {};
      let fareidentifercount :any= {};
      let fareidentifercountcolor :any= {};
      let priceArray:any=[];
      if(Response)
      {
          Response.forEach(function(value:any , key:any) {

            let getpricelist:any=[];
            value['FareList'].forEach(function(value1:any , key1:any) {
              fareidentifercount[value1['FareType']] = (fareidentifercount[value1['FareType']]||0) + 1;
              fareidentifercountcolor[value1['FareTypeColor']] = (fareidentifercountcolor[value1['FareTypeColor']]||0) + 1;
              farecount[value1['IsRefundable']] = (farecount[value1['IsRefundable']]||0) + 1;
              getpricelist.push(value1['Fare']['PublishedPrice']);
              priceArray.push(value1['Fare']['PublishedPrice']);
            });

          let obj={
                    'label':value.MainSegment[1]['AirlineName'],
                    'value':value.MainSegment[1]['Airlinecode'],
                    'fare':min(getpricelist),
                    'isChecked':false,
                  }
            airlinegroup[value.MainSegment[1]['Airlinecode']] = (airlinegroup[value.MainSegment[1]['Airlinecode']] || []).concat(obj);
            stopcount[value.MainSegment[1]['Stops']] = (stopcount[value.MainSegment[1]['Stops']]||0) + 1;
           

          });
       }
      let price={
                    'MinPrice':min(priceArray),
                    'MaxPrice':max(priceArray),
                };
      Object.keys(airlinegroup).forEach(function(key) {
        let airlinedata=  airlinegroup[key].reduce(function(prev:any, current:any) {
          current['count']=prev['count']=airlinegroup[key].length;
          return (prev.fare < current.fare) ? prev : current
        });
        airlineArray.push(airlinedata);
      });

      let stopArray:any=[];
      Object.keys(stopcount).forEach(function(key) {
        let stoplabel;
        if(key=='0')
        {
          stoplabel='Non Stop';
        } else {
          stoplabel=key +' Stop';
        }
        let objstop={
                      'label'     : stoplabel,
                      'value'     : parseInt(key),
                      'count'     : parseInt(stopcount[key]),
                      'isChecked' : false
                    }
        stopArray.push(objstop);
      });
      let objfare=[
                  {
                      'label'     : 'Refundable',
                      'value'     : true,
                      'isChecked' : false
                  },
                  {
                    'label'     : 'Non Refundable',
                    'value'     : false,
                    'isChecked' : false
                  }
                ];
      let objdep=[
                      {
                        'label'     : '00-06',
                        'value'     : 'EarlyMorning',
                        'isChecked' : false,
                        'icon'      : 'icon-morning'
                      },
                      {
                        'label'     : '06-12',
                        'value'     : 'Morning',
                        'isChecked' : false,
                        'icon'      : 'icon-noon'
                      },
                      {
                        'label'     : '12-18',
                        'value'     : 'Afternoon',
                        'isChecked' : false,
                        'icon'      : 'icon-evening'
                      },
                      {
                        'label'     : '18-00',
                        'value'     : 'Night',
                        'isChecked' : false,
                        'icon'      : 'icon-night'
                      }
                ];
      let objarrival = JSON.parse(JSON.stringify(objdep));
              
      let identiferArray:any=[];
      Object.keys(fareidentifercount).forEach(function(key) {

        let objidentifer={
                      'label'     : key.replace(/\s+/g, '-').toLowerCase(),
                      'value'     : key,
                      'count'     : parseInt(fareidentifercount[key]),
                      'isChecked' : false
                    }
        identiferArray.push(objidentifer);
      });

      let identiferColorArray:any=[];
      Object.keys(fareidentifercountcolor).forEach(function(key) {

        let objidentifer={
                      'label'     : key,
                      'value'     : key,
                      'count'     : parseInt(fareidentifercountcolor[key]),
                      'isChecked' : false
                    }
        identiferColorArray.push(objidentifer);
      });
      Filter['Price']=price;
      Filter['Airlines']=airlineArray;
      Filter['Stops']=stopArray;
      Filter['FareType']=objfare;
      Filter['FareIdentiferColor']=identiferColorArray;
      Filter['FareIdentifer']=identiferArray;
      Filter['DepartTime']=objdep;
      Filter['ArrivalTime']=objarrival;
      return Filter;
}

}

function max(input:any) {
  if (toString.call(input) !== "[object Array]")
    return false;
    return Math.max.apply(null, input);
}

function min(input:any) {
  if (toString.call(input) !== "[object Array]")
    return false;
    return Math.min.apply(null, input);
}
