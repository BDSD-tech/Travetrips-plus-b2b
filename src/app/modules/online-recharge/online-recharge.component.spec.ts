import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OnlineRechargeComponent } from './online-recharge.component';

describe('OnlineRechargeComponent', () => {
  let component: OnlineRechargeComponent;
  let fixture: ComponentFixture<OnlineRechargeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ OnlineRechargeComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(OnlineRechargeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
