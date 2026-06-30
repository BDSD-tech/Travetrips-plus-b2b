import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TravellerDetailsComponent } from './traveller-details.component';

describe('TravellerDetailsComponent', () => {
  let component: TravellerDetailsComponent;
  let fixture: ComponentFixture<TravellerDetailsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TravellerDetailsComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(TravellerDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
