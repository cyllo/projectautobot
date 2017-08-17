import { AppState } from './appstate.model';
import { User } from './user.model';

export interface CurrentSession extends AppState {
  user: User;
}
