import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PaymentPassbookComponent } from './payment-passbook.component';

describe('PaymentPassbookComponent', () => {
  let component: PaymentPassbookComponent;
  let fixture: ComponentFixture<PaymentPassbookComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PaymentPassbookComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PaymentPassbookComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
