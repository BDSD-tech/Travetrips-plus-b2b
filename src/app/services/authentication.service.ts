import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import { tts_config } from '../../environments/tts_config';
import { Agent } from '../_models';
import { Router } from '@angular/router';

@Injectable({ providedIn: 'root' })
export class AuthenticationService {

    private currentUserSubject: BehaviorSubject<Agent>;
    public currentUser: Observable<Agent>;

    constructor(private http: HttpClient, private router: Router) {
        let currentAgent:any=localStorage.getItem('TTSAgent');
        this.currentUserSubject = new BehaviorSubject<Agent>( JSON.parse(currentAgent));
        this.currentUser = this.currentUserSubject.asObservable();
    }

    public get currentUserValue(): Agent {
        return this.currentUserSubject.value;
    }

    login(emailphone: string, password: string,istrust:any,device:any) {
        return this.http.post<any>(`${tts_config.APIURL}/login`, {emailphone, password,istrust,device })
            .pipe(map(user => {
                if(user['Error']['ErrorCode']==0) {
                   if(user['Result']['WithOTP']==false){
                    localStorage.setItem('TTSAgent', JSON.stringify(user.Result));
                        this.currentUserSubject.next(user.Result);
                    }
                 }
                 return user;
            }));
    }
    VarifyOTP(email:any,password:any,otp:any){
        return this.http.post<any>(`${tts_config.APIURL}/login-otp`, {email,password,otp})
        .pipe(map(user => {
            if(user['Error']['ErrorCode']==0) {
                localStorage.setItem('TTSAgent', JSON.stringify(user.Result));
                this.currentUserSubject.next(user.Result);
             }
             return user;
        }));
    }
    
    update(data:any,field:any)
    {
        if(data)
        {
            let updatedata:any;
            this.currentUser.subscribe(storedata => {
                let resp:any=storedata;
                if(resp)
                {
                    resp[field]=data[field];
                    updatedata=resp;
                }
            });
            localStorage.setItem('TTSAgent', JSON.stringify(updatedata));
            return data;
        }
    }

    emulateuser(data:any) {
        return this.http.post<any>(`${tts_config.APIURL}/emulate-login`,data)
            .pipe(map(user => {
                if(user['Error']['ErrorCode']==0) {
                    localStorage.setItem('TTSAgent', JSON.stringify(user.Result));
                    this.currentUserSubject.next(user.Result);
                 }
                 return user;
            }));
    }


    logout() {
        localStorage.removeItem('TTSAgent');
        let currentAgent:any=null;
        this.currentUserSubject.next(currentAgent);
        this.router.navigate(['/']);
    }
}
