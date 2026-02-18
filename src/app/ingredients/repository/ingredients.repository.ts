import { Injectable } from '@angular/core';
import { supabaseClient } from '@core/supabase/supabase.client';
import { Ingredient } from '@app/ingredients/domain/ingredient.model';

@Injectable({ providedIn: 'root' })
export class IngredientsRepository {
  private readonly supabase = supabaseClient;

  async getAll() {
    const { data, error } = await this.supabase.from('ingredients').select('*');
    return { data: data as Ingredient[], error };
  }

  async create(ingredient: Pick<Ingredient, 'name'>) {
    return this.supabase.from('ingredients').insert(ingredient);
  }
}
