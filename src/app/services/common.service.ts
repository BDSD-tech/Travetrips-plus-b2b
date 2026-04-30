import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { tts_config } from '../../environments/tts_config';
import { BehaviorSubject } from 'rxjs';
import { DecimalPipe } from '@angular/common';

@Injectable({
  providedIn: 'root'
})
export class CommonService {
  
  private dataWebsetting = new BehaviorSubject([]);
  Websetting = this.dataWebsetting.asObservable();

  private dataOffer = new BehaviorSubject([]);
  HomeOffer = this.dataOffer.asObservable();

  private dataNotifications = new BehaviorSubject([]);
  HomeNotifications = this.dataNotifications.asObservable();
  
  private dataPopupNotifications = new BehaviorSubject([]);
  PopupNotifications = this.dataPopupNotifications.asObservable();

  private dataFooterMenu = new BehaviorSubject([]);
  DataFooterMenu = this.dataFooterMenu.asObservable();


  private dataWalletBalance = new BehaviorSubject({'Balance':0,'CreditLimit':0,'DueAmount':0,'CreditStatus':'NA','ExpireDate':'','WalletStatus':'','DepositBalance':0});
  WalletBalance = this.dataWalletBalance.asObservable();

  constructor(private http: HttpClient,private decimalPipe: DecimalPipe) { 

    this.SetWebSiteData();
  }
  
  public SetWebSiteData() {

    let url=tts_config.APIURL+'/common/website-info';
    return this.http.get(url, {headers: { 'Content-Type': 'application/json'}}).subscribe(resp => {
          let response:any=resp; 
          this.dataWebsetting.next(response['WebSiteInfo']);
          this.dataOffer.next(response['Offers']);
          this.dataNotifications.next(response['Notifications']);
          this.dataPopupNotifications.next(response['PopupNotification']);
          this.dataFooterMenu.next(response['FooterMenu']);
    });
  }

  public GetWebSiteData()
  {
    return this.Websetting;
  }
  public GetFooterData()
  {
    return this.DataFooterMenu;
  }

  public GetHomeOffer()
  {
    return this.HomeOffer;
  }

  public GetHomeNotifications()
  {
    return this.HomeNotifications;
  }

  public GetPopupNotifications()
  {
    return this.PopupNotifications;
  }

  public Logout()
  {
    let url=tts_config.APIURL+'/logout';
    return this.http.get(url,{headers: { 'Content-Type': 'application/json'}});
  }

  statelist(val:any)
  {
    // Initialize Params Object
    let params = new HttpParams();
    params = params.append('cid', val.toString());
    let configUrl =  tts_config.APIURL +'/common/state';
    return this.http.get(configUrl,{ params: params});
  }

  citylist(val:any)
  {
     // Initialize Params Object
     let params = new HttpParams();
     params = params.append('sid', val.toString());
     let configUrl =  tts_config.APIURL +'/common/city';
     return this.http.get(configUrl,{ params: params});
  }
  
  dialcode()
  {
     let configUrl =  tts_config.APIURL +'/common/country-phone-code';
     return this.http.get(configUrl);
  }
  GetCountry(){
    let configUrl =  tts_config.APIURL +'/common/country';
     return this.http.get(configUrl);
  }
  GetBankDetails()
  {
     let configUrl =  tts_config.APIURL +'/common/bank-list';
     return this.http.get(configUrl);
  }
  GetPagesDetails(slug:any)
  {
     let configUrl =  tts_config.APIURL +'/common/page-details?slug='+slug+""
     return this.http.get(configUrl);
  }

  public Contactus(data:any)
  {
    let url=tts_config.APIURL+'/common/contactus';
    return this.http.post(url, data, {headers: { 'Content-Type': 'application/json'}});
  }

  public paymentmethod(data:any)
  {
    let url=tts_config.APIURL+'/payment/payment-mode';
    return this.http.post(url, data, {headers: { 'Content-Type': 'application/json'}});
  }

  public OnlineRecharge(data:any)
  {
    let url=tts_config.APIURL+'/payment/online-top-up';
    return this.http.post(url, data, {headers: { 'Content-Type': 'application/json'}});
  }
  
  public SetWalletBalance()
  {
    let url=tts_config.APIURL+'/payment/wallet-balance';
    return this.http.get(url).subscribe(resp => {
        let response:any=resp; 
        if(response['Error']['ErrorCode']==0)
        {
          let balance:any=parseFloat(response['Result']['Balance']);
          let creditlimit:any=parseFloat(response['Result']['CreditLimit']);
          let dueamount:any=parseFloat(response['Result']['DueAmount']);
          let creditstatus:any=response['Result']['CreditStatus'];
          let expiredate:any=response['Result']['ExpireDate'];
          let walletstatus:any=response['Result']['WalletStatus'];
          let depositbalance:any=parseFloat(response['Result']['DepositeAmount']);

          this.dataWalletBalance.next({'Balance':balance,'CreditLimit':creditlimit,'DueAmount':dueamount,'CreditStatus':creditstatus,'ExpireDate':expiredate,'WalletStatus':walletstatus,'DepositBalance':depositbalance});
        }
      });
  }
  public GetWalletBalance()
  {
    return this.WalletBalance;
  }
  
  transformDecimal(num:any) {
    return this.decimalPipe.transform(num, '1.0-2');
   }

    updateFavicon(faviconUrl: string) {
      const existingFavicon = document.querySelector("link[rel*='icon']") as HTMLLinkElement;

      if (existingFavicon) {
        existingFavicon.href = faviconUrl;
      } else {
        const newFavicon = document.createElement('link');
        newFavicon.rel = 'icon';
        newFavicon.href = faviconUrl;
        document.head.appendChild(newFavicon);
      }
}

}
