import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { AlertService } from '../../../services/alert.service';
import { AuthenticationService } from '../../../services/authentication.service';
import { CommonService } from '../../../services/common.service';
import { DashboardService } from '../dashboard.service';

declare var $: any;

@Component({
  selector: 'app-user-detail',
  templateUrl: './user-detail.component.html',
  styleUrls: ['./user-detail.component.css']
})
export class UserDetailComponent implements OnInit {

  countrylist:any=[];
  statelist:any=[];
  citylist:any=[];
  AgentDetail:any=[];

  AgentForm!: FormGroup;

  selectedFiles?: FileList;
  currentFile?: File;
  progress = 0;
  isupload =false;
  preview = '';
  pageLoading=true
  loading:any=false;
  companyId:any
  submitloading:any=false;
  Usersubmitted:any=false;
  constructor(private dashboardservice:DashboardService, private commonservice:CommonService,private fb: FormBuilder,private alertservice:AlertService, private authenticationservice:AuthenticationService,private route: ActivatedRoute, private router: Router) { 
   this.authenticationservice.currentUser.subscribe((data:any)=>{
        this.companyId='/dashboard/user-detail/'+data['CompanyId'];
    
   })
   
    
  }
  

  ngOnInit(): void {

    this.getstate(101);
    this.GetUserDetail();

    this.AgentForm = this.fb.group({
      CompanyId: [{value: null, disabled: true},[Validators.required]],
      AgencyName: [{value: null, disabled: true},[Validators.required]],
      MobileNumber: [{value: null, disabled: true}, [Validators.required,Validators.pattern('[0-9]+'),Validators.minLength(10),Validators.maxLength(10)]],
      EmailID: [{value: null, disabled: true}, [Validators.required,Validators.email]],
      PANName: [''],
      PANNumber: ['', [Validators.pattern(/([A-Z]){5}([0-9]){4}([A-Z]){1}$/)]],
      GSTName:[],
      GSTEmail:['', [Validators.email]],
      GSTNumber:[''],
      GSTMobileNumber:['',[Validators.pattern('[0-9]+'),Validators.minLength(10),Validators.maxLength(10)]],
      GSTAddress:[''],
      Street:['', [Validators.required]],
      Pincode:['', [Validators.required]],
      Country:['India', [Validators.required]],
      State:['', [Validators.required]],
      City:['', [Validators.required]],
      AgencyLogo:[''],
    });

  }

  reload() {
    this.router.routeReuseStrategy.shouldReuseRoute = () => false;
    this.router.onSameUrlNavigation = 'reload';
    this.router.navigate(['./'], { relativeTo: this.route });
  }


  GetUserDetail()
  {
    this.pageLoading=true
    this.dashboardservice.GetDetail().subscribe(response => { 
      let data:any=response;
      if(data['Error']['ErrorCode']==0)
      {
        this.AgentDetail=data['Result'];
        setTimeout(() => {
          this.getcity(null,this.AgentDetail['State']);
        }, 200);
        this.pageLoading=false
        this.AgentForm.patchValue({
                                      'CompanyId':this.AgentDetail['CompanyId'],
                                      'AgencyName':this.AgentDetail['AgencyName'],
                                      'MobileNumber':this.AgentDetail['MobileNumber'],
                                      'EmailID':this.AgentDetail['EmailID'],
                                      'PANName':this.AgentDetail['PANName'],
                                      'PANNumber':this.AgentDetail['PANNumber'],
                                      'GSTName':this.AgentDetail['GSTName'],
                                      'GSTEmail':this.AgentDetail['GSTEmail'],
                                      'GSTNumber':this.AgentDetail['GSTNumber'],
                                      'GSTMobileNumber':this.AgentDetail['GSTMobileNumber'],
                                      'GSTAddress':this.AgentDetail['GSTAddress'],
                                      'Street':this.AgentDetail['Street'],
                                      'Pincode':this.AgentDetail['Pincode'],
                                      'Country':this.AgentDetail['Country'],
                                      'State':this.AgentDetail['State'],
                                      'City':this.AgentDetail['City']
                                  });

          if(this.AgentDetail['PANName'])
          {
            this.AgentForm.get('PANName')?.disable();
          }
          if(this.AgentDetail['PANNumber'])
          {
            this.AgentForm.get('PANNumber')?.disable();
          }
          if(this.AgentDetail['GSTNumber'])
          {
            this.AgentForm.get('GSTNumber')?.disable();
          }           
          if(this.AgentDetail['GSTEmail'])
          {
            this.AgentForm.get('GSTEmail')?.disable();
          }           
          if(this.AgentDetail['GSTMobileNumber'])
          {
            this.AgentForm.get('GSTMobileNumber')?.disable();
          }           
          if(this.AgentDetail['GSTName'])
          {
            this.AgentForm.get('GSTName')?.disable();
          }           
          if(this.AgentDetail['GSTAddress'])
          {
            this.AgentForm.get('GSTAddress')?.disable();
          }
          
          this.preview= this.AgentDetail['AgencyLogo'];
                                  
      }
    });

  }
  // ActiveStep(val:any){

