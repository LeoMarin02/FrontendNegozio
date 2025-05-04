import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { LoginComponent } from '../login/login.component';
import { RegisterComponent } from '../register/register.component';
import { AuthService } from '../../core/services/auth.service';
import { Inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    LoginComponent,
    RegisterComponent,

  ],
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
})
export class HomeComponent {
  logoUrl = '/assets/images/logo.png';
  showUserMenu = false;
  showMenMenu = false;
  menuTimeout: any;

  menuLeave() {
    this.menuTimeout = setTimeout(() => {
      this.showMenMenu = false;
    }, 200); 
  }


  constructor(
    public authService: AuthService,
    @Inject(PLATFORM_ID) private readonly platformId: Object
  ) {}

  showLogin = false;
  showRegister = false;

  collections = [
    {
      label: 'Donna',
      imageUrl: '/assets/images/women-category.png',
      link: '/products?gender=female',
    },
    {
      label: 'Uomo',
      imageUrl: '/assets/images/men-category.png',
      link: '/products?gender=male',
    },
  ];

  featuredProducts = [
    {
      id: 1,
      name: 'Felpa',
      price: 120,
      imageUrl: '/assets/images/sweatshirt.png',
    },
    {
      id: 2,
      name: 'Maglietta',
      price: 45,
      imageUrl: '/assets/images/tshirt.png',
    },
    {
      id: 3,
      name: 'Pantalone',
      price: 80,
      imageUrl: '/assets/images/pants.png',
    },
    { id: 4, name: 'Scarpa', price: 150, imageUrl: '/assets/images/shoe.png' },
  ];

  get userDisplayName(): string {
    const user = this.authService.currentUserValue;
    if (!user) return '';
    
    if (user.name && user.name.trim().length > 0) {  
      return user.name;
    }
  
    const prefix = user.email.split('@')[0];
    return prefix.charAt(0).toUpperCase() + prefix.slice(1);
  }
  
  


  handleUserIconClick(event: MouseEvent): void {
    event.stopPropagation();

    if (this.authService.isLoggedIn()) {
      this.showUserMenu = !this.showUserMenu;
    } else {
      this.openLogin();
    }
  }

  logout(event: MouseEvent): void {
    event.stopPropagation();
    this.authService.logout();
    this.showUserMenu = false;
  }

  onLoginSuccess(): void {
    this.closeLogin();
    this.showUserMenu = false;
  }

  ngOnInit(): void {
    if (isPlatformBrowser(this.platformId)) {
      document.addEventListener('click', () => {
        this.showUserMenu = false;
      });
    }
  }

  openLogin() {
    this.showLogin = true;
  }

  closeLogin(): void {
    this.showLogin = false;
  }

  openRegister(): void {
    this.showRegister = true;
  }
  closeRegister(): void {
    this.showRegister = false;
  }

  handleFromLoginRegister(): void {
    this.closeLogin();
    this.openRegister();
  }

  onSubscribe(e: Event) {
    e.preventDefault();
  }
}
