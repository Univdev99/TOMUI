import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ProProfileCompleteComponent } from './pro-profile-complete.component';

describe('ProProfileCompleteComponent', () => {
  let component: ProProfileCompleteComponent;
  let fixture: ComponentFixture<ProProfileCompleteComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ProProfileCompleteComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ProProfileCompleteComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
