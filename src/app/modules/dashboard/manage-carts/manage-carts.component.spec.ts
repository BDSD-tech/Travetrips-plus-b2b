import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ManageCartsComponent } from './manage-carts.component';

describe('ManageCartsComponent', () => {
  let component: ManageCartsComponent;
  let fixture: ComponentFixture<ManageCartsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ManageCartsComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ManageCartsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
