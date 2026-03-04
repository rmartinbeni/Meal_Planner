import { Injectable } from '@angular/core';
import { WeeklyPlan } from '@app/weekly/domain/weekly-plan.model';
import { supabaseClient } from '@core/supabase/supabase.client';

@Injectable({ providedIn: 'root' })
export class WeeklyRepository {
  private readonly supabase = supabaseClient;

  async getAll() {
    const { data, error } = await this.supabase.from('weekly').select('*');
    return { data: data as WeeklyPlan[], error };
  }

  async create(payload: Omit<WeeklyPlan, 'id'>) {
    return this.supabase.from('weekly').insert([payload]);
  }
}
