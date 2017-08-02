import { AfterContentInit, Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { Subscription } from 'rxjs/Subscription';

@Component({
  selector: 'ow-top-nav',
  templateUrl: 'top-nav.component.html',
  styleUrls: ['top-nav.component.scss']
})
export class TopNavComponent implements OnInit, AfterContentInit, OnDestroy {
  @ViewChild('search') search;
  questionForm: FormGroup;
  subscriptions: Subscription[] = [];

  private player;
  private fieldName = 'Search';
  private controlName = 'search';
  private searchPlaceholder = 'Search for player by battle tag, psn or xbox live';

  constructor() {
    // Do stuff
  }

  ngOnInit() {
    this.questionForm = new FormGroup({});
  }

  ngAfterContentInit() {
    this.search.initControl(
      this.questionForm,
      this.player,
      this.fieldName,
      this.controlName,
      this.searchPlaceholder,
      true
    );
    this.mapFormToModel();
  }

  private mapFormToModel() {
    this.search = this.questionForm.getRawValue();
  }

  ngOnDestroy() {
    this.subscriptions.forEach(subscription => subscription.unsubscribe());
  }
}
