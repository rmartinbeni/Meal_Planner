import { ChangeDetectionStrategy, Component, inject, OnInit, signal } from '@angular/core';
import { RecipesService } from '@app/recipes/service/recipes.service';
import { IngredientsService } from '@app/ingredients/service/ingredients.service';
import { RecipesFormComponent } from './form/recipes.form.component';
import { TableComponent } from '@app/shared/table/table.component';
import { DialogModule } from 'primeng/dialog';
import { Ingredient } from '@app/ingredients/domain/ingredient.model';
import { RecipeListItem } from '@app/recipes/repository/recipes.repository';

@Component({
  selector: 'meal-planner-recipes',
  standalone: true,
  imports: [RecipesFormComponent, TableComponent, DialogModule],
  templateUrl: './recipes.component.html',
  styleUrls: ['./recipes.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class RecipesComponent implements OnInit {
  private readonly recipeService = inject(RecipesService);
  private readonly ingredientService = inject(IngredientsService);

  readonly ingredients = signal<Ingredient[]>([]);
  readonly recipes = signal<RecipeListItem[]>([]);
  readonly isFormVisible = signal(false);

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

  showForm() {
    this.isFormVisible.set(true);
  }
}