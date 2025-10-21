import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';

type ID = number;

interface TipoAmbiente {
  id: ID;
  nombre: string;
  descripcion: string;
  activo: boolean;
}


@Component({
  selector: 'app-type-env',
  imports: [CommonModule, FormsModule],
  templateUrl: './type-env.component.html',
  styleUrl: './type-env.component.css'
})
export class TypeEnvComponent {
constructor(private router: Router) {}

// --- Form (crear / editar) ---
nuevoNombre = '';
nuevaDescripcion = '';
editandoId: ID | null = null;

// --- Buscador ---
search = '';

// --- Datos de ejemplo ---
tipos: TipoAmbiente[] = [
  {
    id: 1,
    nombre: 'Sala de Reuniones A',
    descripcion: 'Una pequeña sala de reuniones para hasta 6 personas.',
    activo: true,
  },
  {
    id: 2,
    nombre: 'Salón de Conferencias B',
    descripcion: 'Un gran salón de conferencias para hasta 50 personas.',
    activo: true,
  },
  {
    id: 3,
    nombre: 'Sala de Capacitación C',
    descripcion:
      'Una sala de capacitación equipada con computadoras para 20 personas.',
    activo: false,
  },
  {
    id: 4,
    nombre: 'Estudio D',
    descripcion: 'Un estudio de grabación con insonorización.',
    activo: true,
  },
  {
    id: 5,
    nombre: 'Laboratorio E',
    descripcion: 'Un laboratorio con equipo especializado.',
    activo: true,
  },
];

get tiposFiltrados(): TipoAmbiente[] {
  const q = this.search.trim().toLowerCase();
  if (!q) return this.tipos;
  return this.tipos.filter(
    (t) =>
      t.nombre.toLowerCase().includes(q) ||
      t.descripcion.toLowerCase().includes(q),
  );
}

crearOActualizar(): void {
  const nombre = this.nuevoNombre.trim();
  const desc = this.nuevaDescripcion.trim();

  if (!nombre) return;

  if (this.editandoId == null) {
    // Crear
    const nuevo: TipoAmbiente = {
      id: this.nextId(),
      nombre,
      descripcion: desc,
      activo: true,
    };
    this.tipos = [nuevo, ...this.tipos];
  } else {
    // Guardar edición
    this.tipos = this.tipos.map((t) =>
      t.id === this.editandoId ? { ...t, nombre, descripcion: desc } : t,
    );
  }
  this.resetForm();
}

editar(t: TipoAmbiente): void {
  this.editandoId = t.id;
  this.nuevoNombre = t.nombre;
  this.nuevaDescripcion = t.descripcion;
  window.scrollTo({ top: 0, behavior: 'smooth' });
}

cancelarEdicion(): void {
  this.resetForm();
}

eliminar(t: TipoAmbiente): void {
  const ok = confirm(`¿Eliminar "${t.nombre}"?`);
  if (!ok) return;
  this.tipos = this.tipos.filter((x) => x.id !== t.id);
}

toggleEstado(t: TipoAmbiente): void {
  t.activo = !t.activo;
}

estadoChipClasses(activo: boolean): string {
  return activo
    ? 'bg-green-100 text-green-700'
    : 'bg-gray-200 text-gray-700';
}

// --- helpers ---
private nextId(): ID {
  return (Math.max(0, ...this.tipos.map((t) => t.id)) || 0) + 1;
}

private resetForm(): void {
  this.nuevoNombre = '';
  this.nuevaDescripcion = '';
  this.editandoId = null;
}

trackById = (_: number, item: TipoAmbiente) => item.id;

volver(): void {
  this.router.navigate(['/main/env-creation']);
}
}
