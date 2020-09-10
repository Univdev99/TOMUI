/* tslint:disable:no-unused-variable */

import { TestBed, async, inject } from '@angular/core/testing';
import { BackEndService } from './back-end.service';

describe('Service: BackEnd', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [BackEndService]
    });
  });

  it('should ...', inject([BackEndService], (service: BackEndService) => {
    expect(service).toBeTruthy();
  }));
});
