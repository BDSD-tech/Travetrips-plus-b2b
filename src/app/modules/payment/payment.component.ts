import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute, NavigationExtras } from '@angular/router';
import { Location } from '@angular/common';
import { CommonService } from '../../services/common.service';
import { AlertService } from '../../services/alert.service';
import { FlightService } from '../flight/flight.service';

declare var window: any;
declare var $: any;

@Component({
  selector: 'app-payment',
  templateUrl: './payment.component.html',
  styleUrls: ['./payment.component.css']
})
export class PaymentComponent implements OnInit {

  SessionTime:any;
  WebSiteData:any=[];
  GetSearchData: any=[];
  param:any=[];
  CurrentFare:any={};
  isshowmarkup:any=false;
  markupvalue=0;

  paymentloading:any=true;
  PaymentOption:any=[];
  paylnowloading:any=false;

  payfinalloading:any=false;

  totalfare:any;
  conveniencefee:any=0;
  WalletBalance:any=0;
  
  SaveData:any=[];
  paymentmode:any='';
  Gateway:any;

  formModal: any;
  confirmtotalfare:any;

  netpayableamount:any=0;
  Service:any
  constructor(private router: Router, private route: ActivatedRoute,private location: Location,private commonservice:CommonService,private alertservice:AlertService,private flightService: FlightService) {

 }

  ngOnInit(): void {

    this.formModal = new window.bootstrap.Modal(document.getElementById('confirmmodel'));

    if(sessionStorage.getItem('time')) {
      let time:any=sessionStorage.getItem('time');
      this.SessionTime=JSON.parse(time);
    }

    this.route.queryParams.subscribe((resp:any)=>{
      this.Service=resp['service'];
    })
    if(this.Service=='Flight'){
          if (sessionStorage.getItem('TSFP')) {
                let TSFP:any=sessionStorage.getItem('TSFP');
                let resp=JSON.parse(TSFP);
                this.CurrentFare=resp['fare'];

                this.netpayableamount=this.CurrentFare['OfferedPrice']+this.CurrentFare['TDS'];

                if (sessionStorage.getItem('TAGM')) {
                  let markup:any=sessionStorage.getItem('TAGM');
                  this.markupvalue=parseFloat(markup);
                  this.CurrentFare['AgentMarkup']=this.markupvalue;
                }
                // this.totalfare=this.CurrentFare['PublishedPrice']+this.CurrentFare['AgentMarkup']+this.CurrentFare['InsurancePrice']+this.CurrentFare['SSR']['Meal']+this.CurrentFare['SSR']['Baggage']+this.CurrentFare['SSR']['Seat']|0; 
                this.totalfare=this.CurrentFare['OfferedPrice']+this.CurrentFare['TDS']+this.CurrentFare['InsurancePrice']+this.CurrentFare['SSR']['Meal']+this.CurrentFare['SSR']['Baggage']+this.CurrentFare['SSR']['Seat']|0; 
              
                
              } else {
                this.router.navigate(['flight']);
              }

              if (sessionStorage.getItem('TSFPAX')) {
                let TSFP:any=sessionStorage.getItem('TSFPAX');
                let resp=JSON.parse(TSFP);
                this.Getpaymentmethod(resp);
                this.SaveData=resp;
              } else {
                this.router.navigate(['flight']);
              }
    }
    if(this.Service=='Hotel'){
        if (sessionStorage.getItem('TSFP')) {
                let TSFP:any=sessionStorage.getItem('TSFP');
                let resp=JSON.parse(TSFP);
                this.CurrentFare=resp['fare'];
                this.totalfare=this.CurrentFare['OfferedPrice']+this.CurrentFare['TDS']
                this.CurrentFare['BaseFare']=resp['fare']['RoomPrice'];
                let req:any={"ResultIndex":resp['param']['rindex'],'SearchTokenId':resp['param']['stoken']}
                this.Getpaymentmethod(req);
        }
          if (sessionStorage.getItem('TSFPAX')) {
                let TSFP:any=sessionStorage.getItem('TSFPAX');
                let resp=JSON.parse(TSFP);
                this.Getpaymentmethod(resp);
                this.SaveData=resp;
                this.SaveData['FB']=this.CurrentFare
              } else {
                this.router.navigate(['hotel']);
              }
    }
   

    
  }

