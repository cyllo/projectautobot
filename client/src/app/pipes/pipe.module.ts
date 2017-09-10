import { ModuleWithProviders, NgModule } from '@angular/core';


import {
  SecondsToHours,
  AverageMatchLength,
  SecondsToMinutes,
  ParsePercent,
  KillDeathAverage,
  OrderByPipe,
  ValuesPipe } from '../pipes';

const PipeArray = [
  SecondsToHours,
  AverageMatchLength,
  SecondsToMinutes,
  ParsePercent,
  KillDeathAverage,
  OrderByPipe,
  ValuesPipe
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
