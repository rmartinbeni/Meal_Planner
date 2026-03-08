import { inject, Injectable } from '@angular/core';
import { RecipesService } from '@app/recipes/service/recipes.service';
import { WeeklyMeal } from '@app/weekly/domain/weekly-meal.model';
import { WeeklyPlan } from '@app/weekly/domain/weekly-plan.model';
import { WeeklyRepository } from '@app/weekly/repository/weekly.repository';

@Injectable({ providedIn: 'root' })
export class WeeklyService {
  private readonly repo = inject(WeeklyRepository);
  private readonly recipesService = inject(RecipesService);

  async getAll() {
    return this.repo.getAll();
  }

  async create(weeklyPlan: Omit<WeeklyPlan, 'id'>) {
    return this.repo.create(weeklyPlan);
  }

  async generateRandomWeek(): Promise<WeeklyMeal[]> {
    const { data: recipes, error } = await this.recipesService.getRandom(15);
    if (error || recipes.length === 0) {
      console.error('Error fetching random recipes', error);
      return [];
    }

    const days = [
      'Monday',
      'Tuesday',
      'Wednesday',
      'Thursday',
      'Friday',
      'Saturday',
      'Sunday',
    ] as const;
    const meals = ['Breakfast', 'Lunch', 'Dinner'] as const;

    const weeklyMeals: WeeklyMeal[] = meals.map((meal) => ({
      meal,
      Monday: '',
      Tuesday: '',
      Wednesday: '',
      Thursday: '',
      Friday: '',
      Saturday: '',
      Sunday: '',
    }));

    for (const weeklyMeal of weeklyMeals) {
      for (const day of days) {
        // Pick a random recipe from the pool of 15
        const randomRecipe = recipes[Math.floor(Math.random() * recipes.length)]; // eslint-disable-line sonarjs/pseudo-random
        if (randomRecipe) {
          weeklyMeal[day] = randomRecipe.name;
        }
      }
    }

    return weeklyMeals;
  }
}
