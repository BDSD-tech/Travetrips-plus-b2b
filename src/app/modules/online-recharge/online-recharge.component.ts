import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { AlertService } from '../../services/alert.service';
import { CommonService } from '../../services/common.service';

declare var $: any;

@Component({
  selector: 'app-online-recharge',
  templateUrl: './online-recharge.component.html',
  styleUrls: ['./online-recharge.component.css']
})
export class OnlineRechargeComponent implements OnInit {

  Amount:any;
  submit=false;
  paymentloading:any=true;
  PaymentOption:any=[];
  paylnowloading:any=false;
  ShowPaymwntresp:any=false;


  SaveData:any={};
  conveniencefee:any=0;
  paymentmode:any='DBCRD';
  Gateway:any='';
  paymentID:any='';
  Paymentamount:any=0
  selpaymentmode:any=[];

  activatedRoute: ActivatedRoute | null | undefined;


  constructor(private commonservice:CommonService,private alertservice:AlertService,private router: Router, private route: ActivatedRoute) { 
    if(sessionStorage.getItem('PaymentAmount')){
      this.Paymentamount=sessionStorage.getItem('PaymentAmount')
    }
    this.route.queryParams.subscribe(params => {
      if(params && params['transactionid']) {
        this.paymentID=params['transactionid']
          this.alertservice.success('Online recharge has bee done successfully. transaction id is '+params['transactionid']);
      }
    });

  }

  ngOnInit(): void {

   
  }
  ngOnDestroy(): void {
    sessionStorage.removeItem('PaymentAmount');
  }

  setQueryParams(){
    const qParams: Params = {};
    this.router.navigate([], {
        relativeTo: this.activatedRoute,
        queryParams: qParams,
        queryParamsHandling: ''
    });
}

  AddMoney()
  {
    this.submit=true;
    this.paymentloading=true;
    if(this.submit)
    {
      this.Getpaymentmethod();
    }
   
  }

  Getpaymentmethod()
  {
    let request={'service':'Make_Payment'}
    this.commonservice.paymentmethod(request).subscribe(resp => {
      let data:any=resp;
      this.paymentloading=false;
      if(data['Error']['ErrorCode']==0)
      {
        var _this=this;
        let paymentdata:any=[];
        data['Result'].forEach((value:any,key:any) => {
          if(value['mode']!='wallet')
          {
            value['totalprice']=this.Amount;
            paymentdata.push(value); 
         }
        });
        this.PaymentOption=paymentdata;
        this.selpaymentmode=this.PaymentOption.filter((item:any) => { 
          if(item['mode']==this.paymentmode)
          {
            return item;
          }
        })[0];

      } else {
          this.alertservice.error(data['Error']['ErrorMessage']);
      } 
    });
  }


  ConvenienceFeeCal(data:any)
  {
    let paymentfee:any=0;
    if(data['ValueType']=='fixed')
    {
      paymentfee=parseFloat(data['Value']);
    } else {
      paymentfee=(this.Amount*data['Value'])/100;
      paymentfee=parseFloat(paymentfee);
    }
    return paymentfee;
  }

  selectmode(mode:any)
  {
    if(this.paymentmode!=mode)
    {

      $('input[name="selectmodegetway"]').prop('checked', false);
      this.conveniencefee=0;
      this.paymentmode=mode;
      this.selpaymentmode=this.PaymentOption.filter((item:any) => { 
        if(item['mode']==mode)
        {
          return item;
        }
      })[0];

      this.selpaymentmode['totalprice']=this.Amount;
    }
  
  }
  selectpaymentgetway(item:any)
  {
    if(item)
    {
      this.conveniencefee=this.ConvenienceFeeCal(item)
      this.Gateway=item['Gateway'];
      this.selpaymentmode['totalprice']=parseFloat(this.Amount)+parseFloat(this.conveniencefee);
    } else {
      this.conveniencefee=0;
    }
  }


  PayNow()
  {
    this.paylnowloading=false;
    if(this.Gateway)
    {
      this.SaveData['Gateway']=this.Gateway;
      this.SaveData['Amount']=this.Amount;
      this.SaveData['PaymentMode']=this.paymentmode;

      sessionStorage.setItem('PaymentAmount',this.Amount)
      this.commonservice.OnlineRecharge(this.SaveData).subscribe(resp => {
        let data:any=resp;
        this.paylnowloading=false;
        if(data['Error']['ErrorCode']==0)
        {
          this.ShowPaymwntresp=true;
            window.location.href=data['Result']['url'];
        } else {
            this.ShowPaymwntresp=false;
            this.alertservice.error(data['Error']['ErrorMessage']);
        }   
      });
    } else {
      this.alertservice.error("Please select getway option");
    }
  }

  numberOnly(event:any) {
    const charCode = (event.which) ? event.which : event.keyCode;
    if (charCode > 31 && (charCode < 48 || charCode > 57)) {
      return false;
    }
    return true;
  }
}
