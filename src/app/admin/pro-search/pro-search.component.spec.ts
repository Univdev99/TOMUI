import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ProSearchComponent } from './pro-search.component';

describe('ProSearchComponent', () => {
  let component: ProSearchComponent;
  let fixture: ComponentFixture<ProSearchComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ProSearchComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ProSearchComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
