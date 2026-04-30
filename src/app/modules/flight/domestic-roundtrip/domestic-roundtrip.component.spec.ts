import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DomesticRoundtripComponent } from './domestic-roundtrip.component';

describe('DomesticRoundtripComponent', () => {
  let component: DomesticRoundtripComponent;
  let fixture: ComponentFixture<DomesticRoundtripComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DomesticRoundtripComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DomesticRoundtripComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
