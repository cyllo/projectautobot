import { Component,
         Input,
         OnInit,
         HostListener,
         ViewChild,
         ElementRef } from '@angular/core';
import { Router } from '@angular/router';
import { Club, Friendship } from '../../../../models';
import { ClubService, FriendShipService } from '../../../../services';
import { map, pluck, compose, flatten, path } from 'ramda';

@Component({
  selector: 'ow-club',
  templateUrl: 'club.component.html',
  styleUrls: [ 'club.component.scss' ],
  providers: [ClubService, FriendShipService]
})

export class ClubComponent implements OnInit {
  @Input() club: Club;
  @ViewChild('clubNameEditor', {read: ElementRef}) clubNameEditor: ElementRef;

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

  toggleClubNameEdit() {
    this.clubNameEditInProgress = !this.clubNameEditInProgress;
  }

  @HostListener('document:click', ['$event.target'])
  onDOMClick($target) {
    if (this.clubNameEditInProgress && !this.clubNameEditor.nativeElement.contains($target)) {
      this.toggleClubNameEdit();
    }
  }

}
