import { ModuleWithProviders, NgModule } from '@angular/core';


import {
  SecondsToHours,
  SecondsToMinutes,
  ParsePercent,
  RatioPipe
} from '../pipes';

const PipeArray = [
  SecondsToHours,
  SecondsToMinutes,
  ParsePercent,
  RatioPipe
];

@NgModule({
  imports: [],
  declarations: PipeArray,
  exports: PipeArray
})
export class PipeModule {
  static forRoot(): ModuleWithProviders {
    return {
      ngModule: PipeModule
    };
  }
}
