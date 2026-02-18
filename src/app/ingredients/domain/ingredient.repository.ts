import { InjectionToken } from '@angular/core';
import { Observable } from 'rxjs';
import { Ingredient } from './ingredient.model';

export const INGREDIENT_REPOSITORY = new InjectionToken<IngredientRepository>('IngredientRepository');

export interface IngredientRepository {
  getAll(): Observable<Ingredient[]>;
  findById(id: string): Observable<Ingredient | undefined>;
  create(ingredient: Omit<Ingredient, 'id'>): Observable<Ingredient>;
  update(ingredient: Ingredient): Observable<Ingredient>;
  delete(id: string): Observable<void>;
}
