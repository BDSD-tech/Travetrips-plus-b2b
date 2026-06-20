import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { FormBuilder, FormArray, FormGroup, Validators} from '@angular/forms';
import { NavigationExtras, Router } from '@angular/router';
import Validation from '../../../utils/validation';
import { tts_config } from '../../../../environments/tts_config';
import { CommonService } from '../../../services/common.service';

declare var $: any;

@Component({
  selector: 'app-modify-search',
  templateUrl: './modify-search.component.html',
  styleUrls: ['./modify-search.component.css']
})
export class ModifySearchComponent implements OnInit {

  GetSearchData: any=[];
  GetWebSiteData: any=[];
  isModifyShow = false;
  ModifySearchForm!: FormGroup;
  submitted = false;
  Flightloading=false;
  paxcountstop=false;
  isShow = false;
  adultcount: number = 1;
  childcount: number = 0;
  infantcount: number = 0;
  striptravellertxt: string | undefined;
  travellertxt: string | undefined;
  totalpaxcount: number | undefined;
  flightrecent:any=[];
  getRecentSearch:any=[];
  preferredairlinedata:any=[];
  preferredairlinelist=[
                        {
                          'name':'Indigo',
                          'code':'6E',
                          'ischecked':false
                        },
                        {
                          'name':'Air India Express',
                          'code':'I5',
                          'ischecked':false
                        },
                        {
                          'name':'Akasa Air',
                          'code':'QP',
                          'ischecked':false
                        },
                        {
                          'name':'AirIndia',
                          'code':'AI',
                          'ischecked':false
                        },
                        {
                          'name':'Vistara',
                          'code':'UK',
                          'ischecked':false
                        },
                        {
                          'name':'Spice jet',
                          'code':'SG',
                          'ischecked':false
                        }
                       ];

  compareKeepOrder = (a: any, b: any): number => {
  return 0; 
  };
  constructor(public fb: FormBuilder,private router: Router,private commonservice:CommonService) {

    if (sessionStorage.getItem('FlightSearch')) {
      let flightsearch:any=sessionStorage.getItem('FlightSearch');
      this.GetSearchData = JSON.parse(flightsearch);
    } else {
      this.router.navigate(['/flight']);
    }

    this.ModifySearchForm = this.fb.group({
      Type: [this.GetSearchData['Type'], Validators.required],
      Origin: [this.GetSearchData['Origin'], Validators.required],
      OriginCode: [this.GetSearchData['OriginCode']],
      OriginCountry: [this.GetSearchData['OriginCountry']],
      Destination: [this.GetSearchData['Destination'], Validators.required],
      DestinationCode: [this.GetSearchData['DestinationCode']],
      DestinationCountry: [this.GetSearchData['DestinationCountry']],
      DepartDate: [this.GetSearchData['DepartDate'], Validators.required],
      ReturnDate: [this.GetSearchData['ReturnDate']],
      Class: [this.GetSearchData['Class'], Validators.required],
      Nonstop: [this.GetSearchData['Nonstop']],
      SeriesFare: [this.GetSearchData['SeriesFare']],
      Adult: [this.GetSearchData['Adult']],
      Child: [this.GetSearchData['Child']],
      Infant: [this.GetSearchData['Infant']],
      Isdomestic: [this.GetSearchData['Isdomestic']],
      PreferredAirline: [this.GetSearchData['PreferredAirline']],
      ResultFareType:[this.GetSearchData['ResultFareType']],
      MultiCity:this.fb.array([]),
    }, {
      validators: [Validation.NotMatch('Origin', 'Destination')]
    });

    this.adultcount=this.GetSearchData['Adult'];
    this.childcount=this.GetSearchData['Child'];
    this.infantcount=this.GetSearchData['Infant'];

    let childtxt=''; let infanttxt='';
    if(this.GetSearchData['Child']!=0)
    {
      childtxt=this.GetSearchData['Child'] + ' Children ';
    }
    if(this.GetSearchData['Infant']!=0)
    {
      infanttxt=this.GetSearchData['Infant'] + ' Infants';
    }

    this.striptravellertxt=this.adultcount + ' Adults '+ childtxt + infanttxt +' | ' + this.ModifySearchForm.value.Class
    this.travellertxt =this.ModifySearchForm.value.Adult + this.ModifySearchForm.value.Child +this.ModifySearchForm.value.Infant + ' Passenger | ' + this.ModifySearchForm.value.Class;

    
    if(this.GetSearchData['PreferredAirline'])
    {
      this.GetSearchData['PreferredAirline'].forEach((element:any) => {
          this.preferredairlinelist.forEach((item:any) => {
              if(item['code']==element)
              {
                item['ischecked']=true;
              }
          });
      });
      this.preferredairlinedata=this.GetSearchData['PreferredAirline'];
    }
  

    if(this.GetSearchData['Type']!='M')
    {
      this.AddCity();
      this.AddCity();
    } else {

        for (let i = 0; i < this.GetSearchData['MultiCity'].length; i++) {

          const cityForm = this.fb.group({
            Origin: [this.GetSearchData['MultiCity'][i]['Origin'], Validators.required],
            OriginCode: [this.GetSearchData['MultiCity'][i]['OriginCode']],
            OriginCountry: [this.GetSearchData['MultiCity'][i]['OriginCountry']],
            Destination: [this.GetSearchData['MultiCity'][i]['Destination'], Validators.required],
            DestinationCode: [this.GetSearchData['MultiCity'][i]['DestinationCode']],
            DestinationCountry: [this.GetSearchData['MultiCity'][i]['DestinationCountry']],
            DepartDate: [this.GetSearchData['MultiCity'][i]['DepartDate'], Validators.required],
                },{
                  validators: [Validation.NotMatch('Origin', 'Destination')]
                });
          this.multicity.push(cityForm);
        }
        
  
    }
    this.gettype(this.GetSearchData['Type']);
   
   }

