import { Component } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-session-expire',
  templateUrl: './session-expire.component.html',
  styleUrls: ['./session-expire.component.css']
})
export class SessionExpireComponent {

  constructor(
    public dialogRef: MatDialogRef<SessionExpireComponent>
  ) {}

  CloseButton(): void {
    this.dialogRef.close();
  }
}
