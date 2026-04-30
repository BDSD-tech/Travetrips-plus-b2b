import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AlertService } from '../../../services/alert.service';
import { AuthenticationService } from '../../../services/authentication.service';
import { CommonService } from '../../../services/common.service';
import { DashboardService } from '../dashboard.service';
import { Sort } from '@angular/material/sort';

declare var $: any;
declare var window: any;

@Component({
  selector: 'app-deposit-request',
  templateUrl: './deposit-request.component.html',
  styleUrls: ['./deposit-request.component.css']
})
export class DepositRequestComponent implements OnInit {

  GetWebSiteData:any=[];
  BankList:any=[];
  DepositForm: FormGroup;
  submitted = false;
  loading = false;
  SelAccountNo:any='';
  selectedFiles?: FileList;
  currentFile?: File;

  SelectBankList:any=[];

  AllBankListShow:any=[];

  
  AddAmendmentModal:any
  QRImage:any
  ImageURL:any
  constructor(private fb: FormBuilder,private alertservice: AlertService, private dashboardservice:DashboardService,private commonservice:CommonService,private authenticationservice: AuthenticationService) { 

    this.DepositForm = this.fb.group({
                                       DepositType: ['',[Validators.required]],
                                       PaymentMode: ['',[Validators.required]],
                                       DepositAmount: ['',[Validators.required,Validators.pattern('[0-9]+')]],
                                       BankID: ['',[Validators.required]],
                                       BankName: ['',[Validators.required]],
                                       AccountNumber: ['',[Validators.required]],
                                       TransactionID: ['',[Validators.required]],
                                       MobileNumber: ['', [Validators.required,Validators.pattern('[0-9]+'),Validators.minLength(10),Validators.maxLength(10)]],
                                       ChequeDrawOnBank: ['',[Validators.required]],
                                       ChequeIssueDate: ['',[Validators.required]],
                                       ChequeNumber: ['',[Validators.required]]
                                     });

  }

  ngOnInit(): void {

     this.AddAmendmentModal = new window.bootstrap.Modal(
      document.getElementById('QEMODAL')
    );
    this.commonservice.GetWebSiteData().subscribe(data => {
      this.GetWebSiteData =data;
    });

    this.authenticationservice.currentUser.subscribe(data => {
      if(data)
      {
        this.DepositForm.patchValue({'MobileNumber':data['MobileNo']});
      }
    });

    this.commonservice.GetBankDetails().subscribe(data => {
        let resp:any=data;
        if(resp['Error']['ErrorCode']==0)
        {
          this.BankList=resp['Result'];
          this.ImageURL=resp['QrFile']
          this.AllBankListShow=resp['Result']['RegularBank'].concat(resp['Result']['PhonePayments']);
        }
    });
    
    this.ChequeIssueDate();
  }


  GetDepositType(event:any)
  {
    this.DepositForm.enable();
    let value=event.value;
  
    this.SelectBankList=this.BankList['RegularBank'];

    this.DepositForm.patchValue({'AccountNumber':''});

    if(value=='Bank Transfer')
    {
      this.DepositForm.get('ChequeDrawOnBank')?.disable();
      this.DepositForm.get('ChequeIssueDate')?.disable();
      this.DepositForm.get('ChequeNumber')?.disable();

     
    }
    if(value=='Phone Payment')
    {
      this.DepositForm.get('ChequeDrawOnBank')?.disable();
      this.DepositForm.get('ChequeIssueDate')?.disable();
      this.DepositForm.get('ChequeNumber')?.disable();
      this.DepositForm.get('PaymentMode')?.disable();

      this.SelectBankList=this.BankList['PhonePayments'];
    }
    if(value=='Cheque Deposit')
    {
     this.DepositForm.get('PaymentMode')?.disable();
    }
    if(value=='Cash in Bank')
    {
      this.DepositForm.get('MobileNumber')?.disable();
      this.DepositForm.get('ChequeDrawOnBank')?.disable();
      this.DepositForm.get('ChequeIssueDate')?.disable();
      this.DepositForm.get('ChequeNumber')?.disable();
      this.DepositForm.get('PaymentMode')?.disable();
      this.DepositForm.patchValue({'MobileNumber':''});
    }
    if(value=='Cash at Headoffice')
    {
      this.DepositForm.patchValue({'MobileNumber':''});
      this.DepositForm.get('BankName')?.disable();
      this.DepositForm.get('AccountNumber')?.disable();
      this.DepositForm.get('MobileNumber')?.disable();
      this.DepositForm.get('ChequeDrawOnBank')?.disable();
      this.DepositForm.get('ChequeIssueDate')?.disable();
      this.DepositForm.get('ChequeNumber')?.disable();
      this.DepositForm.get('PaymentMode')?.disable();
      this.DepositForm.get('BankID')?.disable();
    }

  }

