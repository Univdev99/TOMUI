import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FirmProfileListComponent } from './firm-profile-list.component';

describe('FirmProfileListComponent', () => {
  let component: FirmProfileListComponent;
  let fixture: ComponentFixture<FirmProfileListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FirmProfileListComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FirmProfileListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
