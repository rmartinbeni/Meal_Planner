import { Injectable } from '@angular/core';
import { createClient, SupabaseClient } from '@supabase/supabase-js';
import { environment } from '../../environments/environment';

@Injectable({ providedIn: 'root' })
export class SupabaseService {
  private readonly supabase: SupabaseClient = createClient(
    environment.supabase.url,
    environment.supabase.key
  );

  async getIngredients() {
    return this.supabase.from('ingredients').select('id, name');
  }

  async getRecipes() {
    return this.supabase.from('recipes').select('id, name');
  }

  async insertIngredient(name: string) {
    return this.supabase.from('ingredients').insert([{ name }]);
  }

  async insertRecipe(payload: { name: string; ingredient_ids: number[] }) {
    return this.supabase.from('recipes').insert([payload]);
  }
}
