import { ChangeDetectionStrategy, Component, inject, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { WeeklyService } from '@app/weekly/service/weekly.service';
import { WeeklyFormComponent } from './form/weekly.form.component';

interface Recipe {
  id: number;
  name: string;
}

@Component({
  selector: 'meal-planner-weekly',
  imports: [CommonModule, WeeklyFormComponent],
  templateUrl: './weekly.component.html',
  styleUrls: ['./weekly.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class WeeklyComponent implements OnInit {
  private readonly weeklyService = inject(WeeklyService);

  readonly recipes = signal<Recipe[]>([]);

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
