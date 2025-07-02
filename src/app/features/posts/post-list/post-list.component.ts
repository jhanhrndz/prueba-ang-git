import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Subject, takeUntil, map } from 'rxjs';
import { Post } from '../../../core/interfaces/post.interface';
import { PostService } from '../../../core/services/posts/post.service';

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

  constructor(private postService: PostService) { }

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

  onView(post: Post): void {
    alert(`Navegando al detalle del post: ${post.title}`);
  }

  onEdit(post: Post): void {
    alert(`Editando: ${post.title}`);
  }

  onCreateNew(): void {
    alert('Navegando al formulario de creación');
  }

  onDelete(postId: number): void {
    const post = this.posts.find(p => p.id === postId);
    const confirmMessage = post 
      ? `¿Estás seguro de que quieres eliminar la publicación "${post.title}"?`
      : '¿Estás seguro de que quieres eliminar esta publicación?';

    if (confirm(confirmMessage)) {
      this.deletePost(postId);
    }
  }

  private deletePost(postId: number): void {
    this.loading = true;
    
    this.postService.deletePost(postId)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: () => {
          this.posts = this.posts.filter(p => p.id !== postId);
          this.loading = false;
          alert('Publicación eliminada exitosamente');
        },
        error: (error) => {
          console.error('Error deleting post:', error);
          this.loading = false;
          alert('Error al eliminar la publicación. Por favor, intenta de nuevo.');
        }
      });
  }

  onRefresh(): void {
    this.loadPosts();
  }
}

// Export default para lazy loading
export default PostListComponent;