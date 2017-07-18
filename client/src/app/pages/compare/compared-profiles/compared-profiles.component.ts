import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'ow-compared-profiles',
  templateUrl: 'compared-profiles.component.html',
  styleUrls: ['compared-profiles.component.scss']
})
export class ComparedProfilesComponent implements OnInit {

  // dummy content
  listOfPlayerTags: any[] =
  [
  'cyllo#2112',
  'iMBlueDaBaDee#1921',
  'Seagull#1894',
  'DabbyDabDabDabs#1108',
  'cyllo#2112',
  'cyllo#2112',
  'iMBlueDaBaDee#1921',
  'Seagull#1894',
  'DabbyDabDabDabs#1108'
];

  constructor() {}

  ngOnInit() {}

}
