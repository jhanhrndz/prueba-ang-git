import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { PostService } from '../../../core/services/posts/post.service';
import { Post } from '../../../core/interfaces/post.interface';

@Component({
  selector: 'app-post-detail',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './post-detail.component.html',
  styleUrls: ['./post-detail.component.scss']
})
export class PostDetailComponent implements OnInit {
  post: Post | null = null;
  loading = false;
  error: string | null = null;

  constructor(
    private route: ActivatedRoute,
    private postService: PostService,
    private router: Router
  ) {}

  ngOnInit(): void {
    const id = Number(this.route.snapshot.paramMap.get('id'));
    if (!id) {
      this.error = 'ID de publicación inválido';
      return;
    }
    this.loading = true;
    this.postService.getPostById(id).subscribe({
      next: (post) => {
        this.post = post;
        this.loading = false;
      },
      error: () => {
        this.error = 'No se pudo cargar la publicación';
        this.loading = false;
      }
    });
  }

  get titleLength(): number {
    return this.post?.title.length ?? 0;
  }

  get bodyLength(): number {
    return this.post?.body.length ?? 0;
  }

  goBack(): void {
    this.router.navigate(['/listar-posts']);
  }
}
