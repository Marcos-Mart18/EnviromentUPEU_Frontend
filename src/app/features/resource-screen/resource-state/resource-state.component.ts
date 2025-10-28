import { CommonModule } from '@angular/common';
import { Component, OnInit, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { ResourceState } from '../../../core/models/resource-state.model';
import { ResourceStateService } from '../../../core/services/resource-state.service';

@Component({
  selector: 'app-resource-state',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './resource-state.component.html',
})
export class ResourcesStateComponent implements OnInit {
  private readonly stateService = inject(ResourceStateService);
  private readonly router = inject(Router);

  states: ResourceState[] = [];
  name: string = '';
  isActive: boolean = true;
  editing: boolean = false;
  editingId: number | null = null;
  showStatesList: boolean = true;

  // Para confirmar eliminaciónjaksgdhjasgdjhagsdjhasgdjhagsjhasgdjhagsdhjagshdgasjhdgashjdgajhsdghjasgdjhasgdjhasgdj
  pendingDeleteId?: number | null = null;
  pendingDeleteName = '';
  lastDeleted?: ResourceState | null = null;
  popupStyle: { [k: string]: string } | null = null;

  // Variables para mostrar el mensaje de éxito
  showToast = false;
  toastMessage = '';
  toastSuccess = false;  // Para determinar si el mensaje es de éxito o error
  private toastTimer: any = null;

  ngOnInit(): void {
    this.loadStates();
  }

  loadStates(): void {
    this.stateService.getStates().subscribe({
      next: (data) => {
        console.log('Datos recibidos de la API:', data);
        this.states = data.map((state: any) => 
          new ResourceState(state.name, state.isActive, state.idState));
        console.log('Estados procesados:', this.states);
      },
      error: (err) => {
        console.error('Error al cargar los estados:', err);
      },
    });
  }

  createOrUpdate(): void {
    if (!this.name.trim()) {
      alert('Por favor ingresa un nombre para el estado.');
      return;
    }

    const body = { name: this.name.trim(), isActive: this.isActive };

    if (this.editing && this.editingId !== null) {
      this.stateService.updateState(this.editingId, body).subscribe({
        next: () => {
          this.loadStates();
          this.resetForm();
        },
        error: (err) => console.error('Error al actualizar el estado:', err),
      });
    } else {
      this.stateService.createState(body).subscribe({
        next: () => {
          this.loadStates();
          this.resetForm();
        },
        error: (err) => console.error('Error al crear el estado:', err),
      });
    }
  }

  edit(state: ResourceState): void {
    this.editing = true;
    this.editingId = state.idState ?? null;
    this.name = state.name;
    this.isActive = state.isActive;
  }

  // Abre la ventana de confirmación antes de eliminar
  confirmRemove(state: ResourceState, ev?: MouseEvent): void {
    this.pendingDeleteId = state.idState ?? null;
    this.pendingDeleteName = state.name;
    this.lastDeleted = new ResourceState(state.name, state.isActive, state.idState);

    // Calcular la posición del popup respecto al botón
    const btn = ev?.currentTarget as HTMLElement;
    const rect = btn?.getBoundingClientRect();
    const popupW = 224;
    const popupH = 96;
    let top: number;
    let left: number;

    if (rect) {
      top = rect.top > popupH + 20 ? rect.top - popupH - 8 : rect.bottom + 8;
      left = rect.left + rect.width / 2 - popupW / 2;
      const minLeft = 8;
      const maxLeft = Math.max(8, window.innerWidth - popupW - 8);
      left = Math.min(Math.max(left, minLeft), maxLeft);
    } else {
      top = Math.max(8, window.innerHeight / 2 - popupH / 2);
      left = Math.max(8, window.innerWidth / 2 - popupW / 2);
    }

    this.popupStyle = {
      position: 'fixed',
      top: `${top}px`,
      left: `${left}px`,
    };
  }

  // Cancela la ventana de confirmación
  cancelRemove(): void {
    this.pendingDeleteId = null;
    this.pendingDeleteName = '';
    this.popupStyle = null;
  }

  // Ejecuta la eliminación confirmada
  performDeleteConfirmed(): void {
    if (!this.pendingDeleteId) return;

    this.stateService.deleteState(this.pendingDeleteId).subscribe({
      next: () => {
        this.pendingDeleteId = null;
        this.pendingDeleteName = '';
        this.loadStates();
        this.showToastMessage('Eliminado correctamente', true);  // Popup verde de éxito
      },
      error: () => {
        this.pendingDeleteId = null;
        this.pendingDeleteName = '';
        this.showToastMessage('Error al eliminar', false);  // Popup rojo de error
      },
    });
  }

  // Mostrar mensaje toast (popup verde para éxito y rojo para error)
  private showToastMessage(message: string, isSuccess: boolean): void {
    this.toastMessage = message;
    this.showToast = true;
    this.toastSuccess = isSuccess;
    if (this.toastTimer) {
      clearTimeout(this.toastTimer);
    }
    this.toastTimer = setTimeout(() => {
      this.showToast = false;
      this.toastMessage = '';
      this.toastSuccess = false;
    }, 5000);
  }

  resetForm(): void {
    this.name = '';
    this.isActive = true;
    this.editing = false;
    this.editingId = null;
  }

  volver(): void {
    this.router.navigate(['/main/res-creation']);
  }
}
