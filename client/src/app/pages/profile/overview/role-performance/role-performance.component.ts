import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'ow-role-performance',
  templateUrl: 'role-performance.component.html',
  styleUrls: ['role-performance.component.scss']
})

export class RolePerformanceComponent implements OnInit {

  rolesData = [
    {
      name: 'offense'
    },
    {
      name: 'defense'
    },
    {
      name: 'support'
    },
    {
      name: 'tank'
    }
  ];

  constructor() {}

  ngOnInit() {}

}