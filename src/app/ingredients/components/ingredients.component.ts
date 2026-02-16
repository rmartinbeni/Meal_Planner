import { ChangeDetectionStrategy, Component, inject, OnInit, signal } from '@angular/core';
import { IngredientsService } from '@app/ingredients/service/ingredients.service';
import { IngredientsFormComponent } from './form/ingredients.form.component';
import { TableComponent } from '@app/shared/table/table.component';
import { DialogModule } from 'primeng/dialog';

@Component({
  selector: 'meal-planner-ingredients',
  standalone: true,
  imports: [IngredientsFormComponent, TableComponent, DialogModule],
  templateUrl: './ingredients.component.html',
  styleUrls: ['./ingredients.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class IngredientsComponent implements OnInit {
  private readonly ingredientsService = inject(IngredientsService);

  readonly ingredients = signal<{ id: number; name: string }[]>([]);
  readonly errorMessage = signal('');
  readonly isFormVisible = signal(false);

  ngOnInit() {
    void this.load();
  }

  async load() {
    this.errorMessage.set('');
    const { data, error } = await this.ingredientsService.getAll();
    if (error) return this.errorMessage.set('Failed to load ingredients');
    this.ingredients.set(data || []);
  }

  showForm() {
    this.isFormVisible.set(true);
  }
}