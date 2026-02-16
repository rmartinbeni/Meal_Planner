import { ChangeDetectionStrategy, Component, input, signal } from '@angular/core';
import { CommonModule } from '@angular/common';

interface Recipe {
  id: number;
  name: string;
}

@Component({
  selector: 'meal-planner-weekly-form',
  imports: [CommonModule],
  templateUrl: './weekly.form.component.html',
  styleUrls: ['./weekly.form.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class WeeklyFormComponent {
  readonly recipes = input.required<Recipe[]>();

  readonly days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
  readonly assignments = signal<
    Record<string, { breakfast: number | null; lunch: number | null; dinner: number | null }>
  >(Object.fromEntries(this.days.map((d) => [d, { breakfast: null, lunch: null, dinner: null }])));

  setAssignment(day: string, slot: 'breakfast' | 'lunch' | 'dinner', value: string) {
    const id = value === '' ? null : Number(value);
    this.assignments.update((prev) => ({
      ...prev,
      [day]: { ...prev[day], [slot]: id },
    }));
  }

  onAssignmentChange(e: Event, day: string, slot: 'breakfast' | 'lunch' | 'dinner') {
    const value = (e.target as HTMLSelectElement).value;
    this.setAssignment(day, slot, value);
  }
}
