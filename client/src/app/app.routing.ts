import { RouterModule, Routes } from '@angular/router';
import { AuthGuard, AdminAuthGuard } from './services';
import { BlogPostResolver } from './pages/resolvers';
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
  LoginComponent,
  UserRegistrationComponent,
  AccountSettingsComponent,
  CreatePostComponent
} from './pages';

const routes: Routes = [
  { path: '', component: HomeComponent },
  { path: 'following', component: FollowingComponent, canActivate: [AuthGuard] },
  { path: 'leaderboard', component: LeaderboardComponent },
  { path: 'heroes', component: HeroesComponent },
  { path: 'hero/:hero', component: HeroComponent },
  { path: 'esports', component: ESportsComponent },
  { path: 'live', component: LiveComponent },
  { path: 'login', component: LoginComponent },
  { path: 'register/:code', component: UserRegistrationComponent},
  { path: 'register', component: UserRegistrationComponent },
  { path: 'news', component: NewsComponent },
  { path: 'create-post', component: CreatePostComponent, canActivate: [AdminAuthGuard]},
  { path: 'post/:title', component: PostComponent, resolve: { blogPost: BlogPostResolver } },
  { path: 'friends', component: FriendsComponent },
  { path: 'profile/:platform/:region/:tag', component: ProfileComponent }, // pc
  { path: 'profile/:platform/:tag', component: ProfileComponent }, // console
  { path: 'account', component: AccountSettingsComponent, canActivate: [AuthGuard] },
  { path: 'compare', component: CompareComponent },
  { path: '404', component: PageNotFoundComponent },
  { path: '**', redirectTo: '/404' }
];

export const routing = RouterModule.forRoot(routes);
