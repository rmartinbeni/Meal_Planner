import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { TableComponent } from '@app/shared/table/table.component';
import { WeeklyMeal } from '@app/weekly/domain/weekly-meal.model';
import { WeeklyService } from '@app/weekly/service/weekly.service';
import { ButtonModule } from 'primeng/button';

@Component({
  selector: 'meal-planner-weekly',
  imports: [TableComponent, ButtonModule],
  templateUrl: './weekly.component.html',
  styleUrls: ['./weekly.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class WeeklyComponent {
  private readonly weeklyService = inject(WeeklyService);

  readonly isLoading = signal(false);

  readonly columns: (keyof WeeklyMeal)[] = [
    'meal',
    'Monday',
    'Tuesday',
    'Wednesday',
    'Thursday',
    'Friday',
    'Saturday',
    'Sunday',
  ];

  readonly data = signal<WeeklyMeal[]>([
    {
      meal: 'Breakfast',
      Monday: '',
      Tuesday: '',
      Wednesday: '',
      Thursday: '',
      Friday: '',
      Saturday: '',
      Sunday: '',
    },
    {
      meal: 'Lunch',
      Monday: '',
      Tuesday: '',
      Wednesday: '',
      Thursday: '',
      Friday: '',
      Saturday: '',
      Sunday: '',
    },
    {
      meal: 'Dinner',
      Monday: '',
      Tuesday: '',
      Wednesday: '',
      Thursday: '',
      Friday: '',
      Saturday: '',
      Sunday: '',
    },
  ]);

  async randomizeWeek() {
    this.isLoading.set(true);
    try {
      const randomWeek = await this.weeklyService.generateRandomWeek();
      this.data.set(randomWeek);
    } finally {
      this.isLoading.set(false);
    }
  }
}
