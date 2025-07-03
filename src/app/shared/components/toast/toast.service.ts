import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

export interface ToastMessage {
  type: 'success' | 'error';
  message: string;
}

@Injectable({ providedIn: 'root' })
export class ToastService {
  private toastSubject = new BehaviorSubject<ToastMessage | null>(null);
  toast$ = this.toastSubject.asObservable();

  show(type: 'success' | 'error', message: string) {
    this.toastSubject.next({ type, message });
    setTimeout(() => this.clear(), 4000);
  }

  clear() {
    this.toastSubject.next(null);
  }
}