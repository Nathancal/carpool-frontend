import { TestBed } from '@angular/core/testing';

import { DynamiccomponentService } from './dynamiccomponent.service';

describe('DynamiccomponentService', () => {
  let service: DynamiccomponentService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(DynamiccomponentService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
