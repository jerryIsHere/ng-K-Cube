import { TestBed } from '@angular/core/testing';

import { ApiAgentService } from './api-agent.service';

describe('ApiAgentService', () => {
  let service: ApiAgentService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ApiAgentService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
