import { BlogPostState } from '../models';

export function blogPosts(state: BlogPostState = {}, { type, payload }: { type: string, payload?: any|any[] }) {
  switch (type) {
    case 'GET_BLOG_POSTS':
      return payload.reduce((acc, item) => Object.assign(acc, {
        [item.id]: item
      }), {});
      
    case 'ADD_BLOG_POST':
      return {
        ...state,
        [payload.id]: payload
      };

    default:
      return state;
  }
}

export function getBlogPosts(posts) {
  return {type: 'GET_BLOG_POSTS', payload: posts};
}

export function addBlogPost(post) {
  return {type: 'ADD_BLOG_POST', payload: post};
}
