import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { Subscription, interval } from 'rxjs';
import { SessionExpireComponent } from '../session-expire/session-expire.component';

@Component({
  selector: 'app-count-down',
  templateUrl: './count-down.component.html',
  styleUrls: ['./count-down.component.css']
})
export class CountDownComponent implements OnInit,OnDestroy {

  private subscription: Subscription = new Subscription;
  public secondsToDday:any;
  public minutesToDday:any;

  @Input('display') display : any='off';

  constructor(public dialog: MatDialog,private router: Router) {

  }

  private getTimeDifference () {
      let time:any=sessionStorage.getItem('time');
      let dDay=JSON.parse(time);
      let countDownDate = new Date(dDay).getTime();
      let now = new Date().getTime();
      let distance = countDownDate - now;
      this.secondsToDday=Math.floor((distance/ 1000) % 60);
      this.minutesToDday=Math.floor((distance/ 1000 / 60) % 60);
      if (distance < 0) {
        this.subscription.unsubscribe();
        this.minutesToDday='00';
        this.secondsToDday='00';
        if(sessionStorage.getItem("time")) {
          this.OpenSessionDialog();
        }
      }
  }

  ngOnInit() {
    this.subscription = interval(1000)
    .subscribe(x => { this.getTimeDifference(); });
  }

  ngOnDestroy() {
      this.subscription.unsubscribe();
  }

  OpenSessionDialog()
  {
    const dialogRef =this.dialog.open(SessionExpireComponent,{
      height: '250px',
      width: '550px',
    });
    dialogRef.afterClosed().subscribe(result => {
      this.router.navigate(['/flight']);
    });
  }

}
