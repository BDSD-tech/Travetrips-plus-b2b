import { Component } from '@angular/core';
import { fromEvent, Observable, Subscription } from 'rxjs';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'Travetrips Plus';
  loadpopup=false;

  onlineEvent: Observable<Event> | undefined;
  offlineEvent: Observable<Event> | undefined;
  subscriptions: Subscription[] = [];
  connectionStatusMessage: string | undefined;
  connectionStatus: string | undefined;
  msghide='no';

  constructor() { 

  }
  
  ngOnInit(): void {
    /**
    * Get the online/offline status from browser window
    */
    this.onlineEvent = fromEvent(window, 'online');
    this.offlineEvent = fromEvent(window, 'offline');
    this.subscriptions.push(this.onlineEvent.subscribe(e => {
      this.connectionStatusMessage = 'Back to online';
      this.connectionStatus = 'online';
      setTimeout(() => {
        this.msghide='yes';
        //location.reload();
      }, 2000);
     
    }));
    this.subscriptions.push(this.offlineEvent.subscribe(e => {
      this.connectionStatusMessage = 'Connection lost! trying to connect again...';
      this.connectionStatus = 'offline';
      this.msghide='no';
    }));

    /*-- load popup after content ---*/
    setTimeout(()=>{
      this.loadpopup=true;
     },1000)
  }

  ngOnDestroy(): void {
    /**
    * Unsubscribe all subscriptions to avoid memory leak
    */
    this.subscriptions.forEach(subscription => subscription.unsubscribe());
  }

  
}
