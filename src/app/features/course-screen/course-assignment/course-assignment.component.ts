import { CommonModule } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CourseAssignment } from '../../../core/models/course-assignment';
import { CourseAssignmentService } from '../../../core/services/course-assignment.service';
import { TeacherService } from '../../../core/services/teacher.service';
import { Teacher } from '../../../core/models/teacher';
import { Router } from '@angular/router';

@Component({
  selector: 'app-course-assignment',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './course-assignment.component.html',
  styleUrls: ['./course-assignment.component.css'],
})
export class CourseAssignmentComponent implements OnInit {
  private service = inject(CourseAssignmentService);
  private teacherService = inject(TeacherService);
  private router = inject(Router);

  assignments: CourseAssignment[] = [];
  teachers: Teacher[] = [];

  selectedTeacherId?: number | null = null;

  editingId?: number | null = null;
  editingTeacherId?: number | null = null;

  pendingDeleteId?: number | null = null;
  pendingDeleteName = '';
  lastDeleted?: CourseAssignment | null = null;
  popupStyle: { [k: string]: string } | null = null;

  showToast = false;
  toastMessage = '';
  toastTimer: any = null;
  toastHasUndo = false;

  ngOnInit(): void {
    this.load();
    this.loadTeachers();
  }

  load(): void {
    this.service.getCouseAssignment().subscribe({
      next: (res: any) => {
        const items = Array.isArray(res?.data)
          ? res.data
          : Array.isArray(res)
          ? res
          : [];
        this.assignments = items.map(
          (item: any, idx: number) =>
            new CourseAssignment(
              new Teacher(
                item.teacher?.name ?? '',
                item.teacher?.lastName ?? '',
                item.teacher?.email ?? '',
                item.teacher?.idTeacher ?? idx + 1
              ),
              item.idCourseAssignment ?? item.id ?? idx + 1
            )
        );
      },
      error: () => (this.assignments = []),
    });
  }

  loadTeachers(): void {
    this.teacherService.getTeachers().subscribe({
      next: (res: any) => {
        const items = Array.isArray(res?.data)
          ? res.data
          : Array.isArray(res)
          ? res
          : [];
        this.teachers = items.map(
          (item: any, idx: number) =>
            new Teacher(
              item.name ?? '',
              item.lastName ?? '',
              item.email ?? '',
              item.idTeacher ?? item.id ?? idx + 1
            )
        );
      },
      error: () => (this.teachers = []),
    });
  }

  create(): void {
    if (!this.selectedTeacherId) return;
    this.service
      .createCourseType({ idTeacher: this.selectedTeacherId })
      .subscribe({
        next: () => {
          this.selectedTeacherId = null;
          this.load();
        },
        error: () =>
          this.showTransientToast('Error al crear asignación', 3000, false),
      });
  }

  edit(a: CourseAssignment): void {
    this.editingId = a.idCourseAssignment;
    this.editingTeacherId = a.teacher?.idTeacher ?? null;
  }
  cancel(): void {
    this.editingId = null;
    this.editingTeacherId = null;
  }
  save(): void {
    if (this.editingId == null || !this.editingTeacherId) return;
    this.service
      .updateCourseType(this.editingId, { idTeacher: this.editingTeacherId })
      .subscribe({
        next: () => {
          this.cancel();
          this.load();
        },
        error: () =>
          this.showTransientToast('Error al actualizar', 3000, false),
      });
  }

  confirmRemove(a: CourseAssignment, ev?: MouseEvent): void {
    this.pendingDeleteId = a.idCourseAssignment ?? null;
    this.pendingDeleteName = `Asignación ${a.idCourseAssignment ?? ''}`;
    this.lastDeleted = new CourseAssignment(a.teacher, a.idCourseAssignment);
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

  cancelRemove(): void {
    this.pendingDeleteId = null;
    this.pendingDeleteName = '';
    this.popupStyle = null;
  }

  performDeleteConfirmed(): void {
    if (!this.pendingDeleteId) return;
    const id = this.pendingDeleteId;
    this.service.deleteCourseType(id).subscribe({
      next: () => {
        this.pendingDeleteId = null;
        this.pendingDeleteName = '';
        this.load();
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
    if (this.toastTimer) clearTimeout(this.toastTimer);
    this.toastTimer = setTimeout(() => {
      this.showToast = false;
      this.toastMessage = '';
      this.toastHasUndo = false;
      this.toastTimer = null;
    }, ms);
  }

  undoDelete(): void {
    if (!this.lastDeleted) return;
    const payload = { idTeacher: this.lastDeleted.teacher?.idTeacher! };
    if (!payload.idTeacher) {
      this.showTransientToast(
        'No se puede restaurar: falta docente',
        3000,
        false
      );
      return;
    }
    this.service.createCourseType(payload).subscribe({
      next: () => {
        this.load();
        this.showTransientToast('Restaurado', 3000, false);
        this.lastDeleted = null;
      },
      error: () => this.showTransientToast('Error al restaurar', 3000, false),
    });
  }

  volver(): void {
    this.router.navigate(['/main/course-creation']);
  }
}
