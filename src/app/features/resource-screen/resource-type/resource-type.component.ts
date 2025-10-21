import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

interface Categoria { id: number; nombre: string; activo: boolean; }
interface Tipo { id: number; nombre: string; activo: boolean; categoriaId: number | null; }

@Component({
  selector: 'app-resource-type',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './resource-type.component.html',
  styleUrls: ['./resource-type.component.css'],
})
export class ResourceTypeComponent {
  readonly brand = '#BFC621';
  reassignTarget: Record<number, number | null> = {};

  categorias: Categoria[] = [
    { id: 1, nombre: 'Audiovisual', activo: true },
    { id: 2, nombre: 'Informática', activo: true },
  ];
  tipos: Tipo[] = [
    { id: 1, nombre: 'Proyector', activo: true, categoriaId: 1 },
    { id: 2, nombre: 'Portátil', activo: true, categoriaId: 2 },
  ];

  // form tipo
  nombreTipo = '';
  categoriaId: number | null = null;

  // form categoría inline
  nombreCat = '';

  getCategoriaNombre = (id: number | null) => this.categorias.find(c => c.id === id)?.nombre ?? '-';

  crearTipo() {
    const n = (this.nombreTipo || '').trim();
    if (!n || !this.categoriaId) return;
    const id = (Math.max(0, ...this.tipos.map(t => t.id)) || 0) + 1;
    this.tipos = [{ id, nombre: n, activo: true, categoriaId: this.categoriaId }, ...this.tipos];
    this.nombreTipo = ''; this.categoriaId = null;
  }

  crearCategoria() {
    const n = (this.nombreCat || '').trim();
    if (!n) return;
    const id = (Math.max(0, ...this.categorias.map(c => c.id)) || 0) + 1;
    this.categorias = [{ id, nombre: n, activo: true }, ...this.categorias];
    this.nombreCat = '';
  }

  toggleTipo(t: Tipo) { t.activo = !t.activo; }
  eliminarTipo(t: Tipo) {
    if (!confirm(`¿Eliminar tipo "${t.nombre}"?`)) return;
    this.tipos = this.tipos.filter(x => x.id !== t.id);
  }


// ¿Cuántos tipos usan una categoría?
usosDeCategoria(id: number): number {
  return this.tipos.filter(t => t.categoriaId === id).length;
}

// Eliminar si NO tiene usos
eliminarCategoria(cat: Categoria) {
  const usos = this.usosDeCategoria(cat.id);
  if (usos > 0) {
    alert(`No puedes eliminar "${cat.nombre}" porque ${usos} tipo(s) la usan. Reasigna o usa "Reasignar y eliminar".`);
    return;
  }
  if (!confirm(`¿Eliminar la categoría "${cat.nombre}"?`)) return;
  this.categorias = this.categorias.filter(c => c.id !== cat.id);
}

// Reasignar todos los tipos a otra categoría y eliminar
reasignarYEliminar(cat: Categoria, nuevoCatId: number | null) {
  if (!nuevoCatId || nuevoCatId === cat.id) return;
  if (!confirm(`Reasignar todos los tipos de "${cat.nombre}" y eliminarla?`)) return;

  this.tipos = this.tipos.map(t =>
    t.categoriaId === cat.id ? { ...t, categoriaId: nuevoCatId } : t
  );
  this.categorias = this.categorias.filter(c => c.id !== cat.id);
  delete this.reassignTarget[cat.id];
}

// Categorías destino (excluye la misma)
categoriasDestino(catId: number): Categoria[] {
  return this.categorias.filter(c => c.id !== catId);
}

}