  Getpaymentmethod(req:any)
  {
    let request={'service':this.Service,'ResultIndex':req['ResultIndex'],'SearchTokenId':req['SearchTokenId']}
    if(req['SearchTokenIdIB'] && req['ResultIndexIB'])
    {
      Object.assign(request, {ResultIndexIB: req['ResultIndexIB'],SearchTokenIdIB:req['SearchTokenIdIB']});
    }

    this.commonservice.paymentmethod(request).subscribe(resp => {
      let data:any=resp;
      this.paymentloading=false;
      this.GetWalletBalance();
      if(data['Error']['ErrorCode']==0)
      {
        var _this=this;
        let paymentdata:any=[];
        data['Result'].forEach(function(value:any,key:any) {
          if(key==0)
          {
            _this.paymentmode=value['mode'];
          }
          if(value['SubModes'])
          {
            value['SubModes'].forEach(function(value1:any,key1:any) {
                let paymentfee:any =_this.ConvenienceFeeCal(value1);
                value1['conveniencefee']=paymentfee;
                value1['totalprice']=_this.totalfare;
                if(key1==0)
                {
                  value['totalprice']=_this.totalfare;  
                }
            });
          }else {
            value['totalprice']=_this.totalfare;
          }
          paymentdata.push(value);
        });
        this.PaymentOption=paymentdata;
        
      } else {
        this.alertservice.error(data['Error']['ErrorMessage']);
        }  
    });





  }

  GetWalletBalance()
  {
    this.commonservice.GetWalletBalance().subscribe(data => {
      this.WalletBalance =data['Balance'];
    });
  }

  PayNow(type:any=null)
  {
    this.confirmtotalfare=this.totalfare+this.conveniencefee;
    if(type=='confirm')
    {

      this.payfinalloading=true;
      if(this.Gateway)
      {
        this.SaveData['Gateway']=this.Gateway;
      }
      this.SaveData['PaymentMode']=this.paymentmode;
      this.SaveData['Markup']=this.markupvalue;
      this.SaveData['TotalPrice']=this.totalfare;
      this.SaveData['PaymentFee']=this.conveniencefee;
        this.flightService.SavePaxdata(this.SaveData,this.Service).subscribe(resp => {
        let data:any=resp;
        this.payfinalloading=false;
        if(data['Error']['ErrorCode']==0)
        {
          window.location.href=data['Result']['url'];
        } else {
          this.alertservice.error(data['Error']['ErrorMessage']);
        }   
      });

    } else {
      this.formModal.show();
    }
  
  }

  ConvenienceFeeCal(data:any)
  {
    let paymentfee:any=0;
    if(data['ValueType']=='fixed')
    {
      paymentfee=parseFloat(data['Value']);
    } else {
      paymentfee=(this.netpayableamount*data['Value'])/100;
      paymentfee=parseFloat(paymentfee);
    }
    return paymentfee;
  }

  selectmode(mode:any)
  {
    this.paymentmode=mode;
    let selmode:any=this.PaymentOption.filter((item:any) => { 
      if(item['mode']==mode)
      {
        return item;
      }
    })[0];

    this.Gateway='';
    this.conveniencefee=0;
    $('input[name="selectmodegetway"]').prop('checked', false);

    
  }

  goBack()
  {
    this.location.back();
  }


  selectpaymentgetway(item:any,mainitem:any)
  {
    if(item)
    {
      this.conveniencefee=this.ConvenienceFeeCal(item)
      this.Gateway=item['Gateway'];
      mainitem['totalprice']=parseFloat(this.totalfare);
    } else {
      this.conveniencefee=0;
    }
  }

}
