import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ManageCartHotelComponent } from './manage-cart-hotel.component';

describe('ManageCartHotelComponent', () => {
  let component: ManageCartHotelComponent;
  let fixture: ComponentFixture<ManageCartHotelComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ManageCartHotelComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ManageCartHotelComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
