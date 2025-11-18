import { CommonModule } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Course } from '../../../core/models/course';
import { CourseService } from '../../../core/services/course.service';
import { CourseTypeService } from '../../../core/services/course-type.service';
import { GroupService } from '../../../core/services/group.service';
import { PlanService } from '../../../core/services/plan.service';
import { CourseType } from '../../../core/models/course-type';
import { Group } from '../../../core/models/group';
import { Plan } from '../../../core/models/plan';
import { Router } from '@angular/router';

@Component({
  selector: 'app-course',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './course.component.html',
  styleUrls: ['./course.component.css'],
})
export class CourseComponent implements OnInit {
  private service = inject(CourseService);
  private typeService = inject(CourseTypeService);
  private groupService = inject(GroupService);
  private planService = inject(PlanService);
  private router = inject(Router);

  items: Course[] = [];
  types: CourseType[] = [];
  groups: Group[] = [];
  plans: Plan[] = [];

  // create fields
  name = '';
  code = '';
  description = '';
  duration = 0;
  // store minutes internally
  durationMins = 0;
  practicalMins = 0;
  theoreticalMins = 0;
  totalMins = 0;
  // create form split fields
  practicalHoursInput = 0; // hours
  practicalMinutesInput = 0; // minutes
  theoreticalHoursInput = 0;
  theoreticalMinutesInput = 0;
  totalHoursInput = 0;
  totalMinutesInput = 0;
  durationHoursInput = 0;
  durationMinutesInput = 0;
  selectedTypeId?: number | null = null;
  selectedGroupId?: number | null = null;
  selectedPlanId?: number | null = null;

  // editing
  editingId?: number | null = null;
  editingName = '';
  editingCode = '';
  editingDescription = '';
  // editing stored as minutes
  editingDurationMins = 0;
  editingPracticalMins = 0;
  editingTheoreticalMins = 0;
  editingTotalMins = 0;
  // editing split fields
  editingPracticalHours = 0;
  editingPracticalMinutes = 0;
  editingTheoreticalHours = 0;
  editingTheoreticalMinutes = 0;
  editingTotalHours = 0;
  editingTotalMinutes = 0;
  editingDurationHours = 0;
  editingDurationMinutes = 0;
  editingTypeId?: number | null = null;
  editingGroupId?: number | null = null;
  editingPlanId?: number | null = null;

  pendingDeleteId?: number | null = null;
  pendingDeleteName = '';
  lastDeleted?: Course | null = null;
  popupStyle: { [k: string]: string } | null = null;

  showToast = false;
  toastMessage = '';
  toastTimer: any = null;
  toastHasUndo = false;

  ngOnInit(): void {
    this.load();
    this.loadRelations();
  }

  // Helper to format minutes as "Xh Ym"
  formatMinutes(mins?: number | null): string {
    const m = Number(mins ?? 0) || 0;
    const h = Math.floor(m / 60);
    const mm = m % 60;
    return `${h}h ${mm}m`;
  }

  load(): void {
    this.service.getCourses().subscribe({
      next: (res: any) => {
        const items = Array.isArray(res?.data)
          ? res.data
          : Array.isArray(res)
          ? res
          : [];
        this.items = items.map((item: any, idx: number) => {
          const parseDur = (v: any) => {
            if (typeof v === 'string') return this.isoDurationToMinutes(v);
            if (typeof v === 'number') return Number(v);
            return 0;
          };
          const durationM = parseDur(
            item.duration ?? item.durationISO ?? item.durationString
          );
          const practicalM = parseDur(
            item.practicalHours ??
              item.practicalHoursISO ??
              item.practicalHoursString
          );
          const theoreticalM = parseDur(
            item.theoreticalHours ??
              item.theoreticalHoursISO ??
              item.theoreticalHoursString
          );
          const totalM = parseDur(
            item.totalHours ?? item.totalHoursISO ?? item.totalHoursString
          );

          const courseType = new CourseType(
            item.courseType?.name ?? '',
            item.courseType?.idCourseType ?? item.courseType?.id ?? idx + 1
          );
          const group = new Group(
            item.group?.groupNumber ?? 0,
            item.group?.capacity ?? 0,
            null as any,
            item.group?.idGroup ?? item.group?.id ?? idx + 1
          );
          const plan = new Plan(
            item.plan?.name ?? '',
            item.plan?.idPlan ?? item.plan?.id ?? idx + 1
          );

          const c = new Course(
            item.name ?? '',
            item.code ?? '',
            item.description ?? '',
            durationM,
            practicalM,
            theoreticalM,
            totalM,
            courseType,
            group,
            plan,
            item.idCourse ?? item.id ?? idx + 1
          );
          return c;
        });
      },
      error: () => (this.items = []),
    });
  }

