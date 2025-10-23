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
      },
      error: () => {
        this.states = [];
      },
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
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  cancel(): void {
    this.editingId = null;
    this.editingName = '';
  }

  save(): void {
    if (this.editingId == null) return;
    const n = this.editingName.trim();
    if (!n) return;
    this.env
      .updateState(this.editingId, { name: n, is_active: 'A' })
      .subscribe({
        next: () => {
          this.cancel();
          this.load();
        },
        error: () => {},
      });
  }

  remove(s: State): void {
    const ok = confirm(`¿Eliminar "${s.name}"?`);
    if (!ok) return;
    this.env.deleteState(s.id_state).subscribe({
      next: () => this.load(),
      error: () => {},
    });
  }

  volver(): void {
    this.router.navigate(['/main/env-creation']);
  }
}
