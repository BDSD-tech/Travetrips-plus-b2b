import { Injectable } from '@angular/core';
import { HttpClient,HttpParams } from '@angular/common/http';
import { DatePipe,DecimalPipe} from '@angular/common';
import { tts_config } from '../../../environments/tts_config';

@Injectable({
  providedIn: 'root'
})
export class CarService {   

  constructor(private http: HttpClient,public datepipe: DatePipe,private decimalPipe: DecimalPipe) { }


  SearchQueryList(data: any) {
    let url=tts_config.APIURL+'/car-query-saved';
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


  datediff(d1:any,d2:any)
  {
    let date1:any = new Date(d1);
    let date2:any = new Date(d2);
    const diffTime = Math.abs(date2 - date1);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)); 
   return diffDays;
  }

 transformDecimal(num:any) {
  return this.decimalPipe.transform(num, '1.0-2');
 }

 DateToTimestamp(date:any)
 {
    return new Date(date).getTime();
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
