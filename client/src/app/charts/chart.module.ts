import { NgModule, ModuleWithProviders } from '@angular/core';
import { NgxChartsModule } from '@swimlane/ngx-charts';

import { LineChartComponent } from './index';

@NgModule({
  imports: [NgxChartsModule],
  declarations: [
    LineChartComponent
  ],
  exports: [
    LineChartComponent
  ],
})
export class ChartsModule {
  static forRoot(): ModuleWithProviders {
    return {
      ngModule: ChartsModule
    };
  }
}
