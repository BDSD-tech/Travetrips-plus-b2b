import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-about-us',
  templateUrl: './about-us.component.html',
  styleUrls: ['./about-us.component.css']
})
export class AboutUsComponent implements OnInit {
  details:any=[
    {
      "Title":"Our Services",
      "Description":"Travel Impression Private Limited specializes in a wide range of travel services designed to cater to the diverse requirements of our travel Partners and corporate clients. Our services include:",
      "Subitem":[
        {
          "SubTitle":"Flights",
          "SubDec":"We offer a broad selection of flight options to destinations worldwide. Whether you need a quick domestic trip or an international journey, our platform provides access to competitive fares and efficient booking processes. Our dedicated team ensures that your travel plans are executed smoothly, from departure to arrival.",

        },
        {
          "SubTitle":"Hotels",
          "SubDec":"Our extensive network of hotel partnerships allows us to offer a variety of accommodation options to suit every budget and preference. From luxurious five-star hotels to comfortable budget-friendly stays, we provide tailored hotel solutions to meet your specific business needs. Our team is skilled in negotiating the best rates and ensuring that every stay is comfortable and convenient."
        },
        {
          "SubTitle":"Holiday Packages",
          "SubDec":"We understand the importance of corporate retreats, team-building events, and incentive travel. Our B2B holiday packages are designed to offer unforgettable experiences, whether it’s a relaxing getaway or an adventurous excursion. We work closely with you to create customized itineraries that align with your objectives and preferences."
        },
        {
          "SubTitle":"Trekking",
          "SubDec":"For those seeking adventure and exploration, we organize trekking expeditions in some of the most stunning landscapes in Kashmir. Our trekking packages are meticulously planned to ensure safety, enjoyment, and unforgettable experiences. We cater to all levels of trekking enthusiasts, from beginners to seasoned adventurers."
        },
        {
          "SubTitle":"Skiing",
          "SubDec":"Our skiing packages provide access to premier ski resort of Gulmarg, offering everything you need for a thrilling winter sports experience. From equipment rentals to accommodation and gondola tickets, we handle all the details to ensure a seamless and enjoyable skiing trip for your clients."
        }
      ] 
    },
    {
      "Title":"Why Choose Travel Impression Private Limited?",
      "Description":"",
      "Subitem":[
        {
           "SubTitle":"Experienced Team",
          "SubDec":" Our team is comprised of seasoned travel professionals with extensive industry experience. We bring a wealth of knowledge and expertise to every aspect of your travel arrangements, ensuring that all your needs are met with the highest standards of service."
        },
        {
           "SubTitle":"Personalized Service",
          "SubDec":"At Travel Impression Private Limited, we believe in delivering a personalized approach to meet the unique needs of our B2B clients. We take the time to understand your specific requirements and provide tailored solutions that enhance your travel experience."
        },
        {
           "SubTitle":"Local Expertise",
          "SubDec":"Based in Srinagar, we offer unique insights and recommendations for travel in the Kashmir region and beyond. Our local knowledge allows us to provide valuable guidance and enhance your travel experience with authentic and memorable experiences."
        },
        {
           "SubTitle":"Commitment to Excellence",
          "SubDec":"Since our inception, we have been dedicated to maintaining high standards of service and reliability. Our focus on excellence drives us to continually improve our offerings and ensure that every interaction exceeds your expectations"
        }
      ]
    },
    {
      "Title":"Our Mission",
      "Description":"Our mission is to be the trusted partner for businesses seeking reliable, comprehensive, and customized travel solutions. We are committed to providing exceptional service, innovative solutions, and personalized attention to ensure that every travel experience is seamless, enjoyable, and aligned with your business objectives.",
    },
    {
      "Title":"Our Vision",
      "Description":"We envision becoming the leading B2B travel service provider known for our dedication to quality, customer satisfaction, and innovative solutions. Our goal is to continually evolve and adapt to the changing needs of our clients, setting new standards in the travel industry.",
    },
  ]
  constructor() { }

  ngOnInit(): void {
  }

}
