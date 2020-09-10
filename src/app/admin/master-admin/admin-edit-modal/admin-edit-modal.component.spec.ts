import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminEditModalComponent } from './admin-edit-modal.component';

describe('AdminEditModalComponent', () => {
  let component: AdminEditModalComponent;
  let fixture: ComponentFixture<AdminEditModalComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AdminEditModalComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AdminEditModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
