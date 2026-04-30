import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ManageAmendmentsComponent } from './manage-amendments.component';

describe('ManageAmendmentsComponent', () => {
  let component: ManageAmendmentsComponent;
  let fixture: ComponentFixture<ManageAmendmentsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ManageAmendmentsComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ManageAmendmentsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
