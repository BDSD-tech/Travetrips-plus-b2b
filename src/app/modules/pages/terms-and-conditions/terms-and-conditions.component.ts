import { Component, OnInit } from '@angular/core';
import { Title, Meta } from '@angular/platform-browser';
import { CommonService } from '../../../services/common.service';

@Component({
  selector: 'app-terms-and-conditions',
  templateUrl: './terms-and-conditions.component.html',
  styleUrls: ['./terms-and-conditions.component.css']
})
export class TermsAndConditionsComponent implements OnInit {

  GetWebSiteData:any=[];

  constructor(private serviceTitle: Title,private meta: Meta, public commonservice :CommonService) { }
  details:any=[
    {
      "Title":'Changes to Terms and Conditions',
      'Description':'Vinayak Traels Private Limited reserves the right to amend, modify, or remove any portion of these Terms and Conditions at any time without prior notice. Changes will become effective immediately upon posting on our website.'
    },
    {
      "Title":'User Content',
      'Description':'You are not permitted to post or transmit any material that is defamatory, libelous, obscene, pornographic, profane, threatening, or unlawful, or any content that could incite criminal behaviour or result in civil liability or violate any laws. Vinayak Traels Private Limited disclaims any responsibility for the content of communications that may be defamatory, inaccurate, or offensive. We reserve the right to edit or remove any user-generated content that violates our policies or is deemed illegal, indecent, or inappropriate.'
    },
    {
      "Title":'Online Submissions',
      'Description':'Any communications or materials sent to our website, including comments, data, questions, or suggestions, will be treated as non-confidential.By submitting materials to the site, you forfeit any claims that their use infringes upon your rights, including moral, privacy, proprietary, or publicity rights. Vinayak Traels Private Limited may use, adapt, copy, disclose, license, perform, post, publish, or otherwise utilize any submitted materials worldwide, in any medium, indefinitely.'
    },
    {
      "Title":'Booking / Refund Policy',
      'Description':'Vinayak Traels Private Limited is committed to providing a smooth booking',
      'SubData':[
        {
          'Subtitle':'Fare Availability',
          'SubDes':'All fares are subject to availability at the time of booking confirmation. We partner with airlines to provide the best available fares for your itinerary.'
        },
        {
          'Subtitle':'Cancellation Charges',
          "SubDes":"All bookings are subject to cancellation fees imposed by the airline, which may vary based on the flight and fare class. Please check the airline's policy for specific details."
        },
        {
          'Subtitle':'Cancellation Service Fees',
          "SubDes":"A service fee of INR 50/- per passenger per sector applies to domestic air tickets, and INR 100/- per passenger per sector applies to international air tickets."
        },
        {
          'Subtitle':'Convenience Fee',
          "SubDes":"The convenience fee is non-refundable. This fee helps us deliver quality service and support throughout the booking process."
        },
        {
          'Subtitle':'Airline Policies',
          "SubDes":"Some bookings may be non-refundable as per the airline’s policy. Check the airline’s terms before confirming your booking."
        },
        {
          'Subtitle':'Cancellation / Reissuance Timeframe',
          "SubDes":"processed beyond 24 hours from the standard airline cancellation policy. For flights within this timeframe, contact the airline directly."
        },
        {
          'Subtitle':'Airlines’ Operational Status',
          "SubDes":"We are not responsible for refunds if airlines suspend operations or go bankrupt. Stay updated on airline statuses."
        },
        {
          'Subtitle':'Voiding / Cancellation Deadline',
          "SubDes":"Ticket voiding or cancellation is only accepted until 2000 hours. Prompt action is needed for effective processing."
        },
        {
          'Subtitle':'Misuse of PNR',
          "SubDes":"Any misuse of an airline PNR by the agent is their sole responsibility. Ethical practices are expected when handling airline bookings. "
        },
        {
          'Subtitle':'Refund Processing',
          "SubDes":" Refunds from airlines will be transferred to agents promptly. No adjustments to the payment schedule will be made."
        },
        {
          'Subtitle':'TDS Deduction',
          "SubDes":"As required by law, TDS will be deducted from all commissions and incentives."
        },
        {
          'Subtitle':'Credit Limit and Advance Payments',
          "SubDes":"Credit limits are provided weekly based on guarantees. Advances are non-interest bearing and must be utilized within 360 days. Unutilized advances after this period will be held in trust for 2 years, after which they will be forfeited."
        },
        {
          'Subtitle':"Refunds for Unused or 'No Show' Bookings",
          "SubDes":"Requests for refunds on unused or 'no show' bookings must be made within 15 days of the ticket’s departure date. Refunds will be processed according to airline and Vinayak Traels policies."
        },
        {
          'Subtitle':' Residents Traveling Abroad',
          "SubDes":"Agents must maintain necessary documentation ensuring that payments for international travel comply with the Reserve Bank of India’s limits."
        },
      ]
    },
    {
      "Title":'Booking / Refund Policy (Groups & Series Fare)',
      'Description':'',
      "SubData":[
        {
           'Subtitle':"Fare Confirmation",
          "SubDes":"The fare or seat is not guaranteed until the PNR is generated."
        },
        {
           'Subtitle':"Pending Bookings",
          "SubDes":"Confirmation may take up to 30 minutes. Avoid sharing confirmation until the PNR is received."
        },
        {
           'Subtitle':"Non-Refundable Fare",
          "SubDes":"Fares under Groups & Series are entirely non-refundable and non-changeable."
        },
        {
           'Subtitle':"Additional Services",
          "SubDes":"Requests for extra services (e.g., excess baggage, infant seats) should be made 24 hours before departure. A service fee of INR 118/- applies in addition to airline charges."
        },
        {
           'Subtitle':"Handling Pending Bookings",
          "SubDes":"Pending bookings are managed between 09:00 and 23:00 hours. No confirmation will be provided outside these hours."
        },
        {
           'Subtitle':"Web Check-In",
          "SubDes":"To be completed by the agent. We do not guarantee free seat availability at web check-in. For issues, contact the airline directly."
        },
       
      ]
    },
    {
      "Title":'Disclaimer',
      'Description':'Vinayak Traels Private Limited acts as an intermediary and is not responsible for third-party obligations related to rates, quality, or other aspects. Use of our services and website is at your own risk. We do not guarantee uninterrupted or error-free service.'
    },
    {
      "Title":'Terms of Use',
      'Description':'Vinayak Traels Private Limited may modify, add, change, or remove any part of these Terms of Use at any time without notice. Changes take effect as soon as they are posted. Continued use of the site signifies acceptance of any modifications.'
    },
    {
      "Title":'General Provisions',
      'Description':'Vinayak Traels Private Limited reserves the right to alter, limit, or discontinue the website or any content without prior notice. We may deny access to the site or any part thereof without notice.'
    },
   

  ]
  ngOnInit(): void {
    this.commonservice.GetWebSiteData().subscribe(data => {
      this.GetWebSiteData =data;
      console.log(this.GetWebSiteData);
      
      this.serviceTitle.setTitle(this.GetWebSiteData['CompanyName']+' Terms & Conditions');
    });
    window.scroll(0,0);
    
  }

}
