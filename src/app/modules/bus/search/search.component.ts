import { Component, OnInit } from '@angular/core';
import { Sort } from '@angular/material/sort';
import { Router, NavigationEnd } from '@angular/router';
import { BusService } from '../bus.service';
import { Subscription } from 'rxjs';
import { MatDialog } from '@angular/material/dialog';
import { SeatLayoutComponent } from '../seat-layout/seat-layout.component';
import { AlertService } from '../../../services/alert.service';
import { AuthenticationService } from '../../../services/authentication.service';


declare var window: any;

@Component({
  selector: 'app-search',
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.css']
})
export class SearchComponent implements OnInit {

  routeSubscription!: Subscription;
  
  GetSearchData: any = [];
  resultloading:boolean=true;
  ErrorCode: number | undefined=0;
  ErrorMessage: string | undefined;
  Response: any;
  SearchTokenId:any;
  FilterResponse:any;
  sortedData:any =[];
  resultcount:number | undefined;
  filterresultcount:number | undefined;

  nobus=null;
  applyfiltercount:number=0;

  sort:any={};

  showBusTab:any;
  obfield:any='totalfare';
  resultlimit=20;

  shownetfare=false;
  showincentivefare=false;

  formModal: any;
  formmodalemail: any;
  sharebuttontext='';
  shareviewdetail='';
  sharetype='';
  shareemaillist:any;
  shareselectedfareid:any;
  sharebuttonloding=false;

  clearfilter:any=false;

  userinfo:any={};
  
  constructor(private router: Router,private busservice:BusService,public dialog: MatDialog,private alertservice:AlertService,private authenticationservice: AuthenticationService) {


    this.router.routeReuseStrategy.shouldReuseRoute = function () {
      return false;
    };

    this.routeSubscription = this.router.events.subscribe((event) => {
      if (event instanceof NavigationEnd) {
        // Trick the Router into believing it's last link wasn't previously loaded
        this.router.navigated = false;
      }
    });  

    if (sessionStorage.getItem('BusSearch')) {
      let bussearch:any=sessionStorage.getItem('BusSearch');
      this.GetSearchData = JSON.parse(bussearch);
    } else {
      this.router.navigate(['/bus']);
    }

   }

  ngOnInit() {
    
    sessionStorage.removeItem('time');
    sessionStorage.removeItem('BUSRD');
    sessionStorage.removeItem('TSFPAX');
    sessionStorage.removeItem('TAGM');

    this.GetResult();

    this.authenticationservice.currentUser.subscribe(data => {
      if(data)
      {
          this.userinfo=data;
          this.shareemaillist= this.userinfo['EmailId'];
      }
    });

    this.formModal = new window.bootstrap.Modal(
      document.getElementById('formmodal')
    );
     this.formmodalemail = new window.bootstrap.Modal(
      document.getElementById('formmodal-email')
    );
  }

  ngOnDestroy() {
    if (this.routeSubscription) {
      this.routeSubscription.unsubscribe();
    }
  }
  
  GetResult()
  {
     /*------------ Start Session ----------*/
     let initial_date = new Date;
     let added15Min = new Date(initial_date.getTime() + (14*60*1000));
     sessionStorage.setItem('time',JSON.stringify(added15Min));
    
     /*------------ End Session ----------*/

    this.resultloading=true;
    this.ErrorCode = 0; 
    let request:any={};
    request['OriginId']=this.GetSearchData['OriginCityID']
    request['DestinationId']=this.GetSearchData['DestinationCityID'];
    request['DateOfJourney']=this.GetSearchData['DepartDate'];

    this.busservice.ResultList(request).subscribe(resp => {
      this.resultloading = false;
      let response:any=resp;
      this.ErrorCode = response['Error']['ErrorCode'];
      this.ErrorMessage = response['Error']['ErrorMessage'];
      if(response['Error']['ErrorCode']==0){
       this.SearchTokenId=response['SearchTokenId'];
       this.Response = response['Result'];
       this.FilterResponse=response['Filter'];
       this.resultcount=this.Response.length;
       this.sortedData = this.Response.slice();      
       setTimeout(() => {
          this.topsort('totalfare','asc','');
        }, 100);
      }

    });

  }
  busdetail(_event:any,item:any)
  {

    if(_event.target.classList.contains('tts-minus'))
    {
      this.showBusTab='';
    } else {
      this.showBusTab=item['ResultIndex'];

    }
  }

  receiveFare($event:any) {
    if($event.type=='incv')
    {
      this.showincentivefare=$event.val;
    }
    if($event.type=='net')
    {
      this.shownetfare=$event.val;
    }
  }

  receiveMessage($event:any) {
    this.sortedData=$event.response;
    this.filterresultcount=this.sortedData.length;
    this.resultcount=this.filterresultcount;
    this.resultlimit=20;
    this.clearfilter=false;
  }

  SelectSeats(item:any)
  {
    let data={  
              'SearchTokenId':this.SearchTokenId,
              'ResultIndex':item['ResultIndex']
             };
  
    const dialogRef =this.dialog.open(SeatLayoutComponent,{
      width: '700px',
      data:{searchdata:this.GetSearchData,request:data,selectedbus:item},
      panelClass: 'my-seat-layout'
    });
    dialogRef.afterClosed().subscribe(result => {
      
    });
  }


