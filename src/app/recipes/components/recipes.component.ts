import {
  ChangeDetectionStrategy,
  Component,
  inject,
  OnInit,
  signal,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { RecipesService } from '@app/recipes/service/recipes.service';
import { IngredientsService } from '@app/ingredients/service/ingredients.service';
import { RecipesFormComponent } from './form/recipes.form.component';

type Ingredient = { id: number; name: string };

@Component({
  selector: 'app-recipes',
  standalone: true,
  imports: [CommonModule, RecipesFormComponent],
  templateUrl: './recipes.component.html',
  styleUrls: ['./recipes.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class RecipesComponent implements OnInit {
  private readonly recipeService = inject(RecipesService);
  private readonly ingredientService = inject(IngredientsService);

  readonly ingredients = signal<Ingredient[]>([]);
  readonly recipes = signal<{ id: number; name: string }[]>([]);

  async ngOnInit() {
    await this.loadIngredients();
    await this.loadRecipes();
  }

  async loadIngredients() {
    const { data, error } = await this.ingredientService.getAll();
    if (error) return console.error(error);
    this.ingredients.set((data as any) || []);
  }

  async loadRecipes() {
    const { data, error } = await this.recipeService.getAll();
    if (error) return console.error(error);
    this.recipes.set((data as any) || []);
  }
}
