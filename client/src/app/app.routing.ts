import { RouterModule, Routes } from '@angular/router';
import {
  HomeComponent,
  FollowingComponent,
  LeaderboardComponent,
  HeroesComponent,
  HeroComponent,
  ESportsComponent,
  LiveComponent,
  NewsComponent,
  PostComponent,
  FriendsComponent,
  ProfileComponent
} from './pages';

const routes: Routes = [
  { path: '', component: HomeComponent },
  { path: 'following', component: FollowingComponent },
  { path: 'leaderboard', component: LeaderboardComponent },
  { path: 'heroes', component: HeroesComponent },
  { path: 'hero', component: HeroComponent },
  { path: 'esports', component: ESportsComponent },
  { path: 'live', component: LiveComponent },
  { path: 'news', component: NewsComponent },
  { path: 'post', component: PostComponent },
  { path: 'friends', component: FriendsComponent },
  { path: 'profile/:region/:platform/:tag', component: ProfileComponent }
];

export const routing = RouterModule.forRoot(routes);
