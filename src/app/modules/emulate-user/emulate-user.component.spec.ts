import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EmulateUserComponent } from './emulate-user.component';

describe('EmulateUserComponent', () => {
  let component: EmulateUserComponent;
  let fixture: ComponentFixture<EmulateUserComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EmulateUserComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EmulateUserComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
