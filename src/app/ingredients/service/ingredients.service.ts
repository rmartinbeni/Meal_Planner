import { Injectable, inject } from '@angular/core';
import { IngredientsRepository } from '@app/ingredients/repository/ingredients.repository';

@Injectable({ providedIn: 'root' })
export class IngredientsService {
  private readonly repo = inject(IngredientsRepository);

  async getAll() {
    return this.repo.getAll();
  }

  async create(name: string) {
    return this.repo.create({ name });
  }
}
