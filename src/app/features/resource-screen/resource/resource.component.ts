import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

type ID = number;

interface Ambiente { id: ID; nombre: string; }
interface Estado { id: ID; nombre: string; activo: boolean; }
interface Categoria { id: ID; nombre: string; activo: boolean; }
interface TipoRecurso { id: ID; nombre: string; activo: boolean; categoriaId: ID | null; }
interface Recurso {
  id: ID;
  nombre: string;
  ambienteId: ID | null;
  tipoId: ID;
  estadoId: ID;
}

@Component({
  selector: 'app-resource',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './resource.component.html',
  styleUrls: ['./resource.component.css'],
})
export class ResourceComponent {
  readonly brand = '#BFC621';

  // Mock de catálogos (simula que ya fueron creados en sus pantallas)
  ambientes: Ambiente[] = [
    { id: 1, nombre: 'Sala de Conferencias A' },
    { id: 2, nombre: 'Oficina 101' },
    { id: 3, nombre: 'Sala de Reuniones B' },
    { id: 4, nombre: 'Oficina 102' },
    { id: 5, nombre: 'Estudio' },
  ];

  estados: Estado[] = [
    { id: 1, nombre: 'Disponible', activo: true },
    { id: 2, nombre: 'En uso', activo: true },
    { id: 3, nombre: 'Mantenimiento', activo: true },
  ];

  categorias: Categoria[] = [
    { id: 1, nombre: 'Audiovisual', activo: true },
    { id: 2, nombre: 'Informática', activo: true },
  ];

  tipos: TipoRecurso[] = [
    { id: 1, nombre: 'Proyector', activo: true, categoriaId: 1 },
    { id: 2, nombre: 'Portátil', activo: true, categoriaId: 2 },
    { id: 3, nombre: 'Pizarra', activo: true, categoriaId: 1 },
    { id: 4, nombre: 'Impresora', activo: true, categoriaId: 2 },
    { id: 5, nombre: 'Micrófono', activo: true, categoriaId: 1 },
  ];

  recursos: Recurso[] = [
    { id: 1, nombre: 'Proyector',  ambienteId: 1, tipoId: 1, estadoId: 1 },
    { id: 2, nombre: 'Portátil',   ambienteId: 2, tipoId: 2, estadoId: 2 },
    { id: 3, nombre: 'Pizarra',    ambienteId: 3, tipoId: 3, estadoId: 1 },
    { id: 4, nombre: 'Impresora',  ambienteId: 4, tipoId: 4, estadoId: 3 },
    { id: 5, nombre: 'Micrófono',  ambienteId: 5, tipoId: 5, estadoId: 1 },
  ];

  // Form alta
  nombre = '';
  ambienteId: ID | null = null;
  tipoId: ID | null = null;
  estadoId: ID | null = null;

  // Helpers
  nextId(): ID { return (Math.max(0, ...this.recursos.map(r => r.id)) || 0) + 1; }
  getAmbiente = (id: ID | null) => this.ambientes.find(a => a.id === id)?.nombre ?? '-';
  getEstado  = (id: ID) => this.estados.find(e => e.id === id)?.nombre ?? '-';
  getTipo    = (id: ID) => this.tipos.find(t => t.id === id)?.nombre ?? '-';

  crear() {
    if (!this.tipoId || !this.estadoId) return; // requiere estado y tipo
    const r: Recurso = {
      id: this.nextId(),
      nombre: this.nombre.trim() || this.getTipo(this.tipoId),
      ambienteId: this.ambienteId ?? null,
      tipoId: this.tipoId,
      estadoId: this.estadoId,
    };
    this.recursos = [r, ...this.recursos];
    this.nombre = ''; this.ambienteId = null; this.tipoId = null; this.estadoId = null;
  }

  editar(r: Recurso) {
    // Demo: al hacer “Editar” cicla estados
    const idx = this.estados.findIndex(e => e.id === r.estadoId);
    const siguiente = this.estados[(idx + 1) % this.estados.length];
    r.estadoId = siguiente.id;
  }

  eliminar(r: Recurso) {
    if (!confirm(`¿Eliminar "${r.nombre}"?`)) return;
    this.recursos = this.recursos.filter(x => x.id !== r.id);
  }

  // Métricas
  get total(): number { return this.recursos.length; }
  get disponibles(): number {
    const dispId = this.estados.find(e => e.nombre.toLowerCase() === 'disponible')?.id;
    return this.recursos.filter(r => r.estadoId === dispId).length;
  }
  get porcentajeDisp(): number { return this.total ? Math.round((this.disponibles / this.total) * 100) : 0; }
  get porcentajeUso(): number { return 100 - this.porcentajeDisp; }

  // UI
  badgeClasses(nombre: string) {
    if (nombre === 'Disponible') return 'bg-lime-100 text-lime-700 ring-1 ring-lime-200';
    if (nombre === 'En uso')     return 'bg-slate-200 text-slate-700 ring-1 ring-slate-300';
    return 'bg-amber-100 text-amber-700 ring-1 ring-amber-200';
  }
}