  // Convert ISO 8601 duration string (e.g. PT4H30M) to total minutes
  private isoDurationToMinutes(iso?: string | null): number {
    if (!iso || typeof iso !== 'string') return 0;
    // Matches PT#H#M#S variants
    const m = iso.match(/P(?:T)?(?:(\d+)H)?(?:(\d+)M)?(?:(\d+)S)?/);
    if (!m) return 0;
    const hours = parseInt(m[1] ?? '0', 10) || 0;
    const minutes = parseInt(m[2] ?? '0', 10) || 0;
    const seconds = parseInt(m[3] ?? '0', 10) || 0;
    return hours * 60 + minutes + Math.round(seconds / 60);
  }

  // Convert total minutes to ISO 8601 duration string
  private minutesToIsoDuration(totalMinutes: number): string {
    if (!totalMinutes || totalMinutes <= 0) return 'PT0S';
    const h = Math.floor(totalMinutes / 60);
    const m = totalMinutes % 60;
    let s = 'PT';
    if (h) s += `${h}H`;
    if (m) s += `${m}M`;
    return s;
  }

  loadRelations(): void {
    this.typeService.getCourseTypes().subscribe({
      next: (res: any) => {
        const items = Array.isArray(res?.data)
          ? res.data
          : Array.isArray(res)
          ? res
          : [];
        this.types = items.map(
          (item: any, idx: number) =>
            new CourseType(
              item.name ?? '',
              item.idCourseType ?? item.id ?? idx + 1
            )
        );
      },
      error: () => (this.types = []),
    });
    this.groupService.getGroups().subscribe({
      next: (res: any) => {
        const items = Array.isArray(res?.data)
          ? res.data
          : Array.isArray(res)
          ? res
          : [];
        this.groups = items.map(
          (item: any, idx: number) =>
            new Group(
              item.groupNumber ?? 0,
              item.capacity ?? 0,
              null as any,
              item.idGroup ?? item.id ?? idx + 1
            )
        );
      },
      error: () => (this.groups = []),
    });
    this.planService.getPlans().subscribe({
      next: (res: any) => {
        const items = Array.isArray(res?.data)
          ? res.data
          : Array.isArray(res)
          ? res
          : [];
        this.plans = items.map(
          (item: any, idx: number) =>
            new Plan(item.name ?? '', item.idPlan ?? item.id ?? idx + 1)
        );
      },
      error: () => (this.plans = []),
    });
  }

  create(): void {
    const n = this.name.trim();
    if (
      !n ||
      !this.selectedTypeId ||
      !this.selectedGroupId ||
      !this.selectedPlanId
    )
      return;
    // build minutes from inputs
    const durationTotal =
      Number(this.durationHoursInput || 0) * 60 +
      Number(this.durationMinutesInput || 0);
    const practicalTotal =
      Number(this.practicalHoursInput || 0) * 60 +
      Number(this.practicalMinutesInput || 0);
    const theoreticalTotal =
      Number(this.theoreticalHoursInput || 0) * 60 +
      Number(this.theoreticalMinutesInput || 0);
    const totalTotal =
      Number(this.totalHoursInput || 0) * 60 +
      Number(this.totalMinutesInput || 0);

    this.service
      .createCourse({
        name: n,
        code: this.code,
        description: this.description,
        duration: durationTotal,
        practicalHours: practicalTotal,
        theoreticalHours: theoreticalTotal,
        totalHours: totalTotal,
        idCourseType: this.selectedTypeId,
        idGroup: this.selectedGroupId,
        idPlan: this.selectedPlanId,
      })
      .subscribe({
        next: () => {
          this.name = '';
          this.code = '';
          this.description = '';
          this.durationMins = 0;
          this.practicalMins = 0;
          this.theoreticalMins = 0;
          this.totalMins = 0;
          this.practicalHoursInput = 0;
          this.practicalMinutesInput = 0;
          this.theoreticalHoursInput = 0;
          this.theoreticalMinutesInput = 0;
          this.totalHoursInput = 0;
          this.totalMinutesInput = 0;
          this.selectedTypeId = null;
          this.selectedGroupId = null;
          this.selectedPlanId = null;
          this.load();
        },
        error: () =>
          this.showTransientToast('Error al crear curso', 3000, false),
      });
  }

