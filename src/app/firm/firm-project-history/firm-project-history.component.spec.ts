import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FirmProjectHistoryComponent } from './firm-project-history.component';

describe('FirmProjectHistoryComponent', () => {
  let component: FirmProjectHistoryComponent;
  let fixture: ComponentFixture<FirmProjectHistoryComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FirmProjectHistoryComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FirmProjectHistoryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
