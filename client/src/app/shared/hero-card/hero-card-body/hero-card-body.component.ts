import { Component } from '@angular/core';

@Component({
  selector: 'ow-hero-card-body',
  templateUrl: 'hero-card-body.component.html',
  styleUrls: [ 'hero-card-body.component.scss' ]
})

export class HeroCardBodyComponent {

  stats = [
    {
      name: 'Kills',
      value: '0.25/min'
    },
    {
      name: 'Assists',
      value: '0.25/min'
    },
    {
      name: 'Deaths',
      value: '0.25/min'
    },
    {
      name: 'K/D Ratio',
      value: '0.25/min'
    },
    {
      name: 'Accuracy',
      value: '0.25/min'
    },
    {
      name: 'Hero Damage',
      value: '0.25/min'
    },
    {
      name: 'Blocked',
      value: '0.25/min'
    },
    {
      name: 'Healing',
      value: '0.25/min'
    },
    {
      name: 'Crits',
      value: '0.25/min'
    },
    {
      name: 'Obj. Kills',
      value: '0.25/min'
    },
    {
      name: 'Obj. Time',
      value: '0.25/min'
    },
    {
      name: 'Ult Hold Time',
      value: '0.25/mpg'
    },
    {
      name: 'Ults Per Game',
      value: '0.25/min'
    }
  ];

  constructor() {}

}
