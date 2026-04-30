import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ManageMarkupHotelComponent } from './manage-markup-hotel.component';

describe('ManageMarkupHotelComponent', () => {
  let component: ManageMarkupHotelComponent;
  let fixture: ComponentFixture<ManageMarkupHotelComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ManageMarkupHotelComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ManageMarkupHotelComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
