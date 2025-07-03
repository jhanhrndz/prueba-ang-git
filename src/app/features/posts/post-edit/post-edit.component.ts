import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { PostService } from '../../../core/services/posts/post.service';
import { Post, UpdatePostRequest } from '../../../core/interfaces/post.interface';
import { Subject, takeUntil } from 'rxjs';
import { CommonModule, Location } from '@angular/common';

@Component({
  selector: 'app-post-edit',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './post-edit.component.html',
  styleUrls: ['./post-edit.component.scss']
})
export class PostEditComponent implements OnInit, OnDestroy {
  postForm!: FormGroup;
  loading = false;
  error: string | null = null;
  private destroy$ = new Subject<void>();
  protected postId!: number;

  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private postService: PostService,
    private router: Router, 
    private location: Location
  ) {}

  ngOnInit(): void {
    this.postId = Number(this.route.snapshot.paramMap.get('id'));
    if (!this.postId) {
      this.error = 'ID de publicación inválido';
      return;
    }
    this.initForm();
    this.loadPost();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  private initForm(): void {
    this.postForm = this.fb.group({
      userId: [{ value: '', disabled: false }, [Validators.required]],
      title: ['', [Validators.required]],
      body: ['', [Validators.required, Validators.minLength(10)]]
    });
  }

  private loadPost(): void {
    this.loading = true;
    this.postService.getPostById(this.postId)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (post: Post) => {
          this.postForm.patchValue({
            userId: post.userId,
            title: post.title,
            body: post.body
          });
          this.loading = false;
        },
        error: () => {
          this.error = 'No se pudo cargar la publicación';
          this.loading = false;
        }
      });
  }

  get title() {
    return this.postForm.get('title');
  }

  get body() {
    return this.postForm.get('body');
  }

  onSubmit(): void {
    if (this.postForm.invalid) {
      this.postForm.markAllAsTouched();
      return;
    }
    this.loading = true;
    const updateData: UpdatePostRequest = {
      id: this.postId,
      userId: this.postForm.value.userId,
      title: this.postForm.value.title,
      body: this.postForm.value.body
    };
    this.postService.updatePost(updateData)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: () => {
          this.loading = false;
          this.goBack();
        },
        error: () => {
          this.error = 'No se pudo actualizar la publicación';
          this.loading = false;
        }
      });
  }

  goBack(): void {
    this.location.back();
  }
}
