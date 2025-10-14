import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

interface Estado { id: number; nombre: string; activo: boolean; }

@Component({
  selector: 'app-resource-state',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './resource-state.component.html',
  styleUrls: ['./resource-state.component.css'],
})
export class ResourceStateComponent {
  readonly brand = '#BFC621';
  estados: Estado[] = [
    { id: 1, nombre: 'Disponible', activo: true },
    { id: 2, nombre: 'En uso', activo: true },
    { id: 3, nombre: 'Mantenimiento', activo: true },
  ];
  nombre = '';
  crear() {
    const n = this.nombre.trim(); if (!n) return;
    const id = (Math.max(0, ...this.estados.map(e => e.id)) || 0) + 1;
    this.estados = [{ id, nombre: n, activo: true }, ...this.estados];
    this.nombre = '';
  }
  toggle(e: Estado) { e.activo = !e.activo; }
  eliminar(e: Estado) {
    if (!confirm(`¿Eliminar estado "${e.nombre}"?`)) return;
    this.estados = this.estados.filter(x => x.id !== e.id);
  }
}
