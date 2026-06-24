import { Injectable } from '@angular/core';
import { AuthenticationService } from './authentication.service';

@Injectable({
  providedIn: 'root'
})
export class IdleTimeoutService {

  private readonly TIMEOUT = 30 * 60 * 1000;
  private timer: any;

  constructor(
    private authService:AuthenticationService
  ) { }

  startWatching(): void {
    
    if (!localStorage.getItem('TTSAgent')) {
      return;
    }

    this.resetTimer();

    const events = [
      'mousemove',
      'mousedown',
      'click',
      'scroll',
      'keydown',
      'touchstart'
    ];

    events.forEach(event => {
      window.addEventListener(event, () => {
        this.updateActivity();
      });
    });

    // Listen activity from other tabs
    window.addEventListener('storage', (event) => {
      if (event.key === 'lastActivity') {
        this.resetTimer();
      }
    });
  }

  private updateActivity(): void {
    localStorage.setItem('lastActivity',Date.now().toString());
    this.resetTimer();
  }

  private resetTimer(): void {

    clearTimeout(this.timer);

    this.timer = setTimeout(() => {

      const lastActivity = Number(
        localStorage.getItem('lastActivity') || Date.now()
      );

      const inactiveTime = Date.now() - lastActivity;

      if (inactiveTime >= this.TIMEOUT) {
        this.logout();
      } else {
        this.resetTimer();
      }

    }, this.TIMEOUT);
  }

  private logout(): void {
    sessionStorage.clear();
    localStorage.clear();
    this.authService.logout()
  }
}