import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { PostService } from '../../../core/services/posts/post.service';
import { UserService } from '../../../core/services/users/user.service';
import { CreatePostRequest } from '../../../core/interfaces/post.interface';
import { User } from '../../../core/interfaces/user.interface';
import { Subject, takeUntil } from 'rxjs';
import { CommonModule, Location } from '@angular/common';

@Component({
  selector: 'app-post-new',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './post-new.component.html',
  styleUrls: ['../post-edit/post-edit.component.scss']
})
export class PostNewComponent implements OnInit, OnDestroy {
  postForm!: FormGroup;
  loading = false;
  error: string | null = null;
  users: User[] = [];
  usersLoading = false;
  private destroy$ = new Subject<void>();

  constructor(
    private fb: FormBuilder,
    private postService: PostService,
    private userService: UserService,
    private router: Router,
    private location: Location
  ) {}

  ngOnInit(): void {
    this.initForm();
    this.loadUsers();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  private initForm(): void {
    this.postForm = this.fb.group({
      userId: ['', [Validators.required]],
      title: ['', [Validators.required]],
      body: ['', [Validators.required, Validators.minLength(10)]]
    });
  }

  private loadUsers(): void {
    this.usersLoading = true;
    this.userService.getUsers()
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (users) => {
          this.users = users;
          this.usersLoading = false;
        },
        error: () => {
          this.error = 'No se pudieron cargar los usuarios';
          this.usersLoading = false;
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
    const newPost: CreatePostRequest = {
      userId: this.postForm.value.userId,
      title: this.postForm.value.title,
      body: this.postForm.value.body
    };
    this.postService.createPost(newPost)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: () => {
          this.loading = false;
          this.router.navigate(['/lists-posts']);
        },
        error: () => {
          this.error = 'No se pudo crear la publicación';
          this.loading = false;
        }
      });
  }

  goBack(): void {
    this.location.back();
  }
}
