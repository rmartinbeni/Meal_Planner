import {
  ChangeDetectionStrategy,
  Component,
  inject,
  OnInit,
  signal,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { IngredientsService } from '@app/ingredients/service/ingredients.service';
import { IngredientsFormComponent } from './form/ingredients.form.component';

@Component({
  selector: 'app-ingredients',
  standalone: true,
  imports: [CommonModule, IngredientsFormComponent],
  templateUrl: './ingredients.component.html',
  styleUrls: ['./ingredients.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class IngredientsComponent implements OnInit {
  private readonly ingredientsService = inject(IngredientsService);

  readonly ingredients = signal<{ id: number; name: string }[]>([]);
  readonly errorMessage = signal('');

  ngOnInit() {
    this.load();
  }

  async load() {
    this.errorMessage.set('');
    const { data, error } = await this.ingredientsService.getAll();
    if (error) return this.errorMessage.set('Failed to load ingredients');
    this.ingredients.set(data || []);
  }
}
