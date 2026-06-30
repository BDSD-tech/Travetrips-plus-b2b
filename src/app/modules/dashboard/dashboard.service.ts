import { DatePipe } from '@angular/common';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { tts_config } from '../../../environments/tts_config';

@Injectable({
  providedIn: 'root'
})
export class DashboardService {

  constructor(private http: HttpClient,public datepipe: DatePipe) { }


  public GetDetail()
  {
     // Initialize Params Object
     let params = new HttpParams();
     let configUrl =  tts_config.APIURL +'/agent/details';
     return this.http.get(configUrl,{ params: params});

  }
  public MakeBookingPayment(data:any)
  {
    let service:any;

    if(data['Service']=='Flight'){
        service='flight'
    }else if(data['Service']=='Hotel'){
      service='hotel'
    }
    let configUrl =  tts_config.APIURL +'/'+service+'/issue-ticket';
    return this.http.post(configUrl, data);
  }
  public UpdateDetail(data:any)
  {
    let configUrl =  tts_config.APIURL +'/agent/update-details';
    return this.http.post(configUrl, data);
  }
  
  public DashboardDetails()
  {
    let req:any={}
    let configUrl =  tts_config.APIURL +'/dashboard';
    return this.http.post(configUrl,req);
  }
  public GSTDetails(data:any)
  {
    let configUrl =  tts_config.APIURL +'/agent/save-gst-info';
    return this.http.post(configUrl, data);
  }
  public TravellersDetails(data:any)
  {
    let configUrl =  tts_config.APIURL +'/agent/save-pax-info';
    return this.http.post(configUrl, data);
  }
  public BookingCalendar(data:any)
  {
    let configUrl =  tts_config.APIURL +'/flight/flight-booking-calendar';
    return this.http.post(configUrl, data);
  }
  public AddDepositRequest(data:any)
  {
    let configUrl = tts_config.APIURL +'/agent/add-deposit-request';
    return this.http.post(configUrl, data);
  }
  public CreditList(data:any)
  {
    let configUrl = tts_config.APIURL +'/agent/credit-request-list';
    return this.http.post(configUrl, data);
  }
  public CreditNotesList(data:any,type:any)
  {
    let configUrl = tts_config.APIURL +'/'+type+'/credit-note-list';
    return this.http.post(configUrl, data);
  }
  public GetCreditnotes(data:any)
  {
    // let params:any = new HttpParams();
    // params=params.append('BookigId', data['BookigId']);
    // params=params.append('SearchTokenId', data['SearchTokenId']);
    // params=params.append('HtmlType', data['HtmlType']);
    // params=params.append('UserType', data['UserType']);
    // params=params.append('ViewService', data['ViewService']);
    // params=params.append('WithAgencyDetail', data['WithAgencyDetail']);
    // params=params.append('ViewSize', data['ViewSize']);
    // params=params.append('RequestBy', data['RequestBy']);
    
    
    let configUrl = tts_config.APIURL +'/'+data['Service']+'/get-credit-note';
    return this.http.post(configUrl,data);
  }
  public AddCreditRequest(data:any)
  {
    let configUrl = tts_config.APIURL +'/agent/add-credit-request';
    return this.http.post(configUrl, data);
  }
  public DepositList(data:any)
  {
    let configUrl =  tts_config.APIURL +'/agent/make-payment-list';
    return this.http.post(configUrl, data);
  }
  public AddMarkup(data:any)
  {
    let configUrl =  tts_config.APIURL +'/agent/add-markup';
    return this.http.post(configUrl,data);
  }
  public AddHotelMarkup(data:any)
  {
    let configUrl =  tts_config.APIURL +'/agent/add-hotel-markup';
    return this.http.post(configUrl,data);
  }
  public ReachFlight(data:any)
  {
    let configUrl =  tts_config.APIURL +'/flight/release-pnr';
    return this.http.post(configUrl,data);
  }
  public EditMarkup(data:any)
  {
    let configUrl =  tts_config.APIURL +'/agent/update-markup';
    return this.http.post(configUrl,data);
  }
  public EditHotelMarkup(data:any)
  {
    let configUrl =  tts_config.APIURL +'/agent/update-hotel-markup';
    return this.http.post(configUrl,data);
  }
  public MarkupList(data:any)
  {
    let configUrl =  tts_config.APIURL +'/agent/markup-list';
    return this.http.post(configUrl,data);
  }
  public HotelMarkupList(data:any)
  {
    let configUrl =  tts_config.APIURL +'/agent/markup-hotel-list';
    return this.http.post(configUrl,data);
  }
  public DeleteMarkup(data:any)
  {
    let configUrl =  tts_config.APIURL +'/agent/delete-markup';
    return this.http.post(configUrl,data);
  }
  public DeleteHotelMarkup(data:any)
  {
    let configUrl =  tts_config.APIURL +'/agent/delete-hotel-markup';
    return this.http.post(configUrl,data);
  }

