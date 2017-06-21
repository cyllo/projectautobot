import { HostListener, Component, ViewChild, Renderer2, AfterViewInit, AfterViewChecked, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs/Subscription';

import { BlogPost } from '../../models';

import { PostService } from './post.service';

@Component({
  selector: 'ow-post',
  templateUrl: 'post.component.html',
  styleUrls: [ 'post.component.scss' ],
  providers: [PostService]
})
export class PostComponent implements AfterViewInit, AfterViewChecked, OnDestroy, OnInit {
  @ViewChild('postsidebar') public elPostSideBar;

  public post: BlogPost = <BlogPost>{};
  private elMainNav;
  private sub: Subscription
;
  constructor(
    public postService: PostService,
    private renderer: Renderer2,
    private route: ActivatedRoute
  ) {}

  ngOnInit() {
    this.sub = this.route.params
      .mergeMap(({title}) => this.postService.getPost(title))
      .subscribe((post) => this.post = post);
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

  ngOnDestroy() {
    this.sub.unsubscribe();
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
