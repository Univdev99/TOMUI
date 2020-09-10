import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MasterAdminDashboardComponent } from './master-admin-dashboard.component';

describe('MasterAdminDashboardComponent', () => {
  let component: MasterAdminDashboardComponent;
  let fixture: ComponentFixture<MasterAdminDashboardComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MasterAdminDashboardComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MasterAdminDashboardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
