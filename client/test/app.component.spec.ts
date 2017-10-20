import { TestBed } from '@angular/core/testing';
import { provideRoutes } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';

import { ApiService } from '../src/app/shared';
import { AppComponent } from '../src/app/app.component';
const assert = require('assert');

describe('App', function() {
  // provide our implementations or mocks to the dependency injector
  beforeEach(function() {
    TestBed.configureTestingModule({
      imports: [RouterTestingModule],
      declarations: [AppComponent],
      providers: [ApiService, provideRoutes([])]
    });
  });

  it('should have an url', function() {
    let fixture = TestBed.createComponent(AppComponent);
    fixture.detectChanges();
    assert.equal(fixture.debugElement.componentInstance.url, 'https://github.com/preboot/angular2-webpack');
  });
});
