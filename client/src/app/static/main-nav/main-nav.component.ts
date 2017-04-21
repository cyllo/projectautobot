import { AfterContentInit, Component, OnDestroy, OnInit, ViewChild, Renderer2 } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { Subscription } from 'rxjs/Subscription';
@Component({
  selector: 'ow-main-nav',
  templateUrl: 'main-nav.component.html',
  styleUrls: ['main-nav.component.scss']
})
export class MainNavComponent implements OnInit, AfterContentInit, OnDestroy {
  @ViewChild('search') search;
  @ViewChild('mainnav') elNav;

  questionForm: FormGroup;
  subscriptions: Subscription[] = [];
  public isCollapsed = true;
  public userActionCollapsed = true;

  private player;
  private fieldName = 'Search';
  private controlName = 'search';
  private searchPlaceholder = 'Search for player by battle tag, psn or xbox live';

  private lastScrollY;
  private currScrollY;
  private elBody;

  constructor(private renderer: Renderer2) {}

  ngOnInit() {
    this.questionForm = new FormGroup({});
    this.renderer.listen('window' , 'scroll' , (event) => {
      this.onScroll(event);
    });
    this.renderer.listen('window' , 'DOMContentLoaded' , () => {this.updateBodyNavOffset();});
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

  ngAfterViewInit() {
    //Called after ngAfterContentInit when the component's view has been initialized. Applies to components only.
    //Add 'implements AfterViewInit' to the class.
    this.lastScrollY = 0;
    this.currScrollY = 0;
    this.elBody = document.getElementsByClassName('stp-container');
  }

  private mapFormToModel() {
    this.search = this.questionForm.getRawValue();
  }

  ngOnDestroy() {
    this.subscriptions.forEach(subscription => subscription.unsubscribe());
  }

  onScroll(event) {
    this.updateBodyNavOffset();       
    event.preventDefault();
  }

  updateBodyNavOffset(){
    var mainNavHeight = this.elNav.nativeElement.offsetHeight;
    var mainNavOffSet = 40; // px
    this.elBody[0].style.paddingTop = mainNavHeight + mainNavOffSet + 'px';
  }

}