   ngOnInit(): void {
    this.flightautocomplete();
     
    this.commonservice.GetWebSiteData().subscribe(data => {
      this.GetWebSiteData =data;
    });
    }


   gettype(type: string) {
    this.ModifySearchForm.patchValue({ Type: type });
    if (type == 'O') {
      this.ModifySearchForm.controls['Origin'].setValidators([Validators.required]);
      this.ModifySearchForm.controls['Origin'].updateValueAndValidity();
      this.ModifySearchForm.controls['Destination'].setValidators([Validators.required]);
      this.ModifySearchForm.controls['Destination'].updateValueAndValidity();
      this.ModifySearchForm.controls['DepartDate'].setValidators([Validators.required]);
      this.ModifySearchForm.controls['DepartDate'].updateValueAndValidity();
      this.ModifySearchForm.controls['ReturnDate'].clearValidators();
      this.ModifySearchForm.controls['ReturnDate'].updateValueAndValidity();

      this.RemoveMultiValidation();
      
    } else if (type == 'R') {
      this.ModifySearchForm.controls['Origin'].setValidators([Validators.required]);
      this.ModifySearchForm.controls['Origin'].updateValueAndValidity();
      this.ModifySearchForm.controls['Destination'].setValidators([Validators.required]);
      this.ModifySearchForm.controls['Destination'].updateValueAndValidity();
      this.ModifySearchForm.controls['DepartDate'].setValidators([Validators.required]);
      this.ModifySearchForm.controls['DepartDate'].updateValueAndValidity();
      this.ModifySearchForm.controls['ReturnDate'].setValidators([Validators.required]);
      this.ModifySearchForm.controls['ReturnDate'].updateValueAndValidity();

      this.RemoveMultiValidation();

    } else {
      this.ModifySearchForm.controls['Origin'].clearValidators();
      this.ModifySearchForm.controls['Origin'].updateValueAndValidity();
      this.ModifySearchForm.controls['Destination'].clearValidators();
      this.ModifySearchForm.controls['Destination'].updateValueAndValidity();
      this.ModifySearchForm.controls['DepartDate'].clearValidators();
      this.ModifySearchForm.controls['DepartDate'].updateValueAndValidity();
      this.ModifySearchForm.controls['ReturnDate'].clearValidators();
      this.ModifySearchForm.controls['ReturnDate'].updateValueAndValidity();

      this.AddMultiValidation();
    }
  }
  get multicity() {
    return this.ModifySearchForm.controls["MultiCity"] as FormArray;
  }

