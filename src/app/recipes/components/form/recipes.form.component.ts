import {
  ChangeDetectionStrategy,
  Component,
  computed,
  inject,
  signal,
  output,
  input,
} from '@angular/core';
import { CommonModule } from '@angular/common';
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
  readonly recipeAdded = output<void>();

  readonly form = new FormGroup({ name: new FormControl('') });
  readonly selectedIngredients = signal<number[]>([]);
  readonly liveMessage = signal('');

  readonly selectedIngredientNames = computed(() => {
    const ids = this.selectedIngredients();
    const allIngs = this.ingredients();
    return ids.map((id) => allIngs.find((i) => i.id === id)?.name).filter(Boolean) as string[];
  });

  toggleIngredient(idStr: string) {
    const id = Number(idStr);
    if (!id) return;
    this.selectedIngredients.update((prev) =>
      prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id],
    );
  }

  async createRecipe() {
    const toInsert = {
      name: (this.form.get('name')?.value ?? '').toString(),
      ingredient_ids: this.selectedIngredients(),
    };
    const { error } = await this.recipeService.create(toInsert);
    if (error) return console.error('Error creating recipe', error);
    this.form.get('name')?.setValue('');
    this.selectedIngredients.set([]);
    this.recipeAdded.emit();
    this.liveMessage.set('Receta creada');
    const el = document.getElementById('recipe-name') as HTMLInputElement | null;
    el?.focus();
  }

  onToggleIngredient(e: Event) {
    const val = (e.target as HTMLSelectElement).value;
    this.toggleIngredient(val);
  }
}
