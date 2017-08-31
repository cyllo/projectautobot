import { User } from './user.model';


export interface SideBarSearchResults {
  users: User[];
  display: boolean;
  searching: boolean;
}