  edit(it: Course): void {
    this.editingId = it.idCourse;
    this.editingName = it.name;
    this.editingCode = it.code;
    this.editingDescription = it.description;
    this.editingDurationMins = Number(it.duration ?? 0);
    this.editingPracticalMins = Number(it.practicalHours ?? 0);
    this.editingTheoreticalMins = Number(it.theoreticalHours ?? 0);
    this.editingTotalMins = Number(it.totalHours ?? 0);
    // split into hours/minutes for editing UI
    this.editingPracticalHours = Math.floor(this.editingPracticalMins / 60);
    this.editingPracticalMinutes = this.editingPracticalMins % 60;
    this.editingTheoreticalHours = Math.floor(this.editingTheoreticalMins / 60);
    this.editingTheoreticalMinutes = this.editingTheoreticalMins % 60;
    this.editingTotalHours = Math.floor(this.editingTotalMins / 60);
    this.editingTotalMinutes = this.editingTotalMins % 60;
    // split duration into hours/minutes
    this.editingDurationHours = Math.floor(this.editingDurationMins / 60);
    this.editingDurationMinutes = this.editingDurationMins % 60;
    this.editingTypeId = it.courseType?.idCourseType ?? null;
    this.editingGroupId = it.group?.idGroup ?? null;
    this.editingPlanId = it.plan?.idPlan ?? null;
  }
  cancel(): void {
    this.editingId = null;
    this.editingName = '';
    this.editingCode = '';
    this.editingDescription = '';
    this.editingDurationMins = 0;
    this.editingDurationHours = 0;
    this.editingDurationMinutes = 0;
    this.editingPracticalMins = 0;
    this.editingTheoreticalMins = 0;
    this.editingTotalMins = 0;
    this.editingPracticalHours = 0;
    this.editingPracticalMinutes = 0;
    this.editingTheoreticalHours = 0;
    this.editingTheoreticalMinutes = 0;
    this.editingTotalHours = 0;
    this.editingTotalMinutes = 0;
    this.editingTypeId = null;
    this.editingGroupId = null;
    this.editingPlanId = null;
  }
  save(): void {
    if (this.editingId == null) return;
    const n = this.editingName.trim();
    if (
      !n ||
      !this.editingTypeId ||
      !this.editingGroupId ||
      !this.editingPlanId
    )
      return;

    const practicalTotal =
      Number(this.editingPracticalHours || 0) * 60 +
      Number(this.editingPracticalMinutes || 0);
    const theoreticalTotal =
      Number(this.editingTheoreticalHours || 0) * 60 +
      Number(this.editingTheoreticalMinutes || 0);
    const totalTotal =
      Number(this.editingTotalHours || 0) * 60 +
      Number(this.editingTotalMinutes || 0);
    const durationTotal =
      Number(this.editingDurationHours || 0) * 60 +
      Number(this.editingDurationMinutes || 0);

    this.service
      .updateCourse(this.editingId, {
        name: n,
        code: this.editingCode,
        description: this.editingDescription,
        duration: durationTotal,
        practicalHours: practicalTotal,
        theoreticalHours: theoreticalTotal,
        totalHours: totalTotal,
        idCourseType: this.editingTypeId,
        idGroup: this.editingGroupId,
        idPlan: this.editingPlanId,
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

  confirmRemove(it: Course, ev?: MouseEvent): void {
    this.pendingDeleteId = it.idCourse ?? null;
    this.pendingDeleteName = it.name;
    this.lastDeleted = new Course(
      it.name,
      it.code,
      it.description,
      it.duration,
      it.practicalHours,
      it.theoreticalHours,
      it.totalHours,
      it.courseType,
      it.group,
      it.plan,
      it.idCourse
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
    this.service.deleteCourse(id).subscribe({
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
      name: this.lastDeleted.name,
      code: this.lastDeleted.code,
      description: this.lastDeleted.description,
      duration: Number(this.lastDeleted.duration ?? 0),
      practicalHours: Number(this.lastDeleted.practicalHours ?? 0),
      theoreticalHours: Number(this.lastDeleted.theoreticalHours ?? 0),
      totalHours: Number(this.lastDeleted.totalHours ?? 0),
      idCourseType: this.lastDeleted.courseType?.idCourseType!,
      idGroup: this.lastDeleted.group?.idGroup!,
      idPlan: this.lastDeleted.plan?.idPlan!,
    };
    if (!payload.idCourseType || !payload.idGroup || !payload.idPlan) {
      this.showTransientToast(
        'No se puede restaurar: faltan referencias',
        3000,
        false
      );
      return;
    }
    this.service.createCourse(payload).subscribe({
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
