import { NgModule, ModuleWithProviders } from '@angular/core';
import { NgxChartsModule } from '@swimlane/ngx-charts';

import { LineChartComponent, GroupedBarChartComponent } from './index';

@NgModule({
  imports: [NgxChartsModule],
  declarations: [
    LineChartComponent,
    GroupedBarChartComponent
  ],
  exports: [
    LineChartComponent,
    GroupedBarChartComponent
  ]
})
export class ChartsModule {
  static forRoot(): ModuleWithProviders {
    return {
      ngModule: ChartsModule
    };
  }
}