  GetBankName(event:any)
  {
    let bankid=event.value;
    let accountno:any; let bankname:any; let bid:any
    this.SelectBankList.forEach(function(value:any, key:any) {
        if(value['BankId']==bankid)
        {
          accountno=value['AccountNumber'];
          bankname=value['BankName'];
          bid=value['BankId'];
        }
    });
    this.SelAccountNo=accountno;
    this.DepositForm.patchValue({'BankID':bid,'AccountNumber':accountno});
  }

  OpenModal(data:any){
    this.AddAmendmentModal.show();
    this.QRImage=data['QrCodeFile']
  }
  ChequeIssueDate()
  {
    var _this = this;
    $("[cheque-issue-date]").datepicker({
        dateFormat : "d M yy",
        minDate: "-4m",
        maxDate: '4m',
        changeMonth: false,
        changeYear: false,
        numberOfMonths: 1,
        beforeShow : function(input:any, inst:any) {
          setTimeout(function() {
            inst.dpDiv.css({'height':'auto'});
          }, 1);
          $(inst.dpDiv).addClass('tts-calandor');
        },
        onClose : function(selectedDate:any, inst:any ) {
         
          _this.DepositForm.patchValue({'ChequeIssueDate':selectedDate});
        }
      });
  }

  selectFile(event:any) {
   
    this.selectedFiles = event.target.files;
    if (this.selectedFiles) {
      const file: File | null = this.selectedFiles.item(0);
      if (file) {
        this.currentFile = file;
        const reader = new FileReader();
        reader.onload = (e: any) => {
        };
        reader.readAsDataURL(this.currentFile);
      }
    }

  }

  get f() { return this.DepositForm.controls; }

  Submit()
  {
    this.submitted = true;
    if (this.DepositForm.invalid) {
      return;
    }
    this.loading=true;
    let filedata:any=this.selectedFiles?.[0];
    const formData = new FormData();
    formData.append('data' , JSON.stringify(this.DepositForm.value));
    formData.append('file' , filedata);

    this.dashboardservice.AddDepositRequest(formData).subscribe(data => {
      let resp:any=data;
      if(resp['Error']['ErrorCode']==0)
      {
          this.DepositForm.reset();
          this.submitted = false;
          this.alertservice.success(resp['Error']['ErrorMessage']);
          this.DepositForm.get('DepositType')?.setErrors(null);
          this.DepositForm.get('DepositAmount')?.setErrors(null);
          this.DepositForm.get('BankName')?.setErrors(null);
          this.DepositForm.get('AccountNumber')?.setErrors(null);
          this.DepositForm.get('TransactionID')?.setErrors(null);
          this.DepositForm.get('MobileNumber')?.setErrors(null);
          this.DepositForm.get('ChequeDrawOnBank')?.setErrors(null);
          this.DepositForm.get('ChequeIssueDate')?.setErrors(null);
          this.DepositForm.get('ChequeNumber')?.setErrors(null);
        } else {
          this.alertservice.error(resp['Error']['ErrorMessage']);
      }
    });

  }
  numberOnly(event:any) {
    const charCode = (event.which) ? event.which : event.keyCode;
    if (charCode > 31 && (charCode < 48 || charCode > 57)) {
      return false;
    }
    return true;
  }

  sortData(sort: Sort) {
    const data = this.AllBankListShow.slice();
    if (!sort.active || sort.direction === '') {
      this.AllBankListShow = data;
      return;
    }
    this.AllBankListShow = data.sort((a:any, b:any) => {
      const isAsc = sort.direction === 'asc';
      switch (sort.active) {
        case 'BankName': return compare(a.BankName, b.BankName, isAsc);
        case 'AccountHolderName': return compare(a.AccountHolderName, b.AccountHolderName, isAsc);
        case 'BranchName': return compare(a.BranchName, b.BranchName, isAsc);
        case 'AccountNumber': return compare(a.AccountNumber, b.AccountNumber, isAsc);
        case 'IfscCode': return compare(a.IfscCode, b.IfscCode, isAsc);
        case 'SwiftCode': return compare(a.SwiftCode, b.SwiftCode, isAsc);
        default: return 0;
      }
    });
  }
}

function compare(a: number | string, b: number | string, isAsc: boolean) {
  return (a < b ? -1 : 1) * (isAsc ? 1 : -1);
}