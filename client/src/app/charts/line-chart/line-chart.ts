import { Component, OnInit, Input, ViewEncapsulation } from '@angular/core';

@Component({
  selector: 'ow-line-chart',
  templateUrl: 'line-chart.html',
  styleUrls: ['line-chart.scss'],
  encapsulation: ViewEncapsulation.None
})

export class LineChartComponent implements OnInit {
  @Input() data: any;
  showXAxis = true;
  showYAxis = true;
  gradient = false;
  autoScale = true;

  ngOnInit() {}
}
