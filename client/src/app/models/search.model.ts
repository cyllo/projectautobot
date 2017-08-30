import { AppState } from './appstate.model';
import { GamerTag } from './user.model';

export interface Search extends AppState {
  profile?: GamerTag[];
  searching?: boolean;
}
