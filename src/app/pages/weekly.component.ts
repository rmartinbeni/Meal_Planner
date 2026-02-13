import { Component, signal, inject, OnInit, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { SupabaseService } from '../services/supabase.service';

type Recipe = { id: number; name: string };

@Component({
  selector: 'app-weekly',
  standalone: true,
  imports: [CommonModule],
  template: `
    <nav style="display:flex;gap:8px;margin-bottom:12px">
      <a routerLink="/">Semana</a>
      <a routerLink="/recipes">Recetas</a>
      <a routerLink="/ingredients">Ingredientes</a>
    </nav>

    <h2>Vista Semanal</h2>
    <table>
      <thead>
        <tr>
          <th>Día</th>
          <th>Desayuno</th>
          <th>Comida</th>
          <th>Cena</th>
        </tr>
      </thead>
      <tbody>
        <tr *ngFor="let day of days">
          <td>{{ day }}</td>
          <td>
            <select [value]="assignments()[day].breakfast ?? ''" (change)="setAssignment(day, 'breakfast', $any($event.target).value)">
              <option value="">—</option>
              <option *ngFor="let r of recipes()" [value]="r.id">{{ r.name }}</option>
            </select>
          </td>
          <td>
            <select [value]="assignments()[day].lunch ?? ''" (change)="setAssignment(day, 'lunch', $any($event.target).value)">
              <option value="">—</option>
              <option *ngFor="let r of recipes()" [value]="r.id">{{ r.name }}</option>
            </select>
          </td>
          <td>
            <select [value]="assignments()[day].dinner ?? ''" (change)="setAssignment(day, 'dinner', $any($event.target).value)">
              <option value="">—</option>
              <option *ngFor="let r of recipes()" [value]="r.id">{{ r.name }}</option>
            </select>
          </td>
        </tr>
      </tbody>
    </table>

    <p style="margin-top:12px">Asignaciones (estado local):</p>
    <pre>{{ assignments() | json }}</pre>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class WeeklyComponent implements OnInit {
  private readonly supabase = inject(SupabaseService).client;
  private readonly router = inject(Router);

  readonly days = ['Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado', 'Domingo'];

  readonly recipes = signal<Recipe[]>([]);

  readonly assignments = signal<Record<string, { breakfast: number | null; lunch: number | null; dinner: number | null }>>(
    this.days.reduce((acc, d) => ({ ...acc, [d]: { breakfast: null, lunch: null, dinner: null } }), {} as any)
  );

  async ngOnInit() {
    const { data, error } = await this.supabase.from('recipes').select('id, name');
    if (error) {
      console.error('Error loading recipes', error);
      return;
    }
    this.recipes.set((data as any) || []);
  }

  setAssignment(day: string, slot: 'breakfast' | 'lunch' | 'dinner', value: string) {
    const id = value === '' ? null : Number(value);
    this.assignments.update(prev => ({ ...prev, [day]: { ...prev[day], [slot]: id } }));
  }
}
