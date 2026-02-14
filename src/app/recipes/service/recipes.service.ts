import { Injectable, inject } from '@angular/core';
import { RecipesRepository } from '@app/recipes/repository/recipes.repository';

@Injectable({ providedIn: 'root' })
export class RecipesService {
  private readonly repo = inject(RecipesRepository);

  async getAll() {
    return this.repo.getAll();
  }

  async create(payload: { name: string; ingredient_ids: number[] }) {
    return this.repo.create(payload);
  }
}
