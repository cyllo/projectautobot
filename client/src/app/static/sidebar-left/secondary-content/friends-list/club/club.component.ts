import { Component, Input, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Club } from '../../../../../models';
import { ClubService, FriendShipService } from '../../../../../services';
import { map, prop } from 'ramda';

@Component({
  selector: 'ow-club',
  templateUrl: 'club.component.html',
  styleUrls: [ 'club.component.scss' ],
  providers: [ClubService, FriendShipService]
})

export class ClubComponent implements OnInit {
  @Input() club: Club;

  clubNameEditInProgress: boolean;
  expansionPanelCollapsed: boolean;

  constructor(
    private clubService: ClubService,
    private friendshipService: FriendShipService,
    private router: Router
  ) {
    this.clubNameEditInProgress = false;
    this.expansionPanelCollapsed = false;
  }

  ngOnInit() {}

  compareProfiles(friendships) {
    this.router.navigate(['/compare'], { queryParams: { ids: map(prop('id'), friendships)} });
  }

  clubNameEditStart(event) {
    this.clubNameEditInProgress = true;
    event.stopPropagation();
  }

  clubNameEditEnd($event) {
    this.clubNameEditInProgress = false;
    $event.stopPropagation();
  }

  expandedEvent() {
    this.expansionPanelCollapsed = false;
  }

  collapsedEvent() {
    this.expansionPanelCollapsed = true;
  }

  deleteClub(id) {
    this.clubService.delete(id);
  }

  updateClub(id, name, $event) {
    this.clubNameEditInProgress = false;
    this.clubService.update(id, name);
    $event.stopPropagation();
  }

  deleteFriend(friendshipId) {
    this.friendshipService.delete(friendshipId);
  }

  removeFriend(friendshipId, clubId) {
    this.clubService.removeFriendship(friendshipId, clubId);
  }
}
