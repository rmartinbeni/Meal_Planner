import { ChangeDetectionStrategy, Component, inject, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RecipesService } from '@app/recipes/service/recipes.service';
import { IngredientsService } from '@app/ingredients/service/ingredients.service';
import { RecipesFormComponent } from './form/recipes.form.component';

interface Ingredient {
  id: number;
  name: string;
}

interface Recipe {
  id: number;
  name: string;
}

@Component({
  selector: 'meal-planner-recipes',
  imports: [CommonModule, RecipesFormComponent],
  templateUrl: './recipes.component.html',
  styleUrls: ['./recipes.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class RecipesComponent implements OnInit {
  private readonly recipeService = inject(RecipesService);
  private readonly ingredientService = inject(IngredientsService);

  readonly ingredients = signal<Ingredient[]>([]);
  readonly recipes = signal<Recipe[]>([]);

  ngOnInit() {
    void this.loadIngredients();
    void this.loadRecipes();
  }

  async loadIngredients() {
    const { data, error } = await this.ingredientService.getAll();
    if (error) return console.error(error);
    this.ingredients.set(data || []);
  }

  async loadRecipes() {
    const { data, error } = await this.recipeService.getAll();
    if (error) return console.error(error);
    this.recipes.set(data || []);
  }
}
