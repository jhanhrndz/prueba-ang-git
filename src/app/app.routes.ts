import { Routes } from '@angular/router';
import { PostListComponent } from './features/posts/post-list/post-list.component';

export const routes: Routes = [
  { path: '', pathMatch: 'full', redirectTo: 'listar-posts' },
  { path: 'listar-posts', component: PostListComponent },
];
