import { Component, ElementRef, ViewChild } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Router, NavigationExtras } from '@angular/router';
import { AlertService } from '../../../services/alert.service';
import { DashboardService } from '../dashboard.service';
import { LiveAnnouncer } from '@angular/cdk/a11y';
import { MatAutocompleteSelectedEvent } from '@angular/material/autocomplete';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort, Sort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { CommonService } from '../../../services/common.service';
declare var $:any
declare var window:any
@Component({
  selector: 'app-users',
  templateUrl: './users.component.html',
  styleUrl: './users.component.css'
})
export class UsersComponent {

  SearchForm: FormGroup;
  Searchsubmitted = false;
  Searchloading = false;
  isshowdiv=false;
  CartList:any=[];


  displayedColumns: string[] =[];
  dataSource:any=[];

  @ViewChild(MatPaginator)
  paginator!: MatPaginator;
  @ViewChild(MatSort)
  sort: MatSort = new MatSort;
  pageSizeOptions:any=[100];

  UsersModal:any;
  modalTitle:any;
  UserForm:FormGroup;
 
  Usersubmited=false;
  Userloading=false;

  separatorKeysCodes: number[] = [];
  airline:any = [];
  allairline:any=[];
  Dialcode:any=[];
  isVisible=false
  ShowMore:boolean = true;
  visible:boolean = false;
  activebookingfilter='All';
  statusmodal :any
  totalgrossamount=0;

  StatusForm:FormGroup;
  submitLoading=false;
  Statussubmit=false;

  PasswordForm:FormGroup;
  passLoading=false;
  passsubmited=false;

  Passmodal:any
  
  constructor(private fb: FormBuilder,private alertservice: AlertService, private dashboardservice:DashboardService,private router: Router,private _liveAnnouncer: LiveAnnouncer,private commonService:CommonService) {


    let from=this.dashboardservice.SubstractCurrentDate(0);
    let to=this.dashboardservice.AddDayDefaultDate(new Date(),0);
    this.SearchForm= this.fb.group({
                                  first_name: [''],
                                  last_name: [''],
                                  mobile_no: [''],
                                  email_id: [''],
                                  status:[''],
                                  designation:[''],
                                });
    this.StatusForm= this.fb.group({
                                 ID:['',[Validators.required]],
                                 Status:['',[Validators.required]]
                                });
    this.PasswordForm= this.fb.group({
                                 ID:['',[Validators.required]],
                                 Password:['',[Validators.required]]
                                });

                                   
    this.UserForm=this.fb.group({
                                email_id:['',[Validators.required,Validators.email]],
                                mobile_no:['',[Validators.required,Validators.minLength(10),Validators.maxLength(10)]],
                                password:['',[Validators.required]],
                                first_name:['',[Validators.required]],
                                last_name:['',[Validators.required]],
                                mobile_isd:['91',[Validators.required]],
                                phone_number:[''],
                                whatsapp_no:[''],
                                date_of_birth:['',[Validators.required]],
                                street:[''],
                                city:[''],
                                state:[''],
                                country:['IN'],
                                pin_code:[''],
                                job_joining_date:['',[Validators.required]],
                                designation:['',[Validators.required]],
                                status:['',[Validators.required]],
                                });  

   }

  ngOnInit(): void {

    this.UsersModal = new window.bootstrap.Modal(
      document.getElementById('addusermodal')
    );
    this.statusmodal = new window.bootstrap.Modal(
      document.getElementById('statusmodal')
    );
    this.Passmodal = new window.bootstrap.Modal(
      document.getElementById('passmodal')
    );
    this.GetDialCode()
    this.SearchSubmit()
  }

  ngAfterViewInit() {
    this.FromDate();
    this.ToDate(); 
    this.FromTravelDate();
  }

  SpacePartialcanceled(data:any){
    return data.replace(/([a-z])([A-Z])/g, '$1 $2');
  }
  
