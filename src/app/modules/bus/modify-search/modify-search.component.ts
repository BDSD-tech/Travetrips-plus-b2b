import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NavigationExtras, Router } from '@angular/router';
import Validation from '../../../utils/validation';
import { tts_config } from '../../../../environments/tts_config';


declare var $: any;

@Component({
  selector: 'app-modify-search',
  templateUrl: './modify-search.component.html',
  styleUrls: ['./modify-search.component.css']
})
export class ModifySearchComponent implements OnInit {

  GetSearchData: any=[];
  isModifyShow = false;

  BusSearchForm: FormGroup;
  submitted = false;
  Busloading=false;

  
  constructor(public fb: FormBuilder,private router: Router) {

    if (sessionStorage.getItem('BusSearch')) {
      let bussearch:any=sessionStorage.getItem('BusSearch');
      this.GetSearchData = JSON.parse(bussearch);
    } else {
      this.router.navigate(['/bus']);
    }

    this.BusSearchForm = this.fb.group({
      Origin: [this.GetSearchData['Origin'], Validators.required],
      OriginCityID: [this.GetSearchData['OriginCityID']],
      Destination: [this.GetSearchData['Destination'], Validators.required],
      DestinationCityID: [this.GetSearchData['DestinationCityID']],
      DepartDate: [this.GetSearchData['DepartDate'], Validators.required],
    }, 
    {
      validators: [Validation.NotMatch('Origin', 'Destination')]
    });

   }

 
   ngOnInit(): void {
    this.busautocomplete();
  }



  swapecity()
  {
    let Origin = this.BusSearchForm.get('Origin')?.value;
    let OriginCityID = this.BusSearchForm.get('OriginCityID')?.value;
    let Destination = this.BusSearchForm.get('Destination')?.value;
    let DestinationCityID = this.BusSearchForm.get('DestinationCityID')?.value;
    this.BusSearchForm.patchValue({Origin:Destination,OriginCityID:DestinationCityID,Destination:Origin,DestinationCityID:OriginCityID});
  }

  busautocomplete() {
    var _this = this;
    $(document).on('focus','.busautosuggeest',() => {
      $(".busautosuggeest").autocomplete({
        minLength: 0,
        maxResults: 15,
        source: function (request:any, response:any) {
          let url = tts_config.APIURL + '/bus/citylist';
          $.ajax({
            url: url,
            dataType: "json",
            cache: false,
            data: {
              term: request.term
            },
            success: function (data:any) {
              response(data);
            }
          });
        },
        open: function () {
          $(".ui-autocomplete").addClass('ttsautocomplet');
          $(this).autocomplete('widget').css('z-index', 9999);
          return false;
        },
        select: function (event:any, ui:any) {
            var fieldname = $(this).attr('formControlName');
            if(fieldname=="Origin")
            {
                _this.BusSearchForm.patchValue({Origin:ui.item.label,OriginCityID:ui.item.city_id});
            } else if(fieldname=="Destination")
            {
              _this.BusSearchForm.patchValue({Destination:ui.item.label,DestinationCityID:ui.item.city_id});
            }
            var inputs = $(this).closest('#bus-form').find(':input');
            inputs.eq(inputs.index(this) + 1).focus().click();
        },
        change: function (event:any, ui:any) {
          $(this).val(ui.item ? ui.item.label : '');
        },
        create: function () {
          $(this).data('ui-autocomplete')._renderItem = function (ul:any, item:any) {
            var label = item.label;
            return $("<li>")
              .data("ui-autocomplete-item", item)
              .append(
                "<div>"
                + "<div class='tts-autosuggest-li'>"
                + "<b class='label'>"
                + label
                + "</b>"
                + "</div>"
                + "</div>").appendTo(ul);
          };
        }
      });
    });
    }

  openautocomplete(event:any,type:any)
  {
    $(event.target).autocomplete( "search", "" );
  }


  get f() { return this.BusSearchForm.controls; }

  Cleardata(field:any,key:any=null)
  {
      if(field=='Origin')
      {
        this.BusSearchForm.patchValue({ Origin:'',OriginCityID:''});
      }
      if(field=='Destination')
      {
        this.BusSearchForm.patchValue({ Destination:'',DestinationCityID:''});
      }
  }

  dateEventEmitter(dateobj:any)
  {
    if(dateobj.calType=='O')
    {
      this.BusSearchForm.patchValue({DepartDate:dateobj.Date});
    }

  }

  SearchData()
  {
    this.submitted = true;
    if (this.BusSearchForm.invalid) {
      return;
    }
    this.Busloading=true;
    sessionStorage.setItem('BusSearch',JSON.stringify(this.BusSearchForm.value));
    
    let data=this.BusSearchForm.value;

    let searchstring={
                        'source':data['Origin'],
                        'source_id':data['OriginCityID'],
                        'destination':data['Destination'],
                        'destination_id':data['DestinationCityID'],
                        'dep':data['DepartDate'].replaceAll(' ', '-'),
                     };

    const navigationExtras: NavigationExtras = {
      queryParams:searchstring
    };
    this.router.navigate(['bus/search'], navigationExtras);
  }


  modifysearch()
  {
    this.isModifyShow=!this.isModifyShow;
  }
}
