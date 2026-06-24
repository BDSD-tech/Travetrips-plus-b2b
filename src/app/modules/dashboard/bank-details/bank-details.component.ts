import { Component } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Sort } from '@angular/material/sort';
import { AlertService } from '../../../services/alert.service';
import { AuthenticationService } from '../../../services/authentication.service';
import { CommonService } from '../../../services/common.service';
import { DashboardService } from '../dashboard.service';
declare var window:any
@Component({
  selector: 'app-bank-details',
  templateUrl: './bank-details.component.html',
  styleUrl: './bank-details.component.css'
})
export class BankDetailsComponent {

  GetWebSiteData:any=[];
  BankList:any=[];
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

   
  }

  ngOnInit(): void {
    this.AddAmendmentModal = new window.bootstrap.Modal(
      document.getElementById('QEMODAL')
    );
   
    this.commonservice.GetWebSiteData().subscribe(data => {
      this.GetWebSiteData =data;
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
    
  }

  OpenModal(data:any){
    this.AddAmendmentModal.show();
    this.QRImage=data['QrCodeFile']
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