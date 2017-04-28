import { AfterContentInit, AfterViewInit, AfterViewChecked, Component, OnDestroy, OnInit, ViewChild, Renderer2 } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { Subscription } from 'rxjs/Subscription';

@Component({
  selector: 'ow-main-nav',
  templateUrl: 'main-nav.component.html',
  styleUrls: ['main-nav.component.scss']
})

export class MainNavComponent implements OnInit, AfterContentInit, AfterViewInit, AfterViewChecked, OnDestroy {
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
    //Called after the constructor, initializing input properties, and the first call to ngOnChanges.
    //Add 'implements OnInit' to the class.
    this.questionForm = new FormGroup({});
    this.renderer.listen('window' , 'scroll' , (event) => {this.onScroll(event);});
    this.renderer.listen('window' , 'resize' , (event) => {this.onResize(event);});
    this.renderer.listen('window' , 'DOMContentLoaded' , (event) => {this.onDOMLoaded(event);});
  }
  
  ngAfterContentInit() {
    //Called after ngOnInit when the component's or directive's content has been initialized.
    //Add 'implements AfterContentInit' to the class.
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
    this.elBody = document.getElementsByTagName('body');
  }

  ngAfterViewChecked() {
    //Called after every check of the component's view. Applies to components only.
    //Add 'implements AfterViewChecked' to the class.
    this.updateMainNavOffset();
  }

  ngOnDestroy() {
    //Called once, before the instance is destroyed.
    //Add 'implements OnDestroy' to the class.
    this.subscriptions.forEach(subscription => subscription.unsubscribe());
  }

  private mapFormToModel() {
    this.search = this.questionForm.getRawValue();
  }

  onScroll(event) {
    this.updateMainNavOffset();       
    event.preventDefault();
  }

  onResize(event) {
    this.updateMainNavOffset();       
    event.preventDefault();
  }

  onDOMLoaded(event) {
    this.updateMainNavOffset();       
    event.preventDefault();
  }

  updateMainNavOffset(){
    var mainNavHeight = this.elNav.nativeElement.offsetHeight;
    this.elBody[0].style.paddingTop = mainNavHeight + 'px';
  }

}
