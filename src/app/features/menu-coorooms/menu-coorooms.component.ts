import { Component, OnInit } from '@angular/core';
import { RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-menu-coorooms',
  imports: [RouterLink, CommonModule],
  templateUrl: './menu-coorooms.component.html',
  styleUrl: './menu-coorooms.component.css'
})
export class MenuCooroomsComponent implements OnInit {
  currentDate = '';
  
  // Mock data - Replace with real data from service
  totalAmbientes = 15;
  totalRecursos = 120;
  
  ambientesList = [
    { nombre: 'Sala de Conferencias', recursos: 30 },
    { nombre: 'Oficina Principal', recursos: 45 },
    { nombre: 'Sala de Descanso', recursos: 15 },
    { nombre: 'Cocina', recursos: 10 },
    { nombre: 'Almacén', recursos: 20 }
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
      day: 'numeric' 
    };
    this.currentDate = now.toLocaleDateString('es-ES', options);
  }
}
