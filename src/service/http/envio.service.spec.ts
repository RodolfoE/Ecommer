import { TestBed, inject } from '@angular/core/testing';

import { EnvioService } from './envio.service';

describe('EnvioService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [EnvioService]
    });
  });

  it('should be created', inject([EnvioService], (service: EnvioService) => {
    expect(service).toBeTruthy();
  }));
});
