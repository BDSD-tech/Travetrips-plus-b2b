import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { BusService } from '../bus.service';
import { NavigationExtras, Router } from '@angular/router';
import { AlertService } from '../../../services/alert.service';

@Component({
  selector: 'app-seat-layout',
  templateUrl: './seat-layout.component.html',
  styleUrls: ['./seat-layout.component.css'],
})
export class SeatLayoutComponent implements OnInit {

  GetSearchData: any = [];
  SelectedBusData: any = [];

  seatloading:boolean=true;
  ErrorCode: number | undefined=0;
  ErrorMessage: string | undefined;
  SearchTokenId:any;
  Response: any;


  PickupPoint:any='';
  DropPoint:any='';

  PickupPointErrorMSG:any='';
  DropPointErrorMSG:any='';
  SeatErrorMSG:any='';

  SelectedPickupData:any='';
  SelectedDropPointData:any='';

  Extrafarebrakup:any={};

  totalprice:any=0;
  seatnumber:any=[];
  showseatlabel:any="";

  constructor(@Inject(MAT_DIALOG_DATA) public data:any,private busservice:BusService, public dialogRef: MatDialogRef<SeatLayoutComponent>,private alertservice:AlertService,private router: Router) { }

  ngOnInit(): void {
    
    this.GetSearchData=this.data['searchdata'];
    this.SelectedBusData=this.data['selectedbus'];

    this.GetSeatData();
    
  }

