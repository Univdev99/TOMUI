import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ProMainComponent } from './pro-main.component';

describe('ProMainComponent', () => {
  let component: ProMainComponent;
  let fixture: ComponentFixture<ProMainComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ProMainComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ProMainComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
