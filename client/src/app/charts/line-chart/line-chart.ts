import { Component, OnInit, Input, ViewEncapsulation } from '@angular/core';
import { Observable } from 'rxjs/Observable';

@Component({
  selector: 'ow-line-chart',
  templateUrl: 'line-chart.html',
  styleUrls: ['line-chart.scss'],
  encapsulation: ViewEncapsulation.None
})

export class LineChartComponent implements OnInit {
  @Input() data: Observable<any>;
  showXAxis = true;
  showYAxis = true;
  gradient = false;
  autoScale = true;

  ngOnInit() {
  }
}
