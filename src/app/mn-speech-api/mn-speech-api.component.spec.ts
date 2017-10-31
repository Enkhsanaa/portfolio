import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MnSpeechApiComponent } from './mn-speech-api.component';

describe('MnSpeechApiComponent', () => {
  let component: MnSpeechApiComponent;
  let fixture: ComponentFixture<MnSpeechApiComponent>;

  beforeEach(
    async(() => {
      TestBed.configureTestingModule({
        declarations: [MnSpeechApiComponent]
      }).compileComponents();
    })
  );

  beforeEach(() => {
    fixture = TestBed.createComponent(MnSpeechApiComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
