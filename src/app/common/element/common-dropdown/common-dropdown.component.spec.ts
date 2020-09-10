import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CommonDropdownComponent } from './common-dropdown.component';

describe('CommonDropdownComponent', () => {
  let component: CommonDropdownComponent;
  let fixture: ComponentFixture<CommonDropdownComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CommonDropdownComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CommonDropdownComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
