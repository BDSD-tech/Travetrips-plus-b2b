import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CreditNotesHotelComponent } from './credit-notes-hotel.component';

describe('CreditNotesHotelComponent', () => {
  let component: CreditNotesHotelComponent;
  let fixture: ComponentFixture<CreditNotesHotelComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CreditNotesHotelComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(CreditNotesHotelComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
