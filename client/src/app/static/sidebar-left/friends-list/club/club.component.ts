import { Component,
         Input,
         OnInit,
         HostListener,
         ViewChild,
         ElementRef } from '@angular/core';
import { Router } from '@angular/router';
import { Club, Friendship, GamerTag } from '../../../../models';
import { ClubService, FriendShipService, notNil, ProfileService } from '../../../../services';
import { map, pluck, compose, flatten, path } from 'ramda';
import { Subject } from 'rxjs/Subject';

@Component({
  selector: 'ow-club',
  templateUrl: 'club.component.html',
  styleUrls: [ 'club.component.scss' ],
  providers: [ClubService, FriendShipService, ProfileService]
})

export class ClubComponent implements OnInit {
  @Input() club: Club;
  @ViewChild('clubNameEditor', {read: ElementRef}) clubNameEditor: ElementRef;

  clubNameEditInProgress: boolean;
  expansionPanelCollapsed: boolean;
  destroyer$ = new Subject<void>();
  gotoProfile$ = new Subject<GamerTag>();

  constructor(
    private clubService: ClubService,
    private friendshipService: FriendShipService,
    private profile: ProfileService,
    private router: Router
  ) {}

  ngOnInit() {
    this.clubNameEditInProgress = false;
    this.expansionPanelCollapsed = false;

    this.gotoProfile$
    .filter(notNil)
    .subscribe((profile: GamerTag) => this.profile.goto(profile));
  }

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
