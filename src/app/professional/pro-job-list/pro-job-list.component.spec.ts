import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ProJobListComponent } from './pro-job-list.component';

describe('ProJobListComponent', () => {
  let component: ProJobListComponent;
  let fixture: ComponentFixture<ProJobListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ProJobListComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ProJobListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
