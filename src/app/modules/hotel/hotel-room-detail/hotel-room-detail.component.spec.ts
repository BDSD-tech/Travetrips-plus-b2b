import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HotelRoomDetailComponent } from './hotel-room-detail.component';

describe('HotelRoomDetailComponent', () => {
  let component: HotelRoomDetailComponent;
  let fixture: ComponentFixture<HotelRoomDetailComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ HotelRoomDetailComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(HotelRoomDetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
