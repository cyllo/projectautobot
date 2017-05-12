import { AppState } from './appstate.model';

export interface Search extends AppState {
  tag?: string;
}
