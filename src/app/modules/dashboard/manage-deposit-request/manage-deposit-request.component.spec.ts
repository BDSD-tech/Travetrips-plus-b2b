import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ManageDepositRequestComponent } from './manage-deposit-request.component';

describe('ManageDepositRequestComponent', () => {
  let component: ManageDepositRequestComponent;
  let fixture: ComponentFixture<ManageDepositRequestComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ManageDepositRequestComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ManageDepositRequestComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
