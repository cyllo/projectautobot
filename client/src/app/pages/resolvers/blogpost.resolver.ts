import { Router, Resolve, ActivatedRouteSnapshot } from '@angular/router';
import { Injectable } from '@angular/core';
import { Store } from '@ngrx/store';
import { BlogPost } from '../../models';
import { BlogPostsService } from '../../services';
import { values, filter, propEq } from 'ramda';
import { Observable } from 'rxjs/Observable';
import { BlogPostState, ReducerStack } from '../../reducers';

@Injectable()
export class BlogPostResolver implements Resolve<BlogPost> {

  constructor(
    private blogPostsService: BlogPostsService,
    private store: Store<ReducerStack>,
    private router: Router
  ) {}

  resolve(route: ActivatedRouteSnapshot): Observable<BlogPost> {
    const title: string = route.params.title;

    if (title) {

      const blogPost: Observable<any> = this.store.select('blogPosts')
        .take(1)
        .map((blogPostState: BlogPostState) => {
          // we should not map over the blogpost state we should write a function in
          // the blog post reducer that will let us query for a specific blog post(s)
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
