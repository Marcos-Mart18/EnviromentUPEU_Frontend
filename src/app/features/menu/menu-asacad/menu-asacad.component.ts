import { Component, OnInit } from '@angular/core';
import { CalendarComponent } from '../../calendar/calendar.component';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-menu-asacad',
  imports: [RouterLink, CalendarComponent],
  templateUrl: './menu-asacad.component.html',
  styleUrl: './menu-asacad.component.css',
})
export class MenuAsacadComponent implements OnInit {
  currentDate = '';

  ngOnInit() {
    this.updateCurrentDate();
  }

  updateCurrentDate() {
    const now = new Date();
    const options: Intl.DateTimeFormatOptions = {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    };
    this.currentDate = now.toLocaleDateString('es-ES', options);
  }
}