  AddCity()
  {
    const cityForm = this.fb.group({
                              Origin: ['', Validators.required],
                              OriginCode: [''],
                              OriginCountry: [''],
                              Destination: ['', Validators.required],
                              DestinationCode: [''],
                              DestinationCountry: [''],
                              DepartDate: ['', Validators.required],
                        },{
                          validators: [Validation.NotMatch('Origin', 'Destination')]
                        });
    this.multicity.push(cityForm);

    if(this.multicity.length==4)
    {
      $(".tts-addmulti-btn").hide();
    }
    
  }

  AddMultiValidation()
  {
    for (let i = 0; i < this.multicity.length; i++) {
      this.ModifySearchForm.get('MultiCity.'+i+'.Origin')?.setValidators([Validators.required]);
      this.ModifySearchForm.get('MultiCity.'+i+'.Origin')?.updateValueAndValidity();
      this.ModifySearchForm.get('MultiCity.'+i+'.Destination')?.setValidators([Validators.required]);
      this.ModifySearchForm.get('MultiCity.'+i+'.Destination')?.updateValueAndValidity();
      this.ModifySearchForm.get('MultiCity.'+i+'.DepartDate')?.setValidators([Validators.required]);
      this.ModifySearchForm.get('MultiCity.'+i+'.DepartDate')?.updateValueAndValidity();
    } 
  }

  RemoveMultiValidation()
  {
    for (let i = 0; i < this.multicity.length; i++) {
      this.ModifySearchForm.get('MultiCity.'+i+'.Origin')?.clearValidators();
      this.ModifySearchForm.get('MultiCity.'+i+'.Origin')?.updateValueAndValidity();
      this.ModifySearchForm.get('MultiCity.'+i+'.Destination')?.clearValidators();
      this.ModifySearchForm.get('MultiCity.'+i+'.Destination')?.updateValueAndValidity();
      this.ModifySearchForm.get('MultiCity.'+i+'.DepartDate')?.clearValidators();
      this.ModifySearchForm.get('MultiCity.'+i+'.DepartDate')?.updateValueAndValidity();
    } 
  }

  RemoveCity(Index: number) {
    this.multicity.removeAt(Index);

    if(this.multicity.length < 4)
    {
      $(".tts-addmulti-btn").show();
    }
  }

  swapecity() {
    let Origin = this.ModifySearchForm.value.Origin;
    let OriginCode= this.ModifySearchForm.value.OriginCode;
    let OriginCountry=this.ModifySearchForm.value.OriginCountry;
    let Destination = this.ModifySearchForm.value.Destination;
    let DestinationCode=this.ModifySearchForm.value.DestinationCode;
    let DestinationCountry=this.ModifySearchForm.value.DestinationCountry;

    this.ModifySearchForm.patchValue({ Origin: Destination, OriginCode:DestinationCode, OriginCountry:DestinationCountry, Destination: Origin, DestinationCode: OriginCode, DestinationCountry:OriginCountry});
  }

  openautocomplete(event:any,type:any)
  {
    $(event.target).autocomplete( "search", "" );
  }

