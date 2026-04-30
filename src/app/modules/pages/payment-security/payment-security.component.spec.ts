import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PaymentSecurityComponent } from './payment-security.component';

describe('PaymentSecurityComponent', () => {
  let component: PaymentSecurityComponent;
  let fixture: ComponentFixture<PaymentSecurityComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PaymentSecurityComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PaymentSecurityComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
