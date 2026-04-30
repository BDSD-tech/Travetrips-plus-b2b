import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'app-dialog-modal',
  templateUrl: './dialog-modal.component.html',
  styleUrls: ['./dialog-modal.component.css']
})
export class DialogModalComponent implements OnInit {

  RequestData:any;

  constructor(@Inject(MAT_DIALOG_DATA) public data:[]) { }

  ngOnInit(): void {
    this.RequestData=this.data;
  }

}
