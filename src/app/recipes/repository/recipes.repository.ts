import { Injectable } from '@angular/core';
import { Recipe } from '@app/recipes/domain/recipe.model';
import { supabaseClient } from '@core/supabase/supabase.client';

export type RecipeListItem = Pick<Recipe, 'id' | 'name'>;

@Injectable({ providedIn: 'root' })
export class RecipesRepository {
  private readonly supabase = supabaseClient;

  async getAll() {
    const { data, error } = await this.supabase.from('recipes').select('*');
    return { data: data as RecipeListItem[], error };
  }

  async getRandom(limit: number) {
    // Supabase doesn't have a direct random order function out-of-the-box without an RPC,
    // but a common workaround if we don't have db access is just to fetch all and randomize in JS
    // if the dataset is small, or use a specific RPC if created.
    // For now, let's fetch all and randomize in memory, then take the limit.
    // If the DB supports it, we could do something else, but this is the safest without knowing the schema.
    const { data, error } = await this.supabase.from('recipes').select('id, name');
    if (error) {
      return { data: [], error };
    }
    const shuffled = (data as RecipeListItem[]).sort(() => 0.5 - Math.random()); // eslint-disable-line unicorn/no-array-sort, sonarjs/pseudo-random
    return { data: shuffled.slice(0, limit), error: undefined };
  }

  async create(payload: { name: string; ingredient_ids: number[] }) {
    return this.supabase.from('recipes').insert([payload]);
  }
}
