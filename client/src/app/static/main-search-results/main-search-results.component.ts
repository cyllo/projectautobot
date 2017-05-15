import { HostBinding, Component, Output, Input, EventEmitter } from '@angular/core';
import { Player } from '../../models';

@Component({
  selector: 'ow-main-search-results',
  templateUrl: 'main-search-results.component.html',
  styleUrls: ['main-search-results.component.scss']
  // changeDetection: ChangeDetectionStrategy.OnPush
})
export class MainSearchResultsComponent {
  @Input() searchResults;
  @Input()
  @HostBinding('class.open')
  isOpen = false;
  @Output() resultSelect = new EventEmitter<Player>();
  @Output() close = new EventEmitter();

  onClose() {
    this.isOpen = false;
  }

  onSelect(result) {
    this.resultSelect.emit(result);
  }
}
