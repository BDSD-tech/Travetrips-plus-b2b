import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { DatePipe } from '@angular/common';
import { DecimalPipe } from '@angular/common';
import { tts_config } from '../../../environments/tts_config';

@Injectable({
  providedIn: 'root'
})
export class HotelService {

  constructor(private http: HttpClient,public datepipe: DatePipe, private decimalPipe: DecimalPipe) { }

  GetCurrentDate(day :number)
  {
    let myDate = new Date(new Date().getTime()+(day*24*60*60*1000));
    return myDate;
  }

  HotelResult(data:any)
  {
    //return this.http.get('./assets/hotel_result.json');
    let url=tts_config.APIURL+'/hotel/search';
    return this.http.post(url, data, {headers: { 'Content-Type': 'application/json'}});
  }

  HotelInfo(data:any)
  {
   /*  return this.http.get('./assets/hotelinfo.json'); */
    let url=tts_config.APIURL+'/hotel/hotelinfo';
    return this.http.post(url, data, {headers: { 'Content-Type': 'application/json'}});
  }

  HotelRoom(data:any)
  {
    /* return this.http.get('./assets/hotel_room.json'); */
    let url=tts_config.APIURL+'/hotel/roominfo';
    return this.http.post(url, data, {headers: { 'Content-Type': 'application/json'}});
  }


  HotelBlock(data:any)
  {
    /* return this.http.get('./assets/blockRommData.json'); */
    let url=tts_config.APIURL+'/hotel/blockroom';
    return this.http.post(url, data, {headers: { 'Content-Type': 'application/json'}});
  }

  SavePaxdata(data:any)
  {
    let url=tts_config.APIURL+'/hotel/validate-travellers';
    return this.http.post(url, data, {headers: { 'Content-Type': 'application/json'}});
  }

  Book(data:any)
  {
    let url=tts_config.APIURL+'/hotel/book';
    return this.http.post(url, data, {headers: { 'Content-Type': 'application/json'}});
  }
  UpdateMarkup(data:any)
  {
    let url=tts_config.APIURL+'/hotel/update-web-partnerMarkup';
    return this.http.post(url, data, {headers: { 'Content-Type': 'application/json'}});
  }
  SendSMS(data:any)
  {
    let url=tts_config.APIURL+'/hotel/send-sms';
    return this.http.post(url, data, {headers: { 'Content-Type': 'application/json'}});
  }

  GetConfirmation(data:any,type:any)
  { 
    let params  =  new HttpParams();
    if(type)
    {
      params =params.append('type',type);
    }
    let url=tts_config.APIURL+'/hotel/confirmation/'+data['token'];
    return this.http.get(url, { params: params});
  }

  CancalRequest(data:any)
  {
    let url=tts_config.APIURL+'/hotel/CancelRequest';
    return this.http.post(url, data, {headers: { 'Content-Type': 'application/json'}});
  }

  GetVoucherDetail(data:any)
  {
    let url=tts_config.APIURL+'/hotel/getHotelInfo';
    return this.http.get(url, { params: data});
  }

  Applycoupon(data:any)
  {
   let url=tts_config.APIURL+'/hotel/getcoupandetail';
   return this.http.post(url, data, {headers: { 'Content-Type': 'application/json'}});
  }

  APIDateFormat(date: string | number | Date)
  {
    let myDate = new Date(date);
    return this.datepipe.transform(myDate, 'dd/MM/yyyy');

  }
  AddDayDefaultDate(date : any , day :number)
  {
    let myDate = new Date(new Date(date).getTime()+(day*24*60*60*1000));
     return this.datepipe.transform(myDate, 'dd MMM yyyy');
  }
  transformDecimal(num: string | number) {
    return this.decimalPipe.transform(num, '1.0-0');
  }

  MasterGST(data : any )
  {
    let url=tts_config.APIURL+'/flight/master-gst-info';
    return this.http.post(url, data, {headers: { 'Content-Type': 'application/json'}});
  }
  Calculatedatediff(date1: string | number | Date,date2: string | number | Date)
  {
    let diffc;
    let days;
    let ndate1=new Date(date1);
    let ndate2=new Date(date2);
    diffc = ndate1.getTime() - ndate2.getTime();
    days = Math.round(Math.abs(diffc/(1000*60*60*24)));
    return days;
  }

  DefaultDateFormat(date: string | number | Date)
  {
    let myDate = new Date(date);
    return this.datepipe.transform(myDate, 'dd MMM yyyy');
  }

  ShowBookMessage(day:number)
  {
        let value:string;
        switch (day) {
            case 8:
            value="50";
            break;
            case 7:
                value="58";
                break;
            case 6:
                value="62";
                break;
            case 5:
                value="68";
                break;
            case 4:
                value="75";
                break;
            case 3:
                value="80";
                break;
            case 2:
                value="85";
                break;
            case 1:
                value="92";
                break;
            default:
               value="";
                break;
        }
      return value;
  }
  GetInvoiceTicket(data:any)
  {
     let params = new HttpParams();
     params=params.append('booking_ref_number', data['booking_ref_number']);
     params=params.append('type', data['type']);
     if(data['price']){
      params=params.append('price', data['price']);
     }
     if(data['send_email']){
      params=params.append('send_email', data['send_email']);
     }
     if(data['to_email']){
      params=params.append('to_email', data['to_email']);
     }
     params=params.append('agency_detail', data['agency_detail']);

    let url=tts_config.APIURL+'/hotel/get-voucher-invoice';
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

   let url=tts_config.APIURL+'/hotel/get-voucher-invoice';
   return this.http.get(url,{ params: params,responseType: 'blob'});

 }
}
