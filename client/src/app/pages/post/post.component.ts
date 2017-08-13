import { Component , OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { BlogPost, AppState } from '../../models';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs/Observable';
import { BlogPostsService } from '../../services';
import { Subject } from 'rxjs/Subject';
import { find, findIndex, propEq, append, last } from 'ramda';

@Component({
  selector: 'ow-post',
  templateUrl: 'post.component.html',
  styleUrls: [ 'post.component.scss' ]
})

export class PostComponent implements OnInit {

  blogPosts: Observable<BlogPost[]>;

  private loadNextPost$: Subject<number> = new Subject<number>();

  constructor(private activatedRoute: ActivatedRoute,
    private store: Store<AppState>,
    private blogPostsService: BlogPostsService) {
      console.log(this.store);
    }

  ngOnInit() {

    this.activatedRoute.data.subscribe(data => {
      this.blogPosts = Observable.of([data.blogPost]);
    });

    this.loadNextPost$
      .distinctUntilChanged((a, b) => a !== b)
      .subscribe(id => this.loadNextPost(id));

  }

  loadNextPost(id: number) {
    this.blogPostsService.posts$
      .filter(posts => find(propEq('id', id), posts) !== last(posts))
      .subscribe(posts => {
        const i = findIndex(propEq('id', id), posts);
        this.blogPosts
          .map(p => append(posts[i + 1], p))
          .subscribe();
      });
    // this.blogPostsService.getBlogPostsBefore(1, id);
  }

  onNextPost(id: number) {
    this.loadNextPost$.next(id);
  }


}
