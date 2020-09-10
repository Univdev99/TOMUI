import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ProMenuComponent } from './pro-menu.component';

describe('ProMenuComponent', () => {
  let component: ProMenuComponent;
  let fixture: ComponentFixture<ProMenuComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ProMenuComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ProMenuComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
