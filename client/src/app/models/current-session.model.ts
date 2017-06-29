import { AppState } from './appstate.model';

interface SessionInfo {
  token: string;
  exp: string;
}

interface CurrentUser {
  username: string;
  id: Number;
  email: string;
}

export interface CurrentSession extends AppState {
  sessionInfo: SessionInfo;
  user: CurrentUser;
}
