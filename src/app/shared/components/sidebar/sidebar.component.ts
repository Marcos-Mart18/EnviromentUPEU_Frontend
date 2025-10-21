import { Component, inject } from '@angular/core';
import { RouterLink, Router, NavigationEnd } from '@angular/router';
import { CommonModule } from '@angular/common';
import { filter } from 'rxjs/operators';
import { AuthService } from '../../../core/services/auth.service';
import { User } from '../../../core/models/auth.model';

@Component({
  selector: 'app-sidebar',
  imports: [RouterLink, CommonModule],
  templateUrl: './sidebar.component.html',
  styleUrl: './sidebar.component.css'
})
export class SidebarComponent {
  private authService = inject(AuthService);
  horariosExpanded = false;
  currentRoute = '';
  currentUser: User | null = null;

  constructor(private router: Router) {
    this.router.events
      .pipe(filter(event => event instanceof NavigationEnd))
      .subscribe((event: NavigationEnd) => {
        this.currentRoute = event.url;
      });
    
    // Suscribirse al usuario actual
    this.authService.currentUser$.subscribe(user => {
      this.currentUser = user;
    });
  }

  toggleHorarios() {
    this.horariosExpanded = !this.horariosExpanded;
  }

  isActive(route: string): boolean {
    return this.currentRoute === route;
  }

  logout() {
    this.authService.logout().subscribe({
      next: () => {
        console.log('Logout exitoso');
      },
      error: (error) => {
        console.error('Error en logout', error);
      }
    });
  }

  getUserRole(): string {
    return this.currentUser?.roles?.[0]?.name || 'Usuario';
  }
}