  GetSeatData()
  {
    this.busservice.SeatLayout(this.data['request']).subscribe(resp => {
      this.seatloading = false;
      let response:any=resp;
      this.ErrorCode = response['Error']['ErrorCode'];
      this.ErrorMessage = response['Error']['ErrorMessage'];
      if(response['Error']['ErrorCode']==0) {
       this.SearchTokenId=response['SearchTokenId'];
       this.Response = response['Result'];

       setTimeout(() => {

        const pageElements=document.getElementsByClassName('nseat');
        if(pageElements && pageElements.length!=0){
          for(let i=0; i<pageElements.length; i++){
            let elm:any=pageElements[i];
            if (elm.hasAttribute("onclick")) {
              const fvalue=elm.getAttribute('onclick').replace('AddRemoveSeat(','').split(')')[0].replace(/'/g, '').split(',');
              pageElements[i].addEventListener('click',()=>{
              this.AddRemoveSeat(fvalue[1],pageElements[i]);
              });
            }
          }
        }

        const pageElements1=document.getElementsByClassName('hseat');
        if(pageElements1 && pageElements1.length!=0){
          for(let i=0; i<pageElements1.length; i++){
            let elm:any=pageElements1[i];
            if (elm.hasAttribute("onclick")) {
              const fvalue=elm.getAttribute('onclick').replace('AddRemoveSeat(','').split(')')[0].replace(/'/g, '').split(',');
              pageElements1[i].addEventListener('click',()=>{
                this.AddRemoveSeat(fvalue[1],pageElements1[i]);
              });
            }
          }
        }
    
        const pageElements2=document.getElementsByClassName('bseat');
        if(pageElements2 && pageElements2.length!=0){
          for(let i=0; i<pageElements2.length; i++){
            let elm:any=pageElements2[i];
            if (elm.hasAttribute("onclick")) {
              const fvalue=elm.getAttribute('onclick').replace('AddRemoveSeat(','').split(')')[0].replace(/'/g, '').split(',');
              pageElements2[i].addEventListener('click',()=>{
                this.AddRemoveSeat(fvalue[1],pageElements2[i]);
              });
             }
          }
        }
        const pageElements3=document.getElementsByClassName('vseat');
        if(pageElements3 && pageElements3.length!=0){
          for(let i=0; i<pageElements3.length; i++){
            let elm:any=pageElements3[i];
            if (elm.hasAttribute("onclick")) {
              const fvalue=elm.getAttribute('onclick').replace('AddRemoveSeat(','').split(')')[0].replace(/'/g, '').split(',');
              pageElements3[i].addEventListener('click',()=>{
                this.AddRemoveSeat(fvalue[1],pageElements3[i]);
              });
            }
          }
        }
        const pageElements4=document.getElementsByClassName('bvseat');
        if(pageElements4 && pageElements4.length!=0){
          for(let i=0; i<pageElements4.length; i++){
            let elm:any=pageElements4[i];
            if (elm.hasAttribute("onclick")) {
              const fvalue=elm.getAttribute('onclick').replace('AddRemoveSeat(','').split(')')[0].replace(/'/g, '').split(',');
              pageElements4[i].addEventListener('click',()=>{
                this.AddRemoveSeat(fvalue[1],pageElements4[i]);
              });
            }
          }
        }
    
        const pageElements5=document.getElementsByClassName('bhseat');
        if(pageElements5 && pageElements5.length!=0){
          for(let i=0; i<pageElements5.length; i++){
            let elm:any=pageElements5[i];
            if (elm.hasAttribute("onclick")) {
              const fvalue=elm.getAttribute('onclick').replace('AddRemoveSeat(','').split(')')[0].replace(/'/g, '').split(',');
              pageElements5[i].addEventListener('click',()=>{
                this.AddRemoveSeat(fvalue[1],pageElements5[i]);
              });
            }
          }
        }   

       }, 200);
    
      }
    });
  }

  AddRemoveSeat(seatno:any,thisval:any): void 
  {
        let classlist= thisval.classList;
        let newclass='s'+classlist[0];
        if(this.seatnumber.length < 6) {
            thisval.classList.toggle(newclass);
        } else {
            if(thisval.classList.contains(newclass))
            {
                thisval.classList.remove(newclass);
            }
        }
        if(this.seatnumber.indexOf(seatno) !== -1){
            const index = this.seatnumber.indexOf(seatno);
            this.seatnumber.splice(index, 1);
        } else{
            if(this.seatnumber.length < 6) {
                this.seatnumber.push(seatno);
            }  else {
              this.alertservice.error("Selected seats cannot be greater than 6.");
            }
        }
      this.PriceAddSeat();

      if(this.seatnumber.length!=0)
      {
        this.SeatErrorMSG="";
      } else {
        this.SeatErrorMSG="Select seat(s)";
      }
  }

  
  PriceAddSeat()
  {
    let showseatlabel="";
    let price=0;
    let basefare=0; let tax=0; let othercharge=0; let servicecharge=0; let discount=0; let agentmarkup=0; let agentcommission=0;
    let tds=0; let offerprice=0;let publishedprice=0
    this.seatnumber.forEach((element:any) => {
      if(element)
      {
        showseatlabel+=element+",";
        basefare+=this.Response['SeatDetails'][element]['Price']['BasePrice'];
        tax+=this.Response['SeatDetails'][element]['Price']['Tax'];
        othercharge+=this.Response['SeatDetails'][element]['Price']['OtherCharges'];
        servicecharge+=this.Response['SeatDetails'][element]['Price']['ServiceCharges'];
        discount+=this.Response['SeatDetails'][element]['Price']['Discount'];
        agentcommission+=this.Response['SeatDetails'][element]['Price']['AgentCommission'];
        tds+=this.Response['SeatDetails'][element]['Price']['TDS'];
        offerprice+=this.Response['SeatDetails'][element]['Price']['OfferedPrice'];
        agentmarkup+=this.Response['SeatDetails'][element]['Price']['WebPMarkUp'];
        price+=this.Response['SeatDetails'][element]['WithmarkupPublishedPrice'];
        publishedprice+=this.Response['SeatDetails'][element]['PublishedPrice'];
      }
    });

    this.showseatlabel=showseatlabel.slice(0, -1);

    let seatinfo='';
    if(this.seatnumber.length >1)
    {
      seatinfo=this.seatnumber.length + ' Seats';
    } else 
    {
      seatinfo=this.seatnumber.length + ' Seat';
    }

    this.Extrafarebrakup={
                          'BasePrice':basefare,
                          'Tax':tax,
                          'OtherCharges':othercharge,
                          'ServiceCharges':servicecharge,
                          'AgentCommission':agentcommission,
                          'AgentMarkup':agentmarkup,
                          'Discount':discount,
                          'TDS':tds,
                          'OfferedPrice':offerprice,
                          'PublishedPrice':publishedprice,
                          'Fare':price,
                          'TotalSeat':seatinfo
                        };

    this.totalprice=price;
  }

  getTime(value: string) {
    const time: string[] = value.split('T');
    const finaltime: string[] = time[1].split(':');
    return finaltime[0] + ':' + finaltime[1];
  }

  SelectPickDropPoint(type:any,event:any)
  {
      if(type=='Pickup')
      {
        this.PickupPoint=event.target.value;
        this.Response['BoardingPointsDetails'].forEach((element:any) => {
            if(element['CityPointIndex']==event.target.value)
            {
                this.SelectedPickupData=element;
                this.PickupPointErrorMSG=''; 
            }
        });
      }
      if(type=='Drop')
      {
        this.DropPoint=event.target.value;
        this.Response['DroppingPointsDetails'].forEach((element:any) => {
          if(element['CityPointIndex']==event.target.value)
          {
              this.SelectedDropPointData=element;
              this.DropPointErrorMSG='';
          }
       });
      }
  }

  Continue()
  {
    this.PickupPointErrorMSG='';   this.DropPointErrorMSG=''; this.SeatErrorMSG='';
    if(this.PickupPoint!='' && this.seatnumber.length!=0)
    {
      this.CloseButton();
      
      let finaldata={
        'SelectedBusData':this.SelectedBusData,
        'SearchTokenId':this.SearchTokenId,
        'SeatNumber':this.seatnumber,
        'TotalPrice':this.totalprice,
        'BoardingPointsDetails':this.SelectedPickupData,
        'DroppingPointsDetails':this.SelectedDropPointData,
        'Extrafarebrakup':this.Extrafarebrakup
      }

      sessionStorage.setItem('BUSRD',JSON.stringify(finaldata)); 

      const navigationExtras: NavigationExtras = {
      queryParams:{seatnumber:this.showseatlabel,stoken:this.SearchTokenId}
      };
      this.router.navigate(['bus/review-detail'], navigationExtras);
    } else {
      this.scrollToSection('pickup-and-drop-point');
      if(this.seatnumber.length==0)
      {
        this.SeatErrorMSG="Select seat(s)";
      }
      if(this.PickupPoint=='')
      {
        this.PickupPointErrorMSG="Please select pickup point";
      }
      if(this.SelectedBusData['IdProofRequired'])
      {
        if(this.DropPoint=='')
        {
          this.DropPointErrorMSG="Please select dropping point";
        }
      }
     
    }
  }

  CloseButton(): void {
    this.dialogRef.close();
  }


   scrollToSection(id: string): void {
      const element = document.getElementById(id);

      if (element) {
        element.scrollIntoView({
          behavior: 'smooth',
          block: 'start'
        });
      }
    }

}


