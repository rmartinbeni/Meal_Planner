import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  computed,
  inject,
  input,
  output,
  signal,
} from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { RecipesService } from '@app/recipes/service/recipes.service';

interface Ingredient {
  id: number;
  name: string;
}

@Component({
  selector: 'meal-planner-recipes-form',
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './recipes.form.component.html',
  styleUrls: ['./recipes.form.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class RecipesFormComponent {
  private readonly recipeService = inject(RecipesService);

  readonly ingredients = input.required<Ingredient[]>();
  readonly recipeAdded = output();

  readonly form = new FormGroup({ name: new FormControl('') });
  readonly selectedIngredients = signal<number[]>([]);
  readonly liveMessage = signal('');

  // eslint-disable-next-line unicorn/consistent-function-scoping
  readonly selectedIngredientNames = computed(() => {
    const ids = this.selectedIngredients();
    const allIngs = this.ingredients();
    return ids
      .map((id) => allIngs.find((index) => index.id === id)?.name)
      .filter(Boolean) as string[];
  });

  toggleIngredient(idString: string) {
    const id = Number(idString);
    if (!id) return;
    this.selectedIngredients.update((previous) =>
      previous.includes(id) ? previous.filter((index) => index !== id) : [...previous, id],
    );
  }

  async createRecipe() {
    const toInsert = {
      name: this.form.get('name')?.value ?? '',
      ingredient_ids: this.selectedIngredients(),
    };
    const { error } = await this.recipeService.create(toInsert);
    if (error) {
      console.error('Error creating recipe', error);
      return;
    }
    this.form.get('name')?.setValue('');
    this.selectedIngredients.set([]);
    this.recipeAdded.emit();
    this.liveMessage.set('Recipe created');
    const element = document.querySelector<HTMLElement>('#recipe-name');
    element?.focus();
  }

  onToggleIngredient(event: Event) {
    const value = (event.target as HTMLSelectElement).value;
    this.toggleIngredient(value);
  }
}
