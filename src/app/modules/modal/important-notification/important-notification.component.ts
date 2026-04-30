import { Component, Inject, OnDestroy, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'app-important-notification',
  templateUrl: './important-notification.component.html',
  styleUrls: ['./important-notification.component.css']
})
export class ImportantNotificationComponent implements OnInit {

  PopupNotifications:any=[];

  constructor(@Inject(MAT_DIALOG_DATA) public data: []) { }

  ngOnInit(): void {
    this.PopupNotifications=this.data;
  }


}
