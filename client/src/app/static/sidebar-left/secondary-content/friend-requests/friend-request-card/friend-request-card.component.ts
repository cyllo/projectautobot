import { Component, Output, EventEmitter, Input } from '@angular/core';

@Component({
  selector: 'ow-friend-request-card',
  templateUrl: 'friend-request-card.component.html',
  styleUrls: [ 'friend-request-card.component.scss' ]
})

export class FriendRequestCardComponent {
  @Input('stubData') stubData: string;
  @Output() ignore: EventEmitter<string> = new EventEmitter();

  constructor() {}

  ignoreFriendRequest() {
    console.log('emitting ignore request');
    this.ignore.emit(this.stubData);
  }

}
