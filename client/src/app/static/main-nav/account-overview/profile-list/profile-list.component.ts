import { Component, OnInit, Input } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { GamerTagService } from '../../../../services';
import { Player } from '../../../../models';

@Component({
  selector: 'ow-profile-list',
  templateUrl: 'profile-list.component.html',
  styleUrls: ['profile-list.component.scss']
})

export class ProfileListComponent implements OnInit {
  @Input() battleNetTag: string;

  players$: Observable<Player[]>;

  constructor(private gamerTagService: GamerTagService) {}

  ngOnInit() {
    // battleNetTag can be null if they did not register through
    // battle.net and/or have not claimed their account.
    const tag = this.battleNetTag;
    if (tag) { this.players$ = this.gamerTagService.find(tag); }
  }

}
