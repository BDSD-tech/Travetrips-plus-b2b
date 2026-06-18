import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NavigationExtras, Router } from '@angular/router';
import { BusService } from './bus.service';
import Validation from '../../utils/validation';
import { tts_config } from '../../../environments/tts_config';
import { CommonService } from '../../services/common.service';

declare var $: any;

@Component({
  selector: 'app-bus',
  templateUrl: './bus.component.html',
  styleUrls: ['./bus.component.css']
})
export class BusComponent implements OnInit {

  GetWebSiteData:any=[];
  Offer:any=[];
  Notifications:any=[];
  offerloading=true;

  BusSearchForm: FormGroup;
  submitted = false;
  Busloading=false;

  BlogList:any=[];
  TestimonialsList:any=[];
  BusRecentSearch:any=[];
  
  constructor(public fb: FormBuilder,private router: Router,private busservice:BusService,private commonservice:CommonService) {

    let DepartDate=this.busservice.AddDayDefaultDate(new Date(),1);

    this.BusSearchForm = this.fb.group({
      Origin: ['Bangalore', Validators.required],
      OriginCityID: ['8463'],
      Destination: ['Hyderabad', Validators.required],
      DestinationCityID: ['9573'],
      DepartDate: [DepartDate, Validators.required],
    }, 
    {
      validators: [Validation.NotMatch('Origin', 'Destination')]
    });

   }

  ngOnInit(): void {
    sessionStorage.removeItem('BusSearch');
    this.busautocomplete();
    this.commonservice.GetWebSiteData().subscribe(data => {
      this.GetWebSiteData =data;
    });
    this.commonservice.GetHomeOffer().subscribe(data => {
      this.Offer=data;
      this.offerloading=false; 
    });
    this.commonservice.GetHomeNotifications().subscribe(data => {
      this.Notifications=data;
    });


      if(sessionStorage.getItem('BusRecentSearch')){
        let recentdata:any=sessionStorage.getItem('BusRecentSearch');
        this.BusRecentSearch=JSON.parse(recentdata);
        console.log(this.BusRecentSearch);
        
      }
    // this.commonservice.GetBlogList().subscribe(data => {
    //   this.BlogList=data;
    // });

    // this.commonservice.GetTestimonialsList().subscribe(data => {
    //   this.TestimonialsList=data;
    // });
    
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


    // Start :: Recent search data start from here 
    let isvaluesame:any=[];
    let d:any=sessionStorage.getItem('BusRecentSearch')            
    let recentData=JSON.parse(d);

    if(recentData){
       if(recentData.length<6)
           {
             recentData.forEach((element:any) => {
               isvaluesame.push(this.JsonCompare(element,this.BusSearchForm.value));
             });
             if (Object.values(isvaluesame).indexOf(true) > -1) {
             } else {
               recentData.push(this.BusSearchForm.value);
              sessionStorage.setItem('BusRecentSearch',JSON.stringify(recentData));
             }
           } else {
             recentData.unshift(this.BusSearchForm.value);
             recentData.pop();
             sessionStorage.setItem('BusRecentSearch',JSON.stringify(recentData));
           }
    }else{
      this.BusRecentSearch.push(this.BusSearchForm.value);
      sessionStorage.setItem('BusRecentSearch',JSON.stringify(this.BusRecentSearch))
    }
    // End :: Recent search data start from here 


    const navigationExtras: NavigationExtras = {
      queryParams:searchstring
    };
    this.router.navigate(['bus/search'], navigationExtras);
  }

  RecentSearch(val:any){
    if(val){
      this.BusSearchForm.setValue(val);
      this.SearchData()
    }
  }

   JsonCompare(obj1:any, obj2:any)
  {
    var keys1 = Object.keys(obj1);
    var keys2 = Object.keys(obj2);
    return keys1.length === keys2.length && Object.keys(obj1).every(key=>obj1[key]==obj2[key]);
  }
}
