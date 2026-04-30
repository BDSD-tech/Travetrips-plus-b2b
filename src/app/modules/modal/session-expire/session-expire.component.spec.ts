import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SessionExpireComponent } from './session-expire.component';

describe('SessionExpireComponent', () => {
  let component: SessionExpireComponent;
  let fixture: ComponentFixture<SessionExpireComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SessionExpireComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SessionExpireComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
