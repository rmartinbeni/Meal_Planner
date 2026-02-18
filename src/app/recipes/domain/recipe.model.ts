import { UnitOfMeasure } from '@shared/domain/unit.model';
import { mealType } from '@shared/domain/meal.model';

export interface RecipeIngredient {
  ingredientId: number;
  quantity: number;
  unitOfMeasure: UnitOfMeasure;
}

export interface Recipe {
  id: number;
  name: string;
  mealType: mealType;
  description: string;
  ingredients: RecipeIngredient[];
}
