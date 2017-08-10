import { AppState } from './appstate.model';

interface SessionInfo {
  token: string;
  exp: string;
}

export interface CurrentUser {
  username: string;
  id: Number;
  email: string;
}

export interface CurrentSession extends AppState {
  sessionInfo: SessionInfo;
  user: CurrentUser;
}
