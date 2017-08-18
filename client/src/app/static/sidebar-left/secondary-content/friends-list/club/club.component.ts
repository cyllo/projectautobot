import { Component,
         Input,
         OnInit,
         HostListener,
         ViewChild,
         ElementRef } from '@angular/core';
import { Router } from '@angular/router';
import { Club, Friendship } from '../../../../../models';
import { ClubService, FriendShipService } from '../../../../../services';
import { map, pluck, compose, flatten, path } from 'ramda';

@Component({
  selector: 'ow-club',
  templateUrl: 'club.component.html',
  styleUrls: [ 'club.component.scss' ],
  providers: [ClubService, FriendShipService]
})

export class ClubComponent implements OnInit {
  @Input() club: Club;
  @ViewChild('clubEditor', { read: ElementRef }) clubEditor: ElementRef;
  @ViewChild('expansionPanel') expansionPanel;

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

  compareProfiles(friendships: Friendship[]) {
    const friendshipGamerTags = compose(flatten, map(path(['friend', 'gamerTags'])));

    this.router.navigate(['/compare'], {
      queryParams: {
        ids: pluck('tag', friendshipGamerTags(friendships))
      }
    });
  }

  toggleClubNameEdit($event = null) {
    this.clubNameEditInProgress = !this.clubNameEditInProgress;
    if ($event) {
      this.stopPropagation($event);
    }
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

  updateClub(id, name) {
    this.clubNameEditInProgress = false;
    this.clubService.update(id, name);
  }

  deleteFriend(friendshipId) {
    this.friendshipService.delete(friendshipId);
  }

  removeFriend(friendshipId, clubId) {
    this.clubService.removeFriendship(friendshipId, clubId);
  }

  stopPropagation($event) {
    $event.stopPropagation();
  }

  toggleExpansionPanel() {
    this.expansionPanel.toggle();
  }

  @HostListener('document:click', ['$event.target'])
  onDOMClick($target) {
    if (this.clubNameEditInProgress && !this.clubEditor.nativeElement.contains($target)) {
      this.toggleClubNameEdit();
    }
  }

}
