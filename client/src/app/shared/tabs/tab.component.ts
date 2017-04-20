import { Component, Output, Input, OnInit } from '@angular/core';
import { Tab } from './tab.interface';
import { TabsComponent } from './tabs.component';

@Component({
  selector: 'tab',
  templateUrl: './tab.component.html',
  styleUrls: ['tab.component.scss']
})

export class TabComponent implements OnInit, Tab {
  @Input() tabTitle;
  @Output() selected;

  constructor(private tabsComponent: TabsComponent) {}

  ngOnInit() {
    this.tabsComponent.addTab(this);
  }
}