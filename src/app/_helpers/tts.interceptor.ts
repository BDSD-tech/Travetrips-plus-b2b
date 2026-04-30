import { Injectable } from '@angular/core';
import { HttpRequest, HttpHandler, HttpEvent, HttpInterceptor } from '@angular/common/http';
import { Observable } from 'rxjs';
import { tts_config } from '../../environments/tts_config';

import { AuthenticationService } from '../services/authentication.service';

@Injectable()
export class TtsInterceptor implements HttpInterceptor {

    constructor(private authenticationService: AuthenticationService) { }

    intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {

        // add authorization header with TTS token if available
        let currentUser = this.authenticationService.currentUserValue;
        if (currentUser && currentUser.AuthToken) {
          request = request.clone({
              setHeaders: {
                Authtoken: `${currentUser.AuthToken}`,
                btype:tts_config.BType
              }
          });
        } else {
          request = request.clone({
              setHeaders: {
                   btype:tts_config.BType,
              }          
           });
        }
        return next.handle(request);
    }
}
