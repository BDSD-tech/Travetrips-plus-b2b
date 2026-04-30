import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AlertService } from '../../../services/alert.service';
import { FlightService } from '../flight.service';

@Component({
  selector: 'app-print-invoice',
  templateUrl: './print-invoice.component.html',
  styleUrls: ['../print-ticket/print-ticket.component.css']
})
export class PrintInvoiceComponent implements OnInit {

  tickethtml:any;
  loading:any=true;

  constructor(private router: Router,private route: ActivatedRoute,private flightService:FlightService,private alertservice:AlertService) { }

  ngOnInit(): void {

    this.route.queryParams.subscribe(params => {
      if(params) {
        this.ViewInvoice(params);
      } else {
          this.router.navigate(['/flight']);
       }
    });
  
  }


  ViewInvoice(params:any)
  {
    let  bookingid=params['BookingId'].split(",");
    let data={
                'BookingId':bookingid,
                'SearchTokenId':params['SearchTokenId'],
                'HtmlType':params['HtmlType'],
                'UserType':params['UserType'],
                'ViewService':params['ViewService'],
                'WithPrice':params['WithPrice'],
                'WithAgencyDetail':params['WithAgencyDetail'],
                'TicketInvoiceJourney':params['TicketInvoiceJourney'],
                'ViewSize':params['ViewSize'],
             }

      this.flightService.GetTicketDetails(data).subscribe(resp=>{
        let response:any=resp;
        this.loading=false;
        if(response['Error']['ErrorCode']==0)
        {
            this.tickethtml=response['Result']['Html'];
        } else {
            this.alertservice.error(response['Error']['ErrorMessage']);
        }
      });
  }

  PrintDiv(divid:any,title:any='Print Ticket') {
    var contents:any = document.getElementById(divid);
    var frame1:any = document.createElement('iframe');
    frame1.name = "frame1";
    frame1.style.position = "absolute";
    frame1.style.top = "-1000000px";
    document.body.appendChild(frame1);
    var frameDoc:any = frame1.contentWindow ? frame1.contentWindow : frame1.contentDocument.document ? frame1.contentDocument.document : frame1.contentDocument;
    frameDoc.document.open();
    frameDoc.document.write(`<html><head><title>${title}</title>`);
    frameDoc.document.write('</head><body>');
    frameDoc.document.write(contents.innerHTML);
    frameDoc.document.write('</body></html>');
    frameDoc.document.close();
    setTimeout(function () {
        let win:any=window;
        win.frames["frame1"].focus();
        win.frames["frame1"].print();
        document.body.removeChild(frame1);
    }, 500);
    return false;
}

}