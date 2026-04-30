import { Injectable } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class AlertService {

    constructor() { }

    success(message: string) {
      let x:any=document.getElementById('data-message');
          x.className="message success_popup";
          x.innerHTML=message;
      this.clear();
    }

    error(message: string) {
      let x:any=document.getElementById('data-message');
      x.className="message error_popup";
      x.innerHTML=message;
      this.clear();
    }

    warning(message: string) {
      let x:any=document.getElementById('data-message');
      x.className="message warning_popup";
      x.innerHTML=message;
      this.clear();
    }


    clear() {
      setTimeout(() => {
        let x:any=document.getElementById('data-message');
        x.innerHTML='';
        x.classList.remove("success_popup");
        x.classList.remove("error_popup");
        x.classList.remove("warning_popup");
      }, 5000);
    }
}


