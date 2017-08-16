import { Component, OnInit, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'ow-quick-comp-toggle',
  templateUrl: 'quick-comp-toggle.component.html',
  styleUrls: ['quick-comp-toggle.component.scss']
})
export class CompetitiveOrQuickPlaySelectorComponent implements OnInit {
  @Output() change: EventEmitter<string> = new EventEmitter<string>();

  constructor() {}

  ngOnInit() {}

  onToggle(state) {
    this.change.emit(state.checked ? 'competitive' : 'quickPlay');
  }

}
