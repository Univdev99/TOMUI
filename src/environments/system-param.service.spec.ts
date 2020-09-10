/* tslint:disable:no-unused-variable */

import { TestBed, async, inject } from '@angular/core/testing';
import { SystemParamService } from './system-param.service';

describe('Service: SystemParam', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [SystemParamService]
    });
  });

  it('should ...', inject([SystemParamService], (service: SystemParamService) => {
    expect(service).toBeTruthy();
  }));
});
