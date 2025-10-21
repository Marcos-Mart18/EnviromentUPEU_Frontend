import { Component, OnInit, inject } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { CalendarComponent } from '../calendar/calendar.component';
import { MenuCooroomsComponent } from '../menu-coorooms/menu-coorooms.component';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../core/services/auth.service';

@Component({
  selector: 'app-menu',
  imports: [RouterLink, CalendarComponent, MenuCooroomsComponent, CommonModule],
  templateUrl: './menu.component.html',
  styleUrl: './menu.component.css'
})
export class MenuComponent implements OnInit {
  private authService = inject(AuthService);
  private router = inject(Router);
  
  currentDate = '';
  showAsacadMenu = false;
  showCooroomsMenu = false;

  ngOnInit() {
    this.updateCurrentDate();
    this.checkUserRole();
  }

  checkUserRole() {
    const user = this.authService.getCurrentUser();
    if (user) {
      this.showAsacadMenu = this.authService.hasRole('ASACAD');
      this.showCooroomsMenu = this.authService.hasRole('COOROOMS');
      
      // If no valid role, redirect to home or show error
      if (!this.showAsacadMenu && !this.showCooroomsMenu) {
        console.warn('User does not have a valid role for menu access');
      }
    }
  }

  updateCurrentDate() {
    const now = new Date();
    const options: Intl.DateTimeFormatOptions = { 
      weekday: 'long', 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    };
    this.currentDate = now.toLocaleDateString('es-ES', options);
  }
}
