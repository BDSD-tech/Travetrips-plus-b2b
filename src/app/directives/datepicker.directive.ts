import { AfterViewInit, Directive, ElementRef, EventEmitter, Input, NgZone, Output } from '@angular/core';

declare var $:any;

@Directive({
  selector: '[appDatepicker]',
  exportAs:'datepicker'
})
export class DatepickerDirective implements AfterViewInit {

  @Output() dateEventEmitter=new EventEmitter();
  @Input('minDate') minDate : any;
  @Input('maxDate') maxDate : any;
  @Input('calType') calType : any;
  @Input('itemkey') key : any;

  constructor(private el:ElementRef,private ngZone:NgZone) {


  }
  ngOnChanges(): void {
    let newdate= new Date(this.minDate);
    $(this.el.nativeElement).datepicker("option", "minDate", newdate);
  }


  ngAfterViewInit(): void {
    this.ngZone.runOutsideAngular(()=>{
      $(this.el.nativeElement).datepicker({
        defaultDate : "",
        dateFormat : "dd M yy",
        minDate : this.minDate,
        maxDate: this.maxDate,
        changeMonth : false,
        numberOfMonths: [1,13],
        beforeShow :(input:any, inst:any) => {
        /*---Start Open in bottom--*/
        var $this = $(this.el.nativeElement);
        var top = $this.offset().top + $this.outerHeight();
        var left = $this.offset().left;
        setTimeout(function() {
          inst.dpDiv.css({
                'top': top-1,
                'left': left,
                'width':'24.1em',
                'overflow-x':'scroll',
                'height':'30em',
                'z-index':'9999'
            });
            $(".ui-datepicker-next").hide();
            $(".ui-datepicker-prev").hide();

            inst.dpDiv.find('.ui-state-active').css({'background':"var(--primary-color)",'color':'#fff'});
        }, 1);
        /*---End Open in bottom--*/
        },
        onUpdateDatepicker:(input:any, inst:any) => {
          $(this.el.nativeElement).css({'width':'24.1em'});
          $(".ui-datepicker-next").hide();
          $(".ui-datepicker-prev").hide();
        },
        onSelect:(date:any,inst:any)=>{
          this.ngZone.run(()=>{
            this.setDate(date);
          });
        },
        onClose:(selectedDate:any, inst:any) =>{
         
        }
      });
    });
  }

  setDate(date:any)
  {
    let obj={
              'Date':date,
              'calType':this.calType,
              'minDate':this.minDate,
              'maxDate':this.maxDate,
              'key':this.key,
            }
    this.dateEventEmitter.emit(obj);
  }

 
}
