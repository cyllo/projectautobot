import { RouterModule, Routes } from '@angular/router';
import {
  HomeComponent,
  FollowingComponent,
  LeaderboardComponent,
  HeroesComponent,
  ESportsComponent,
  LiveComponent,
  NewsComponent,
  FriendsComponent
} from './pages';

const routes: Routes = [
  { path: 'home', component: HomeComponent },
  { path: 'following', component: FollowingComponent },
  { path: 'leaderboard', component: LeaderboardComponent },
  { path: 'heroes', component: HeroesComponent },
  { path: 'esports', component: ESportsComponent },
  { path: 'live', component: LiveComponent },
  { path: 'news', component: NewsComponent },
  { path: 'friends', component: FriendsComponent }
];

export const routing = RouterModule.forRoot(routes);
