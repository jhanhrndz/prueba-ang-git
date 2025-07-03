import { Routes } from '@angular/router';
import { PostListComponent } from './features/posts/post-list/post-list.component';
import {PostDetailComponent } from './features/posts/post-detail/post-detail.component';
import { PostEditComponent } from './features/posts/post-edit/post-edit.component';
import { PostNewComponent } from './features/posts/post-new/post-new.component';

export const routes: Routes = [
  { path: '', pathMatch: 'full', redirectTo: 'lists-posts' },
  { path: 'lists-posts', component: PostListComponent },
  { path: 'detail-posts/:id', component: PostDetailComponent },
  { path: 'edit-posts/:id', component: PostEditComponent },
  { path: 'new-post', component: PostNewComponent }
];
