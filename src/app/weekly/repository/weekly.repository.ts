import { Injectable } from '@angular/core';
import { supabaseClient } from '@core/supabase/supabase.client';

@Injectable({ providedIn: 'root' })
export class WeeklyRepository {
  private readonly supabase = supabaseClient;

  async getAll() {
    return this.supabase.from('weekly').select('*');
  }

  async create(payload: unknown) {
    return this.supabase.from('weekly').insert([payload]);
  }
}
