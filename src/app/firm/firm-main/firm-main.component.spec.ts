/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import { FirmMainComponent } from './firm-main.component';

describe('FirmMainComponent', () => {
  let component: FirmMainComponent;
  let fixture: ComponentFixture<FirmMainComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FirmMainComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FirmMainComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
