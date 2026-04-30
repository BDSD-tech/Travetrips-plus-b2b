import { Component, OnInit } from '@angular/core';
import { Title, Meta } from '@angular/platform-browser';
import { CommonService } from '../../../services/common.service';

@Component({
  selector: 'app-payment-security',
  templateUrl: './payment-security.component.html',
  styleUrls: ['./payment-security.component.css']
})
export class PaymentSecurityComponent implements OnInit {

  GetWebSiteData:any=[];
  details:any=[
    {
      'Title':'Secure Transactions',
      "Description":"All transactions conducted on our website, www.travelimpression.in, are protected using advanced Secure Socket Layer (SSL) encryption technology. SSL encryption secures the transmission of your sensitive data, such as credit card details, by converting it into a coded format that is unreadable to unauthorized parties."
  
    },
    {
      'Title':'Payment Gateways',
      "Description":"We use reputable and secure payment gateways to process all online transactions. These gateways are compliant with Payment Card Industry Data Security Standards (PCI DSS) to ensure the highest level of security for your financial information."
  
    },
    {
      'Title':'Data Protection',
      "Description":"We implement robust security measures to protect your personal and payment information from unauthorized access, alteration, or disclosure. Our security infrastructure includes firewalls, secure servers, and regular system updates to safeguard against potential threats."
    },
    {
      'Title':'Fraud Prevention',
      "Description":"To prevent fraudulent activities, we employ sophisticated fraud detection tools and processes. These tools help identify and mitigate any suspicious activities that could compromise the security of your transactions."
  
    },
    {
      'Title':'Privacy of Payment Information',
      "Description":"Your payment information is only used for processing your transactions and is not stored beyond the duration necessary to complete the payment process. We do not store your credit card details or any other sensitive payment information on our servers."
  
    },
    {
      'Title':'User Responsibility',
      "Description":"While we take extensive measures to protect your payment information, we also encourage you to practice good security habits. Ensure you are accessing our website from a secure and trusted network and avoid sharing your payment information with anyone."
  
    },
    {
      'Title':'Compliance',
      "Description":"Travel Impression Private Limited complies with relevant data protection and privacy laws to ensure the responsible handling of your payment information. We regularly review and update our security practices to adhere to industry standards and legal requirements."
  
    },
    {
      'Title':'Reporting Security Concerns',
      "Description":"If you suspect any unauthorized transactions or encounter security issues related to your payment, please contact our customer support team immediately at support@travelimpression.in or call us on +91-9906606606. We are here to assist you and address any concerns you may have."

    },
  ]
  constructor(private serviceTitle: Title,private meta: Meta, public commonservice :CommonService) { }

  ngOnInit(): void {
    this.commonservice.GetWebSiteData().subscribe(data => {
      this.GetWebSiteData =data;
      this.serviceTitle.setTitle(this.GetWebSiteData['CompanyName']+' Payment Policy');
    });
    window.scroll(0,0); 
  }

}
