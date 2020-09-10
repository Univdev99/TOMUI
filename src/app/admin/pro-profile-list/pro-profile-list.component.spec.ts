import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ProProfileListComponent } from './pro-profile-list.component';

describe('ProProfileListComponent', () => {
  let component: ProProfileListComponent;
  let fixture: ComponentFixture<ProProfileListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ProProfileListComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ProProfileListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
