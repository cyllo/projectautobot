import { Component, OnInit, Input } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { GamerTagService } from '../../../../services';
import { Player } from '../../../../models';

@Component({
  selector: 'ow-profile-list',
  templateUrl: 'profile-list.component.html',
  styleUrls: ['profile-list.component.scss'],
  providers: [GamerTagService],
})

export class ProfileListComponent implements OnInit {
  @Input() battleNetTag: string;

  players$: Observable<Player[]>;

  constructor(private gamerTagService: GamerTagService) {}

  ngOnInit() {
    this.players$ = this.gamerTagService.find(this.battleNetTag);
  }

}
