import { Component, OnInit, Input, OnChanges, ChangeDetectorRef } from '@angular/core';

@Component({
  selector: 'ow-chart',
  templateUrl: 'chart.component.html',
  styleUrls: ['chart.component.scss']
})

export class ChartComponent implements OnInit, OnChanges {
  @Input() datasets:  any[];
  @Input() labels: string[];
  @Input() chartType: string;
  @Input() legend: boolean;

  // Common Chart Configuration
  options: any;

  rerender = false;

  constructor(private cdRef: ChangeDetectorRef) {}

  public ngOnInit() {
    this.options = {
      responsive: true, // Resizes the chart canvas when its container does.
      responsiveAnimationDuration: 250, // Duration in milliseconds it takes to animate to new size after a resize event.
      maintainAspectRatio: false, // Maintain the original canvas aspect ratio (width / height) when resizing
      scaleBeginAtZero: false,
      legend: {position: 'right'}
    };
  }

  ngOnChanges() {
    this.rerender = true;
    this.cdRef.detectChanges();
    this.rerender = false;
  }

}
