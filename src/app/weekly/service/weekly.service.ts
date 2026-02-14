import { Injectable, inject } from '@angular/core';
import { WeeklyRepository } from '@app/weekly/repository/weekly.repository';

@Injectable({ providedIn: 'root' })
export class WeeklyService {
  private readonly repo = inject(WeeklyRepository);

  async getAll() {
    return this.repo.getAll();
  }

  async create(payload: unknown) {
    return this.repo.create(payload);
  }
}
