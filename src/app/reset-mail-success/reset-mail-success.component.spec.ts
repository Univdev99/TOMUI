import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ResetMailSuccessComponent } from './reset-mail-success.component';

describe('ResetMailSuccessComponent', () => {
  let component: ResetMailSuccessComponent;
  let fixture: ComponentFixture<ResetMailSuccessComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ResetMailSuccessComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ResetMailSuccessComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
