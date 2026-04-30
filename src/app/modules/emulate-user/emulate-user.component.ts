import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { first } from 'rxjs';
import { AlertService } from '../../services/alert.service';
import { AuthenticationService } from '../../services/authentication.service';

@Component({
  selector: 'app-emulate-user',
  templateUrl: './emulate-user.component.html'
})
export class EmulateUserComponent implements OnInit {

  constructor(private authenticationservice:AuthenticationService,private router: Router,private route: ActivatedRoute,private alertservice:AlertService) {

    this.route.queryParams.subscribe(params => {
      if(params) {
          this.UserCheck(params)
      } else {
          this.router.navigate(['/flight']);
       }
    });

   }

  ngOnInit(): void {
  }

  UserCheck(params:any)
  {
    let request={'EmulateUserKey':params['stoken']}
    this.authenticationservice.emulateuser(request).pipe(first()).subscribe(resp => {
      let data:any=resp;
      if(data['Error']['ErrorCode']==0)
      {
        this.router.navigate(['/flight']);
      } else {
        this.alertservice.error(data['Error']['ErrorMessage']);
      }
    });
  }

}
