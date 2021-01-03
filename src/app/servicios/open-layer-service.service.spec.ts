import { TestBed } from '@angular/core/testing';

import { OpenLayerServiceService } from './open-layer-service.service';

describe('OpenLayerServiceService', () => {
  let service: OpenLayerServiceService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(OpenLayerServiceService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
