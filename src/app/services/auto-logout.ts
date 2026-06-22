// idle-timeout.service.ts

import { Injectable, NgZone } from '@angular/core';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class IdleTimeoutService {

  private timeout = 30 * 60 * 1000; // 30 minutes
  private timer: any;

  constructor(
    private router: Router,
    private ngZone: NgZone
  ) {}

  startWatching() {

    this.resetTimer();

    ['mousemove', 'mousedown', 'click', 'scroll', 'keypress', 'touchstart']
      .forEach(event => {
        window.addEventListener(event, () => {
          this.resetTimer();
        });
      });
  }

  private resetTimer() {
    clearTimeout(this.timer);

    this.timer = setTimeout(() => {
      this.logout();
    }, this.timeout);
  }

  private logout() {

    localStorage.clear();
    sessionStorage.clear();

    alert('Session expired due to inactivity.');

    this.ngZone.run(() => {
      this.router.navigate(['/login']);
    });
  }
}