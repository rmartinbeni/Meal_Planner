import { Routes } from '@angular/router';

export const routes: Routes = [
  { path: '', loadComponent: () => import('./weekly/components/weekly.component').then(m => m.WeeklyComponent) },
  { path: 'recipes', loadComponent: () => import('./recipes/components/recipes.component').then(m => m.RecipesComponent) },
  { path: 'ingredients', loadComponent: () => import('./ingredients/components/ingredients.component').then(m => m.IngredientsComponent) },
];
