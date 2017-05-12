import { Component, ViewChild, Renderer2, OnInit, AfterViewInit, AfterViewChecked } from '@angular/core';

@Component({
  selector: 'ow-sidebar-left',
  templateUrl: 'sidebar-left.component.html',
  styleUrls: [ 'sidebar-left.component.scss' ]
})

export class SideBarLeftComponent implements OnInit, AfterViewInit, AfterViewChecked {
  @ViewChild('sidebarleft') sidebarleft;

  private elMainNav;
  isCollapsed = true;

  constructor( private renderer: Renderer2 ) {}

  ngOnInit() {
    // Called after the constructor, initializing input properties, and the first call to ngOnChanges.
    // Add 'implements OnInit' to the class.
    this.renderer.listen('window', 'scroll', ( event ) => { this.onScroll(event); });
    this.renderer.listen('window', 'resize', ( event ) => { this.onResize(event); });
    this.renderer.listen('window', 'DOMContentLoaded', ( event ) => { this.onDOMLoaded(event); });
  }

  ngAfterViewInit() {
    // Called after ngAfterContentInit when the component's view has been initialized. Applies to components only.
    // Add 'implements AfterViewInit' to the class.
    this.elMainNav = document.getElementsByClassName('main-nav')[ 0 ];
  }

  ngAfterViewChecked() {
    // Called after every check of the component's view. Applies to components only.
    // Add 'implements AfterViewChecked' to the class.
    this.updateMainNavOffset();
  }

  onScroll( event ) {
    this.updateMainNavOffset();
    event.preventDefault();
  }

  onResize( event ) {
    this.updateMainNavOffset();
    event.preventDefault();
  }

  onDOMLoaded( event ) {
    this.updateMainNavOffset();
    event.preventDefault();
  }

  updateMainNavOffset() {
    this.renderer.setStyle(this.sidebarleft.nativeElement, 'top', this.elMainNav.offsetHeight + 'px');
  }

}