import { HostListener, Component, ViewChild, Renderer2, AfterViewInit, AfterViewChecked } from '@angular/core';

@Component({
  selector: 'ow-post',
  templateUrl: 'post.component.html',
  styleUrls: [ 'post.component.scss' ]
})
export class PostComponent implements AfterViewInit, AfterViewChecked {
  @ViewChild('postsidebar') elPostSideBar;

  private elMainNav;

  constructor( private renderer: Renderer2 ) {}

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

  @HostListener('window.scroll')
  onScroll( event ) {
    this.updateMainNavOffset();
    event.preventDefault();
  }

  @HostListener('window.resize')
  onResize( event ) {
    this.updateMainNavOffset();
    event.preventDefault();
  }

  @HostListener('window.DOMContentLoaded')
  onDOMLoaded( event ) {
    this.updateMainNavOffset();
    event.preventDefault();
  }

  updateMainNavOffset() {
    this.renderer.setStyle(this.elPostSideBar.nativeElement, 'top', this.elMainNav.offsetHeight + 'px');
  }

}
