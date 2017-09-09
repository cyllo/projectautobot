import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'ow-role-performance',
  templateUrl: 'role-performance.component.html',
  styleUrls: ['role-performance.component.scss']
})

export class RolePerformanceComponent implements OnInit {
  @Input() heroStatsByRole: any;

  constructor() {}

  ngOnInit() {}

}
