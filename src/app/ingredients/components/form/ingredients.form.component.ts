import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, effect, inject, output, signal } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { IngredientsService } from '@app/ingredients/service/ingredients.service';

@Component({
  selector: 'meal-planner-ingredients-form',
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './ingredients.form.component.html',
  styleUrls: ['./ingredients.form.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class IngredientsFormComponent {
  private readonly ingredientsService = inject(IngredientsService);

  readonly form = new FormGroup<{ name: FormControl<string> }>({
    name: new FormControl('', { nonNullable: true }),
  });
  readonly liveMessage = signal('');
  readonly errorMessage = signal('');
  readonly ingredientAdded = output();

  async add() {
    const value = this.form.controls.name.value.trim();
    if (!value) return;

    const { error } = await this.ingredientsService.create(value);
    if (error) {
      this.errorMessage.set('Failed to add ingredient');
      return;
    }

    this.form.controls.name.setValue('');
    this.ingredientAdded.emit();
    this.liveMessage.set('Ingredient added');
  }

  constructor() {
    effect(() => {
      if (this.liveMessage()) {
        const element = document.querySelector<HTMLElement>('#ingredient-name');
        element?.focus();
        setTimeout(() => {
          this.liveMessage.set('');
        }, 3000);
      }
    });
  }
}