  public airlineautocomplete(val:any)
  {
    let params = new HttpParams();
    params = params.append('term', val.toString());
    let configUrl =  tts_config.APIURL +'/common/airline-list';
    return this.http.get(configUrl,{ params: params});
  }

  public FlightList(data:any)
  {
    let configUrl =  tts_config.APIURL +'/flight/flight-booking-list';
    return this.http.post(configUrl,data);
  }
  public FlightDetail(id:any)
  {
    let configUrl =  tts_config.APIURL +'/flight/flight-details/'+id;
    return this.http.get(configUrl);
  }
  public BusBookingList(data:any)
  {
    let configUrl =  tts_config.APIURL +'/bus/bus-booking-list';
    return this.http.post(configUrl,data);
  }
  public BusBookingDetail(id:any)
  {
    let configUrl =  tts_config.APIURL +'/bus/details/'+id;
    return this.http.get(configUrl);
  }

public HotelList(data:any)
  {
    let configUrl =  tts_config.APIURL +'/hotel/hotel-booking-list';
    return this.http.post(configUrl,data);
  }

  public HotelDetail(id:any)
  {
    let configUrl =  tts_config.APIURL +'/hotel/details/'+id;
    return this.http.get(configUrl);
  }



  public AccountLog(data:any)
  {
    let configUrl =  tts_config.APIURL +'/agent/account-log';
    return this.http.post(configUrl,data);
  }

  public AmendmentsList(data:any,service:any)
  {
    let configUrl =  tts_config.APIURL +'/'+service+'/amendment-list';
    return this.http.post(configUrl,data);
  }
  public RaiseAmendments(data:any,service:any)
    {
      let configUrl =  tts_config.APIURL +'/'+service+'/raise-amendment';
      return this.http.post(configUrl,data);
    }

  AddDayDefaultDate(date : any , day :number)
  {
    let myDate = new Date(new Date(date).getTime()+(day*24*60*60*1000));
     return this.datepipe.transform(myDate, 'dd MMM yyyy');
  }

  SubstractCurrentDate(day :number)
  {
    let myDate=new Date(new Date().getTime()-(day*24*60*60*1000));
    return this.datepipe.transform(myDate, 'dd MMM yyyy');
  }

   Downloadpayment(data:any)
  {
     let configUrl =  tts_config.APIURL +'/agent/account-log-excel-report';
     return this.http.post(configUrl,data);

  }
  DownloadReportFlight(data:any){
   
      let configUrl =  tts_config.APIURL +'/flight/flight-excel-report';
      return this.http.post(configUrl,data);
  }
  DownloadReportFlightPDF(data:any){
     let configUrl =  tts_config.APIURL +'/flight/flight-excel-report-pdf';
      return this.http.post(configUrl,data,{responseType: 'blob'});
  }
  DownloadReportHotel(data:any){
    let configUrl =  tts_config.APIURL +'/hotel/hotel-excel-report';
     return this.http.post(configUrl,data);
  }
  DownloadReportHotelPDF(data:any){
   let configUrl =  tts_config.APIURL +'/hotel/hotel-excel-report-pdf';
      return this.http.post(configUrl,data,{responseType: 'blob'});
  }
  DownloadReportDepositRequest(data:any){
    let configUrl =  tts_config.APIURL +'/agent/make-payment-excel-report';
     return this.http.post(configUrl,data);
  }
  DownloadReportCreditRequest(data:any){
    let configUrl =  tts_config.APIURL +'/agent/credit-request-excel-report';
     return this.http.post(configUrl,data);
  }
   DownloadReport(data:any)
  {
     // Initialize Params Object
     let params = new HttpParams();
     params=params.append('Type', data['ReportType']);
     params=params.append('FromDate', data['FromDate']);
     params=params.append('ToDate', data['ToDate']);
     let configUrl =  tts_config.APIURL +'/agent/download-report';
     return this.http.get(configUrl,{ params: params});

  }
 AddNote(data:any,service:any)
  {
    let configUrl =  tts_config.APIURL +'/'+service+'/save-notes';
    return this.http.post(configUrl,data);
  }

  AbortAmendments(data:any,service:any)
  {
    let configUrl =  tts_config.APIURL +'/'+service+'/abort-amendment';
    return this.http.post(configUrl,data);
  }
  UserList(req:any)
  {
    let configUrl =  tts_config.APIURL +'/agent/user-list';
    return this.http.post(configUrl,req);
  }
  AddUpdateUser(req:any)
  {
    let configUrl =  tts_config.APIURL +'/agent/add-or-update-user';
    return this.http.post(configUrl,req);
  }
  ChangeUserStatus(req:any)
  {
    let configUrl =  tts_config.APIURL +'/agent/change-status';
    return this.http.post(configUrl,req);
  }
  ChangePass(req:any)
  {
    let configUrl =  tts_config.APIURL +'/agent/change-user-password';
    return this.http.post(configUrl,req);
  }

}
