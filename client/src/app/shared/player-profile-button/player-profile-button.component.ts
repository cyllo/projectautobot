import { Component, Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'ow-player-profile-button',
  templateUrl: 'player-profile-button.component.html',
  styleUrls: ['player-profile-button.component.scss']
})
export class PlayerProfileButtonComponent {
  @Input('player') player;
  @Output() playerSelected = new EventEmitter();

  constructor () {}

  onButtonClicked() {
    console.log('test:', this.player);
    this.playerSelected.emit();
  }

}
