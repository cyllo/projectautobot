import { assoc, reduce, merge } from 'ramda';

import { BlogPostState, BlogPost } from '../models';

export function blogPosts(state: BlogPostState = {}, { type, payload }: { type: string, payload?: BlogPost | BlogPost[] }) {
  switch (type) {
    case 'GET_BLOG_POSTS':
      return reduce((acc, post) => merge(acc, {
        [post.id]: post
      }), state, payload as BlogPost[]);

    case 'ADD_BLOG_POST':
      return assoc(String((payload as BlogPost).id), payload, state);

    default:
      return state;
  }
}

export function getBlogPosts(posts) {
  return { type: 'GET_BLOG_POSTS', payload: posts };
}

export function addBlogPost(post) {
  return { type: 'ADD_BLOG_POST', payload: post };
}
