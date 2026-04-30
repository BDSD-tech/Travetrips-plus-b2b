import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ManageMarkupComponent } from './manage-markup.component';

describe('ManageMarkupComponent', () => {
  let component: ManageMarkupComponent;
  let fixture: ComponentFixture<ManageMarkupComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ManageMarkupComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ManageMarkupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
