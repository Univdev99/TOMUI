import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ProSearchResultComponent } from './pro-search-result.component';

describe('ProSearchResultComponent', () => {
  let component: ProSearchResultComponent;
  let fixture: ComponentFixture<ProSearchResultComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ProSearchResultComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ProSearchResultComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
