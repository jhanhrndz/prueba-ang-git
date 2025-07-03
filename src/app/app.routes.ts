import { Routes } from '@angular/router';
import { PostListComponent } from './features/posts/post-list/post-list.component';
import {PostDetailComponent } from './features/posts/post-detail/post-detail.component';

export const routes: Routes = [
  { path: '', pathMatch: 'full', redirectTo: 'listar-posts' },
  { path: 'listar-posts', component: PostListComponent },
  { path: 'detalles-posts/:id', component: PostDetailComponent }
];