  // }
  getstate(value:any)
  {
    if(value) {
      this.commonservice.statelist(value).subscribe(response => { 
        let data:any=response;
        if(data['Error']['ErrorCode']==0)
        {
          this.statelist=data['Result'];     
        }
       
      });
    } 
  }

  getcity(event:any,valuetxt:any=null)
  {
    let id:any='';
    this.statelist.forEach(function(value:any ,key:any) {
      if(event)
      {
        if(value['name']==event.target.value)
        {
          id=value['id'];
        }
      } else {
        if(value['name']==valuetxt)
        {
          id=value['id'];
        }
      }
        
    });
    if(id) { 
      this.commonservice.citylist(id).subscribe(response => { 
        let data:any=response;
        if(data['Error']['ErrorCode']==0)
        {
          this.citylist=data['Result'];    
          this.AgentForm.patchValue({'City':this.AgentDetail['City']}) 
        }
      });       
    }    
  }

  numberOnly(event:any) {
    const charCode = (event.which) ? event.which : event.keyCode;
    if (charCode > 31 && (charCode < 48 || charCode > 57)) {
      return false;
    }
    return true;
  }


  selectFile(event:any) {
   
    this.selectedFiles = event.target.files;
    if (this.selectedFiles) {
      const file: File | null = this.selectedFiles.item(0);
      if (file) {
        this.isupload=true;
        this.preview = '';
        this.currentFile = file;
        const reader = new FileReader();
        reader.onload = (e: any) => {
          this.preview = e.target.result;
        };
        reader.readAsDataURL(this.currentFile);
      }
    }

  }

  uploadlogo()
  {
    let filedata:any=this.selectedFiles?.[0];
    const formData = new FormData();
    formData.append('type' , 'uploadlogo');
    formData.append('file' , filedata);
    
    this.loading=true;
    this.dashboardservice.UpdateDetail(formData).subscribe(resp => {
      let response:any=resp;
      this.loading=false;
      if(response['Error']['ErrorCode']===0)
      {
        this.authenticationservice.update(response['Result'],'AgencyLogo');
        this.alertservice.success(response['Error']['ErrorMessage']);
        this.reload();
      } else {
        this.alertservice.warning(response['Error']['ErrorMessage']);
      }
    });
  }

  Removelogo()
  {
    this.isupload=false;
    this.preview = '';
    this.AgentDetail['AgencyLogo']='';
    this.AgentForm.patchValue({'AgencyLogo':''});
    let request={'LogoType':'removelogo'};
    this.dashboardservice.UpdateDetail(request).subscribe(resp => {
      let response:any=resp;
      this.loading=false;
      if(response['Error']['ErrorCode']===0)
      {
        this.authenticationservice.update(response['Result'],'AgencyLogo');
        this.alertservice.success(response['Error']['ErrorMessage']);
        this.reload();
      } else {
        this.alertservice.warning(response['Error']['ErrorMessage']);
      }
    });

  }

  get f() { return this.AgentForm.controls; }
  
  SubmitData()
  {
    this.Usersubmitted=true;
    if (this.AgentForm.invalid) {
      return;
    }

    this.submitloading=true;
    this.dashboardservice.UpdateDetail(this.AgentForm.value).subscribe(resp => {
      let response:any=resp;
      this.submitloading=false;
      if(response['Error']['ErrorCode']===0)
      {
        this.AgentDetail=response['Result'];
        this.alertservice.success(response['Error']['ErrorMessage']);
      } else {
        this.alertservice.warning(response['Error']['ErrorMessage']);
      }
    });

  }


}
