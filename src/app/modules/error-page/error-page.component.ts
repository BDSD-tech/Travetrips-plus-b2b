import { Component, OnInit } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { ActivatedRoute, Router } from '@angular/router';
import { CommonService } from '../../services/common.service';

@Component({
  selector: 'app-error-page',
  templateUrl: './error-page.component.html',
  styleUrls: ['./error-page.component.css']
})
export class ErrorPageComponent implements OnInit {

  GetWebSiteData:any=[];
  Bookingid:any;
  Message:string='';

  constructor(private titleService: Title,private commonservice:CommonService,private route: ActivatedRoute,private router: Router) {

    this.route.queryParams.subscribe(params => {
      if(params) {
        
        this.Bookingid=params['BookingId'];
        this.Message=params['ErrorMessage'];

      } else {
        this.router.navigate(['/']);
       }
    });

   }

  ngOnInit(): void {

    this.commonservice.GetWebSiteData().subscribe(data => {
      this.GetWebSiteData =data;
      if(this.GetWebSiteData['CompanyName'])
      {
        this.titleService.setTitle(this.GetWebSiteData['CompanyName'] + ' | Error Page');
      }
    });

  }

}
