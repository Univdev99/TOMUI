/* tslint:disable:no-unused-variable */

import { TestBed, async, inject } from '@angular/core/testing';
import { IsAlreadyLoggedInService } from './is-already-logged-in.service';

describe('Service: IsAlreadyLoggedIn', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [IsAlreadyLoggedInService]
    });
  });

  it('should ...', inject([IsAlreadyLoggedInService], (service: IsAlreadyLoggedInService) => {
    expect(service).toBeTruthy();
  }));
});
