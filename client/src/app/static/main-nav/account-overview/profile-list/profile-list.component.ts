import { Component, OnInit, Input } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { GamerTagService } from '../../../../services';
import { Player } from '../../../../models';
import { values, isEmpty } from 'ramda';

@Component({
  selector: 'ow-profile-list',
  templateUrl: 'profile-list.component.html',
  styleUrls: ['profile-list.component.scss']
})

export class ProfileListComponent implements OnInit {
  @Input() battleNetTag: string;

  players: Observable<Player[]>;

  constructor(private gamerTagService: GamerTagService) {}

  ngOnInit() {
    this.players = this.gamerTagService.find(this.battleNetTag)
      .filter((players: Player[]) => !isEmpty(players));
    this.players.subscribe();
  }

}
