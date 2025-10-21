import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';

type ID = number;

interface Ambiente {
  id: ID;
  nombre: string;
  tipoId: number;
  recursosTotales: number;
  recursosDisponibles: number; // para el resumen “Disponibles”
  estado: 'Disponible' | 'Ocupado';
}

interface TipoAmbiente {
  id: number;
  nombre: string;
  slug: string;
}

@Component({
  selector: 'app-ambiente',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './ambiente.component.html',
  styleUrls: ['./ambiente.component.css'],
})
export class AmbienteComponent {
  // --- Colores base (coincide con el mock) ---
  readonly verde = '#BFC621';

  constructor(private router: Router) {}

  // --- Tipos disponibles para el select ---
  tipos: TipoAmbiente[] = [
    { id: 1, nombre: 'Sala de Reuniones', slug: 'reuniones' },
    { id: 2, nombre: 'Oficina', slug: 'oficina' },
    { id: 3, nombre: 'Laboratorio', slug: 'laboratorio' },
    { id: 4, nombre: 'Sala de Formación', slug: 'formacion' },
    { id: 5, nombre: 'Almacenamiento', slug: 'almacenamiento' },
  ];

  // --- Datos de ejemplo (tabla) ---
  ambientes: Ambiente[] = [
    {
      id: 1,
      nombre: 'Sala de Conferencias A',
      tipoId: 1,
      recursosTotales: 15,
      recursosDisponibles: 10,
      estado: 'Disponible',
    },
    {
      id: 2,
      nombre: 'Espacio de Oficina 1',
      tipoId: 2,
      recursosTotales: 20,
      recursosDisponibles: 0,
      estado: 'Ocupado',
    },
    {
      id: 3,
      nombre: 'Laboratorio 2',
      tipoId: 3,
      recursosTotales: 10,
      recursosDisponibles: 10,
      estado: 'Disponible',
    },
    {
      id: 4,
      nombre: 'Sala de Formación B',
      tipoId: 4,
      recursosTotales: 25,
      recursosDisponibles: 25,
      estado: 'Disponible',
    },
    {
      id: 5,
      nombre: 'Área de Almacenamiento 3',
      tipoId: 5,
      recursosTotales: 5,
      recursosDisponibles: 5,
      estado: 'Disponible',
    },
  ];

  // --- Form alta rápida ---
  nuevoNombre = '';
  nuevoTipoId: number | null = null;

  // --- Resúmenes (con “últimos 30 días”) ---
  prevTotal30d = 68;       // para ~+10% al redondear
  prevDisp30d = 52.6;      // para ~-5% al redondear

  // --- Helpers UI ---
  getTipoNombre(id: number): string {
    return this.tipos.find(t => t.id === id)?.nombre ?? '-';
  }

  get totalRecursos(): number {
    return this.ambientes.reduce((s, a) => s + a.recursosTotales, 0);
  }

  get totalDisponibles(): number {
    return Math.round(
      this.ambientes.reduce((s, a) => s + a.recursosDisponibles, 0)
    );
  }

  get totalOcupados(): number {
    return this.totalRecursos - this.totalDisponibles;
  }

  get cambioTotalPct(): number {
    return Math.round(((this.totalRecursos - this.prevTotal30d) / this.prevTotal30d) * 100);
  }

  get cambioDispPct(): number {
    return Math.round(((this.totalDisponibles - this.prevDisp30d) / this.prevDisp30d) * 100);
  }

  // Mini-barras (altura relativa)
  barAltura(recursos: number, maxPx = 120): number {
    const max = Math.max(...this.ambientes.map(a => a.recursosTotales), 1);
    return Math.max(6, Math.round((recursos / max) * maxPx));
  }

  barAlturaEstado(valor: number, maxPx = 140): number {
    const max = Math.max(this.totalDisponibles, this.totalOcupados, 1);
    return Math.max(6, Math.round((valor / max) * maxPx));
  }

  // Acciones
  crearAmbiente(): void {
    const nombre = this.nuevoNombre.trim();
    const tipoId = this.nuevoTipoId;
    if (!nombre || !tipoId) return;

    const nuevo: Ambiente = {
      id: (Math.max(0, ...this.ambientes.map(a => a.id)) || 0) + 1,
      nombre,
      tipoId,
      recursosTotales: 0,
      recursosDisponibles: 0,
      estado: 'Disponible',
    };
    this.ambientes = [nuevo, ...this.ambientes];
    this.nuevoNombre = '';
    this.nuevoTipoId = null;
  }

  editar(a: Ambiente): void {
    // Ejemplo simple: alterna estado al pulsar "Editar"
    a.estado = a.estado === 'Disponible' ? 'Ocupado' : 'Disponible';
    // Ajuste rápido de disponibles
    a.recursosDisponibles = a.estado === 'Disponible' ? a.recursosTotales : 0;
  }

  eliminar(a: Ambiente): void {
    const ok = confirm(`¿Eliminar "${a.nombre}"?`);
    if (!ok) return;
    this.ambientes = this.ambientes.filter(x => x.id !== a.id);
  }

  // Estilos dinámicos
  getBadgeClases(estado: Ambiente['estado']) {
    return estado === 'Disponible'
      ? 'bg-lime-100 text-lime-700 ring-1 ring-lime-200'
      : 'bg-amber-100 text-amber-700 ring-1 ring-amber-200';
  }

  trackById = (_: number, it: Ambiente) => it.id;

  volver(): void {
    this.router.navigate(['/main/env-creation']);
  }
}
