import { AfterContentInit, Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { Subscription } from 'rxjs/Subscription';

@Component({
  selector: 'ow-live',
  templateUrl: 'live.component.html',
  styleUrls: ['live.component.scss']
})
export class LiveComponent implements OnInit, AfterContentInit, OnDestroy {
  @ViewChild('sort') sortInput;
  questionForm: FormGroup;
  subscriptions: Subscription[] = [];

  private sort;
  public fieldName = 'Sort by';
  private controlName = 'sort';
  private sortList: Array<string> = ['Skill Rating', 'Offense', 'Defense', 'Tank', 'Support'];

  heroes = [];
  sum = 12;
  throttle = 300;
  scrollDistance = 1;

  videoUrl = 'http://img.youtube.com/vi/DWqhXWRaMmU/mqdefault.jpg';
  baseHero = {
    playerImage: this.videoUrl,
    playerName: 'TEST-FOURTH',
    points: 11567,
    viewers: '349,836',
  };

  constructor() {
    this.addItems(0, this.sum);
  }

  ngOnInit() {
    this.questionForm = new FormGroup({});
  }

  ngAfterContentInit() {
    this.sortInput.initControl(
      this.questionForm,
      this.sort,
      this.fieldName,
      this.controlName,
      this.sortList
    );


    this.mapFormToModel();
  }

  private mapFormToModel() {
    this.sortInput = this.questionForm.getRawValue();
  }

  addItems(startIndex, endIndex) {
    for (let i = startIndex; i < endIndex; i++) {
      this.heroes.push(this.baseHero);
    }
  }

  onScroll() {
    const start = this.sum;

    this.sum += 4;
    this.addItems(start, this.sum);
  }

  ngOnDestroy() {
    this.subscriptions.forEach(subscription => subscription.unsubscribe());
  }

}
