import { inject, Injectable } from '@angular/core';
import { WeeklyPlan } from '@app/weekly/domain/weekly-plan.model';
import { WeeklyRepository } from '@app/weekly/repository/weekly.repository';

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
