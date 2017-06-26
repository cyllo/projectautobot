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
  ProfileComponent,
  CompareComponent,
  PageNotFoundComponent,
  LoginComponent
} from './pages';

const routes: Routes = [
  { path: '', component: HomeComponent },
  { path: 'following', component: FollowingComponent },
  { path: 'leaderboard', component: LeaderboardComponent },
  { path: 'heroes', component: HeroesComponent },
  { path: 'hero/:hero', component: HeroComponent },
  { path: 'esports', component: ESportsComponent },
  { path: 'live', component: LiveComponent },
  { path: 'login', component: LoginComponent },
  { path: 'news', component: NewsComponent },
  { path: 'post/:title', component: PostComponent },
  { path: 'friends', component: FriendsComponent },
  { path: 'profile/:platform/:region/:tag', component: ProfileComponent },
  { path: 'profile/:platform/:tag', component: ProfileComponent },
  { path: 'compare' , component: CompareComponent },
  { path: '404' , component: PageNotFoundComponent },
  { path: '**', redirectTo: '/404' }
];

export const routing = RouterModule.forRoot(routes);
