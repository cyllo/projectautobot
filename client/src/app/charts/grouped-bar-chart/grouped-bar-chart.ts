import { Component, OnInit, Input, ViewEncapsulation } from '@angular/core';

@Component({
  selector: 'ow-grouped-bar-chart',
  templateUrl: 'grouped-bar-chart.html',
  styleUrls: ['grouped-bar-chart.scss'],
  encapsulation: ViewEncapsulation.None
})

export class GroupedBarChartComponent implements OnInit {
  @Input() data: any;
  showXAxis = true;
  showYAxis = true;
  gradient = false;
  barPadding = 0;
  groupPadding = 0;

  ngOnInit() {}
}