  Shareby(type:any)
  {
    this.sharetype=type;
    if(type=='Close')
    {
      this.sharebuttontext='';
    } else if(type=='Whatsapp'){
      this.sharebuttontext='Send';
    } else if(type=='Email'){
      this.sharebuttontext='Send';
    } else if(type=='View'){
      this.sharebuttontext='Open';
    }
  }

  SendData()
  {
    let selecteddata:any=[];
    let checkbox:any = document.getElementsByName('shareinput[]');
    let ln = 0;
    for (var i = 0; i < checkbox.length; i++) {
        if (checkbox[i].checked){
          ln++;
          selecteddata.push(checkbox[i].value);
        }
    }
    if (ln === 0) {
        alert("Select atleast 1 bus");
    } else {

        this.shareselectedfareid=selecteddata;
        
        let html:any='';
        let Whatsapphtml:any='';
        var _this=this;
        selecteddata.forEach(function(value:any,key:any) {
          console.log(value);
          let keys=value.split("_");
          _this.Response.filter(function(Item:any) {

                  if(Item.ResultIndex == keys[0])
                  {
                    let fare='₹'+ _this.busservice.transformDecimal(Item['BusPrice']['PublishedPrice']);

                    let ArrivalDate:any;
                    if(Item['ArrivalDate'])
                    {
                      let dateobj = new Date();
                      var currentyear = dateobj.getFullYear();
                      let finaldate  =Item['ArrivalDate']+' '+currentyear;
                      ArrivalDate=_this.busservice.DefaultDateFormat(finaldate);
                    } else {
                      ArrivalDate=_this.GetSearchData['DepartDate'];
                    }
                  
                   html+='<p>'
                    + (key+1) +'. '+ Item['TravelName'] +' ('+ Item['BusType'] +') : <br/>'
                    + _this.GetSearchData['Origin']+' - '+ _this.GetSearchData['Destination'] + ' on ' + Item['DepartureTime']+' '+  _this.GetSearchData['DepartDate']+ ' - ' + Item['ArrivalTime']+' '+  ArrivalDate+ ' Duration:'+ Item['Duration']+', '+fare +'.'
                  '</p>';

                  Whatsapphtml+='*'+(key+1) +'. '+ Item['TravelName'] +' ('+ Item['BusType'] +') :* %0a'
                        + _this.GetSearchData['Origin']+' - '+ _this.GetSearchData['Destination'] + ' on ' + Item['DepartureTime']+' '+  _this.GetSearchData['DepartDate']+ ' - ' + Item['ArrivalTime']+' '+  ArrivalDate+ ' Duration:'+ Item['Duration']+', '+fare +'. %0a%0a';
                    
                  } 
          });

        });

        this.shareviewdetail=html;

        if(this.sharetype=='Whatsapp')
        {
          this.goToLink('https://api.whatsapp.com/send?text='+Whatsapphtml+'');

        } else if(this.sharetype=='Email')
        {
          this.formmodalemail.show();
          
        } else if(this.sharetype=='View') {
          this.formModal.show();
        }

    }
  }

  sendemail(type:any)
  {
    this.sharebuttonloding=true;
    let emaillist=this.shareemaillist.split(",");
    let data={
              'pricetype':type,
              'sharetype':this.sharetype,
              'emailid':emaillist,
              'selectedfareid':this.shareselectedfareid
             }
    this.busservice.send_itinerary(data).subscribe(resp => {
      let response:any=resp;
      this.sharebuttonloding=false;
      this.formmodalemail.hide();
      if(response['Error']['ErrorCode']==0)
      {
        this.alertservice.success(response['Error']['ErrorMessage']);
      } else {
        this.alertservice.error(response['Error']['ErrorMessage']);
      }
    });
  }

  goToLink(url: string){
    window.open(url, "_blank");
   }


   resetfilterdata()
   {
     this.clearfilter=true;
   }

  topsort(active:any,direction:any,event:any)
  {
    let sort={
              "active":active,
              "direction":direction
             };
    this.sort=sort;         
    this.sortData(sort);
  }

  sortData(sort: Sort) {
    const data = this.sortedData.slice();
    if (!sort.active || sort.direction === '') {
      this.sortedData = data;
      return;
    }
    this.sortedData = data.sort((a:any, b:any) => {
      const isAsc = sort.direction === 'asc';
      switch (sort.active) {
        case 'totalfare': return compare(parseFloat(a.BusPrice.PublishedPrice), parseFloat(b.BusPrice.PublishedPrice), isAsc);
        case 'duration': return compare(a.durationMinutes, b.durationMinutes, isAsc);
        case 'departtime': return compare(a.DepartureTime, b.DepartureTime, isAsc);
        case 'arrivaltime': return compare(a.ArrivalTime, b.ArrivalTime, isAsc);
        default: return 0;
      }
    });
  }

}
function compare(a: number | string, b: number | string, isAsc: boolean) {
  return (a < b ? -1 : 1) * (isAsc ? 1 : -1);
}