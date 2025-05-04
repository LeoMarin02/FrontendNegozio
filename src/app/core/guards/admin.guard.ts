import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';

@Injectable({
  providedIn: 'root'
})
export class AdminGuard implements CanActivate {

  constructor(private readonly authService: AuthService, private readonly router: Router) {}

  canActivate(): boolean {
    const user = this.authService.currentUserValue;
    if (user && user.ruolo === 'ADMIN') {
      return true;
    }

    // Non autorizzato → torna alla home o login
    this.router.navigate(['/']);
    return false;
  }
}
