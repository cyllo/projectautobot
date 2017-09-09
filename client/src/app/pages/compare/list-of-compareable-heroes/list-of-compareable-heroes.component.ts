import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { Heroes } from '../../../models';

interface SelectedHeroes {
  [heroId: string]: boolean;
}

@Component({
  selector: 'ow-list-of-compareable-heroes',
  templateUrl: 'list-of-compareable-heroes.component.html',
  styleUrls: ['list-of-compareable-heroes.component.scss']
})
export class ListOfCompareableHeroesComponent implements OnInit {
  @Input() heroes: Heroes[];
  @Input() selectedHeroes: SelectedHeroes;
  @Output() change = new EventEmitter<SelectedHeroes>();

  constructor() {}

  ngOnInit() {
    this.change.emit(this.selectedHeroes);
  }

  selectedChange(event) {
    this.selectedHeroes[event.value] = event.source.checked;
    this.change.emit(this.selectedHeroes);
  }
}
