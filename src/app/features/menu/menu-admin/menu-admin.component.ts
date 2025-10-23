import { Component, OnInit } from '@angular/core';
import { CalendarComponent } from '../../calendar/calendar.component';
import { RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-menu-admin',
  imports: [RouterLink, CommonModule],
  templateUrl: './menu-admin.component.html',
  styleUrl: './menu-admin.component.css',
})
export class MenuAdminComponent implements OnInit {
  currentDate = '';
  totalAmbientes = 15;
  totalRecursos = 120;

  ambientesList = [
    { nombre: 'Sala de Conferencias', recursos: 30 },
    { nombre: 'Oficina Principal', recursos: 45 },
    { nombre: 'Sala de Descanso', recursos: 15 },
    { nombre: 'Cocina', recursos: 10 },
    { nombre: 'Almacén', recursos: 20 },
  ];

  utilizacionRecursos = 75;
  tendenciaUso = 20;

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
