import { Component, OnInit, ViewChild, ElementRef, Input } from '@angular/core';

@Component({
  selector: 'ow-chart',
  templateUrl: 'chart.component.html',
  styleUrls: ['chart.component.scss']
})

export class ChartComponent implements OnInit {
  @ViewChild('owChart') owChart: ElementRef;
  @Input() owChartTitle: String;
  @Input() owChartDatasets: Array < any > ;
  @Input() owChartXAxisLabels: Array < string > ;
  @Input() owChartType: String;
  @Input() owChartShowLegend: Boolean;

  //  6 types of charts: line, bar, radar, pie, polarArea, doughnut
  public chartType = 'line';

  // X axis labels. It's necessary for charts: line, bar and radar.
  // And just labels (on hover) for charts: polarArea, pie and doughnut
  /*public chartLabels: Array<string> = ['05-19', '05-20', '05-21', '05-22', '05-23', '05-24', '05-25'];*/

  // Set of points of the chart, it should be Array<number[]> only for
  // line, bar and radar, otherwise number[]
  // eg:
  // public chartData: Array<any> = [
  //   {data: [65, 59, 90, 81, 56, 55, 40], label: 'Series A'},
  //   {data: [28, 48, 40, 19, 96, 27, 100], label: 'Series B'}
  // ];
  /*public chartDatasets: Array<any> = [
    { data: [2300, 2818, 1920, 3498, 4200, 4220, 4786], label: 'You' },
    { data: [1300, 1818, 2400, 1992, 3800, 3890, 4200], label: 'Others' }
  ];*/

  // Common Chart Configuration
  public chartOptions: any;

  /*private chartStyles: Array<any> = [
    {
      line: {
        scales: {
          yAxes: [{
            display: true,
            gridLines: {
              display: true,
              drawTicks: true
            },
            ticks: {
              fontFamily: 'Arial',
              fontSize: '11',
              fontWeight: 'lighter',
              fontStyle: 'normal'
            }
          }],
          xAxes: [{
            display: true,
            gridLines: {
              display: true,
              drawTicks: true
            },
            ticks: {
              fontFamily: 'Arial',
              fontSize: '11',
              fontWeight: 'lighter',
              fontStyle: 'normal'
            }
          }]
        }
      }
    }
  ];*/

  constructor() {}

  public ngOnInit() {

    this.chartOptions = {
      responsive: true, // Resizes the chart canvas when its container does.
      responsiveAnimationDuration: 250, // Duration in milliseconds it takes to animate to new size after a resize event.
      maintainAspectRatio: true // Maintain the original canvas aspect ratio (width / height) when resizing
    };

    switch (this.owChartType) {
      case ("line"):
        this.chartOptions = Object.assign({}, this.chartOptions, {
          scales: {
            yAxes: [{
              display: true,
              gridLines: {
                display: true,
                drawTicks: true
              },
              ticks: {
                fontFamily: 'Arial',
                fontSize: '11',
                fontWeight: 'lighter',
                fontStyle: 'normal'
              }
            }],
            xAxes: [{
              display: true,
              gridLines: {
                display: true,
                drawTicks: true
              },
              ticks: {
                fontFamily: 'Arial',
                fontSize: '11',
                fontWeight: 'lighter',
                fontStyle: 'normal'
              }
            }]
          }
        });
      default:
        // do nothing
    }

    console.log(this.chartOptions);

  }

  // events
  public chartClicked(e: any): void {
    console.log(e);
  }
  public chartHovered(e: any): void {
    console.log(e);
  }
}
