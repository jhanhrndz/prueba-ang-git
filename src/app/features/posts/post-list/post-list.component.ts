import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Subject, takeUntil, map } from 'rxjs';
import { Post } from '../../../core/interfaces/post.interface';
import { PostService } from '../../../core/services/posts/post.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-post-list',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './post-list.component.html',
  styleUrls: ['./post-list.component.scss']
})
export class PostListComponent implements OnInit, OnDestroy {
  posts: Post[] = [];
  loading = false;
  private destroy$ = new Subject<void>();

  showDeleteModal = false;
  postToDelete: Post | null = null;
  isDeleting = false;

  constructor(private postService: PostService, private ruta: Router) { }

  ngOnInit(): void {
    this.loadPosts();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  private loadPosts(): void {
    this.loading = true;
    this.postService.getPosts()
      .pipe(
        map(posts => posts.slice(0, 10)), 
        takeUntil(this.destroy$)
      )
      .subscribe({
        next: (posts: Post[]) => {
          this.posts = posts;
          this.loading = false;
        },
        error: (error) => {
          console.error('Error loading posts:', error);
          this.loading = false;
          alert('Error al cargar las publicaciones. Por favor, intenta de nuevo.');
        }
      });
  }

  onView(id: Post["id"]) {
    return this.ruta.navigate(['/detail-posts/' + id]);
  }

  onEdit(id: Post["id"]){
    return this.ruta.navigate(['/edit-posts/' + id]);
  }

  onCreateNew(): void {
    this.ruta.navigate(['/new-post/']);
  }

  onDelete(postId: number): void {
    const post = this.posts.find(p => p.id === postId);
    if (post) {
      this.postToDelete = post;
      this.showDeleteModal = true;
    }
  }

  confirmDelete(): void {
    if (this.postToDelete) {
      this.deletePost(this.postToDelete.id);
    }
  }

  cancelDelete(): void {
    this.showDeleteModal = false;
    this.postToDelete = null;
  }

  private deletePost(postId: number): void {
    this.isDeleting = true;
    
    this.postService.deletePost(postId)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: () => {
          this.posts = this.posts.filter(p => p.id !== postId);
          this.isDeleting = false;
          this.showDeleteModal = false;
          this.postToDelete = null;
          alert('Publicación eliminada exitosamente');
        },
        error: (error) => {
          console.error('Error deleting post:', error);
          this.isDeleting = false;
          alert('Error al eliminar la publicación. Por favor, intenta de nuevo.');
        }
      });
  }

  onBackdropClick(event: Event): void {
    if (event.target === event.currentTarget && !this.isDeleting) {
      this.cancelDelete();
    }
  }
}

export default PostListComponent;