  GetDialCode() {
    this.commonService.dialcode().subscribe(data => {
      let resp: any = data;
      if (resp['Error']['ErrorCode'] == 0) {
        this.Dialcode = resp['Result'];
      }

    });

  }

  showPassword() {
    this.isVisible = !this.isVisible;
  }


  allowNumbersOnly(event: KeyboardEvent) {
  const input = event.target as HTMLInputElement;
  input.value = input.value.replace(/[^0-9]/g, ''); // Remove non-numeric characters
}
  FromDate()
  {
    var _this = this;
    $("[dob]").datepicker({
        dateFormat : "d M yy",
       maxDate: "-12Y",
      changeMonth: true,
      changeYear: true,
      numberOfMonths: 1,
      yearRange: '-100y:c+nn',
        beforeShow : function(input:any, inst:any) { 
          setTimeout(function() {
            inst.dpDiv.css({'height':'auto'});
          }, 1);
        },
        onClose : function(selectedDate:any, inst:any ) {
          _this.UserForm.patchValue({date_of_birth:selectedDate});
          $("[to-date]").datepicker("option", "minDate",selectedDate).focus().select();
        }
      });    
  }

  ToDate()
  {
    var _this = this;
    $("[jonjoining]").datepicker({
        dateFormat : "dd M yy",
        maxDate: 0,
        changeMonth: false,
        changeYear: false,
        numberOfMonths: 1,
        beforeShow : function(input:any, inst:any) {
          setTimeout(function() {
            inst.dpDiv.css({'height':'auto'});
          }, 1);
          var selectedDate = _this.SearchForm.value.FromDate;
          var newdate = new Date(selectedDate);
          $(this).datepicker("option", "minDate",newdate);
        },
        onClose : function(selectedDate:any, inst:any ) {
          _this.UserForm.patchValue({job_joining_date:selectedDate});
        }
      });
  }

  FromTravelDate()
  {
    var _this = this;
    $("[from-travel-date]").datepicker({
        dateFormat : "d M yy",
        changeMonth: false,
        changeYear: false,
        numberOfMonths: 1,
        beforeShow : function(input:any, inst:any) {
          setTimeout(function() {
            inst.dpDiv.css({'height':'auto'});
          }, 1);
         },
        onClose : function(selectedDate:any, inst:any ) {
          _this.SearchForm.patchValue({FromTravelDate:selectedDate});
          $("[to-travel-date]").datepicker("option", "minDate",selectedDate).focus().select();
        }
      });    
  }

  ToTravelDate()
  {
    var _this = this;
    $("[to-travel-date]").datepicker({
        dateFormat : "dd M yy",
        changeMonth: false,
        changeYear: false,
        numberOfMonths: 1,
        beforeShow : function(input:any, inst:any) {
          setTimeout(function() {
            inst.dpDiv.css({'height':'auto'});
          }, 1);
          var selectedDate = _this.SearchForm.value.FromTravelDate;
          var newdate = new Date(selectedDate);
          $(this).datepicker("option", "minDate",newdate);
        },
        onClose : function(selectedDate:any, inst:any ) {
          _this.SearchForm.patchValue({ToTravelDate:selectedDate});
        }
      });
  }

  clear(field:any)
  {
      this.SearchForm.patchValue({[field]:''});
  }

  get f() { return this.SearchForm.controls; }
  get fp() { return this.PasswordForm.controls;}
  get fs() { return this.StatusForm.controls;}

