import { Component, OnInit } from '@angular/core';
import { Title, Meta } from '@angular/platform-browser';
import { CommonService } from '../../../services/common.service';

@Component({
  selector: 'app-privacy-policy',
  templateUrl: './privacy-policy.component.html',
  styleUrls: ['./privacy-policy.component.css']
})
export class PrivacyPolicyComponent implements OnInit {

  GetWebSiteData:any=[];
  details:any=[
    {
      "Title":'Collection of Personal Information',
      "Description":'We collect personal details that identify you as an individual, such as your name, address, phone number, email address, and credit card information. This data is collected during booking processes, profile creation, or when you interact with our services to ensure a smooth and customized experience.'
    },
    {
      "Title":'Use of Personal Information',
      "Description":'We collect personal details that identify you as an individual, such as your name, address, phone number, email address, and credit card information. This data is collected during booking processes, profile creation, or when you interact with our services to ensure a smooth and customized experience.  '
    },
    {
      "Title":'Use of Personal Information',
      "Description":'The information we gather is used to handle and confirm your travel bookings, including sharing relevant details with airlines, hotels, and other service providers. Additionally, we may use your data to keep you updated about your bookings and to offer personalized travel deals and updates.'
    },
    {
      "Title":' Data Collection',
      "Description":'When you visit www.travelimpression.in, we automatically collect certain non-personal data, such as your IP address, browser type, and operating system. This information helps us analyse usage patterns, enhance our website’s functionality, and troubleshoot any technical issues. This data is not linked to any individual user.'
    },
    {
      "Title":'Sharing of Information',
      "Description":'We do not sell or rent your personal information to third parties without your permission. To provide you with travel services, we may share your details with airlines, hotels, car rental companies, and other partners involved in your travel arrangements. Aggregate, non-personal data may be used for analytical purposes and service improvement.'
    },
    {
      "Title":'Data Protection',
      "Description":'Transactions on www.travelimpression.in are secured with SSL encryption provided by VeriSign to protect your personal information during transmission. We implement appropriate security measures to prevent unauthorized access, use, or disclosure of your data.'
    },
    {
      "Title":'External Links',
      "Description":'Our website may include links to other websites. We are not responsible for the privacy practices or content of these external sites. We recommend reviewing the privacy policies of any third-party sites you visit.'
    },
    {
      "Title":'User Responsibilities',
      "Description":'You are responsible for safeguarding your login credentials and account information. Please be cautious when sharing personal information online and ensure you are on a secure connection.'
    },
    {
      "Title":'Legal Requirements',
      "Description":'We may disclose your personal information if required by law, court orders, or government regulations, or to protect our rights and interests or prevent fraud.'
    },
    {
      "Title":'Policy Updates',
      "Description":'We may update this Privacy Policy periodically. We encourage you to review it regularly to stay informed about how we protect and use your personal information.'
    },
    {
      "Title":'Effective Date',
      "Description":'This Privacy Policy is effective as of 1st Sep 2019.'
    },
    {
      "Title":'Contact Us',
      "Description":'If you have any questions or concerns regarding your personal information or this Privacy Policy, please contact our customer support team at:'
    },
    {
      "Title":'Travel Impression Private Limited',
      "Description":'90 Feet Road, Usman Abad Buchpora, Srinagar Jammu & Kashmir, India 190020 Phone :- +91-9906606606'
    }
  ]
  constructor(private serviceTitle: Title,private meta: Meta, public commonservice :CommonService) { }

  ngOnInit(): void {
    this.commonservice.GetWebSiteData().subscribe(data => {
      this.GetWebSiteData =data;
      this.serviceTitle.setTitle(this.GetWebSiteData['CompanyName']+' Privacy Policy');
    });
    window.scroll(0,0); 
  }

}
