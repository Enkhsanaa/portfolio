import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SchedlyComponent } from './schedly.component';

describe('SchedlyComponent', () => {
  let component: SchedlyComponent;
  let fixture: ComponentFixture<SchedlyComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SchedlyComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SchedlyComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
