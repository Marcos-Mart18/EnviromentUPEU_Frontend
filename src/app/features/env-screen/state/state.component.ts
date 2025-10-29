import { CommonModule } from '@angular/common';
import { Component, OnInit, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { State } from '../../../core/models/state';
import { StateService } from '../../../core/services/state.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-state',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './state.component.html',
  styleUrls: ['./state.component.css'],
})
export class StateComponent implements OnInit {
  constructor(private router: Router) {}
  private env = inject(StateService);

  states: State[] = [];
  name = '';
  editingId?: number | null = null;
  editingName = '';
  editingIsActive = '';
  // para confirmar eliminación
  pendingDeleteId?: number | null = null;
  pendingDeleteName = '';
  // guarda el último borrado para permitir "deshacer"
  lastDeleted?: State | null = null;
  // estilo calculado para el popup de confirmación (fixed)
  popupStyle: { [k: string]: string } | null = null;
  // toast
  showToast = false;
  toastMessage = '';
  private toastTimer: any = null;
  toastHasUndo = false;

  ngOnInit(): void {
    this.load();
  }
  load(): void {
    this.env.getStates().subscribe({
      next: (res: any) => {
        const items = Array.isArray(res?.data)
          ? res.data
          : Array.isArray(res)
          ? res
          : [];
        this.states = items.map(
          (it: any, idx: number) =>
            new State(
              it.name ?? '—',
              it.is_active ?? 'A',
              it.id ?? it.id_state ?? idx + 1
            )
        );
        // ordenar: activos ('A') primero, luego inactivos; dentro de cada grupo por nombre
        this.states.sort((a, b) => {
          if (a.is_active === b.is_active) return a.name.localeCompare(b.name);
          return a.is_active === 'A' ? -1 : 1;
        });
      },
      error: () => {
        this.states = [];
      },
    });
  }

  /** Alterna el campo is_active ('A' <-> 'I') para un estado dado y guarda en backend */
  toggleState(s: State): void {
    if (!s || s.id_state == null) return;
    const newStatus = s.is_active === 'A' ? 'I' : 'A';
    // Enviar update usando el servicio existente
    this.env
      .updateState(s.id_state, { name: s.name, is_active: newStatus })
      .subscribe({
        next: () => {
          // reflejar cambio localmente sin recargar todo
          s.is_active = newStatus;
          // si estamos editando esta fila, mantener editingIsActive sincronizado
          if (this.editingId === s.id_state) this.editingIsActive = newStatus;
          // volver a ordenar la lista para mantener activos primero
          this.states.sort((a, b) => {
            if (a.is_active === b.is_active)
              return a.name.localeCompare(b.name);
            return a.is_active === 'A' ? -1 : 1;
          });
        },
        error: () => {},
      });
  }

  estadoChipClasses(is_active: string): string {
    return is_active === 'A'
      ? 'bg-green-100 text-green-700'
      : 'bg-gray-200 text-gray-700';
  }

  create(): void {
    const n = this.name.trim();
    if (!n) return;
    this.env.createState({ name: n, is_active: 'A' }).subscribe({
      next: () => {
        this.name = '';
        this.load();
      },
      error: () => {},
    });
  }

  edit(s: State): void {
    this.editingId = s.id_state;
    this.editingName = s.name;
    this.editingIsActive = s.is_active;
  }

  cancel(): void {
    this.editingId = null;
    this.editingName = '';
    this.editingIsActive = '';
  }

  save(): void {
    if (this.editingId == null) return;
    const n = this.editingName.trim();
    if (!n) return;
    // preferir el valor actual en la lista (si el usuario alternó el estado),
    // si no existe, usar el valor almacenado en editingIsActive o por defecto 'A'
    const current = this.states.find((st) => st.id_state === this.editingId);
    const is_active = current ? current.is_active : this.editingIsActive || 'A';
    this.env.updateState(this.editingId, { name: n, is_active }).subscribe({
      next: () => {
        this.cancel();
        this.load();
      },
      error: () => {},
    });
  }

  /** Abre la ventana de confirmación (desplegable) */
  confirmRemove(s: State, ev?: MouseEvent): void {
    this.pendingDeleteId = s.id_state ?? null;
    this.pendingDeleteName = s.name;
    // guardar copia para posible deshacer
    this.lastDeleted = new State(s.name, s.is_active, s.id_state);

    // calcular posición del popup respecto al botón (usar viewport coords)
    try {
      const btn = ev?.currentTarget as HTMLElement | undefined;
      const rect = btn ? btn.getBoundingClientRect() : undefined;
      const popupW = 224; // w-56
      const popupH = 96; // estimado
      let top: number;
      let left: number;
      if (rect) {
        // mostrar encima si hay espacio suficiente, si no debajo
        if (rect.top > popupH + 20) {
          top = rect.top - popupH - 8;
        } else {
          top = rect.bottom + 8;
        }
        // centrar horizontalmente respecto al botón
        left = rect.left + rect.width / 2 - popupW / 2;
        // clamp within viewport
        const minLeft = 8;
        const maxLeft = Math.max(8, window.innerWidth - popupW - 8);
        if (left < minLeft) left = minLeft;
        if (left > maxLeft) left = maxLeft;
      } else {
        top = Math.max(8, window.innerHeight / 2 - popupH / 2);
        left = Math.max(8, window.innerWidth / 2 - popupW / 2);
      }
      // usar position fixed para que quede fuera del flujo y no se recorte
      this.popupStyle = {
        position: 'fixed',
        top: `${top}px`,
        left: `${left}px`,
      };
    } catch (e) {
      this.popupStyle = null;
    }
  }

  /** Cancela la ventana de confirmación */
  cancelRemove(): void {
    this.pendingDeleteId = null;
    this.pendingDeleteName = '';
    this.popupStyle = null;
  }

  /** Ejecuta la eliminación confirmada */
  performDeleteConfirmed(): void {
    if (!this.pendingDeleteId) return;
    const id = this.pendingDeleteId;
    this.env.deleteState(id).subscribe({
      next: () => {
        this.pendingDeleteId = null;
        this.pendingDeleteName = '';
        this.load();
        // permitir deshacer durante unos segundos
        this.showTransientToast('Eliminado correctamente', 5000, true);
      },
      error: () => {
        this.pendingDeleteId = null;
        this.pendingDeleteName = '';
        this.showTransientToast('Error al eliminar', 3000, false);
      },
    });
  }

  private showTransientToast(
    message: string,
    ms = 3000,
    undoable = false
  ): void {
    this.toastMessage = message;
    this.showToast = true;
    this.toastHasUndo = undoable;
    if (this.toastTimer) {
      clearTimeout(this.toastTimer);
    }
    this.toastTimer = setTimeout(() => {
      this.showToast = false;
      this.toastMessage = '';
      this.toastHasUndo = false;
      // si no se deshizo, limpiar el lastDeleted para liberar memoria
      if (this.toastTimer == null) {
        // noop
      }
      this.toastTimer = null;
    }, ms);
  }

  undoDelete(): void {
    if (!this.lastDeleted) return;
    const payload = {
      name: this.lastDeleted.name,
      is_active: this.lastDeleted.is_active,
    };
    this.env.createState(payload).subscribe({
      next: () => {
        this.load();
        this.showTransientToast('Restaurado', 3000, false);
        this.lastDeleted = null;
      },
      error: () => {
        this.showTransientToast('Error al restaurar', 3000, false);
      },
    });
  }

  volver(): void {
    this.router.navigate(['/main/env-creation']);
  }
}