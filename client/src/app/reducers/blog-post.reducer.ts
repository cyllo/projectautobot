import { BlogPost } from '../models';

export function blogPosts(state: BlogPost[] = [], { type, payload }: { type:string, payload?: any|any[] }) {
  switch (type) {
    case 'GET_BLOG_POSTS':
      return payload.reduce((acc, item) => Object.assign(acc, {
        [item.id]: item
      }), {})

    default:
      return state;
  }
}

export function getBlogPosts(posts) {
  return {type: 'GET_BLOG_POSTS', payload: posts}
}
