import { CommonModule } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CourseAssignmentCourse } from '../../../core/models/course-assignment-course';
import { CourseAssignmentCourseService } from '../../../core/services/course-assignment-course.service';
import { CourseService } from '../../../core/services/course.service';
import { CourseAssignmentService } from '../../../core/services/course-assignment.service';
import { Course } from '../../../core/models/course';
import { CourseAssignment } from '../../../core/models/course-assignment';
import { Router } from '@angular/router';
import { Teacher } from '../../../core/models/teacher';

@Component({
  selector: 'app-course-assignment-course',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './course-assignment-course.component.html',
  styleUrls: ['./course-assignment-course.component.css'],
})
export class CourseAssignmentCourseComponent implements OnInit {
  private service = inject(CourseAssignmentCourseService);
  private courseService = inject(CourseService);
  private assignmentService = inject(CourseAssignmentService);
  private router = inject(Router);

  items: CourseAssignmentCourse[] = [];
  courses: Course[] = [];
  assignments: CourseAssignment[] = [];

  selectedCourseId?: number | null = null;
  selectedAssignmentId?: number | null = null;

  editingId?: number | null = null;
  editingCourseId?: number | null = null;
  editingAssignmentId?: number | null = null;

  pendingDeleteId?: number | null = null;
  pendingDeleteName = '';
  lastDeleted?: CourseAssignmentCourse | null = null;
  popupStyle: { [k: string]: string } | null = null;

  showToast = false;
  toastMessage = '';
  toastTimer: any = null;
  toastHasUndo = false;

  ngOnInit(): void {
    this.load();
    this.loadCourses();
    this.loadAssignments();
  }

  load(): void {
    this.service.getCouseAssignmentCourse().subscribe({
      next: (res: any) => {
        const items = Array.isArray(res?.data)
          ? res.data
          : Array.isArray(res)
          ? res
          : [];
        this.items = items.map((item: any, idx: number) => {
          // Construir CourseAssignment (con su Teacher) y Course correctamente
          const teacherData = item.courseAssignment?.teacher ?? {};
          const teacher = new Teacher(
            teacherData.name ?? '',
            teacherData.lastName ?? teacherData.surname ?? '',
            teacherData.email ?? '',
            teacherData.idTeacher ?? teacherData.id ?? undefined
          );

          const courseAssignment = new CourseAssignment(
            teacher,
            item.courseAssignment?.idCourseAssignment ??
              item.courseAssignment?.id ??
              idx + 1
          );

          const courseData = item.course ?? {};
          const course = new Course(
            courseData.name ?? '',
            courseData.code ?? '',
            courseData.description ?? '',
            courseData.duration ?? 0,
            courseData.practicalHours ?? 0,
            courseData.theoreticalHours ?? 0,
            courseData.totalHours ?? 0,
            null as any,
            null as any,
            null as any,
            courseData.idCourse ?? courseData.id ?? idx + 1
          );

          return new CourseAssignmentCourse(
            courseAssignment,
            course,
            item.idCourseAssignmentCourse ?? item.id ?? idx + 1
          );
        });
      },
      error: () => (this.items = []),
    });
  }

  loadCourses(): void {
    this.courseService.getCourses().subscribe({
      next: (res: any) => {
        const items = Array.isArray(res?.data)
          ? res.data
          : Array.isArray(res)
          ? res
          : [];
        this.courses = items.map(
          (item: any, idx: number) =>
            new Course(
              item.name ?? '',
              item.code ?? '',
              item.description ?? '',
              item.duration ?? 0,
              item.practicalHours ?? 0,
              item.theoreticalHours ?? 0,
              item.totalHours ?? 0,
              null as any,
              null as any,
              null as any,
              item.idCourse ?? item.id ?? idx + 1
            )
        );
      },
      error: () => (this.courses = []),
    });
  }

  loadAssignments(): void {
    this.assignmentService.getCouseAssignment().subscribe({
      next: (res: any) => {
        const items = Array.isArray(res?.data)
          ? res.data
          : Array.isArray(res)
          ? res
          : [];
        this.assignments = items.map(
          (item: any, idx: number) =>
            new CourseAssignment(
              new (null as any)(),
              item.idCourseAssignment ?? item.id ?? idx + 1
            )
        );
      },
      error: () => (this.assignments = []),
    });
  }

  create(): void {
    if (!this.selectedCourseId || !this.selectedAssignmentId) return;
    this.service
      .createCourseType({
        idCourse: this.selectedCourseId,
        idCourseAssignment: this.selectedAssignmentId,
      })
      .subscribe({
        next: () => {
          this.selectedCourseId = null;
          this.selectedAssignmentId = null;
          this.load();
        },
        error: () =>
          this.showTransientToast('Error al crear vínculo', 3000, false),
      });
  }

  edit(it: CourseAssignmentCourse): void {
    this.editingId = it.idCourseAssignmentCourse;
    this.editingCourseId = it.course?.idCourse ?? null;
    this.editingAssignmentId = it.courseAssignment?.idCourseAssignment ?? null;
  }
  cancel(): void {
    this.editingId = null;
    this.editingCourseId = null;
    this.editingAssignmentId = null;
  }
  save(): void {
    if (
      this.editingId == null ||
      !this.editingCourseId ||
      !this.editingAssignmentId
    )
      return;
    this.service
      .updateCourseType(this.editingId, {
        idCourse: this.editingCourseId,
        idCourseAssignment: this.editingAssignmentId,
      })
      .subscribe({
        next: () => {
          this.cancel();
          this.load();
        },
        error: () =>
          this.showTransientToast('Error al actualizar', 3000, false),
      });
  }

  confirmRemove(it: CourseAssignmentCourse, ev?: MouseEvent): void {
    this.pendingDeleteId = it.idCourseAssignmentCourse ?? null;
    this.pendingDeleteName = `Vínculo ${it.idCourseAssignmentCourse ?? ''}`;
    this.lastDeleted = new CourseAssignmentCourse(
      it.courseAssignment,
      it.course,
      it.idCourseAssignmentCourse
    );
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
    const payload = {
      idCourse: this.lastDeleted.course?.idCourse!,
      idCourseAssignment:
        this.lastDeleted.courseAssignment?.idCourseAssignment!,
    };
    if (!payload.idCourse || !payload.idCourseAssignment) {
      this.showTransientToast(
        'No se puede restaurar: faltan datos',
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
