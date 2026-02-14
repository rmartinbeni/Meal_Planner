import { ChangeDetectionStrategy, Component, output, inject, signal, effect } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { IngredientsService } from '@app/ingredients/service/ingredients.service';

@Component({
  selector: 'app-ingredients-form',
  standalone: true,
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
  readonly ingredientAdded = output<void>();

  async add() {
    const value = this.form.controls.name.value.trim();
    if (!value) return;

    const { error } = await this.ingredientsService.create(value);
    if (error) return this.errorMessage.set('Failed to add ingredient');

    this.form.controls.name.setValue('');
    this.ingredientAdded.emit();
    this.liveMessage.set('Ingrediente añadido');
  }

  constructor() {
    effect(() => {
      if (this.liveMessage()) {
        const el = document.getElementById('ingredient-name') as HTMLInputElement | null;
        el?.focus();
        setTimeout(() => this.liveMessage.set(''), 3000);
      }
    });
  }
}
