import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, input, signal } from '@angular/core';

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
    Record<
      string,
      { breakfast: number | undefined; lunch: number | undefined; dinner: number | undefined }
    >
  >(
    Object.fromEntries(
      this.days.map((d) => [d, { breakfast: undefined, lunch: undefined, dinner: undefined }]),
    ),
  );

  setAssignment(day: string, slot: 'breakfast' | 'lunch' | 'dinner', value: string) {
    const id = value === '' ? undefined : Number(value);
    this.assignments.update((previous) => ({
      ...previous,
      [day]: {
        ...(previous[day] ?? { breakfast: undefined, lunch: undefined, dinner: undefined }),
        [slot]: id,
      },
    }));
  }

  onAssignmentChange(event: Event, day: string, slot: 'breakfast' | 'lunch' | 'dinner') {
    const value = (event.target as HTMLSelectElement).value;
    this.setAssignment(day, slot, value);
  }
}
