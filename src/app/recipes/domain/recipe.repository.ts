import { InjectionToken } from '@angular/core';
import { Observable } from 'rxjs';
import { Recipe } from './recipe.model';

export const RECIPE_REPOSITORY = new InjectionToken<RecipeRepository>('RecipeRepository');

export interface RecipeRepository {
  getAll(): Observable<Recipe[]>;
  findById(id: string): Observable<Recipe | undefined>;
  create(recipe: Omit<Recipe, 'id'>): Observable<Recipe>;
  update(recipe: Recipe): Observable<Recipe>;
  delete(id: string): Observable<void>;
}
