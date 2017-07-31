import { Component, Output, EventEmitter, Input } from '@angular/core';

@Component({
  selector: 'ow-sidebar-friend-request-card',
  templateUrl: 'sidebar-friend-request-card.component.html',
  styleUrls: [ 'sidebar-friend-request-card.component.scss' ]
})

export class SidebarFriendRequestCardComponent {
  @Input('stubData') stubData: string;
  @Output() ignore: EventEmitter<string> = new EventEmitter();

  constructor() {}

  ignoreFriendRequest() {
    console.log('emitting ignore request');
    this.ignore.emit(this.stubData);
  }

}
