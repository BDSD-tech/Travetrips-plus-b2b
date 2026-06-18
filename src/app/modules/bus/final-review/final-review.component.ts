import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute, NavigationExtras } from '@angular/router';

import { BusService } from '../bus.service';
import { Location } from '@angular/common';
import { AuthenticationService } from '../../../services/authentication.service';
import { Input } from '@angular/core';

declare var bootstrap:any;
@Component({
  selector: 'app-final-review',
  templateUrl: './final-review.component.html',
  styleUrls: ['./final-review.component.css']
})
export class FinalReviewComponent implements OnInit {

  @Input() params:any=[];
  GetSearchData:any=[];
  SelectedBus:any=[];
  SelectedBusSeat:any=[];

  CurrentFare:any={};
  isshowmarkup:any=false;
  markupvalue=0;

  ArrivalDate:any;

  showpolicy=false;
  showpolicytext='View Policies';

  param:any=[];

  Paxinfo:any=[];

  constructor(private location: Location,private busService:BusService,private authenticationservice: AuthenticationService,private router: Router,private route: ActivatedRoute) {

    // this.route.queryParams.subscribe(params => {
    //   if(params) {
    //       this.param=params;
    //   } else {
    //       this.router.navigate(['/bus']);
    //    }
    // });

    if (sessionStorage.getItem('BusSearch')) {
      let bussearch:any=sessionStorage.getItem('BusSearch');
      this.GetSearchData = JSON.parse(bussearch);
    }

    if (sessionStorage.getItem('BUSRD')) {
      let busreview:any=sessionStorage.getItem('BUSRD'); 
      this.SelectedBusSeat=JSON.parse(busreview);
      this.CurrentFare=this.SelectedBusSeat['Extrafarebrakup'];
      let selectedbus=this.SelectedBusSeat['SelectedBusData'];

      if (sessionStorage.getItem('TAGM')) {
        let markup:any=sessionStorage.getItem('TAGM');
        this.markupvalue=parseFloat(markup);
        this.CurrentFare['AgentMarkup']=this.markupvalue;
      }

      if(selectedbus['ArrivalDate'])
      {
        let dateobj = new Date();
        var currentyear = dateobj.getFullYear();
        let finaldate  =selectedbus['ArrivalDate']+' '+currentyear;
        this.ArrivalDate=this.busService.DefaultDateFormat(finaldate);
      } else {
        this.ArrivalDate=this.GetSearchData['DepartDate'];
      }
      this.SelectedBus = selectedbus;

    } else {
      this.router.navigate(['/bus']);
    } 

    if (sessionStorage.getItem('TSFPAX')) {
      let TSFPAX:any=sessionStorage.getItem('TSFPAX');
      let resp=JSON.parse(TSFPAX);
      this.Paxinfo=resp;
    } else {
      this.router.navigate(['bus']);
    }

   }

  ngOnInit(): void {
     this.param=this.params;
  }


  goBack()
  {
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

  toggle()
  {
    this.showpolicy=!this.showpolicy;
    if(this.showpolicy)
    {
      this.showpolicytext='Hide Policies';
    }
    if(this.showpolicy==false)
    {
      this.showpolicytext='View Policies';
    }
  }

  ProceedToPay()
  {
    this.closeModal();
    let selectobj:any={
      'response':this.SelectedBusSeat,
      'fare':this.CurrentFare,
      'param':this.param
    }
    let req:any={
      "params":this.param,
      'service':'Bus'
    }
    sessionStorage.setItem('TSFP',JSON.stringify(selectobj));
    sessionStorage.setItem('Save',JSON.stringify(selectobj));
    const navigationExtras: NavigationExtras = {
      queryParams:req
    };
    this.router.navigate(['payment'],navigationExtras);
  }


  closeModal() {
    // this.showReviewpage = false;
    const modalElement = document.getElementById('ReviewModal')!;
    const modal = bootstrap.Modal.getInstance(modalElement);
    modal?.hide();
  }



}
