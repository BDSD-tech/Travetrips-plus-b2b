import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { tts_config } from '../../../environments/tts_config';

@Injectable({
  providedIn: 'root'
})
export class LoginService {

  constructor(private http: HttpClient) { }


  public AgentSignup(data:any)
  {
    let url=tts_config.APIURL+'/agent-signup';
    return this.http.post(url, data, {headers: { 'Content-Type': 'application/json'}});
  }
  
  public ForgotPassword(data:any)
  {
    let url=tts_config.APIURL+'/forgot-password';
    return this.http.post(url, data, {headers: { 'Content-Type': 'application/json'}});
  }

  public GenerateNewPassword(data:any)
  {
    let url=tts_config.APIURL+'/validate-otp-change-password';
    return this.http.post(url, data, {headers: { 'Content-Type': 'application/json'}});
  }
  public EmailOTPSend(data:any)
  {
    let url=tts_config.APIURL+'/generate-email-otp';
    return this.http.post(url, data, {headers: { 'Content-Type': 'application/json'}});
  }
  public MobileOTPSend(data:any)
  {
    let url=tts_config.APIURL+'/generate-mobile-otp';
    return this.http.post(url, data, {headers: { 'Content-Type': 'application/json'}});
  }
  public VerifyEmailOTP(data:any)
  {
    let url=tts_config.APIURL+'/validate-email-verify-otp';
    return this.http.post(url, data, {headers: { 'Content-Type': 'application/json'}});
  }
  public VerifyMobileOTP(data:any)
  {
    let url=tts_config.APIURL+'/validate-mobile-verify-otp';
    return this.http.post(url, data, {headers: { 'Content-Type': 'application/json'}});
  }

}
