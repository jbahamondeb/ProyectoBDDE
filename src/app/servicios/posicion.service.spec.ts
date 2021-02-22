import { TestBed } from '@angular/core/testing';

import { PosicionService } from './posicion.service';

describe('PosicionService', () => {
  let service: PosicionService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(PosicionService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
