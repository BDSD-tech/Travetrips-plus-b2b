import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ManageAmendmentsHotelComponent } from './manage-amendments-hotel.component';

describe('ManageAmendmentsHotelComponent', () => {
  let component: ManageAmendmentsHotelComponent;
  let fixture: ComponentFixture<ManageAmendmentsHotelComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ManageAmendmentsHotelComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ManageAmendmentsHotelComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
