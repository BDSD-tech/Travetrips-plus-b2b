import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BusMarkupComponent } from './bus-markup.component';

describe('BusMarkupComponent', () => {
  let component: BusMarkupComponent;
  let fixture: ComponentFixture<BusMarkupComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BusMarkupComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(BusMarkupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
