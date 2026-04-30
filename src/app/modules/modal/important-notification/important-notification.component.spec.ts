import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ImportantNotificationComponent } from './important-notification.component';

describe('ImportantNotificationComponent', () => {
  let component: ImportantNotificationComponent;
  let fixture: ComponentFixture<ImportantNotificationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ImportantNotificationComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ImportantNotificationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
