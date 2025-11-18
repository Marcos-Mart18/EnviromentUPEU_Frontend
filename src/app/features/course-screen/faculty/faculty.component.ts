import { CommonModule } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Faculty } from '../../../core/models/faculty';
import { FacultyService } from '../../../core/services/faculty.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-faculty',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './faculty.component.html',
  styleUrl: './faculty.component.css',
})
export class FacultyComponent implements OnInit {
  private service = inject(FacultyService);
  private router = inject(Router);

  faculties: Faculty[] = [];
  name = '';
  editingId?: number | null = null;
  editingName = '';

  pendingDeleteId?: number | null = null;
  pendingDeleteName = '';
  lastDeleted?: Faculty | null = null;
  popupStyle: { [k: string]: string } | null = null;
  showToast = false;
  toastMessage = '';
  toastTimer: any = null;
  toastHasUndo = false;

  ngOnInit(): void {
    this.load();
  }

  load(): void {
    this.service.getFaculties().subscribe({
      next: (res: any) => {
        const items = Array.isArray(res?.data)
          ? res.data
          : Array.isArray(res)
          ? res
          : [];
        this.faculties = items.map(
          (item: any, idx: number) =>
            new Faculty(item.name ?? '', item.id ?? item.facultyId ?? idx + 1)
        );
      },
      error: () => {
        this.faculties = [];
      },
    });
  }

  create(): void {
    const n = this.name.trim();
    if (!n) return;
    this.service.createFaculty({ name: n }).subscribe({
      next: () => {
        this.name = '';
        this.load();
      },
      error: () => {
        this.showTransientToast('Error al crear facultad', 3000, false);
      },
    });
  }

  edit(f: Faculty): void {
    this.editingId = f.idFaculty;
    this.editingName = f.name;
  }

  cancel(): void {
    this.editingId = null;
    this.editingName = '';
  }

  save(): void {
    if (this.editingId == null) return;
    const n = this.editingName.trim();
    if (!n) return;
    const current = this.faculties.find((f) => f.idFaculty === this.editingId);
    this.service.updateFaculty(this.editingId, { name: n }).subscribe({
      next: () => {
        this.cancel();
        this.load();
      },
      error: () => {},
    });
  }

  confirmRemove(f: Faculty, ev?: MouseEvent): void {
    this.pendingDeleteId = f.idFaculty ?? null;
    this.pendingDeleteName = f.name;
    this.lastDeleted = new Faculty(f.name, f.idFaculty);

    try {
      const btn = ev?.currentTarget as HTMLElement | undefined;
      const react = btn ? btn.getBoundingClientRect() : undefined;
      const popupW = 224;
      const popupH = 96;
      let top: number;
      let left: number;
      if (react) {
        if (react.top > popupH + 20) {
          top = react.top - popupH - 8;
        } else {
          top = react.bottom + 8;
        }
        left = react.left + react.width / 2 - popupW / 2;

        const minLeft = 8;
        const maxLeft = Math.max(8, window.innerWidth - popupW - 8);
        if (left < minLeft) left = minLeft;
        if (left > maxLeft) left = maxLeft;
      } else {
        top = Math.max(8, window.innerHeight / 2 - popupH / 2);
        left = Math.max(8, window.innerWidth / 2 - popupW / 2);
      }
      this.popupStyle = {
        position: 'fixed',
        top: `${top}px`,
        left: `${left}px`,
      };
    } catch (e) {
      this.popupStyle = null;
    }
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
    };
    this.service.createFaculty(payload).subscribe({
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

  cancelRemove(): void {
    this.pendingDeleteId = null;
    this.pendingDeleteName = '';
    this.popupStyle = null;
  }

  /** Ejecuta la eliminación confirmada */
  performDeleteConfirmed(): void {
    if (!this.pendingDeleteId) return;
    const id = this.pendingDeleteId;
    this.service.deleteFaculty(id).subscribe({
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

  volver(): void {
    this.router.navigate(['/main/course-creation']);
  }
}
