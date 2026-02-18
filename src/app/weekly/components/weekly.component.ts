import { ChangeDetectionStrategy, Component, inject, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { WeeklyService } from '@app/weekly/service/weekly.service';
import { TableComponent } from '@app/shared/table/table.component';

interface Recipe {
  id: number;
  name: string;
}

interface WeeklyMeal {
  meal: string;
  Monday: string;
  Tuesday: string;
  Wednesday: string;
  Thursday: string;
  Friday: string;
  Saturday: string;
  Sunday: string;
}

@Component({
  selector: 'meal-planner-weekly',
  imports: [CommonModule, TableComponent],
  templateUrl: './weekly.component.html',
  styleUrls: ['./weekly.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class WeeklyComponent implements OnInit {
  private readonly weeklyService = inject(WeeklyService);

  readonly recipes = signal<Recipe[]>([]);

  readonly columns: (keyof WeeklyMeal)[] = ['meal', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
  readonly data: WeeklyMeal[] = [
    { meal: 'Breakfast', Monday: '', Tuesday: '', Wednesday: '', Thursday: '', Friday: '', Saturday: '', Sunday: '' },
    { meal: 'Lunch',     Monday: '', Tuesday: '', Wednesday: '', Thursday: '', Friday: '', Saturday: '', Sunday: '' },
    { meal: 'Dinner',    Monday: '', Tuesday: '', Wednesday: '', Thursday: '', Friday: '', Saturday: '', Sunday: '' },
  ];

  ngOnInit() {
    void this.loadRecipes();
  }

  private async loadRecipes() {
    const { data, error } = await this.weeklyService.getAll();
    if (error) {
      console.error('Error loading recipes', error);
      return;
    }
    this.recipes.set((data as Recipe[]) ?? []);
  }
}
