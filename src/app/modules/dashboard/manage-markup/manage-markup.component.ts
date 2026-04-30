import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatAutocompleteSelectedEvent } from '@angular/material/autocomplete';
import { Sort } from '@angular/material/sort';
import { AlertService } from '../../../services/alert.service';
import { DashboardService } from '../dashboard.service';

declare var window: any;

@Component({
  selector: 'app-manage-markup',
  templateUrl: './manage-markup.component.html',
  styleUrls: ['./manage-markup.component.css']
})
export class ManageMarkupComponent implements OnInit {

  AddMarkupForm:FormGroup;
  submitted=false;
  addmarkuploading=false;
  addModal:any;

  MarkupList:any=[];
  loading:any=true;
  deleteModal:any;
  seldeleteid:any;

  separatorKeysCodes: number[] = [];
  airline:any = [];
  allairline:any=[];


  addOnBlur=true
   removable =true
   selectable = true;

  @ViewChild('airlineInput') airlineInput!: ElementRef<HTMLInputElement>;


  constructor(private fb: FormBuilder,private alertservice: AlertService, private dashboardservice:DashboardService) {

      this.AddMarkupForm=this.fb.group({
                                            ProductType: ['',[Validators.required]],
                                            MarkupType: ['',[Validators.required]],
                                            AmountType: ['',[Validators.required]],
                                            Value: ['',[Validators.required,Validators.pattern('[0-9\.]+')]],
                                            Airlines: [''],
                                            id: ['']
                                        });
      this.airline['All']='All';
   }

  ngOnInit(): void {

    this.GetMarkupList();

    this.deleteModal = new window.bootstrap.Modal(
      document.getElementById('tts-delete-modal')
    );
    this.addModal = new window.bootstrap.Modal(
      document.getElementById('addformmodal')
    );
  }

  GetMarkupList()
  {
    let req:any;
    this.dashboardservice.MarkupList(req).subscribe(data=>{
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
    this.dashboardservice.DeleteMarkup(req).subscribe(data=>{
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
    this.airline=[];
    let airline:any=[];
    let keys:any = item['airlineCode'];
    let values:any =item['airlineName'];
    for (let i = 0; i < keys.length; i++)
    {
      airline[keys[i]] = values[i];
    }
    this.airline=airline;

    this.AddMarkupForm.patchValue({
                                      'ProductType':item['product'],
                                      'MarkupType':item['markupType'],
                                      'AmountType':item['amountType'],
                                      'Value':item['value'],
                                      'Airlines':airline,
                                      'PaxType':item['paxType'],
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
    var airlinecode = Object.keys(this.airline);
    this.AddMarkupForm.patchValue({'Airlines':airlinecode});
    
    if(this.AddMarkupForm.get('id')?.value=='' || this.AddMarkupForm.get('id')?.value==null)
    {
      this.dashboardservice.AddMarkup(this.AddMarkupForm.value).subscribe(data=>{
        let resp:any=data;
        this.addmarkuploading=false;
        this.addModal.hide();
        if(resp['Error']['ErrorCode']==0)
        {
            this.alertservice.success(resp['Error']['ErrorMessage']);
            this.GetMarkupList();
            this.AddMarkupForm.reset();
            this.submitted=false;
            this.airline=[];
            this.airline['All']='All';
        } else {
            this.alertservice.error(resp['Error']['ErrorMessage']);
        }
      });
    } else {

      this.dashboardservice.EditMarkup(this.AddMarkupForm.value).subscribe(data=>{
        let resp:any=data;
        this.addmarkuploading=false;
        this.addModal.hide();
        if(resp['Error']['ErrorCode']==0)
        {
            this.alertservice.success(resp['Error']['ErrorMessage']);
            this.GetMarkupList();
            this.AddMarkupForm.reset();
            this.submitted=false;
            this.airline=[];
            this.airline['All']='All';
        } else {
            this.alertservice.error(resp['Error']['ErrorMessage']);
        }
      });
      
    }
  }

  remove(item: any): void {
    delete this.airline[item.key];
  }

  selected(event: MatAutocompleteSelectedEvent): void {
    this.airline[event.option.value]=event.option.viewValue;
    this.airlineInput.nativeElement.value = '';
  }

  AirlineAutocomplete(event:any)
  {
      let val=event.target.value;
      this.dashboardservice.airlineautocomplete(val).subscribe(data=>{
        let resp:any=data;
        if(resp['Error']['ErrorCode']==0)
        {
            this.allairline=resp['Result'];
        } 
      });
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
        case 'airlineName': return compare(a.airlineName, b.airlineName, isAsc);
        case 'paxType': return compare(a.paxType.toString(), b.paxType.toString(), isAsc);
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