  Cleardata(field:any,key:any=null)
  {
    if(key!=null)
    {   
      if(field=='Origin')
      {
        this.ModifySearchForm.get('MultiCity.'+key+'')?.patchValue({ Origin:'',OriginCode:'',OriginCountry:''});
        $('#multi-f-origin-'+key+'').val('');
      }
      if(field=='Destination')
      {
        this.ModifySearchForm.get('MultiCity.'+key+'')?.patchValue({ Destination:'',DestinationCode:'',DestinationCountry:''});
        $('#multi-f-destination-'+key+'').val('');

        let newkey=key+1;
        this.ModifySearchForm.get('MultiCity.'+newkey+'')?.patchValue({ Origin:'',OriginCode:'',OriginCountry:''});
        $('#multi-f-origin-'+newkey+'').val('');  
      }

    } else {
      if(field=='Origin')
      {
        this.ModifySearchForm.patchValue({ Origin:'',OriginCode:'',OriginCountry:''});
      }
      if(field=='Destination')
      {
        this.ModifySearchForm.patchValue({ Destination:'',DestinationCode:'',DestinationCountry:''});
      }
    }
  }
  

  flightautocomplete() {
    var _this = this;
    $(document).on('focus','.autosuggeest',() => {
      $(".autosuggeest").autocomplete({
        minLength: 0,
        maxResults: 15,
        source: function (request:any, response:any) {
          let url = tts_config.APIURL + '/flight/airports';
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
        open: function (inst:any) {
          $(".ui-autocomplete").addClass('ttsautocomplet');
          $(this).autocomplete('widget').css('z-index', 9999);
          return false;
  
        },
        select: function (event:any, ui:any) {
          var type = $(this).attr('tp');
         if (typeof type === "undefined") {
            var fieldname = $(this).attr('formControlName');
            if(fieldname=="Origin")
            {
                _this.ModifySearchForm.patchValue({Origin:ui.item.label,OriginCode:ui.item.airport_code,OriginCountry:ui.item.country_code});
            } else if(fieldname=="Destination")
            {
              _this.ModifySearchForm.patchValue({Destination:ui.item.label,DestinationCode:ui.item.airport_code,DestinationCountry:ui.item.country_code});
            }
            var inputs = $(this).closest('#flight-form').find(':input');
            inputs.eq(inputs.index(this) + 1).focus().click();
         } else {

          setTimeout(() => {
                var datakey=$(event.target).attr('key');
                var fieldname=$(event.target).attr('tp');
                if(fieldname=='Origin')
                {
                  _this.ModifySearchForm.get('MultiCity.'+datakey+'')?.patchValue({'Origin':ui.item.label,'OriginCode':ui.item.airport_code,'OriginCountry':ui.item.country_code});

                } else if(fieldname=="Destination")
                {
                  _this.ModifySearchForm.get('MultiCity.'+datakey+'')?.patchValue({'Destination':ui.item.label,'DestinationCode':ui.item.airport_code,'DestinationCountry':ui.item.country_code});

                  var newkey=parseInt(datakey)+1;
                  if(_this.ModifySearchForm.controls["MultiCity"].value[newkey])
                  {
                    _this.ModifySearchForm.get('MultiCity.'+newkey+'')?.patchValue({'Origin':ui.item.label,'OriginCode':ui.item.airport_code,'OriginCountry':ui.item.country_code});

                    $("#multi-f-origin-"+newkey).val(ui.item.label);
                  }
                 
                }
             }, 10);

             var inputs = $(this).closest('#flight-form').find(':input');
             inputs.eq(inputs.index(this) + 1).focus().click();
         }
    
        },
        change: function (event:any, ui:any) {
          $(this).val(ui.item ? ui.item.label : '');
        },
        create: function () {
          $(this).data('ui-autocomplete')._renderItem = function (ul:any, item:any) {
            var label = item.label;
            var airportname = item.airport_name;
            return $("<li>")
              .data("ui-autocomplete-item", item)
              .append(
                "<div>"
                + "<div class='tts-autosuggest-li'>"
                + "<div class='location-dot'>"
                + "<i class='fa-solid fa-location-dot'></i>"
                + "</div>"
                + "<b class='label'>"
                + label
                + "</b>"
                + "<p class='airport m-0'>"
                + airportname
                + "</p>"
                + "</div>"
                + "</div>").appendTo(ul);
          };
        }
      });
    });
    }
    
    get f() { return this.ModifySearchForm.controls; }
   
    ModifySearchData() {
     this.submitted = true;
     if (this.ModifySearchForm.invalid) {
       return;
     }
       
     this.Flightloading=true;
     if(this.ModifySearchForm.get('Type')?.value!='M')
     {
        if(this.f['OriginCountry'].value=="IN" && this.f['DestinationCountry'].value=="IN")
        {
          this.ModifySearchForm.patchValue({Isdomestic:'true'});
        } else {
          this.ModifySearchForm.patchValue({Isdomestic:'false'});
        }
     } else{
        let isdomestic:any=[];
        for (let i = 0; i < this.multicity.length; i++) {
          if(this.ModifySearchForm.get('MultiCity.'+i+'.OriginCountry')?.value && this.ModifySearchForm.get('MultiCity.'+i+'.DestinationCountry')?.value)
          {
              if(this.ModifySearchForm.get('MultiCity.'+i+'.OriginCountry')?.value=="IN" && this.ModifySearchForm.get('MultiCity.'+i+'.DestinationCountry')?.value=="IN")
              {
                isdomestic.push('true');
              } else {
                isdomestic.push('false');
              }
          }
        }
        if(isdomestic.includes('false'))
        {
          this.ModifySearchForm.patchValue({Isdomestic:'false'});
        } else {
          this.ModifySearchForm.patchValue({Isdomestic:'true'});
        }
     }

     this.ModifySearchForm.patchValue({'PreferredAirline':this.preferredairlinedata});


     sessionStorage.setItem('FlightSearch',JSON.stringify(this.ModifySearchForm.value));
     this.Flightloading=false;
      /* --- Start Recent Search ---- */
      let isvaluesame:any=[];
      if (localStorage.getItem('FlightRecentSearch')) {
        let FlightRecentSearch:any=localStorage.getItem('FlightRecentSearch');
        let val= JSON.parse(FlightRecentSearch);
        if(val)
         {
           if(val.length<3)
           {
             val.forEach((element: any) => {
               isvaluesame.push(this.JsonCompare(element,this.ModifySearchForm.value));
             });
             if (Object.values(isvaluesame).indexOf(true) > -1) {
             } else {
               val.push(this.ModifySearchForm.value);
               localStorage.setItem('FlightRecentSearch',JSON.stringify(val));
             }
 
           } else {
             val.unshift(this.ModifySearchForm.value);
             val.pop();
             localStorage.setItem('FlightRecentSearch',JSON.stringify(val));
           }
         }
      } else {
       this.flightrecent.push(this.ModifySearchForm.value);
       localStorage.setItem('FlightRecentSearch',JSON.stringify(this.flightrecent));
      }
      
      
     /* --- End Recent Search ---- */
 
     let data=[]; let searchstring:any;
     data=this.ModifySearchForm.value;
     if(this.ModifySearchForm.value.Type!='M') {
      searchstring={
                        'from':data['OriginCode'],
                        'to':data['DestinationCode'],
                        'dep':data['DepartDate'].replaceAll(' ', '-'),
                        'ADT':data['Adult'],
                        'CHD':data['Child'],
                        'INF':data['Infant'],
                        'Isdomestic':data['Isdomestic'],
                        'Class':data['Class'],
                        'tripType':data['Type'],
                        "ailines":data['PreferredAirline'],
                        'faretype':data['ResultFareType'],
                        'stop':data['Nonstop']

                      };
      } else {
         searchstring={
                          'from':data['MultiCity'][0]['OriginCode'],
                          'to':data['MultiCity'][data['MultiCity'].length-1]['DestinationCode'],
                          'dep':data['MultiCity'][0]['DepartDate'].replaceAll(' ', '-'),
                          'ADT':data['Adult'],
                          'CHD':data['Child'],
                          'INF':data['Infant'],
                          'Isdomestic':data['Isdomestic'],
                          'Class':data['Class'],
                          'tripType':data['Type'],
                          "ailines":data['PreferredAirline'],
                          'faretype':data['ResultFareType'],
                          'stop':data['Nonstop']
                        };
      }
      if(this.ModifySearchForm.value.Type=='R') {
        Object.assign(searchstring, {ret:data['ReturnDate'].replaceAll(' ', '-')});
      }
 
        const navigationExtras: NavigationExtras = {
       queryParams:searchstring
     };
     if(this.f['Isdomestic'].value=="true" && this.f['Type'].value=="R") {
       this.router.navigate(['flight/rtsearch'], navigationExtras);
     } else {
       this.router.navigate(['flight/search'], navigationExtras);
     }

   }
    
  arrayOne(n: number): any[] {
    return Array(n);
  }

   JsonCompare(obj1:any, obj2:any)
   {
     var keys1 = Object.keys(obj1);
     var keys2 = Object.keys(obj2);
     return keys1.length === keys2.length && Object.keys(obj1).every(key=>obj1[key]==obj2[key]);
   }

   TravellerCount() {
    this.ModifySearchForm.patchValue({ Adult: this.adultcount, Child: this.childcount, Infant: this.infantcount });
    let paxcount  =this.ModifySearchForm.value.Adult + this.ModifySearchForm.value.Child +this.ModifySearchForm.value.Infant;
    if(paxcount>1)
    {
     this.travellertxt=paxcount + ' Passengers | ' + this.ModifySearchForm.value.Class
    } else {
     this.travellertxt=paxcount + ' Passenger | ' + this.ModifySearchForm.value.Class
    }
    this.totalpaxcount=paxcount;
    if(paxcount>9)
    {
      this.paxcountstop=true;
       $(".paxcount_message").addClass("shake").html("Upto 9 passengers allowed");
       setTimeout(() => {
         $(".paxcount_message").removeClass("shake");
       }, 600);
    } else {
     this.paxcountstop=false;
     $(".paxcount_message").removeClass("shake").html("");
    }
    if (this.infantcount <= this.adultcount) {
    } else {
      $(".paxcount_message").addClass("shake").html("Number of Infants can not exceed number of Adults");
      this.paxcountstop=true;
    }
   }

   PaxDisplay() {
    $(".paxcount_message").removeClass("shake").html("");
    let paxcount  =this.ModifySearchForm.value.Adult + this.ModifySearchForm.value.Child +this.ModifySearchForm.value.Infant;
    if(paxcount>9)
    {
      this.TravellerCount();
    } else if(this.ModifySearchForm.value.Adult < this.ModifySearchForm.value.Infant) {
      $(".paxcount_message").addClass("shake").html("Number of Infants can not exceed number of Adults");
      this.paxcountstop=true;
    } else {
      this.isShow = !this.isShow;
    }
  }

  SelectPax(nopax:any,type:any)
  {
      if(type=='ADT')
      { 
        this.adultcount=nopax;
      }
      if(type=='CHD')
      {
        this.childcount=nopax;
      }
      if(type=='INF')
      {
        this.infantcount=nopax;
      }
      this.TravellerCount();
  }
  MClass(value:any)
  {
    this.ModifySearchForm.patchValue({'Class':value});
  }

   modifysearch()
   {
      this.isModifyShow=!this.isModifyShow;
   }

   GetPreferredAirline(e: any)
  {
    if (e.target.checked) {
        this.preferredairlinedata.push(e.target.value);
    } else {
      let index = this.preferredairlinedata.indexOf(e.target.value);
      if (index > -1) {
        this.preferredairlinedata.splice(index, 1);
      }
    }
  }

  dateEventEmitter(dateobj:any)
  {
    if(dateobj.calType=='O')
    {
      this.ModifySearchForm.patchValue({DepartDate:dateobj.Date});
      this.ModifySearchForm.patchValue({ReturnDate:dateobj.Date});
    }
    if(dateobj.calType=='R')
    {
      this.ModifySearchForm.patchValue({ReturnDate:dateobj.Date});
    }
    if(dateobj.calType=='M')
    {
     
      let datakey=parseInt(dateobj.key);
      this.ModifySearchForm.get('MultiCity.'+datakey+'')?.patchValue({'DepartDate':dateobj.Date})
    }
  }



}
