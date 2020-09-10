import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ProJobHistoryComponent } from './pro-job-history.component';

describe('ProJobHistoryComponent', () => {
  let component: ProJobHistoryComponent;
  let fixture: ComponentFixture<ProJobHistoryComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ProJobHistoryComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ProJobHistoryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