  SearchSubmit()
  {
    this.Searchsubmitted = true;
    if (this.SearchForm.invalid) {
      return;
    }
    this.isshowdiv=false;
    this.Searchloading=true;

    this.dashboardservice.UserList(this.SearchForm.value).subscribe(data=>{
      let resp:any=data;
      this.Searchloading=false;
      this.isshowdiv=true;
      if(resp['Error']['ErrorCode']==0)
      { 
         this.CartList=resp['Result'];
         this.displayedColumns=[ 'first_name','date_of_birth','job_joining_date','mobile_no','login_email','designation','status','action'];
         this.dataSource = new MatTableDataSource(resp['Result']);

         setTimeout(() => {
          this.dataSource.sort = this.sort;
          this.dataSource.paginator = this.paginator;
         }, 20);
         
      } else {
        this.CartList=[];
        this.dataSource = new MatTableDataSource(resp['Result']);
        this.dataSource.sort = this.sort;
        this.dataSource.paginator = this.paginator;
      }
    });
  }

  applyFilter(event:any) {
    let filterValue=event.target.value;
    filterValue = filterValue.trim();
    filterValue = filterValue.toLowerCase();
    this.dataSource.filter = filterValue;
  }
 
  sortData(sortState: Sort) {
    if (sortState.direction) {
      this._liveAnnouncer.announce(`Sorted ${sortState.direction}ending`);
    } else {
      this._liveAnnouncer.announce('Sorting cleared');
    }
  }



  get fa() { return this.UserForm.controls; }

  Submituser()
  {
    this.Usersubmited = true;
    if (this.UserForm.invalid) {
      return;
    }
    this.Userloading=true;
    this.dashboardservice.AddUpdateUser(this.UserForm.value).subscribe((resp:any)=>{
      
      setTimeout(() => {
            this.Usersubmited = false;
            this.Userloading=false;
        }, 1000);
      if(resp['Error']['ErrorCode']==0){
        this.UsersModal.hide();
        this.SearchSubmit()
        this.alertservice.success(resp['Error']['ErrorMessage']);
      }else{
        this.alertservice.error(resp['Error']['ErrorMessage']);
      }
    })
  }

  


  OpenModal(type:any,data:any=null){
    this.modalTitle=type    
      if(type=='Edit'){
        this.UserForm.addControl('id',this.fb.control('',[Validators.required]))
        this.UserForm.patchValue(data);
        this.UserForm.get('password')?.disable();
        this.UserForm.updateValueAndValidity()
      }else{
        this.UserForm.get('password')?.enable()
        this.UserForm.updateValueAndValidity()
        this.UserForm.removeControl('id')
      }
      this.UsersModal.show()
  }

  OpenModalS(type:any,data:any){
    if(type=='Status'){
      this.StatusForm.patchValue({ID:data['id'],Status:data['status']})
      this.statusmodal.show()
    }else if(type=='Password'){
       this.PasswordForm.patchValue({ID:data['id']})
       this.Passmodal.show();
    }
  }

  StatusSubmit(){
    this.Statussubmit=true;
    if(this.StatusForm.invalid){
      return
    }

    let req:any={
      "ID":[this.StatusForm.get('ID')?.value],
      "Status":this.StatusForm.get('Status')?.value
    }
    this.submitLoading=true
    this.dashboardservice.ChangeUserStatus(req).subscribe((resp:any)=>{
       this.submitLoading=false
       this.Statussubmit=false;
        if(resp['Error']['ErrorCode']==0){
          this.statusmodal.hide()
          this.SearchSubmit()
            this.alertservice.success(resp['Error']['ErrorMessage']);
        }else{    
            this.alertservice.error(resp['Error']['ErrorMessage']);
        }
    })
  }

  PassSubmit(){
   this.passsubmited=true;
   if(this.PasswordForm.invalid){
    return
   }

    this.passLoading=true
    this.dashboardservice.ChangePass(this.PasswordForm.value).subscribe((resp:any)=>{
       this.passLoading=false
        this.passsubmited=false;
        if(resp['Error']['ErrorCode']==0){
          this.Passmodal.hide()
          this.SearchSubmit()
            this.alertservice.success(resp['Error']['ErrorMessage']);
        }else{    
            this.alertservice.error(resp['Error']['ErrorMessage']);
        }
    })
  }
}
