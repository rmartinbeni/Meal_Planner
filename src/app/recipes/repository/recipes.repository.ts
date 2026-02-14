import { Injectable } from '@angular/core';
import { supabaseClient } from '@core/supabase/supabase.client';

@Injectable({ providedIn: 'root' })
export class RecipesRepository {
  private readonly supabase = supabaseClient;

  async getAll() {
    return this.supabase.from('recipes').select('id, name');
  }

  async create(payload: { name: string; ingredient_ids: number[] }) {
    return this.supabase.from('recipes').insert([payload]);
  }
}
