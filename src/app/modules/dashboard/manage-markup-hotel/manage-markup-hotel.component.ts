import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Sort } from '@angular/material/sort';
import { AlertService } from 'src/app/services/alert.service';
import { DashboardService } from '../dashboard.service';

declare var window: any;

@Component({
  selector: 'app-manage-markup-hotel',
  templateUrl: './manage-markup-hotel.component.html',
  styleUrls: ['./manage-markup-hotel.component.css']
})
export class ManageMarkupHotelComponent implements OnInit {

  AddMarkupForm:FormGroup;
  submitted=false;
  addmarkuploading=false;
  addModal:any;

  MarkupList:any=[];
  loading:any=true;
  deleteModal:any;
  seldeleteid:any;



  constructor(private fb: FormBuilder,private alertservice: AlertService, private dashboardservice:DashboardService) {

      this.AddMarkupForm=this.fb.group({
                                            ProductType: ['Hotel',[Validators.required]],
                                            MarkupType: ['',[Validators.required]],
                                            AmountType: ['',[Validators.required]],
                                            Value: ['',[Validators.required,Validators.pattern('[0-9\.]+')]],
                                            id: ['']
                                        });
   }

  ngOnInit(): void {

    this.GetMarkupList();

    this.deleteModal = new window.bootstrap.Modal(
      document.getElementById('tts-delete-modal-hotel')
    );
    this.addModal = new window.bootstrap.Modal(
      document.getElementById('addformmodal-hotel')
    );
  }

  GetMarkupList()
  {
    let req:any;
    this.dashboardservice.HotelMarkupList(req).subscribe(data=>{
      this.loading=false;
      let resp:any=data;
      if(resp['Error']['ErrorCode']==0)
      {
          this.MarkupList=resp['Result'];
      } else {
          this.MarkupList=[];
      }
    });
  }

  Deleteitem(id:any)
  {
    this.deleteModal.show();
    this.seldeleteid=id;
  }
  ConfirmDelete()
  {
    let req={
                'id':this.seldeleteid
            };
    this.dashboardservice.DeleteHotelMarkup(req).subscribe(data=>{
      let resp:any=data;
      this.deleteModal.hide();
      if(resp['Error']['ErrorCode']==0)
      {
          this.alertservice.success(resp['Error']['ErrorMessage']);
          this.GetMarkupList();
      } else {
          this.alertservice.error(resp['Error']['ErrorMessage']);
      }
    });
  }

  Edititem(item:any)
  {
  
    this.AddMarkupForm.patchValue({
                                      'ProductType':item['product'],
                                      'MarkupType':item['markupType'],
                                      'AmountType':item['amountType'],
                                      'Value':item['value'],
                                      'id':item['id']
                                  });

    this.addModal.show();

  }

  get f() { return this.AddMarkupForm.controls; }

  SubmitMarkup()
  {
    this.submitted = true;
    if (this.AddMarkupForm.invalid) {
      return;
    }
    this.addmarkuploading=true;
  
    
    if(this.AddMarkupForm.get('id')?.value=='' || this.AddMarkupForm.get('id')?.value==null)
    {
      this.dashboardservice.AddHotelMarkup(this.AddMarkupForm.value).subscribe(data=>{
        let resp:any=data;
        this.addmarkuploading=false;
        this.addModal.hide();
        if(resp['Error']['ErrorCode']==0)
        {
            this.alertservice.success(resp['Error']['ErrorMessage']);
            this.GetMarkupList();
            this.AddMarkupForm.reset();
            this.submitted=false;
        } else {
            this.alertservice.error(resp['Error']['ErrorMessage']);
        }
      });
    } else {

      this.dashboardservice.EditHotelMarkup(this.AddMarkupForm.value).subscribe(data=>{
        let resp:any=data;
        this.addmarkuploading=false;
        this.addModal.hide();
        if(resp['Error']['ErrorCode']==0)
        {
            this.alertservice.success(resp['Error']['ErrorMessage']);
            this.GetMarkupList();
            this.AddMarkupForm.reset();
            this.submitted=false;
        } else {
            this.alertservice.error(resp['Error']['ErrorMessage']);
        }
      });
      
    }
  }
  
  sortData(sort: Sort) {
    const data = this.MarkupList.slice();
    if (!sort.active || sort.direction === '') {
      this.MarkupList = data;
      return;
    }
    this.MarkupList = data.sort((a:any, b:any) => {
      const isAsc = sort.direction === 'asc';
      switch (sort.active) {
        case 'created': return compare(a.created, b.created, isAsc);
        case 'product': return compare(a.product, b.product, isAsc);
        case 'markupType': return compare(a.markupType, b.markupType, isAsc);
        case 'amountType': return compare(a.amountType, b.amountType, isAsc);
        case 'value': return compare(a.value, b.value, isAsc);
        default: return 0;
      }
    });
  }
}

function compare(a: number | string, b: number | string, isAsc: boolean) {
  return (a < b ? -1 : 1) * (isAsc ? 1 : -1);
}
