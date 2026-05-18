import { Component, Input, OnInit } from '@angular/core';
import { Router, ActivatedRoute, NavigationExtras } from '@angular/router';
import { Location } from '@angular/common';

declare var bootstrap:any;

@Component({
  selector: 'app-final-review',
  templateUrl: './final-review.component.html',
  styleUrls: ['./final-review.component.css']
})
export class FinalReviewComponent implements OnInit {
   @Input() params:any=[];
  GetSearchData:any =[];
  BlockRoomResult:any =[];
  RoomCancellationPolicyData:any =[];
  RoomCancellationPolicyModal:any;

  CurrentFare:any={};
  isshowmarkup:any=false;
  markupvalue=0;

  Paxinfo:any=[];

  param:any=[];

  constructor(private router:Router,private route:ActivatedRoute,private location:Location) {


    // this.route.queryParams.subscribe(params => {
    //   if(params) {
    //       this.param=params;
    //   } else {
    //       this.router.navigate(['/']);
    //    }
    // });

    if(sessionStorage.getItem('HotelBlockRoomData')!=null)
    {
      let blockRoomData:any=sessionStorage.getItem('HotelBlockRoomData');
      blockRoomData=JSON.parse(blockRoomData);
      this.BlockRoomResult=blockRoomData['Result'];
   
    } else{
       this.router.navigate(['/hotel']);
    }
    if (sessionStorage.getItem('HotelSearch')) {
      let hotelsearch:any=sessionStorage.getItem('HotelSearch');
      this.GetSearchData = JSON.parse(hotelsearch);
    } else{
      this.router.navigate(['/hotel']);
    }

     if (sessionStorage.getItem('TAGM')) {
        let markup:any=sessionStorage.getItem('TAGM');
        this.markupvalue=parseFloat(markup);
        this.CurrentFare['AgentMarkup']=this.markupvalue;
      }

      if (sessionStorage.getItem('TSFPAX')) {
        let TSFPAX:any=sessionStorage.getItem('TSFPAX');
        let resp=JSON.parse(TSFPAX);
        this.Paxinfo=resp;
      } else {
        this.router.navigate(['hotel']);
      }

   }

  ngOnInit(): void {
    this.param=this.params;
    this.Fare_information(this.BlockRoomResult);
  }

  roomCancellationPolicy(RoomData:any)
  {
    this.RoomCancellationPolicyData =  RoomData;
    this.RoomCancellationPolicyModal = new bootstrap.Modal(document.getElementById('CancellationPolicyModal'))
    this.RoomCancellationPolicyModal.show();
  }

  star_rating(star: number) {
    var starhtml = "";
    const count = 5 - star;
    for (let index = 0; index < star; index++) {
      starhtml += '<img src="assets/img/fill-star.svg">';
    }
    for (let index = 0; index < count; index++) {
      starhtml += '';
    }
    return starhtml;
  } 

  goBack() {
    this.location.back();
  }

  showmarkup()
  {
    this.isshowmarkup=!this.isshowmarkup;
  }

  updatemarkup()
  {
    this.CurrentFare['AgentMarkup']=Math.abs(this.markupvalue);
    let markup:any=Math.abs(this.markupvalue);
    sessionStorage.setItem('TAGM',markup);
    this.showmarkup();
  }

  Fare_information(Result : any)
  {
      let RoomPrice=0;
      let Tax=0;
      let AgentCommission=0;
      let OtherCharges=0;
      let Discount=0;
      let ServiceCharges=0;
      let OfferedPrice=0;
      let PublishedPrice=0;
      let TDS=0;
     
      Result['HotelRoomsDetails'].forEach(function(value:any , key:any) {
           RoomPrice+=value['Price']['RoomPrice'];
           Tax+=value['Price']['Tax'];
           AgentCommission+=value['Price']['AgentCommission'];
           OtherCharges+=value['Price']['OtherCharges'];
           Discount+=value['Price']['Discount'];
           ServiceCharges+=value['Price']['ServiceCharges'];
           OfferedPrice+=value['Price']['OfferedPrice'];
           PublishedPrice+=value['Price']['PublishedPrice'];
           TDS+=value['Price']['TDS'];
      });

      this.CurrentFare['RoomPrice']=RoomPrice;
      this.CurrentFare['Tax']=Tax;
      this.CurrentFare['AgentCommission']=AgentCommission;
      this.CurrentFare['Discount']=Discount;
      this.CurrentFare['OtherCharges']=OtherCharges;
      this.CurrentFare['ServiceCharges']=ServiceCharges;
      this.CurrentFare['OfferedPrice']=OfferedPrice;
      this.CurrentFare['PublishedPrice']=PublishedPrice;
      this.CurrentFare['AgentMarkup']=this.markupvalue;
      this.CurrentFare['TDS']=TDS;
  }

  ProceedToPay()
  {
    let selectobj:any={
                    'response':this.BlockRoomResult,
                    'fare':this.CurrentFare,
                    'param':this.param
                  }

    sessionStorage.setItem('TSFP',JSON.stringify(selectobj));
    let req:any={
      "params":this.param,
      'service':'Hotel'
    }
    const navigationExtras: NavigationExtras = {
      queryParams:req
    };
    this.closeModal()
    this.router.navigate(['payment'],navigationExtras);
  }

  closeModal() {
    // this.showReviewpage = false;
    const modalElement = document.getElementById('ReviewModal')!;
    const modal = bootstrap.Modal.getInstance(modalElement);
    modal?.hide();
  }



   formatCustomDate(dateString: string): Date {
      // Convert "27-07-2025T00:00:00" to "2025-07-27T00:00:00"
      const [day, month, yearWithTime] = dateString.split('-');
      const [year, time] = yearWithTime.split('T');
      const isoDate = `${year}-${month}-${day}T${time}`;
      return new Date(isoDate);
    }
}
