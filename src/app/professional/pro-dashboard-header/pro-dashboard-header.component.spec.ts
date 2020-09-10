import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ProDashboardHeaderComponent } from './pro-dashboard-header.component';

describe('ProDashboardHeaderComponent', () => {
  let component: ProDashboardHeaderComponent;
  let fixture: ComponentFixture<ProDashboardHeaderComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ProDashboardHeaderComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ProDashboardHeaderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
