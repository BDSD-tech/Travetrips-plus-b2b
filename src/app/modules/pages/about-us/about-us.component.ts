import { Component, OnInit } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { CommonService } from '../../../services/common.service';

@Component({
  selector: 'app-about-us',
  templateUrl: './about-us.component.html',
  styleUrls: ['./about-us.component.css']
})
export class AboutUsComponent implements OnInit {

  GetWebSiteData: any = {}; 

  details: any[] = [
    {
      Title: "Welcome to TravelTripPlus Holidays India Private Limited",
      Description: "TravelTripPlus Holidays India Private Limited is a leading and fast-growing travel company based in Faridabad (Delhi NCR), dedicated to delivering seamless and reliable travel management solutions for individuals, SMEs, and corporate clients. We design personalized travel strategies based on your priorities, ensuring every traveler receives the right level of support and service. Our strength lies in our experienced team of highly trained travel professionals who are committed to making every journey smooth, efficient, and stress-free. With round-the-clock 24x7 assistance, we are always ready to support you wherever and whenever you need us.",
      Subitem: [
        {
          SubTitle: "Tailored Travel Solutions",
          SubDec: "We understand that every traveler is unique. Our customized travel planning ensures services aligned with your personal or business needs for maximum convenience and value."
        },
        {
          SubTitle: "Expert Travel Coordination",
          SubDec: "Our skilled travel experts manage everything from bookings to itinerary planning with precision, ensuring a hassle-free travel experience."
        },
        {
          SubTitle: "24x7 Customer Support",
          SubDec: "Travel with confidence knowing our dedicated support team is available around the clock to assist you anytime, anywhere."
        },
        {
          SubTitle: "Trusted Travel Partner",
          SubDec: "We focus on reliability, transparency, and long-term relationships, making us a dependable travel partner for thousands of clients."
        }
      ]
    }
  ];

  constructor(
    private commonservice: CommonService,
    private serviceTitle: Title
  ) {}

  ngOnInit(): void {
    this.commonservice.GetWebSiteData().subscribe({
      next: (data) => {
        this.GetWebSiteData = data || {};

        if (this.GetWebSiteData?.CompanyName) {
          this.serviceTitle.setTitle(this.GetWebSiteData.CompanyName);
        }
      },
      error: (err) => {
        console.error('Website data error:', err);
      }
    });
  }
}