import { User } from './user.model';
import { GlobalQueryFilters } from './global-query-filters.model';

export interface BlogCategories {
  id: number;
  name: string;
}

export interface BlogPost {
  id: number;
  content: string;
  summary: string;
  thumbnailUrl: string;
  title: string;
  insertedAt: string;
  updatedAt: string;
  author: User;
  blogCategories: BlogCategories[];
  isFeatured: boolean;
}

export interface BlogPostFilterParams extends GlobalQueryFilters {
  blogCategories?: [BlogCategories];
}
