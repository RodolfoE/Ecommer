import { TestBed, inject } from '@angular/core/testing';

import { FormatarstringService } from './formatarstring.service';

describe('FormatarstringService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [FormatarstringService]
    });
  });

  it('should be created', inject([FormatarstringService], (service: FormatarstringService) => {
    expect(service).toBeTruthy();
  }));
});
