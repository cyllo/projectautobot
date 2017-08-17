import { Component, OnInit, ViewChild, ElementRef, Input } from '@angular/core';
import { mergeAll } from 'ramda';

@Component({
  selector: 'ow-chart',
  templateUrl: 'chart.component.html',
  styleUrls: ['chart.component.scss']
})

export class ChartComponent implements OnInit {
  @ViewChild('owChart') owChart: ElementRef;
  @Input() datasets:  any[];
  @Input() labels: string[];
  @Input() chartType: string;
  @Input() legend: boolean;

  // Common Chart Configuration
  options: any;

  constructor() {}

  public ngOnInit() {
    this.options = mergeAll([this.createBaseChartStyleOptions(), this.createChartTypeSpecificOptions(this.chartType)]);
  }

  chartClicked(event: any): void {
      console.log('chartClicked()', event);
  }

  chartHovered(event: any): void {
      console.log('chartHovered()', event);
  }

  createBaseChartStyleOptions(): any {
    return {
      responsive: true, // Resizes the chart canvas when its container does.
      responsiveAnimationDuration: 250, // Duration in milliseconds it takes to animate to new size after a resize event.
      maintainAspectRatio: true, // Maintain the original canvas aspect ratio (width / height) when resizing
      scaleBeginAtZero: true
    };
  }

  createChartTypeSpecificOptions(chartType: string): any {
    switch (chartType) {
      case ('line'):
        return this.createLineChartStyleOptions();
      default:
        // do nothing
    }
  }

  createLineChartStyleOptions(): any {
    return {
      scales:
      {
        yAxes: [
          {
            display: true,
            gridLines:
            {
              display: true,
              drawTicks: true
            },
            ticks: {
              fontFamily: 'Arial',
              fontSize: '11',
              fontWeight: 'lighter',
              fontStyle: 'normal'
            }
          }
        ],
        xAxes: [
          {
            display: true,
            gridLines:
            {
              display: true,
              drawTicks: true
            },
            ticks:
            {
              fontFamily: 'Arial',
              fontSize: '11',
              fontWeight: 'lighter',
              fontStyle: 'normal'
            }
          }
        ]
      }
    };
  }

}
