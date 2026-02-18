import { Injectable, inject } from '@angular/core';
import { WeeklyRepository } from '@app/weekly/repository/weekly.repository';
import { WeeklyPlan } from '@app/weekly/domain/weekly-plan.model';

@Injectable({ providedIn: 'root' })
export class WeeklyService {
  private readonly repo = inject(WeeklyRepository);

  async getAll() {
    return this.repo.getAll();
  }

  async create(weeklyPlan: Omit<WeeklyPlan, 'id'>) {
    return this.repo.create(weeklyPlan);
  }
}
