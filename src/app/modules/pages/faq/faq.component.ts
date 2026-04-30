import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-faq',
  templateUrl: './faq.component.html',
  styleUrls: ['./faq.component.css']
})
export class FaqComponent implements OnInit {
  details:any=[
    {
      "Title":"How can I book a flight through Travel Impression Private Limited?",
      "Description":"To book a flight with us, head to our website and input your travel details including your departure and arrival cities, travel dates, and the number of travellers. You’ll then be able to view and choose from the available flight options. Follow the on-screen steps to complete your booking and make a secure payment to finalize your reservation."
    },
    {
      "Title":"Is it possible to modify my booking after it has been confirmed?",
      "Description":"Yes, you can alter your booking, such as changing the travel dates or times, in accordance with the airline’s policies. Please be aware that such changes may incur additional fees. For assistance with modifying your booking, please reach out to our customer support team."
    },
    {
      "Title":"What forms of payment do you accept?",
      "Description":"We accept a variety of payment methods including credit and debit cards, net banking, and UPI. All transactions conducted on our website are secured to protect your payment information."
    },
    {
      "Title":"How do you ensure the security of my personal information?",
      "Description":"We take your privacy and security seriously. We implement advanced security protocols to safeguard your personal details and ensure that your information is not disclosed to unauthorized parties."
    },
    {
      "Title":"Can I cancel my flight reservation and obtain a refund?",
      "Description":"Flight cancellations are allowed based on the airline’s specific cancellation policy. Refund eligibility and fees depend on the type of ticket and when you cancel. For more detailed information, please consult our Booking / Refund Policy section."
    },
    {
      "Title":"How do I check-in online for my flight?",
      "Description":"Most airlines offer online check-in services. Visit the airline’s website and enter your booking information to check in online. Be mindful that the availability and timing of online check-in may differ by airline."
    },
    {
      "Title":"How can I contact Travel Impression Private Limited's customer service?",
      "Description":"You can get in touch with our customer service team via the following methods:",
      "SubData":[
        {
          "Subtitle":"Phone",
          "SubDes":"+91 9906606606",
        },
        {
          "Subtitle":"Email",
          "SubDes":"sales@travelimpression.in",
        },
        {
          "Subtitle":"WhatsApp",
          "SubDes":"+91 9906606606",
        }
      ],
      "Important":"Our support team is ready to help with any questions or concerns you might have."
    },
    {
      "Title":"Can I book a flight for someone else on your platform?",
      "Description":"Yes, you are welcome to make a flight reservation for another individual. During the booking process, enter the traveller’s details and proceed with the payment as you normally would."
    },
    {
      "Title":"What should I do if I experience problems during my trip?",
      "Description":"If you face any issues before, during, or after your trip, please contact our customer support team immediately. We offer 24/7 support to help resolve any problems and ensure your travel experience is smooth."
    }
  ]
  constructor() { }

  ngOnInit(): void {
  }

}
