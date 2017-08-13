import { Router, Resolve, ActivatedRouteSnapshot } from '@angular/router';
import { Injectable } from '@angular/core';
import { Store } from '@ngrx/store';
import { AppState, BlogPost, BlogPostState } from '../../models';
import { BlogPostsService } from '../../services';
import { values, filter, propEq } from 'ramda';
import { Observable } from 'rxjs/Observable';

@Injectable()
export class BlogPostResolver implements Resolve<BlogPost> {

  constructor(private blogPostsService: BlogPostsService,
              private store: Store<AppState>,
              private router: Router) {}

  resolve(route: ActivatedRouteSnapshot): Observable<BlogPost> {
    const title: string = route.params.title;

    if (title) {

      const blogPost: Observable<any> = this.store.select('blogPosts')
        .take(1)
        .map((blogPostState: BlogPostState) => {
          const [blogPosts] = filter(
            propEq('title', title),
            values(blogPostState)
          );
          return blogPosts;
        })
        .switchMap(val => val ? Observable.of(val) : this.blogPostsService.getBlogPostByTitle(title))
        .do(val => {
          if (!val) {
            this.onPostNotFound();
          }
        });

      return blogPost;
    }

    this.onPostNotFound();

  }

  onPostNotFound(): void {
    this.router.navigate(['./404']);
  }

}
