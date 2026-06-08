import { Injectable } from '@angular/core';
import { DatePipe, DecimalPipe } from '@angular/common';
import { HttpClient, HttpParams } from '@angular/common/http';
import { tts_config } from '../../../environments/tts_config';

@Injectable({
  providedIn: 'root'
})
export class BusService {

  constructor(private http: HttpClient,public datepipe: DatePipe,private decimalPipe: DecimalPipe) { }


  ResultList(data:any)
  {
    //return this.http.get('assets/bus-result.json');

    let url=tts_config.APIURL+'/bus/search';
    return this.http.post(url, data, {headers: { 'Content-Type': 'application/json'}}); 
  }
  SeatLayout(data:any)
  {
    //return this.http.get('assets/bus-seat.json');
    let url=tts_config.APIURL+'/bus/get-seat-layout';
    return this.http.post(url, data, {headers: { 'Content-Type': 'application/json'}}); 
  }
  BlockSeat(data:any)
  {
    let url=tts_config.APIURL+'/bus/block-seat';
    return this.http.post(url, data, {headers: { 'Content-Type': 'application/json'}}); 
  }

  MasterGST(data : any )
  {
    let url=tts_config.APIURL+'/flight/master-gst-info';
    return this.http.post(url, data, {headers: { 'Content-Type': 'application/json'}});
  }


 transformDecimal(num:any) {
  return this.decimalPipe.transform(num, '1.0-2');
 }

 DefaultDateFormat(date:any)
 {
   let myDate = new Date(date);
   return this.datepipe.transform(myDate, 'dd MMM yyyy');
 }

 AddDayDefaultDate(date : any , day :number)
 {
   let myDate = new Date(new Date(date).getTime()+(day*24*60*60*1000));
    return this.datepipe.transform(myDate, 'dd MMM yyyy');
 }


 send_itinerary(data : any )
 {
   let url=tts_config.APIURL+'/bus/send-itinerary';
   return this.http.post(url, data, {headers: { 'Content-Type': 'application/json'}});
 }

 GetConfimationData(data:any,type:any)
 {
   let params = new HttpParams();
   if(type)
   {
     params=params.append('type',type);
   }
   let url=tts_config.APIURL+'/bus/confirmation/'+data['token'];
   return this.http.get(url,{ params: params});
 }

 UpdateMarkup(data : any )
 {
   let url=tts_config.APIURL+'/bus/update-webpartner-markup';
   return this.http.post(url, data, {headers: { 'Content-Type': 'application/json'}});
 }

 SendSMS(data : any )
 {
   let url=tts_config.APIURL+'/bus/send-sms';
   return this.http.post(url, data, {headers: { 'Content-Type': 'application/json'}});
 }

 
  GetInvoiceTicket(data:any)
  {
     let params = new HttpParams();
     params=params.append('booking_ref_number', data['booking_ref_number']);
     params=params.append('type', data['type']);
     params=params.append('price', data['price']);
     if(data['send_email']){
      params=params.append('send_email', data['send_email']);
     }
     if(data['to_email']){
      params=params.append('to_email', data['to_email']);
     }
     params=params.append('agency_detail', data['agency_detail']);

    let url=tts_config.APIURL+'/bus/get-voucher-invoice';
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

   let url=tts_config.APIURL+'/bus/get-voucher-invoice';
   return this.http.get(url,{ params: params,responseType: 'blob'});

 }
  
}
