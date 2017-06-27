import { AppState } from './appstate.model';

export interface CurrentSession extends AppState {
  id: Number,
  email: string,
  username: string
}
