import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FirmSearchComponent } from './firm-search.component';

describe('FirmSearchComponent', () => {
  let component: FirmSearchComponent;
  let fixture: ComponentFixture<FirmSearchComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FirmSearchComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FirmSearchComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
