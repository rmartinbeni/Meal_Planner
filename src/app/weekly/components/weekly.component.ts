import {
  ChangeDetectionStrategy,
  Component,
  inject,
  OnInit,
  signal,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { WeeklyService } from '@app/weekly/service/weekly.service';

type Recipe = { id: number; name: string };

@Component({
  selector: 'app-weekly',
  imports: [CommonModule],
  templateUrl: './weekly.component.html',
  styleUrls: ['./weekly.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class WeeklyComponent implements OnInit {
  private readonly weeklyService = inject(WeeklyService);

  readonly days = [
    'Lunes',
    'Martes',
    'Miércoles',
    'Jueves',
    'Viernes',
    'Sábado',
    'Domingo',
  ];
  readonly recipes = signal<Recipe[]>([]);
  readonly assignments = signal<
    Record<
      string,
      { breakfast: number | null; lunch: number | null; dinner: number | null }
    >
  >(
    Object.fromEntries(
      this.days.map((d) => [d, { breakfast: null, lunch: null, dinner: null }]),
    ),
  );

  async ngOnInit() {
    const { data, error } = await this.weeklyService.getAll();
    if (error) {
      console.error('Error loading recipes', error);
      return;
    }
    this.recipes.set((data as any) || []);
  }

  setAssignment(
    day: string,
    slot: 'breakfast' | 'lunch' | 'dinner',
    value: string,
  ) {
    const id = value === '' ? null : Number(value);
    this.assignments.update((prev) => ({
      ...prev,
      [day]: { ...prev[day], [slot]: id },
    }));
  }

  onAssignmentChange(
    e: Event,
    day: string,
    slot: 'breakfast' | 'lunch' | 'dinner',
  ) {
    const value = (e.target as HTMLSelectElement).value;
    this.setAssignment(day, slot, value);
  }
}
