import { Injectable } from '@angular/core';
import { supabaseClient } from '@core/supabase/supabase.client';

@Injectable({ providedIn: 'root' })
export class IngredientsRepository {
  private readonly supabase = supabaseClient;

  async getAll() {
    return this.supabase.from('ingredients').select('id, name');
  }

  async create(name: string) {
    return this.supabase.from('ingredients').insert([{ name }]);
  }
}
