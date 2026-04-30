import { Component, Input, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-loading',
  templateUrl: './loading.component.html',
  styleUrls: ['./loading.component.css']
})
export class LoadingComponent implements OnInit {
@Input('type') type:any;
GetSearchData: any=[];
  constructor(private router:Router) {
    if(sessionStorage.getItem('HotelSearch')){
      let  hotelSearchdata:any  = sessionStorage.getItem('HotelSearch');
      this.GetSearchData  = JSON.parse(hotelSearchdata);;
        }
        else{
          this.router.navigate(['hotel']);
        }
   }

  ngOnInit(): void {
    
  }
  arrayOne(n:number):any[]{
    return Array(n);
  }
}
