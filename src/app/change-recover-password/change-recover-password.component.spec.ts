import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ChangeRecoverPasswordComponent } from './change-recover-password.component';

describe('ChangeRecoverPasswordComponent', () => {
  let component: ChangeRecoverPasswordComponent;
  let fixture: ComponentFixture<ChangeRecoverPasswordComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ChangeRecoverPasswordComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ChangeRecoverPasswordComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
