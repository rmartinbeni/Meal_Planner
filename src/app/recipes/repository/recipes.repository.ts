import { Injectable } from '@angular/core';
import { supabaseClient } from '@core/supabase/supabase.client';
import { Recipe } from '@app/recipes/domain/recipe.model';

export type RecipeListItem = Pick<Recipe, 'id' | 'name'>;

@Injectable({ providedIn: 'root' })
export class RecipesRepository {
  private readonly supabase = supabaseClient;

  async getAll() {
    const { data, error } = await this.supabase.from('recipes').select('*');
    return { data: data as RecipeListItem[], error };
  }

  async create(payload: { name: string; ingredient_ids: number[] }) {
    return this.supabase.from('recipes').insert([payload]);
  }
}
