import { Component, OnInit, Output, EventEmitter, OnDestroy, Input } from '@angular/core';
import { Subject } from 'rxjs/Subject';
import { Observable } from 'rxjs/Observable';

@Component({
  selector: 'ow-game-mode-toggle',
  templateUrl: 'quick-comp-toggle.component.html',
  styleUrls: ['quick-comp-toggle.component.scss']
})
export class GameModeToggleComponent implements OnInit, OnDestroy {
  @Input() modeIndicator: Observable<{ disabled: boolean, mode: string }>;
  @Output() gameMode: EventEmitter<string> = new EventEmitter<string>();

  gameModeToggle$ = new Subject<boolean>();
  destroyer$ = new Subject<void>();
  selectedMode: string;
  derp: boolean;
  constructor() {}

  ngOnInit() {
    this.gameModeToggle$
    .map(isCompetitive => isCompetitive ? 'competitive' : 'quickPlay')
    // .takeUntil(this.destroyer$)
    .subscribe(gameMode => this.gameMode.emit(gameMode));
  }

  ngOnDestroy() {
    this.destroyer$.next();
    this.destroyer$.complete();
  }
}
