import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-user-agreement',
  templateUrl: './user-agreement.component.html',
  styleUrls: ['./user-agreement.component.css']
})
export class UserAgreementComponent implements OnInit {
  details:any=[
    {
      "Title":'Acceptance of Terms',
      "Description":'By using our Site, you agree to be bound by this Agreement, including any future modifications. If you do not agree to these terms, please do not use our Site or services.',
    },
    {
      "Title":'User Registration',
      "Description":'To access certain features of our Site, you may be required to register and create an account. You agree to provide accurate, current, and complete information during the registration process and to update your information as necessary. You are responsible for maintaining the confidentiality of your account credentials and for all activities that occur under your account.',
    },
    {
      "Title":'Use of Services',
      "Description":'You agree to use our Site and services only for lawful purposes and in accordance with applicable laws and regulations.',
      "SubData":[
        {
          "list":"Engage in any fraudulent or illegal activities."
        },
        {
          "list":"Use our Site to transmit or distribute harmful or malicious content."
        },
        {
          "list":"Interfere with or disrupt the operation of our Site or servers."
        },
        {
          "list":"Impersonate any person or entity or falsely state or otherwise misrepresent your affiliation with a person or entity."
        },
      ]
    },
    {
      "Title":'Booking and Transactions',
      "Description":'When making bookings or transactions through our Site, you agree to provide accurate and complete information. All bookings are subject to availability and our confirmation. We reserve the right to cancel or refuse any booking if we suspect fraudulent activity or if there is a breach of this Agreement.',
    },
    {
      "Title":'Payment Terms',
      "Description":'All payments for services are due as specified at the time of booking. You agree to provide valid and current payment information and authorize us to charge the applicable fees to your payment method. All transactions are processed using secure payment gateways to ensure the safety of your financial information.',
    },
    {
      "Title":'Cancellation and Refund Policy',
      "Description":'Our cancellation and refund policies are outlined on our Site and may vary depending on the service provider and booking type. It is your responsibility to review these policies before making a booking. We will process refunds in accordance with the terms specified by the service provider and our own policies.',
    },
    {
      "Title":'Intellectual Property',
      "Description":'All content on our Site, including but not limited to text, graphics, logos, and images, is the property of Travel Impression Private Limited or its licensors and is protected by intellectual property laws. You may not reproduce, distribute, or use any content from our Site without our express written permission.',
    },
    {
      "Title":'Privacy and Data Protection',
      "Description":'Our Privacy Policy, which is incorporated into this Agreement by reference, outlines how we collect, use, and protect your personal information. By using our Site and services, you consent to our data practices as described in the Privacy Policy.',
    },
    {
      "Title":' Limitation of Liability',
      "Description":'To the fullest extent permitted by law, Travel Impression Private Limited shall not be liable for any direct, indirect, incidental, special, consequential, or punitive damages arising out of or related to your use of our Site or services. This includes, but is not limited to, damages for loss of profits, data, or other intangible losses.',
    },
    {
      "Title":'Indemnification',
      "Description":'You agree to indemnify and hold harmless Travel Impression Private Limited, its affiliates, officers, directors, employees, and agents from any claims, liabilities, damages, losses, or expenses (including legal fees) arising out of or in connection with your use of our Site or services, or any violation of this Agreement.',
    },
    {
      "Title":'Changes to the Agreement',
      "Description":'We reserve the right to modify this Agreement at any time. Any changes will be effective immediately upon posting on our Site. Your continued use of our Site and services following any modifications constitutes your acceptance of the revised terms.',
    },
    {
      "Title":'Termination',
      "Description":'We may suspend or terminate your access to our Site and services at any time, with or without cause, and with or without notice. Upon termination, your right to use our Site and services will immediately cease.',
    },
    {
      "Title":'Governing Law',
      "Description":'This Agreement is governed by and construed in accordance with the laws of the Republic of India. Any disputes arising out of or in connection with this Agreement shall be subject to the jurisdiction of the courts in Srinagar Jammu & Kashmir  India.',
    },
  ]
  constructor() { }

  ngOnInit(): void {
  }

}
