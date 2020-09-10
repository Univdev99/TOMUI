import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ConnectWithProComponent } from './connect-with-pro.component';

describe('ConnectWithProComponent', () => {
  let component: ConnectWithProComponent;
  let fixture: ComponentFixture<ConnectWithProComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ConnectWithProComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ConnectWithProComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
