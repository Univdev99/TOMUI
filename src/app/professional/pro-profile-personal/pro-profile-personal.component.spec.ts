import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ProProfilePersonalComponent } from './pro-profile-personal.component';

describe('ProProfilePersonalComponent', () => {
  let component: ProProfilePersonalComponent;
  let fixture: ComponentFixture<ProProfilePersonalComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ProProfilePersonalComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ProProfilePersonalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
