import { Injectable, Inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { User } from '../models/user.model';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private readonly currentUserSubject: BehaviorSubject<User | null>;
  public currentUser$: Observable<User | null>;
  private readonly apiBase = 'http://localhost:8081/api';

  constructor(
    private readonly http: HttpClient,
    @Inject(PLATFORM_ID) private readonly platformId: Object
  ) {
    let user: User | null = null;
    if (isPlatformBrowser(this.platformId)) {
      try {
        user = JSON.parse(localStorage.getItem('user') || 'null');
      } catch {
        user = null;
      }
    }
    this.currentUserSubject = new BehaviorSubject<User | null>(user);
    this.currentUser$ = this.currentUserSubject.asObservable();
  }

  login(credentials: { email: string; password: string }): Observable<User> {
    return this.http.post<User>(`${this.apiBase}/auth/login`, credentials)
      .pipe(
        tap(u => {
          if (isPlatformBrowser(this.platformId)) {
            localStorage.setItem('user', JSON.stringify(u));
          }
          this.currentUserSubject.next(u);
        })
      );
  }

  register(data: { name: string; cognome: string; email: string; password: string; indirizzo: string; telefono: string; ruolo: string }): Observable<User> {
    return this.http.post<User>(`${this.apiBase}/users/register`, data)
      .pipe(
        tap(u => {
          if (isPlatformBrowser(this.platformId)) {
            localStorage.setItem('user', JSON.stringify(u));
          }
          this.currentUserSubject.next(u);
        })
      );
  }

  logout(): void {
    if (isPlatformBrowser(this.platformId)) {
      localStorage.removeItem('user');
    }
    this.currentUserSubject.next(null);
  }

  get currentUserValue(): User | null {
    return this.currentUserSubject.value;
  }

  getUser(): User | null {
    return this.currentUserValue;
  }

  isLoggedIn(): boolean {
    if (!isPlatformBrowser(this.platformId)) {
      return false;
    }
    return !!localStorage.getItem('user');
  }
}
